// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ReceiveScreen from './src/screens/ReceiveScreen';
import ConfigScreen from './src/screens/ConfigScreen';
import SendScreen from './src/screens/SendScreen';
import MovementsScreen from './src/screens/MovementsScreen';

export type BottomTabParamList = {
  Movimientos: undefined;
  Recibir: undefined;
  Ajustes: undefined;
  Enviar: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function App(): JSX.Element {
  const [initialScreen, setInitialScreen] = useState<keyof BottomTabParamList | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const configStr = await AsyncStorage.getItem('appConfig');
        if (configStr) {
          const config = JSON.parse(configStr);
          if (
            config.initialScreen &&
            ['Movimientos', 'Enviar', 'Recibir', 'Ajustes'].includes(config.initialScreen)
          ) {
            setInitialScreen(config.initialScreen);
          } else {
            setInitialScreen('Movimientos');
          }
        } else {
          setInitialScreen('Movimientos');
        }
      } catch (error) {
        console.warn('Error leyendo appConfig', error);
        setInitialScreen('Movimientos');
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading || !initialScreen) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando configuración...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={initialScreen}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'home';
            if (route.name === 'Movimientos') {
              iconName = focused ? 'pie-chart' : 'pie-chart-outline';
            } else if (route.name === 'Recibir') {
              iconName = focused ? 'download' : 'download-outline';
            } else if (route.name === 'Ajustes') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Enviar') {
              iconName = focused ? 'send' : 'send-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="Movimientos"
          component={MovementsScreen}
          options={{ title: 'Movimientos' }}
        />
        <Tab.Screen
          name="Enviar"
          component={SendScreen}
          options={{ title: 'Enviar' }}
        />
        <Tab.Screen
          name="Recibir"
          component={ReceiveScreen}
          options={{ title: 'Recibir' }}
        />
        <Tab.Screen
          name="Ajustes"
          component={ConfigScreen}
          // Si no quieres que aparezca la palabra 'Configuracion', puedes cambiar:
          options={{ title: 'Ajustes' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
