import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

async function addMovement(origin: string, monto: string, descripcion: string, userId: string) {
  try {
    const dataStr = await AsyncStorage.getItem('movementsLog');
    let movements = dataStr ? JSON.parse(dataStr) : [];
    const tipo = (origin === userId) ? 'ingreso' : 'egreso';
    const newMovement = {
      origin,
      monto,
      descripcion,
      fecha: new Date().toISOString(),
      tipo,
    };

    movements.push(newMovement);
    await AsyncStorage.setItem('movementsLog', JSON.stringify(movements));
  } catch (error) {
    console.warn('Error guardando movimiento', error);
  }
}

const SendScreen: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [bankNumber, setBankNumber] = useState('');  
  const [destNumber] = useState('3001234567');
  const [destName] = useState('Carlos Pérez');
  const [amount] = useState('1000');
  const [motivo] = useState('Pago de servicios');

  useEffect(() => {
    (async () => {
      const configStr = await AsyncStorage.getItem('appConfig');
      if (configStr) {
        const config = JSON.parse(configStr);
        if (config.userId) setUserId(config.userId);
        if (config.banco) setBankNumber(config.banco); 
      }
    })();
  }, []);

  const handleEnviar = async () => {
    await addMovement(destNumber, amount, motivo, userId);
    const smsBody = `PASE ${amount} ${destNumber} ${motivo}`;
    Linking.openURL(`sms:${bankNumber}?body=${encodeURIComponent(smsBody)}`);
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Número del destinatario:</Text>
        <TextInput
          style={styles.input}
          value={destNumber}
          editable={false}
        />

        <Text style={styles.label}>Nombre del destinatario:</Text>
        <TextInput
          style={styles.input}
          value={destName}
          editable={false} 
        />

        <Text style={styles.label}>Monto a enviar:</Text>
        <TextInput
          style={styles.input}
          value={amount}
          editable={false}
        />

        <Text style={styles.label}>Motivo:</Text>
        <TextInput
          style={styles.input}
          value={motivo}
          editable={false}  
        />

        <View style={{ marginTop: 20 }}>
          <Button title="Enviar" onPress={handleEnviar} />
        </View>
      </View>
    </ScrollView>
  );
};

export default SendScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  innerContainer: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  label: {
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 5,
    paddingHorizontal: 8,
  },
});
