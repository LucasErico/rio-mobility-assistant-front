import { StyleSheet } from 'react-native';
import { COLORS } from './globalStyles';

export default StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  tempo: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  segmentosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  segmento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  segTexto: {
    fontSize: 12,
    color: COLORS.textDark,
    maxWidth: 110,
  },
  seta: {
    fontSize: 14,
    color: COLORS.textMid,
    marginHorizontal: 2,
  },
  instrucao: {
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  instrucaoTexto: {
    fontSize: 13,
    color: COLORS.textDark,
  },
  botaoPlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  botaoStop: {
    backgroundColor: '#E53935',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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