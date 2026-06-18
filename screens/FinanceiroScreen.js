import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Modal, SafeAreaView, Alert,
  KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import Svg, { Rect, Text as SvgText, Line } from 'react-native-svg';
import {
  listarGastos, adicionarGasto, editarGasto, deletarGasto,
  salvarOrcamento, carregarOrcamento,
  calcularResumo, CATEGORIAS, getCategoriaById,
} from '../services/gastoService';
import styles, { CORES_FIN } from '../styles/financeiroStyles';

// ─── Gráfico de barras SVG ────────────────────────────────────────────────
function GraficoBarras({ dados }) {
  const W = 320, H = 110, PADDING = { left: 30, bottom: 24, top: 8, right: 8 };
  const innerW = W - PADDING.left - PADDING.right;
  const innerH = H - PADDING.top  - PADDING.bottom;
  const max    = Math.max(...dados.map(d => d.total), 1);
  const barW   = (innerW / dados.length) * 0.55;
  const gap    = innerW / dados.length;

  return (
    <Svg width={W} height={H}>
      {/* linha base */}
      <Line
        x1={PADDING.left} y1={PADDING.top + innerH}
        x2={W - PADDING.right} y2={PADDING.top + innerH}
        stroke="#ddd" strokeWidth={1}
      />
      {dados.map((d, i) => {
        const barH  = (d.total / max) * innerH;
        const x     = PADDING.left + i * gap + (gap - barW) / 2;
        const y     = PADDING.top + innerH - barH;
        const vazio = barH < 1;
        return (
          <React.Fragment key={i}>
            {!vazio && (
              <Rect
                x={x} y={y} width={barW} height={barH}
                rx={3} fill={CORES_FIN.primary}
              />
            )}
            {/* label dia */}
            <SvgText
              x={x + barW / 2} y={H - 6}
              fontSize={9} fill="#999" textAnchor="middle"
            >
              {d.label}
            </SvgText>
            {/* valor acima da barra */}
            {!vazio && (
              <SvgText
                x={x + barW / 2} y={y - 3}
                fontSize={8} fill={CORES_FIN.primary} textAnchor="middle"
              >
                {d.total.toFixed(0)}
              </SvgText>
            )}
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

// ─── Barra de progresso orçamento ─────────────────────────────────────────
function BarraOrcamento({ gasto, orcamento }) {
  if (!orcamento || orcamento <= 0) return null;
  const pct    = Math.min(gasto / orcamento, 1);
  const cor    = pct >= 1 ? CORES_FIN.danger : pct >= 0.8 ? CORES_FIN.warning : CORES_FIN.success;
  const label  = `R$ ${gasto.toFixed(2)} / R$ ${orcamento.toFixed(2)}`;
  return (
    <View style={styles.barraWrap}>
      <View style={styles.barraFundo}>
        <View style={[styles.barraPreenchida, { width: `${pct * 100}%`, backgroundColor: cor }]} />
      </View>
      <Text style={styles.barraLabel}>{label} ({Math.round(pct * 100)}%)</Text>
    </View>
  );
}

// ─── Modal de lançamento ──────────────────────────────────────────────────
function ModalLancamento({ visivel, gastoEditando, onSalvar, onFechar }) {
  const [categoriaId, setCategoriaId] = useState('onibus');
  const [valor,       setValor]       = useState('');
  const [descricao,   setDescricao]   = useState('');
  const [data,        setData]        = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (gastoEditando) {
      setCategoriaId(gastoEditando.categoriaId);
      setValor(String(gastoEditando.valor));
      setDescricao(gastoEditando.descricao ?? '');
      setData(gastoEditando.data.slice(0, 10));
    } else {
      setCategoriaId('onibus');
      setValor('');
      setDescricao('');
      setData(new Date().toISOString().slice(0, 10));
    }
  }, [gastoEditando, visivel]);

  const confirmar = () => {
    const v = parseFloat(valor.replace(',', '.'));
    if (!valor || isNaN(v) || v <= 0) {
      Alert.alert('Valor inválido', 'Informe um valor maior que zero.');
      return;
    }
    onSalvar({ categoriaId, valor: v, descricao, data: `${data}T12:00:00.000Z` });
  };

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={onFechar}>
      <Pressable style={styles.modalOverlay} onPress={onFechar}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable onPress={e => e.stopPropagation()}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitulo}>
                {gastoEditando ? '✏️ Editar gasto' : '➕ Novo gasto'}
              </Text>

              {/* Seletor de categoria */}
              <Text style={styles.campoLabel}>Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {CATEGORIAS.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setCategoriaId(cat.id)}
                    style={[
                      styles.catChip,
                      categoriaId === cat.id && { backgroundColor: cat.cor, borderColor: cat.cor },
                    ]}
                  >
                    <Text style={[styles.catChipTexto, categoriaId === cat.id && { color: '#fff' }]}>
                      {cat.emoji} {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Valor */}
              <Text style={styles.campoLabel}>Valor (R$)</Text>
              <TextInput
                style={styles.input}
                value={valor}
                onChangeText={setValor}
                keyboardType="decimal-pad"
                placeholder="0,00"
                placeholderTextColor="#bbb"
              />

              {/* Data */}
              <Text style={styles.campoLabel}>Data (AAAA-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={data}
                onChangeText={setData}
                placeholder="2026-06-18"
                placeholderTextColor="#bbb"
              />

              {/* Descrição */}
              <Text style={styles.campoLabel}>Descrição (opcional)</Text>
              <TextInput
                style={[styles.input, { marginBottom: 20 }]}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="ex: ida ao trabalho"
                placeholderTextColor="#bbb"
              />

              <View style={styles.modalBotoes}>
                <TouchableOpacity style={styles.botaoCancelar} onPress={onFechar}>
                  <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoSalvar} onPress={confirmar}>
                  <Text style={styles.botaoSalvarTexto}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

// ─── Modal de orçamento ───────────────────────────────────────────────────
function ModalOrcamento({ visivel, orcamentoAtual, onSalvar, onFechar }) {
  const [tipo,  setTipo]  = useState('mensal');
  const [valor, setValor] = useState('');

  useEffect(() => {
    if (orcamentoAtual) {
      setTipo(orcamentoAtual.tipo);
      setValor(orcamentoAtual.valor > 0 ? String(orcamentoAtual.valor) : '');
    }
  }, [orcamentoAtual, visivel]);

  const confirmar = () => {
    const v = parseFloat(valor.replace(',', '.'));
    if (!valor || isNaN(v) || v <= 0) {
      Alert.alert('Valor inválido', 'Informe um orçamento maior que zero.');
      return;
    }
    onSalvar({ tipo, valor: v });
  };

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={onFechar}>
      <Pressable style={styles.modalOverlay} onPress={onFechar}>
        <Pressable onPress={e => e.stopPropagation()}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>🎯 Definir orçamento</Text>

            <Text style={styles.campoLabel}>Período</Text>
            <View style={styles.toggleRow}>
              {['semanal', 'mensal'].map(t => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTipo(t)}
                  style={[styles.toggleBtn, tipo === t && styles.toggleBtnAtivo]}
                >
                  <Text style={[styles.toggleTexto, tipo === t && styles.toggleTextoAtivo]}>
                    {t === 'semanal' ? '📅 Semanal' : '🗓 Mensal'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.campoLabel}>Limite (R$)</Text>
            <TextInput
              style={[styles.input, { marginBottom: 20 }]}
              value={valor}
              onChangeText={setValor}
              keyboardType="decimal-pad"
              placeholder="ex: 200,00"
              placeholderTextColor="#bbb"
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.botaoCancelar} onPress={onFechar}>
                <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoSalvar} onPress={confirmar}>
                <Text style={styles.botaoSalvarTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Item de gasto ────────────────────────────────────────────────────────
function ItemGasto({ gasto, onEditar, onDeletar }) {
  const cat  = getCategoriaById(gasto.categoriaId);
  const data = new Date(gasto.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  return (
    <View style={styles.itemGasto}>
      <View style={[styles.itemEmoji, { backgroundColor: cat.cor + '22' }]}>
        <Text style={{ fontSize: 20 }}>{cat.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemCategoria}>{cat.label}</Text>
        {!!gasto.descricao && <Text style={styles.itemDesc} numberOfLines={1}>{gasto.descricao}</Text>}
        <Text style={styles.itemData}>{data}</Text>
      </View>
      <Text style={styles.itemValor}>R$ {gasto.valor.toFixed(2)}</Text>
      <View style={styles.itemAcoes}>
        <TouchableOpacity onPress={() => onEditar(gasto)} style={styles.acaoBtn}>
          <Text style={styles.acaoBtnTexto}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDeletar(gasto.id)} style={styles.acaoBtn}>
          <Text style={styles.acaoBtnTexto}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Tela principal ────────────────────────────────────────────────────────
export default function FinanceiroScreen({ navigation }) {
  const [gastos,          setGastos]          = useState([]);
  const [orcamento,       setOrcamento]       = useState({ tipo: 'mensal', valor: 0 });
  const [resumo,          setResumo]          = useState(null);
  const [modalGasto,      setModalGasto]      = useState(false);
  const [modalOrcamento,  setModalOrcamento]  = useState(false);
  const [gastoEditando,   setGastoEditando]   = useState(null);

  const recarregar = useCallback(async () => {
    const [g, o] = await Promise.all([listarGastos(), carregarOrcamento()]);
    setGastos(g);
    setOrcamento(o);
    setResumo(calcularResumo(g));
  }, []);

  useEffect(() => { recarregar(); }, []);

  const handleSalvarGasto = async (campos) => {
    let nova;
    if (gastoEditando) {
      nova = await editarGasto(gastoEditando.id, campos);
    } else {
      nova = await adicionarGasto(campos);
    }
    setGastos(nova);
    setResumo(calcularResumo(nova));
    setModalGasto(false);
    setGastoEditando(null);
  };

  const handleDeletar = (id) => {
    Alert.alert('Confirmar', 'Remover este gasto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive',
        onPress: async () => {
          const nova = await deletarGasto(id);
          setGastos(nova);
          setResumo(calcularResumo(nova));
        },
      },
    ]);
  };

  const handleSalvarOrcamento = async (o) => {
    await salvarOrcamento(o);
    setOrcamento(o);
    setModalOrcamento(false);
  };

  const gastoParaOrcamento = orcamento.tipo === 'semanal'
    ? (resumo?.somaSemana ?? 0)
    : (resumo?.somaMes    ?? 0);

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Viagem')} style={styles.botaoVoltar}>
          <Text style={styles.botaoVoltarTexto}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>💳 Gastos</Text>
        <TouchableOpacity onPress={() => { setGastoEditando(null); setModalGasto(true); }} style={styles.botaoAdicionar}>
          <Text style={styles.botaoAdicionarTexto}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── CARDS DE RESUMO ── */}
        {resumo && (
          <View style={styles.cardsRow}>
            <View style={[styles.card, styles.cardDestaque]}>
              <Text style={styles.cardRotulo}>Mês atual</Text>
              <Text style={styles.cardValorGrande}>R$ {resumo.somaMes.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardRotulo}>Esta semana</Text>
              <Text style={styles.cardValor}>R$ {resumo.somaSemana.toFixed(2)}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardRotulo}>Média/dia</Text>
              <Text style={styles.cardValor}>R$ {resumo.mediaDia.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* ── GRÁFICO 7 DIAS ── */}
        {resumo && (
          <View style={styles.secao}>
            <Text style={styles.secaoTitulo}>📊 Últimos 7 dias</Text>
            <View style={styles.graficoWrap}>
              <GraficoBarras dados={resumo.ultimos7} />
            </View>
          </View>
        )}

        {/* ── PLANEJADOR ── */}
        <View style={styles.secao}>
          <View style={styles.secaoHeaderRow}>
            <Text style={styles.secaoTitulo}>🎯 Planejador</Text>
            <TouchableOpacity onPress={() => setModalOrcamento(true)} style={styles.botaoEditar}>
              <Text style={styles.botaoEditarTexto}>Editar meta</Text>
            </TouchableOpacity>
          </View>
          {orcamento.valor > 0 ? (
            <View style={styles.planejadorCard}>
              <Text style={styles.planejadorDesc}>
                Orçamento {orcamento.tipo}: <Text style={{ fontWeight: 'bold' }}>R$ {orcamento.valor.toFixed(2)}</Text>
              </Text>
              <BarraOrcamento gasto={gastoParaOrcamento} orcamento={orcamento.valor} />
            </View>
          ) : (
            <TouchableOpacity onPress={() => setModalOrcamento(true)} style={styles.planejadorVazio}>
              <Text style={styles.planejadorVazioTexto}>Toque para definir uma meta de gastos</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── LISTA DE GASTOS ── */}
        <View style={styles.secao}>
          <View style={styles.secaoHeaderRow}>
            <Text style={styles.secaoTitulo}>🧾 Lançamentos</Text>
            <Text style={styles.secaoCount}>{gastos.length} registros</Text>
          </View>
          {gastos.length === 0 ? (
            <View style={styles.listaVazia}>
              <Text style={styles.listaVaziaTexto}>Nenhum gasto registrado ainda.</Text>
              <Text style={styles.listaVaziaTexto}>Toque em ＋ para adicionar.</Text>
            </View>
          ) : (
            gastos.map(g => (
              <ItemGasto
                key={g.id}
                gasto={g}
                onEditar={(gasto) => { setGastoEditando(gasto); setModalGasto(true); }}
                onDeletar={handleDeletar}
              />
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <ModalLancamento
        visivel={modalGasto}
        gastoEditando={gastoEditando}
        onSalvar={handleSalvarGasto}
        onFechar={() => { setModalGasto(false); setGastoEditando(null); }}
      />
      <ModalOrcamento
        visivel={modalOrcamento}
        orcamentoAtual={orcamento}
        onSalvar={handleSalvarOrcamento}
        onFechar={() => setModalOrcamento(false)}
      />

    </SafeAreaView>
  );
}
