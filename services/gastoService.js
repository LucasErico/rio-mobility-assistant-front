import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_GASTOS     = '@rio_mobility:gastos';
const CHAVE_ORCAMENTO  = '@rio_mobility:orcamento';

// ─── Categorias ────────────────────────────────────────────────────────────
export const CATEGORIAS = [
  { id: 'onibus',   label: 'Ônibus',     emoji: '🚌', cor: '#1565C0' },
  { id: 'brt',      label: 'BRT',        emoji: '🚍', cor: '#E53935' },
  { id: 'metro',    label: 'Metrô',      emoji: '🚇', cor: '#F57F17' },
  { id: 'trem',     label: 'Trem',       emoji: '🚆', cor: '#388E3C' },
  { id: 'vlt',      label: 'VLT',        emoji: '🚊', cor: '#8E24AA' },
  { id: 'van',      label: 'Van',        emoji: '🚐', cor: '#00897B' },
  { id: 'uber',     label: 'Uber/99',    emoji: '🚗', cor: '#1E1E1E' },
  { id: 'outro',    label: 'Outro',      emoji: '🎫', cor: '#78909C' },
];

export function getCategoriaById(id) {
  return CATEGORIAS.find(c => c.id === id) ?? CATEGORIAS[CATEGORIAS.length - 1];
}

// ─── Gastos CRUD ──────────────────────────────────────────────────────────
export async function listarGastos() {
  try {
    const json = await AsyncStorage.getItem(CHAVE_GASTOS);
    return json ? JSON.parse(json) : [];
  } catch { return []; }
}

export async function adicionarGasto(gasto) {
  // gasto: { categoriaId, valor, descricao, data (ISO string) }
  const lista = await listarGastos();
  const novo = {
    id: Date.now().toString(),
    categoriaId: gasto.categoriaId,
    valor: parseFloat(gasto.valor),
    descricao: gasto.descricao ?? '',
    data: gasto.data ?? new Date().toISOString(),
  };
  const atualizada = [novo, ...lista];
  await AsyncStorage.setItem(CHAVE_GASTOS, JSON.stringify(atualizada));
  return atualizada;
}

export async function editarGasto(id, campos) {
  const lista = await listarGastos();
  const atualizada = lista.map(g =>
    g.id === id ? { ...g, ...campos, valor: parseFloat(campos.valor ?? g.valor) } : g
  );
  await AsyncStorage.setItem(CHAVE_GASTOS, JSON.stringify(atualizada));
  return atualizada;
}

export async function deletarGasto(id) {
  const lista = await listarGastos();
  const atualizada = lista.filter(g => g.id !== id);
  await AsyncStorage.setItem(CHAVE_GASTOS, JSON.stringify(atualizada));
  return atualizada;
}

// ─── Orçamento ─────────────────────────────────────────────────────────────
export async function salvarOrcamento(orcamento) {
  // orcamento: { tipo: 'semanal'|'mensal', valor: number }
  await AsyncStorage.setItem(CHAVE_ORCAMENTO, JSON.stringify(orcamento));
}

export async function carregarOrcamento() {
  try {
    const json = await AsyncStorage.getItem(CHAVE_ORCAMENTO);
    return json ? JSON.parse(json) : { tipo: 'mensal', valor: 0 };
  } catch { return { tipo: 'mensal', valor: 0 }; }
}

// ─── Cálculos de resumo ────────────────────────────────────────────────────
export function calcularResumo(gastos) {
  const agora    = new Date();
  const anoAtual = agora.getFullYear();
  const mesAtual = agora.getMonth();

  // Início da semana (domingo)
  const diaSemana   = agora.getDay();
  const inicioSemana = new Date(agora);
  inicioSemana.setDate(agora.getDate() - diaSemana);
  inicioSemana.setHours(0, 0, 0, 0);

  const doMes     = gastos.filter(g => {
    const d = new Date(g.data);
    return d.getFullYear() === anoAtual && d.getMonth() === mesAtual;
  });
  const daSemana  = gastos.filter(g => new Date(g.data) >= inicioSemana);

  const somaMes    = doMes.reduce((acc, g) => acc + g.valor, 0);
  const somaSemana = daSemana.reduce((acc, g) => acc + g.valor, 0);

  // Dias com gasto no mês para calcular média diária
  const diasComGasto = new Set(doMes.map(g => g.data.slice(0, 10))).size;
  const mediaDia     = diasComGasto > 0 ? somaMes / diasComGasto : 0;

  // Gastos dos últimos 7 dias agrupados por dia (para o gráfico)
  const ultimos7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(agora);
    d.setDate(agora.getDate() - i);
    const chave = d.toISOString().slice(0, 10);
    const total = gastos
      .filter(g => g.data.slice(0, 10) === chave)
      .reduce((acc, g) => acc + g.valor, 0);
    ultimos7.push({
      label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      total,
    });
  }

  // Por categoria no mês
  const porCategoria = {};
  doMes.forEach(g => {
    porCategoria[g.categoriaId] = (porCategoria[g.categoriaId] ?? 0) + g.valor;
  });

  return { somaMes, somaSemana, mediaDia, ultimos7, porCategoria, totalLancamentos: gastos.length };
}
