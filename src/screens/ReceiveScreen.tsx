import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
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

const ReceiveScreen: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const configStr = await AsyncStorage.getItem('appConfig');
        if (configStr) {
          const config = JSON.parse(configStr);
          if (config.userName) setUserName(config.userName);
          if (config.userId) setUserId(config.userId);
        }
      } catch (error) {
        console.warn('Error leyendo config en ReceiveScreen', error);
      }
    })();
  }, []);

  const handleEnviar = async () => {
    await addMovement(userId, amount, concept, userId);
    const smsBody = `Pasame ${amount}. Concepto: ${concept}. A nombre de: ${userName}. Con ID: ${userId}`;
    Linking.openURL(`sms:${phoneNumber}?body=${encodeURIComponent(smsBody)}`);
    setPhoneNumber('');
    setAmount('');
    setConcept('');
    alert('Solicitud de dinero enviada (simulada). Campos limpiados.');
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Nombre de usuario:</Text>
        <TextInput
          style={styles.input}
          value={userName}
          editable={false}  
        />

        <Text style={styles.label}>Identificación:</Text>
        <TextInput
          style={styles.input}
          value={userId}
          editable={false}  
        />

        <Text style={styles.label}>Número de teléfono:</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholder="Ingresa tu número"
        />

        <Text style={styles.label}>Monto a recibir:</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Ingresa el monto"
        />

        <Text style={styles.label}>Concepto de transferencia:</Text>
        <TextInput
          style={styles.input}
          value={concept}
          onChangeText={setConcept}
          placeholder="Ingresa el concepto"
        />

        <View style={{ marginTop: 20 }}>
          <Button title="Solicitar fondos" onPress={handleEnviar} />
        </View>
      </View>
    </ScrollView>
  );
};

export default ReceiveScreen;

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
