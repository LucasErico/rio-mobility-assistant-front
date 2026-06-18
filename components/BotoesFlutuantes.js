import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import styles from '../styles/botoesFlutuantesStyles';

export default function BotoesFlutantes({
  rotaCalculada,
  viagemAtiva,
  onIniciarViagem,
  onLocalizacao,
  gpsAtivo,
}) {
  const animPlay = useRef(new Animated.Value(0)).current;

  // Botão play aparece/desaparece conforme rotaCalculada
  useEffect(() => {
    Animated.spring(animPlay, {
      toValue: rotaCalculada ? 1 : 0,
      useNativeDriver: true,
      tension: 70,
      friction: 10,
    }).start();
  }, [rotaCalculada]);

  const scalePlay = animPlay.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>

      {/* Botão Play — só aparece com rota calculada */}
      <Animated.View style={{ transform: [{ scale: scalePlay }], opacity: animPlay, marginTop: 10 }}>
        <TouchableOpacity
          style={[
            styles.botao,
            viagemAtiva ? { backgroundColor: '#E53935' } : styles.botaoPlayAtivo,
          ]}
          onPress={rotaCalculada ? onIniciarViagem : null}
          activeOpacity={0.75}
        >
          <Text style={styles.iconePlay}>
            {viagemAtiva ? '⏹' : '▶'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Botão GPS — sempre visível */}
      <TouchableOpacity
        style={[styles.botao, !gpsAtivo && styles.botaoGpsDesligado, { marginTop: 10 }]}
        onPress={onLocalizacao}
        activeOpacity={0.7}
      >
        <Text style={[styles.icone, gpsAtivo ? styles.iconeGpsAtivo : styles.iconeGpsDesligado]}>
          ◎
        </Text>
      </TouchableOpacity>

    </View>
  );
}
