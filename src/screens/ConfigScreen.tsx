import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_OPTIONS = ['Movimientos', 'Enviar', 'Recibir', 'Ajustes'];

const BANK_OPTIONS = [
  { label: 'BNCR', value: '2627' },           // (Kolbi, Movistar, Claro)
  { label: 'BCR', value: '2276' },            // (Kolbi)
  { label: 'BAC', value: '1222' },            // (Kolbi, Movistar, Claro)
  { label: 'Davivienda', value: '70707474' },// (Claro)
  { label: 'Promerica', value: '62232450' }, // (Kolbi, Movistar, Claro)
  { label: 'Lafise', value: '9091' },         // (Kolbi, Movistar, Claro)
];

const ConfigScreen: React.FC = () => {
  const [selectedScreen, setSelectedScreen] = useState<string>('Movements');
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('2627'); // BNCR por default

  useEffect(() => {
    (async () => {
      try {
        const configStr = await AsyncStorage.getItem('appConfig');
        if (configStr) {
          const config = JSON.parse(configStr);
          if (config.initialScreen) setSelectedScreen(config.initialScreen);
          if (config.userName) setUserName(config.userName);
          if (config.userId) setUserId(config.userId);
          if (config.banco) setSelectedBank(config.banco);
        }
      } catch (error) {
        console.warn('Error leyendo configuración:', error);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      const newConfig = {
        initialScreen: selectedScreen,
        userName,
        userId,
        banco: selectedBank,
      };
      await AsyncStorage.setItem('appConfig', JSON.stringify(newConfig));
      alert('Preferencias guardadas correctamente.');
    } catch (error) {
      console.warn('Error guardando preferencia:', error);
    }
  };

  const renderOption = (option: string) => {
    const isSelected = option === selectedScreen;
    return (
      <TouchableOpacity
        key={option}
        style={styles.radioButtonContainer}
        onPress={() => setSelectedScreen(option)}
      >
        <View style={styles.radioCircle}>
          {isSelected && <View style={styles.radioCircleSelected} />}
        </View>
        <Text style={styles.radioLabel}>{option}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.innerContainer}>
        {/* Campos de texto */}
        <Text>Nombre de usuario:</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
          placeholder="Ingresa tu nombre..."
        />

        <Text style={{ marginTop: 15 }}>Identificación:</Text>
        <TextInput
          style={styles.input}
          value={userId}
          onChangeText={setUserId}
          placeholder="Ingresa tu ID..."
        />

        <Text style={{ marginTop: 15 }}>Pantalla inicial preferida:</Text>
        <View style={styles.radioGroup}>
          {SCREEN_OPTIONS.map((screen) => renderOption(screen))}
        </View>

        <Text style={{ marginTop: 15 }}>Banco para Sinpe Móvil:</Text>
        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedBank}
            onValueChange={(itemValue) => setSelectedBank(itemValue)}
            style={styles.picker}
          >
            {BANK_OPTIONS.map((bank) => (
              <Picker.Item
                key={bank.value}
                label={bank.label}
                value={bank.value}
              />
            ))}
          </Picker>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button title="Guardar Preferencia" onPress={handleSave} />
        </View>
      </View>
    </ScrollView>
  );
};

export default ConfigScreen;

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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    height: 40,
    marginVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  radioGroup: {
    marginTop: 10,
    width: '80%',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  pickerContainer: {
    width: '80%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  picker: {
    width: '100%',
    height: 195,
  },
});
