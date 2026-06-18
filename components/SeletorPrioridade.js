import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import globalStyles, { COLORS } from '../styles/globalStyles';

const OPCOES = ['Mais barato', 'Mais rápido', 'Menos baldeações'];

export default function SeletorPrioridade({ visivel, valorAtual, onSelecionar, onFechar }) {
  return (
    <Modal transparent visible={visivel} animationType="fade" onRequestClose={onFechar}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onFechar}>
        <View style={styles.box}>
          <Text style={styles.titulo}>Prioridade da rota</Text>
          {OPCOES.map(opcao => (
            <TouchableOpacity
              key={opcao}
              style={[styles.opcao, valorAtual === opcao && styles.opcaoAtiva]}
              onPress={() => { onSelecionar(opcao); onFechar(); }}
            >
              <Text style={[styles.opcaoTexto, valorAtual === opcao && styles.opcaoTextoAtivo]}>
                {opcao}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  opcao: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  opcaoAtiva: { backgroundColor: COLORS.primary },
  opcaoTexto: { fontSize: 15, color: COLORS.textDark },
  opcaoTextoAtivo: { color: COLORS.textWhite, fontWeight: 'bold' },
});