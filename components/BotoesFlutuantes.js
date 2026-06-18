import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/botoesFlutuantesStyles';

export default function BotoesFlutantes({
  rotaCalculada,
  viagemAtiva,
  onIniciarViagem,
  onLocalizacao,
  gpsAtivo,
}) {
  return (
    <View style={styles.container}>

      {/* Botão Play */}
      <TouchableOpacity
        style={[styles.botao, !rotaCalculada && styles.botaoDesabilitado]}
        onPress={rotaCalculada ? onIniciarViagem : null}
        activeOpacity={rotaCalculada ? 0.7 : 1}
      >
        <Text style={[styles.icone, !rotaCalculada && styles.iconeDesabilitado]}>
          {viagemAtiva ? '⏹' : '▶'}
        </Text>
      </TouchableOpacity>

      {/* Botão GPS — onPress SEMPRE ativo */}
      <TouchableOpacity
        style={[styles.botao, !gpsAtivo && styles.botaoGpsDesligado]}
        onPress={() => {
          console.log('Botão GPS tocado, gpsAtivo:', gpsAtivo);
          onLocalizacao();
        }}
        activeOpacity={0.7}
      >
        <Text style={[styles.icone, gpsAtivo ? styles.iconeGpsAtivo : styles.iconeGpsDesligado]}>
          ◎
        </Text>
      </TouchableOpacity>

    </View>
  );
}