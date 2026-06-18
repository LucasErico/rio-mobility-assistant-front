import axios from 'axios';

const API_BASE = 'https://rio-mobility-assistant-api-zgrb.onrender.com';

const COR_POR_MODAL = {
  bus:    '#1565C0',
  onibus: '#1565C0',
  brt:    '#E53935',
  metro:  '#F57F17',
  train:  '#388E3C',
  trem:   '#388E3C',
  vlt:    '#8E24AA',
  pe:     '#78909C',
};

const NOME_MODAL = {
  bus:   'Ônibus',
  brt:   'BRT',
  metro: 'Metrô',
  train: 'Trem',
  vlt:   'VLT',
};

function interpolar(origem, destino, passos = 8) {
  const pts = [];
  for (let i = 0; i <= passos; i++) {
    pts.push({
      latitude:  origem.lat + (destino.lat - origem.lat) * (i / passos),
      longitude: origem.lng + (destino.lng - origem.lng) * (i / passos),
    });
  }
  return pts;
}

function normalizeModal(modal) {
  const m = (modal || '').toLowerCase();
  if (m === 'bus')   return 'onibus';
  if (m === 'train') return 'trem';
  return m;
}

function legsToSegmentos(legs) {
  return legs.map(leg => {
    const tipo = normalizeModal(leg.modal);
    const cor  = COR_POR_MODAL[tipo] ?? '#78909C';

    const fromCoord = { lat: leg.from_coords.lat, lng: leg.from_coords.lng };
    const toCoord   = { lat: leg.to_coords.lat,   lng: leg.to_coords.lng   };

    // Usa shape real se disponível, senão interpola em linha reta
    let coordenadas;
    if (leg.shape_coords && leg.shape_coords.length > 1) {
      coordenadas = leg.shape_coords.map(c => ({
        latitude:  c.lat,
        longitude: c.lng,
      }));
    } else {
      coordenadas = interpolar(fromCoord, toCoord, 8);
    }

    return {
      tipo,
      cor,
      coordenadas,
      tempoMin:       leg.estimated_minutes ?? 0,
      linha:          leg.route_name
                        ? { nome: `${NOME_MODAL[leg.modal] ?? leg.modal} ${leg.route_name}` }
                        : null,
      parada_origem:  leg.from_stop,
      parada_destino: leg.to_stop,
      caminhada_m:    leg.walk_to_stop_m ?? 0,
    };
  });
}

const PRIORIDADE_MAP = {
  mais_rapido:      'faster',
  mais_barato:      'cheaper',
  menos_baldeacoes: 'less_transfers',
};

export async function warmUpBackend() {
  try {
    await axios.get(`${API_BASE}/health`, { timeout: 120000 });
  } catch (_) {}
}

export async function calcularRota(coordOrigem, coordDestino, prioridade = 'mais_rapido') {
  if (!coordOrigem || !coordDestino) {
    throw new Error('Coordenadas inválidas');
  }

  const prioBackend = PRIORIDADE_MAP[prioridade] ?? 'faster';

  let response;
  try {
    response = await axios.post(
      `${API_BASE}/api/route`,
      {
        origin:      coordOrigem,
        destination: coordDestino,
        priority:    prioBackend,
      },
      { timeout: 120000 }
    );
  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      throw new Error('⏳ O servidor está iniciando. Aguarde 30 segundos e tente novamente.');
    }
    if (!err.response) {
      throw new Error('📡 Sem conexão com o servidor. Verifique sua internet e tente novamente.');
    }
    const serverMsg = err.response?.data?.error ?? '';
    if (serverMsg.includes('Nenhuma rota') || serverMsg.includes('Nenhum ponto')) {
      throw new Error('🗺️ Nenhuma rota de transporte público encontrada entre esses pontos.');
    }
    throw new Error(`❌ Erro do servidor (${err.response.status}): ${serverMsg || 'tente novamente.'}`);
  }

  const routes = response.data?.routes;
  if (!routes || routes.length === 0) {
    throw new Error('🗺️ Nenhuma rota encontrada entre esses pontos.');
  }

  const melhorRota  = routes[0];
  const segmentos   = legsToSegmentos(melhorRota.legs);
  const todasCoords = segmentos.flatMap(s => s.coordenadas);
  const tempoTotal  = melhorRota.summary.total_minutes;
  const custoBrl    = melhorRota.summary.estimated_cost_brl;

  return { segmentos, tempoTotal, distKm: '—', custoBrl, todasCoords };
}