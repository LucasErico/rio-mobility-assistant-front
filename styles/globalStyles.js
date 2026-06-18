import { StyleSheet, Platform } from 'react-native';

export const COLORS = {
  primary: '#007AFF',
  success: '#34C759',
  error: '#c62828',
  errorLight: '#ffcdd2',
  errorBorder: '#ef9a9a',
  actionLight: '#e0f2f1',
  actionBorder: '#80cbc4',
  textDark: '#333',
  textMid: '#666',
  textLight: '#999',
  textWhite: '#fff',
  bgWhite: 'rgba(255,255,255,0.97)',
  bgDisabled: 'rgba(220,220,220,0.9)',
  bgInput: '#fff',
  bgMsgUser: '#dcf8c6',
  bgMsgAi: '#f1f1f1',
  bgMsgSystem: '#eeeeee',
  border: '#ddd',
  borderLight: '#eee',
};

export default StyleSheet.create({
  // Botão redondo com fundo branco e sombra (menu, flutuantes)
  botaoIcone: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  iconeTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },

  // Botão primário preenchido
  botaoPrimario: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  botaoPrimarioTexto: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 13,
  },

  // Botão primário redondo (enviar, etc.)
  botaoRedondo: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  botaoRedondoDesabilitado: {
    backgroundColor: '#cccccc',
  },
  botaoRedondoTexto: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
    fontSize: 18,
  },

  // Card flutuante com sombra
  cardFlutuante: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  // Tipografia
  textoLabel: { fontSize: 12, color: COLORS.textMid },
  textoCorpo: { fontSize: 14, color: COLORS.textDark },
  textoPlaceholder: { color: COLORS.textLight },

  // Mensagens do chat
  msgBase: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: '85%',
  },
  msgUser: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.bgMsgUser,
    borderBottomRightRadius: 4,
  },
  msgAi: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.bgMsgAi,
    borderBottomLeftRadius: 4,
  },
  msgAction: {
    alignSelf: 'center',
    backgroundColor: COLORS.actionLight,
    padding: 8,
    borderRadius: 10,
    marginVertical: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.actionBorder,
  },
  msgError: {
    alignSelf: 'center',
    backgroundColor: COLORS.errorLight,
    padding: 8,
    borderRadius: 10,
    marginVertical: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
  },
  msgSystem: {
    alignSelf: 'center',
    backgroundColor: COLORS.bgMsgSystem,
    padding: 8,
    borderRadius: 10,
    marginVertical: 4,
    width: '100%',
  },
});