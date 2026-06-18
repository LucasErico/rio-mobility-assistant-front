import React, { useRef } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import styles from '../styles/chatStyles';
import globalStyles, { COLORS } from '../styles/globalStyles';

export default function ChatOverlay({
  historicoChat, mensagem, setMensagem,
  carregando, onEnviar,
  chatExpandido, setChatExpandido,
  msgBoasVindas,
}) {
  const scrollViewRef = useRef();

  return (
    <View style={styles.chatContainer}>

      {/* Chevron colapsar/expandir */}
      <View style={styles.chatHeader}>
        <TouchableOpacity
          style={styles.botaoColapsarChat}
          onPress={() => setChatExpandido(v => !v)}
        >
          <Text style={styles.iconeChevron}>{chatExpandido ? '∨' : '∧'}</Text>
        </TouchableOpacity>
      </View>

      {/* Histórico — só quando expandido */}
      {chatExpandido && (
        <ScrollView
          style={styles.chatScroll}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {historicoChat.length === 0 && (
            <Text style={styles.msgWelcome}>{msgBoasVindas}</Text>
          )}
          {historicoChat.map((msg, index) => {
            let estiloBolha = globalStyles.msgSystem;
            let estiloTexto = { color: COLORS.textMid };
            if (msg.tipo === 'user')               { estiloBolha = [globalStyles.msgBase, globalStyles.msgUser];  estiloTexto = { color: '#000' }; }
            else if (msg.tipo === 'ai')            { estiloBolha = [globalStyles.msgBase, globalStyles.msgAi];   estiloTexto = { color: COLORS.textDark }; }
            else if (msg.tipo === 'system_action') { estiloBolha = globalStyles.msgAction; estiloTexto = { color: '#00695c' }; }
            else if (msg.tipo === 'system_error')  { estiloBolha = globalStyles.msgError;  estiloTexto = { color: COLORS.error }; }
            return (
              <View key={index} style={estiloBolha}>
                <Text style={estiloTexto}>{msg.texto}</Text>
              </View>
            );
          })}
          {carregando && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={{ marginTop: 10, alignSelf: 'flex-start' }}
            />
          )}
        </ScrollView>
      )}

      {/* Input + botão enviar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={mensagem}
          onChangeText={setMensagem}
          placeholder={carregando ? "Aguarde..." : "Para onde quer ir?"}
          placeholderTextColor="#999"
          onSubmitEditing={onEnviar}
          returnKeyType="send"
          editable={!carregando}
        />

        <TouchableOpacity
          style={[globalStyles.botaoRedondo, carregando && globalStyles.botaoRedondoDesabilitado]}
          onPress={onEnviar}
          disabled={carregando}
        >
          <Text style={globalStyles.botaoRedondoTexto}>↑</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}