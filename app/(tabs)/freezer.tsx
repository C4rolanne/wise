import React, { useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, RefreshControl } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

const STORAGE_TYPE = 'freezer'; // MUDE AQUI para cada tela!
const STORAGE_KEY = '@foods_database';

interface Food {
  id: number;
  name: string;
  category: string;
  storage: string;
  manufacturingDate: string;
  expirationDate: string;
}

export default function HomeScreen() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Hook para carregar dados quando a tela recebe foco
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
    <View style={styles.fullScreenContainer}>
      {/* Header */}
      <View style={styles.headerLaranja}>
        <TouchableOpacity style={styles.iconButton}>
          <Entypo name="dots-three-vertical" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.homeDireita}>FoodWise</Text>

        <View style={styles.iconButton} />
      </View>

      {/* Corpo */}
      <View style={styles.contentBody}>
        {/* Container das Categorias */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity onPress={() => router.push("/home")} style={styles.categoryButton}>
            <MaterialCommunityIcons name="fridge-outline" size={35} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.categorySelectedButton}>
            <MaterialCommunityIcons name="cube-outline" size={35} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/despensa")} style={styles.categoryButton}>
            <MaterialCommunityIcons name="basket-outline" size={35} color="black" />
          </TouchableOpacity>
        </View>

        {/* Lista de Itens */}
        <Text style={styles.bodyText}>Lista de Itens</Text>
        
        <ScrollView 
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {foods.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum alimento cadastrado</Text>
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

      {/* Botão Adicionar */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/FoodCRUD")}
      >
        <Entypo name="plus" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#FFF3E0",
  },
  headerLaranja: {
    backgroundColor: "#FFB74D",
    height: 170,
    paddingTop: 50,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  homeDireita: {
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  contentBody: {
    flex: 1,
    paddingHorizontal: 15,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 65,
  },
  categorySelectedButton: {
    backgroundColor: "#e28408ff",
    borderRadius: 15,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 65,
  },
  bodyText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontWeight: "600",
  },
  scrollContainer: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  foodCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  foodName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: "#FF9800",
    position: "absolute",
    bottom: 110,
    right: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});