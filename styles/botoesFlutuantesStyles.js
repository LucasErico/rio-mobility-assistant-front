import { StyleSheet, Platform } from 'react-native';
import { COLORS } from './globalStyles';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    right: 15,
    bottom: Platform.OS === 'ios' ? 420 : 400,
    alignItems: 'center',
    zIndex: 20,
  },
  botao: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bgWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  botaoDesabilitado: {
    backgroundColor: COLORS.bgDisabled,
  },
  botaoGpsDesligado: {
    backgroundColor: 'rgba(240,240,240,0.7)',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  icone: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconeDesabilitado: {
    color: '#aaa',
  },
  iconeGpsAtivo: {
    color: COLORS.success,
  },
  iconeGpsDesligado: {
    color: '#ccc',
  },
});