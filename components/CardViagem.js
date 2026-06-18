import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import styles from '../styles/cardViagemStyles';

export default function CardViagem({
  segmentos,
  tempoTotal,
  custoBrl,
  viagemAtiva,
  onIniciar,
  onEncerrar,
  bottomOffset,   // distância do fundo — passada pelo ViagemScreen
  visivel,        // controla animação de entrada/saída
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: visivel ? 1 : 0,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  }, [visivel]);

  const translateY = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [120, 0],   // sobe 120px a partir do fundo
  });

  const opacity = anim;

  const segmentoAtual = segmentos?.[0];

  return (
    <Animated.View
      style={[
        styles.card,
        { bottom: bottomOffset ?? 20, opacity, transform: [{ translateY }] },
      ]}
      pointerEvents={visivel ? 'auto' : 'none'}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>
          {viagemAtiva ? '▶ Em viagem' : 'Rota calculada'}
        </Text>
        <View style={styles.infoRow}>
          {tempoTotal != null && (
            <Text style={styles.tempo}>⏱ {tempoTotal} min</Text>
          )}
          {custoBrl != null && (
            <Text style={styles.tempo}>💰 R$ {custoBrl.toFixed(2)}</Text>
          )}
        </View>
      </View>

      {/* Segmentos */}
      <View style={styles.segmentosRow}>
        {segmentos?.map((seg, i) => (
          <View key={i} style={styles.segmento}>
            <View style={[styles.bolinha, { backgroundColor: seg.cor }]} />
            <Text style={styles.segTexto} numberOfLines={1}>
              {seg.tipo === 'pe'
                ? `🚶 ${seg.tempoMin}min`
                : `${seg.linha?.nome ?? seg.tipo} · ${seg.tempoMin}min`}
            </Text>
            {i < segmentos.length - 1 && (
              <Text style={styles.seta}>›</Text>
            )}
          </View>
        ))}
      </View>

      {/* Instrução atual — só durante viagem */}
      {viagemAtiva && segmentoAtual && (
        <View style={styles.instrucao}>
          <Text style={styles.instrucaoTexto}>
            {segmentoAtual.tipo === 'pe'
              ? `🚶 Caminhe ${segmentoAtual.tempoMin} min até o ponto`
              : `🚌 Embarque em: ${segmentoAtual.parada_origem ?? segmentoAtual.linha?.nome}`}
          </Text>
        </View>
      )}

      {/* Ações */}
      <View style={styles.acoes}>
        {viagemAtiva ? (
          <TouchableOpacity style={styles.botaoEncerrar} onPress={onEncerrar}>
            <Text style={styles.botaoTexto}>■ Encerrar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.botaoIniciar} onPress={onIniciar}>
            <Text style={styles.botaoTexto}>▶ Iniciar viagem</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}
