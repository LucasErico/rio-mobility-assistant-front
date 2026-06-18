import { StyleSheet } from 'react-native';
import { COLORS } from './globalStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoVoltar: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 16,
  },
  textoBotao: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    color: '#aaa',
    fontSize: 18,
    fontStyle: 'italic',
  },
});