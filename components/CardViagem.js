import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/cardViagemStyles';

export default function CardViagem({
  segmentos,
  tempoTotal,
  custoBrl,
  viagemAtiva,
  onIniciar,
  onEncerrar,
}) {
  const segmentoAtual = segmentos?.[0];

  return (
    <View style={styles.card}>

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>
          {viagemAtiva ? '▶ Em viagem' : 'Rota calculada'}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Text style={styles.tempo}>⏱ {tempoTotal} min</Text>
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

      {/* Botão ▶/■ */}
      <TouchableOpacity
        style={[styles.botaoPlay, viagemAtiva && styles.botaoStop]}
        onPress={viagemAtiva ? onEncerrar : onIniciar}
      >
        <Text style={styles.botaoTexto}>{viagemAtiva ? '■' : '▶'}</Text>
      </TouchableOpacity>

    </View>
  );
}