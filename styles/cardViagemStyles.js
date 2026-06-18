import { StyleSheet } from 'react-native';
import { COLORS } from './globalStyles';

export default StyleSheet.create({
  // Card agora é posicionado como elemento fixo (não absolute)
  // entre o menu superior e o chat — gerenciado pelo ViagemScreen
  card: {
    position: 'absolute',
    left: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 20,
    padding: 14,
    paddingBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 25,
    // 'bottom' é controlado dinamicamente pelo ViagemScreen
    // via prop 'bottomOffset' para ficar logo acima do chat
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tempo: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
  },
  segmentosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  segmento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bolinha: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  segTexto: {
    fontSize: 11,
    color: COLORS.textDark,
    maxWidth: 110,
  },
  seta: {
    fontSize: 13,
    color: COLORS.textMid,
    marginHorizontal: 1,
  },
  instrucao: {
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    padding: 8,
    marginTop: 2,
    marginBottom: 6,
  },
  instrucaoTexto: {
    fontSize: 12,
    color: COLORS.textDark,
  },
  acoes: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  botaoEncerrar: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#E53935',
  },
  botaoIniciar: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  labelLinha: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  labelLinhaTexto: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
