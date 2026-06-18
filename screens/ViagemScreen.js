import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, View, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import OpenAI from 'openai';
import API_KEYS from '../config/apiKeys';
import { calcularRota } from '../services/rotaService';

import MenuSuperior from '../components/MenuSuperior';
import ChatOverlay from '../components/ChatOverlay';
import BotoesFlutantes from '../components/BotoesFlutuantes';
import CardViagem from '../components/CardViagem';

import cardStyles from '../styles/cardViagemStyles';

const openai = new OpenAI({
  apiKey: API_KEYS.GROQ,
  baseURL: 'https://api.groq.com/openai/v1',
  dangerouslyAllowBrowser: true,
});

const CARD_BOTTOM_OFFSET = Platform.OS === 'ios' ? 320 : 300;

// Monta texto descritivo do trajeto a partir dos segmentos
function descreverTrajeto(segmentos) {
  const passos = [];
  for (const seg of segmentos) {
    if (seg.tipo === 'pe') {
      const destino = seg.parada_destino ? ` até ${seg.parada_destino}` : '';
      passos.push(`🚶 Caminhe ${seg.tempoMin} min${destino}`);
    } else {
      const linha  = seg.linha?.nome ?? seg.tipo;
      const origem = seg.parada_origem  ? ` em ${seg.parada_origem}`  : '';
      const destino = seg.parada_destino ? ` até ${seg.parada_destino}` : '';
      passos.push(`🚌 Embarque na ${linha}${origem}${destino} (${seg.tempoMin} min)`);
    }
  }
  return passos.join('\n');
}

export default function ViagemScreen({
  navigation,
  localizacaoAtual,
  enderecoAtual,
  gpsAtivo,
  ativarLocalizacao,
  msgBoasVindas,
}) {
  const [painelExpandido, setPainelExpandido] = useState(true);
  const [chatExpandido,   setChatExpandido]   = useState(true);
  const [mensagem,        setMensagem]        = useState('');
  const [historicoChat,   setHistoricoChat]   = useState([]);
  const [carregando,      setCarregando]      = useState(false);

  const [origemInput,  setOrigemInput]  = useState('');
  const [destinoInput, setDestinoInput] = useState('');
  const [prioridade,   setPrioridade]   = useState('Mais rápido');

  const [rotaSegmentos, setRotaSegmentos] = useState([]);
  const [rotaInfo,      setRotaInfo]      = useState(null);
  const [viagemAtiva,   setViagemAtiva]   = useState(false);
  const [cardVisivel,   setCardVisivel]   = useState(false);

  const mapRef = useRef();

  useEffect(() => {
    if (enderecoAtual) {
      setOrigemInput(enderecoAtual);
      setHistoricoChat(prev => {
        const jaExiste = prev.some(
          m => m.tipo === 'system_action' && m.texto.includes('Localizei')
        );
        if (jaExiste) return prev;
        return [...prev, {
          texto: `📍 Localizei você em: ${enderecoAtual}. Deseja usar como ponto de partida?`,
          tipo: 'system_action',
        }];
      });
    }
  }, [enderecoAtual]);

  const regiaoInicial = localizacaoAtual
    ? { ...localizacaoAtual, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : { latitude: -22.9121, longitude: -43.2301, latitudeDelta: 0.05, longitudeDelta: 0.05 };

  const inverterEnderecos = () => {
    const t = origemInput;
    setOrigemInput(destinoInput);
    setDestinoInput(t);
  };

  const centralizarLocalizacao = () => {
    if (!gpsAtivo) {
      if (typeof ativarLocalizacao === 'function') ativarLocalizacao();
      return;
    }
    if (localizacaoAtual && mapRef.current) {
      mapRef.current.animateToRegion(
        { ...localizacaoAtual, latitudeDelta: 0.01, longitudeDelta: 0.01 },
        800
      );
    }
  };

  const executarBusca = async (origemTexto, destinoTexto) => {
    if (!origemTexto || !destinoTexto) {
      return 'Preciso de origem e destino para traçar a rota.';
    }

    const prioMap = {
      'Mais rápido':      'mais_rapido',
      'Mais barato':      'mais_barato',
      'Menos baldeações': 'menos_baldeacoes',
    };
    const prioInterno = prioMap[prioridade] ?? 'mais_rapido';

    const coordOrigem = (gpsAtivo && localizacaoAtual)
      ? localizacaoAtual
      : { address: origemTexto };

    const coordDestino = { address: destinoTexto };

    try {
      const resultado = await calcularRota(coordOrigem, coordDestino, prioInterno);

      setRotaSegmentos(resultado.segmentos);
      setRotaInfo({
        tempoTotal: resultado.tempoTotal,
        distKm:     resultado.distKm,
        custoBrl:   resultado.custoBrl,
      });
      setViagemAtiva(false);
      setCardVisivel(true);

      if (mapRef.current && resultado.todasCoords.length > 0) {
        mapRef.current.fitToCoordinates(resultado.todasCoords, {
          edgePadding: { top: 100, right: 40, bottom: 320, left: 40 },
          animated: true,
        });
      }

      // ── Monta resposta descritiva ──
      const custoTexto = resultado.custoBrl
        ? ` · R$ ${resultado.custoBrl.toFixed(2)}`
        : '';
      const cabecalho  = `✅ Rota traçada! ${resultado.tempoTotal} min${custoTexto}`;
      const descricao  = descreverTrajeto(resultado.segmentos);
      return descricao ? `${cabecalho}\n\n${descricao}` : cabecalho;

    } catch (err) {
      setCardVisivel(false);
      return err.message;
    }
  };

  const processarChatIA = async (textoUsuario, historicoAtual) => {
    const gpsInfo = gpsAtivo && localizacaoAtual
      ? `GPS ativo: ${localizacaoAtual.latitude.toFixed(4)}, ${localizacaoAtual.longitude.toFixed(4)}`
      : 'GPS inativo';

    const systemPrompt = `Você é um assistente de transporte do Rio de Janeiro. Sua função é conversar naturalmente para coletar origem e destino, depois traçar a rota.\n\nRegras de prioridade (nunca pergunte ao usuário — detecte pela fala ou use o padrão):\n- "mais_rapido" → padrão quando o usuário não especificar nada\n- "mais_barato" → quando mencionar custo, tarifa, preço, barato, econômico\n- "menos_baldeacoes" → quando mencionar menos trocas, direto, sem baldeação\n\nEstado atual da tela:\n- Origem: ${origemInput || 'não definida'}\n- Destino: ${destinoInput || 'não definido'}\n- Prioridade atual: ${prioridade}\n- ${gpsInfo}\n\nQuando tiver origem E destino, execute a busca imediatamente sem pedir confirmação.\nSe o usuário confirmar que quer usar a localização atual como origem, use "localização atual" como origem.\n\nQuando for executar, responda SOMENTE este JSON (sem texto fora dele):\n{"acao":"buscar","origem":"<valor>","destino":"<valor>","prioridade":"mais_rapido|mais_barato|menos_baldeacoes"}\n\nSe ainda faltar origem ou destino, responda em texto simples pedindo só o que falta.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...historicoAtual.map(m => ({
        role: m.tipo === 'user' ? 'user' : 'assistant',
        content: m.texto,
      })),
      { role: 'user', content: textoUsuario },
    ];

    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.3,
    });

    const resposta = completion.choices[0].message.content.trim();

    try {
      const json = JSON.parse(resposta);
      if (json.acao === 'buscar') {
        const origemFinal  = json.origem  === 'localização atual' ? (enderecoAtual || origemInput)  : json.origem;
        const destinoFinal = json.destino;

        if (json.origem)     setOrigemInput(origemFinal);
        if (json.destino)    setDestinoInput(destinoFinal);
        if (json.prioridade) {
          const mapa = {
            mais_rapido:      'Mais rápido',
            mais_barato:      'Mais barato',
            menos_baldeacoes: 'Menos baldeações',
          };
          if (mapa[json.prioridade]) setPrioridade(mapa[json.prioridade]);
        }
        return await executarBusca(origemFinal, destinoFinal);
      }
    } catch (_) {}

    return resposta;
  };

  const enviarMensagemParaIA = async () => {
    if (!mensagem.trim()) return;
    if (!chatExpandido) setChatExpandido(true);
    const texto = mensagem;
    const hist  = [...historicoChat];
    setHistoricoChat(prev => [...prev, { texto, tipo: 'user' }]);
    setMensagem('');
    setCarregando(true);
    try {
      const resposta = await processarChatIA(texto, hist);
      setHistoricoChat(prev => [...prev, { texto: resposta, tipo: 'ai' }]);
    } catch (err) {
      setHistoricoChat(prev => [...prev,
        { texto: `❌ Erro: ${err.message}`, tipo: 'system_error' }
      ]);
    } finally {
      setCarregando(false);
    }
  };

  const handleEncerrarViagem = () => {
    setViagemAtiva(false);
    setCardVisivel(false);
    setRotaSegmentos([]);
    setRotaInfo(null);
    setDestinoInput('');
  };

  const coordDestino = rotaSegmentos.length > 0
    ? rotaSegmentos[rotaSegmentos.length - 1].coordenadas.slice(-1)[0]
    : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <MapView ref={mapRef} style={StyleSheet.absoluteFillObject} region={regiaoInicial}>
        {localizacaoAtual && (
          <Marker coordinate={localizacaoAtual} title="Você" pinColor="green" />
        )}
        {coordDestino && (
          <Marker coordinate={coordDestino} title={destinoInput} pinColor="red" />
        )}
        {rotaSegmentos.map((seg, i) => (
          <React.Fragment key={i}>
            <Polyline
              coordinates={seg.coordenadas}
              strokeColor={seg.cor}
              strokeWidth={seg.tipo === 'pe' ? 3 : 5}
              lineDashPattern={seg.tipo === 'pe' ? [6, 4] : null}
            />
            {seg.linha && (
              <Marker
                coordinate={seg.coordenadas[Math.floor(seg.coordenadas.length / 2)]}
                anchor={{ x: 0.5, y: 0.5 }}
                tracksViewChanges={false}
              >
                <View style={[cardStyles.labelLinha, { backgroundColor: seg.cor }]}>
                  <Text style={cardStyles.labelLinhaTexto}>{seg.linha.nome}</Text>
                </View>
              </Marker>
            )}
          </React.Fragment>
        ))}
      </MapView>

      <MenuSuperior
        onNavFinanceiro={() => navigation.navigate('Financeiro')}
        onBuscar={() => executarBusca(origemInput, destinoInput)}
        origemInput={origemInput}   setOrigemInput={setOrigemInput}
        destinoInput={destinoInput} setDestinoInput={setDestinoInput}
        prioridade={prioridade}     setPrioridade={setPrioridade}
        onInverter={inverterEnderecos}
        expandido={painelExpandido} setExpandido={setPainelExpandido}
        rotaInfo={rotaInfo}
      />

      <CardViagem
        segmentos={rotaSegmentos}
        tempoTotal={rotaInfo?.tempoTotal}
        custoBrl={rotaInfo?.custoBrl}
        viagemAtiva={viagemAtiva}
        visivel={cardVisivel}
        bottomOffset={CARD_BOTTOM_OFFSET}
        onIniciar={() => setViagemAtiva(true)}
        onEncerrar={handleEncerrarViagem}
      />

      <BotoesFlutantes
        rotaCalculada={rotaSegmentos.length > 0}
        viagemAtiva={viagemAtiva}
        onIniciarViagem={() => setCardVisivel(v => !v)}
        onLocalizacao={centralizarLocalizacao}
        gpsAtivo={gpsAtivo}
      />

      <ChatOverlay
        historicoChat={historicoChat}
        mensagem={mensagem}           setMensagem={setMensagem}
        carregando={carregando}
        onEnviar={enviarMensagemParaIA}
        chatExpandido={chatExpandido} setChatExpandido={setChatExpandido}
        msgBoasVindas={msgBoasVindas}
      />
    </KeyboardAvoidingView>
  );
}
