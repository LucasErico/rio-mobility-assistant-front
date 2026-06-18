import { StyleSheet } from 'react-native';

export const CORES_FIN = {
  primary:    '#007AFF',
  success:    '#34C759',
  warning:    '#FF9500',
  danger:     '#FF3B30',
  bg:         '#F2F2F7',
  card:       '#FFFFFF',
  textDark:   '#1C1C1E',
  textMid:    '#636366',
  textLight:  '#AEAEB2',
  border:     '#E5E5EA',
};

export default StyleSheet.create({
  container:    { flex: 1, backgroundColor: CORES_FIN.bg },

  // ─── Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
    backgroundColor: CORES_FIN.card,
    borderBottomWidth: 1, borderBottomColor: CORES_FIN.border,
  },
  botaoVoltar: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: CORES_FIN.bg,
  },
  botaoVoltarTexto:    { fontSize: 24, color: CORES_FIN.primary, lineHeight: 28 },
  headerTitulo:        { fontSize: 17, fontWeight: '600', color: CORES_FIN.textDark },
  botaoAdicionar: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: CORES_FIN.primary,
  },
  botaoAdicionarTexto: { fontSize: 20, color: '#fff', lineHeight: 24 },

  scroll: { padding: 16 },

  // ─── Cards resumo
  cardsRow:       { flexDirection: 'row', gap: 10, marginBottom: 16 },
  card: {
    flex: 1, backgroundColor: CORES_FIN.card, borderRadius: 14,
    padding: 12, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardDestaque:        { borderWidth: 1.5, borderColor: CORES_FIN.primary },
  cardRotulo:          { fontSize: 11, color: CORES_FIN.textMid, marginBottom: 4 },
  cardValorGrande:     { fontSize: 16, fontWeight: '700', color: CORES_FIN.primary },
  cardValor:           { fontSize: 14, fontWeight: '600', color: CORES_FIN.textDark },

  // ─── Seções
  secao:           { marginBottom: 20 },
  secaoHeaderRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  secaoTitulo:     { fontSize: 15, fontWeight: '600', color: CORES_FIN.textDark },
  secaoCount:      { fontSize: 12, color: CORES_FIN.textLight },

  // ─── Gráfico
  graficoWrap: {
    backgroundColor: CORES_FIN.card, borderRadius: 14, padding: 12,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },

  // ─── Barra orçamento
  barraWrap:       { marginTop: 10 },
  barraFundo:      { height: 10, backgroundColor: CORES_FIN.border, borderRadius: 5, overflow: 'hidden' },
  barraPreenchida: { height: 10, borderRadius: 5 },
  barraLabel:      { fontSize: 12, color: CORES_FIN.textMid, marginTop: 6, textAlign: 'right' },

  // ─── Planejador
  planejadorCard: {
    backgroundColor: CORES_FIN.card, borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  planejadorDesc:  { fontSize: 13, color: CORES_FIN.textMid },
  planejadorVazio: {
    backgroundColor: CORES_FIN.card, borderRadius: 14, padding: 20,
    alignItems: 'center', borderWidth: 1.5,
    borderColor: CORES_FIN.primary, borderStyle: 'dashed',
  },
  planejadorVazioTexto: { fontSize: 13, color: CORES_FIN.primary },
  botaoEditar: {
    paddingHorizontal: 12, paddingVertical: 4,
    backgroundColor: CORES_FIN.primary + '15', borderRadius: 20,
  },
  botaoEditarTexto: { fontSize: 12, color: CORES_FIN.primary, fontWeight: '600' },

  // ─── Lista de gastos
  listaVazia: {
    backgroundColor: CORES_FIN.card, borderRadius: 14, padding: 24,
    alignItems: 'center', gap: 4,
  },
  listaVaziaTexto: { fontSize: 13, color: CORES_FIN.textLight },
  itemGasto: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CORES_FIN.card, borderRadius: 12, padding: 12,
    marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  itemEmoji:     { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  itemCategoria: { fontSize: 13, fontWeight: '600', color: CORES_FIN.textDark },
  itemDesc:      { fontSize: 12, color: CORES_FIN.textMid },
  itemData:      { fontSize: 11, color: CORES_FIN.textLight, marginTop: 1 },
  itemValor:     { fontSize: 14, fontWeight: '700', color: CORES_FIN.textDark },
  itemAcoes:     { flexDirection: 'row', gap: 4 },
  acaoBtn:       { padding: 4 },
  acaoBtnTexto:  { fontSize: 15 },

  // ─── Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: CORES_FIN.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
  },
  modalTitulo:  { fontSize: 17, fontWeight: '700', color: CORES_FIN.textDark, marginBottom: 16 },
  campoLabel:   { fontSize: 12, color: CORES_FIN.textMid, marginBottom: 4, marginTop: 4 },
  input: {
    borderWidth: 1, borderColor: CORES_FIN.border, borderRadius: 10,
    padding: 12, fontSize: 15, color: CORES_FIN.textDark,
    backgroundColor: CORES_FIN.bg, marginBottom: 8,
  },
  catChip: {
    borderWidth: 1.5, borderColor: CORES_FIN.border, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6, marginRight: 8,
    backgroundColor: CORES_FIN.bg,
  },
  catChipTexto:  { fontSize: 13, color: CORES_FIN.textDark },
  modalBotoes:   { flexDirection: 'row', gap: 12, marginTop: 4 },
  botaoCancelar: {
    flex: 1, padding: 14, borderRadius: 12,
    backgroundColor: CORES_FIN.bg, alignItems: 'center',
    borderWidth: 1, borderColor: CORES_FIN.border,
  },
  botaoCancelarTexto: { fontSize: 15, color: CORES_FIN.textMid, fontWeight: '600' },
  botaoSalvar: {
    flex: 1, padding: 14, borderRadius: 12,
    backgroundColor: CORES_FIN.primary, alignItems: 'center',
  },
  botaoSalvarTexto: { fontSize: 15, color: '#fff', fontWeight: '700' },

  // ─── Toggle orçamento
  toggleRow:        { flexDirection: 'row', gap: 10, marginBottom: 12 },
  toggleBtn: {
    flex: 1, padding: 10, borderRadius: 10, alignItems: 'center',
    borderWidth: 1.5, borderColor: CORES_FIN.border, backgroundColor: CORES_FIN.bg,
  },
  toggleBtnAtivo:   { borderColor: CORES_FIN.primary, backgroundColor: CORES_FIN.primary + '15' },
  toggleTexto:      { fontSize: 13, color: CORES_FIN.textMid },
  toggleTextoAtivo: { color: CORES_FIN.primary, fontWeight: '600' },
});
