import React, { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import ViagemScreen from './screens/ViagemScreen';
import FinanceiroScreen from './screens/FinanceiroScreen';
import { warmUpBackend } from './services/rotaService';

const Stack = createNativeStackNavigator();

export default function App() {
  const [localizacaoAtual, setLocalizacaoAtual] = useState(null);
  const [enderecoAtual, setEnderecoAtual] = useState(null);
  const [gpsAtivo, setGpsAtivo] = useState(false);
  const [msgBoasVindas, setMsgBoasVindas] = useState("👋 Olá! Toque em ◎ para ativar sua localização.");

  const pollingRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  // Acorda o backend silenciosamente ao abrir o app
  useEffect(() => {
    warmUpBackend();
  }, []);

  const verificarGps = async () => {
    try {
      const disponivel = await Location.hasServicesEnabledAsync();
      if (!disponivel) {
        desativarGps();
        return;
      }
      const location = await Location.getLastKnownPositionAsync({});
      if (location) {
        setLocalizacaoAtual({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (_) {
      desativarGps();
    }
  };

  const desativarGps = () => {
    setGpsAtivo(false);
    setLocalizacaoAtual(null);
    setEnderecoAtual(null);
    setMsgBoasVindas("👋 Localização desativada. Toque em ◎ para reativar.");
    pararPolling();
  };

  const iniciarPolling = () => {
    pararPolling();
    pollingRef.current = setInterval(verificarGps, 3000);
  };

  const pararPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        if (gpsAtivo) await verificarGps();
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, [gpsAtivo]);

  useEffect(() => {
    return () => pararPolling();
  }, []);

  const ativarLocalizacao = async () => {
    if (gpsAtivo) return;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setMsgBoasVindas("👋 Permissão negada. Defina sua origem manualmente.");
        return;
      }

      let location = null;
      try {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
      } catch (_) {
        setMsgBoasVindas("👋 Ative o GPS do aparelho e toque em ◎ novamente.");
        return;
      }

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setLocalizacaoAtual(coords);
      setGpsAtivo(true);

      try {
        const geocode = await Location.reverseGeocodeAsync(coords);
        if (geocode?.length > 0) {
          const nome = geocode[0].subregion || geocode[0].city || geocode[0].street || "seu local";
          setEnderecoAtual(nome);
        }
      } catch (_) {}

      setMsgBoasVindas("👋 Localização ativada! Para onde quer ir?");
      iniciarPolling();

    } catch (_) {
      setGpsAtivo(false);
      setMsgBoasVindas("👋 Não foi possível obter localização.");
    }
  };

  const gpsProps = {
    localizacaoAtual,
    enderecoAtual,
    gpsAtivo,
    ativarLocalizacao,
    msgBoasVindas,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Viagem">
          {props => <ViagemScreen {...props} {...gpsProps} />}
        </Stack.Screen>
        <Stack.Screen name="Financeiro" component={FinanceiroScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}