import { StyleSheet, Platform } from 'react-native';
import { COLORS } from './globalStyles';

export default StyleSheet.create({
  chatContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 15,
    right: 15,
    backgroundColor: COLORS.bgWhite,
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 10,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  botaoColapsarChat: {
    padding: 4,
  },
  iconeChevron: {
    fontSize: 16,
    color: COLORS.textMid,
  },
  chatScroll: {
    maxHeight: 220,
    marginBottom: 10,
  },
  msgWelcome: {
    textAlign: 'center',
    color: COLORS.textMid,
    marginTop: 10,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: COLORS.borderLight,
    paddingTop: 10,
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 8,
    backgroundColor: COLORS.bgInput,
  },
  botaoVoz: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  botaoVozAtivo: {
    backgroundColor: COLORS.primary,
  },
  iconeVoz: {
    fontSize: 16,
  },
});