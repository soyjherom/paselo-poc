import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';

type Movement = {
  origin: string;
  monto: string;
  descripcion: string;
  fecha: string;  
  tipo: 'ingreso' | 'egreso';
};

const MovementsScreen: React.FC = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if(isFocused) {
      fetchMovements();
    }
  }, [isFocused]);

  const fetchMovements = async () => {
    try {
      const dataStr = await AsyncStorage.getItem('movementsLog');
      if (dataStr) {
        let list = JSON.parse(dataStr) as Movement[];
        list.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setMovements(list);
      } else {
        setMovements([]);
      }
    } catch (error) {
      console.warn('Error leyendo movementsLog', error);
    }
  };

  const clearMovements = async () => {
    await AsyncStorage.removeItem('movementsLog');
    setMovements([]);
  };

  const renderItem = ({ item }: { item: Movement }) => {
    return (
      <View style={[styles.itemContainer, item.tipo === 'ingreso' ? styles.ingreso : styles.egreso]}>
        <Text style={styles.itemText}>Origen: {item.origin}</Text>
        <Text style={styles.itemText}>Monto: {item.monto}</Text>
        <Text style={styles.itemText}>Descripción: {item.descripcion}</Text>
        <Text style={styles.itemText}>Fecha: {new Date(item.fecha).toLocaleString()}</Text>
        <Text style={styles.itemText}>Tipo: {item.tipo}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={movements}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={{ width: '100%' }}
      />

      <TouchableOpacity onPress={clearMovements} style={styles.clearButton}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

export default MovementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  itemContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 16,
  },
  ingreso: {
    backgroundColor: '#d0f7d0', // verde clarito
  },
  egreso: {
    backgroundColor: '#f9dada', // rojo clarito
  },
  clearButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 6,
  },
});
