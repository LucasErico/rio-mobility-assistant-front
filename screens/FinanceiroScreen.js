import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from '../styles/financeiroStyles';
import globalStyles from '../styles/globalStyles';

export default function FinanceiroScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.botaoVoltar}
        onPress={() => navigation.navigate('Viagem')}
      >
        <Text style={globalStyles.iconeTexto}>⇆</Text>
      </TouchableOpacity>
      <Text style={styles.placeholder}>Página Financeira</Text>
    </SafeAreaView>
  );
}