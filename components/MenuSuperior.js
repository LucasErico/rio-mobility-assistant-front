import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/menuSuperiorStyles';
import globalStyles from '../styles/globalStyles';
import SeletorPrioridade from './SeletorPrioridade';

export default function MenuSuperior({
  onNavFinanceiro, onBuscar,
  origemInput, setOrigemInput,
  destinoInput, setDestinoInput,
  prioridade, setPrioridade,
  onInverter,
  expandido, setExpandido,
}) {
  const [seletorVisivel, setSeletorVisivel] = useState(false);

  return (
    <View style={styles.wrapper}>

      {/* Botão Financeiro — sempre visível */}
      <TouchableOpacity style={globalStyles.botaoIcone} onPress={onNavFinanceiro}>
        <Text style={globalStyles.iconeTexto}>⇆</Text>
      </TouchableOpacity>

      {/* Painel expandido */}
      {expandido && (
        <View style={styles.painelExpandido}>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputEndereco}
              placeholder="Origem"
              placeholderTextColor="#999"
              value={origemInput}
              onChangeText={setOrigemInput}
            />
            {origemInput.length > 0 && (
              <TouchableOpacity onPress={() => setOrigemInput('')}>
                <Text style={styles.iconeLimpar}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.botaoInverter} onPress={onInverter}>
            <Text style={styles.iconeInverter}>⇅</Text>
          </TouchableOpacity>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputEndereco}
              placeholder="Destino"
              placeholderTextColor="#999"
              value={destinoInput}
              onChangeText={setDestinoInput}
            />
            {destinoInput.length > 0 && (
              <TouchableOpacity onPress={() => setDestinoInput('')}>
                <Text style={styles.iconeLimpar}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buscarRow}>
            <Text style={styles.labelPrioridade}>Prioridade</Text>
            <TouchableOpacity
              style={styles.selectToque}
              onPress={() => setSeletorVisivel(true)}
            >
              <Text style={styles.selectTexto}>{prioridade} ▾</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.botaoPrimario} onPress={onBuscar}>
              <Text style={globalStyles.botaoPrimarioTexto}>Buscar</Text>
            </TouchableOpacity>
          </View>

          {/* Chevron colapsar — dentro do painel, centralizado */}
          <TouchableOpacity
            style={styles.botaoChevron}
            onPress={() => setExpandido(false)}
            hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
          >
            <Text style={styles.iconeChevron}>∧</Text>
          </TouchableOpacity>

          <SeletorPrioridade
            visivel={seletorVisivel}
            valorAtual={prioridade}
            onSelecionar={setPrioridade}
            onFechar={() => setSeletorVisivel(false)}
          />
        </View>
      )}

      {/* Chevron expandir — canto superior direito, só quando colapsado */}
      {!expandido && (
        <TouchableOpacity
          style={styles.chevronFixo}
          onPress={() => setExpandido(true)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.iconeChevron}>∨</Text>
        </TouchableOpacity>
      )}

    </View>
  );
}