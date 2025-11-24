// Template para as telas: Geladeira.tsx, Freezer.tsx e Despensa.tsx
// Copie este código e mude apenas o valor de STORAGE_TYPE para cada tela

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// ⚠️ MUDE APENAS ESTA LINHA PARA CADA TELA:
// Para Geladeira.tsx → 'geladeira'
// Para Freezer.tsx → 'freezer'  
// Para Despensa.tsx → 'despensa'
const STORAGE_TYPE = 'geladeira'; // MUDE AQUI!

const STORAGE_KEY = '@foods_database';

interface Food {
  id: number;
  name: string;
  category: string;
  storage: string;
  manufacturingDate: string;
  expirationDate: string;
}

export default function StorageScreen() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Recarrega sempre que a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      loadFoods();
    }, [])
  );

  const loadFoods = async () => {
    try {
      const storedFoods = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedFoods) {
        const allFoods = JSON.parse(storedFoods);
        // FILTRA apenas os alimentos do local específico
        const filteredFoods = allFoods.filter(
          (food: Food) => food.storage === STORAGE_TYPE
        );
        setFoods(filteredFoods);
      }
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFoods();
    setRefreshing(false);
  };

  const calculateDaysRemaining = (expirationDate: string): number => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (days: number): string => {
    if (days < 0) return '#ef4444';
    if (days <= 3) return '#f59e0b';
    return '#10b981';
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {foods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum alimento cadastrado aqui</Text>
          </View>
        ) : (
          foods.map((food) => {
            const daysRemaining = calculateDaysRemaining(food.expirationDate);
            const statusColor = getStatusColor(daysRemaining);
            
            return (
              <View key={food.id} style={styles.foodCard}>
                <Text style={styles.foodName}>{food.name}</Text>
                
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>
                    {daysRemaining < 0 ? 'VENCIDO' : `${daysRemaining} dias`}
                  </Text>
                </View>
                
                <Text style={styles.dateText}>
                  Validade: {formatDate(food.expirationDate)}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  foodCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
});