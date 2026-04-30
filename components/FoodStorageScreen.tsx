import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { useFoods } from "@/hooks/useFoods";
import type { FoodStorage } from "@/types/food";
import { formatDate, getFoodStatusColor, getFoodStatusLabel } from "@/utils/foodDisplay";

interface FoodStorageScreenProps {
  storage: FoodStorage;
  emptyText: string;
}

export function FoodStorageScreen({ storage, emptyText }: FoodStorageScreenProps) {
  const { isAuthenticated, loading: authLoading, signInWithGoogle } = useAuth();
  const { foods, loading, error, refresh } = useFoods({ storage });
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) refresh();
    }, [isAuthenticated, refresh]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const renderCategoryButton = (
    targetStorage: FoodStorage,
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
    route: "/(tabs)/home" | "/freezer" | "/despensa",
  ) => (
    <TouchableOpacity
      onPress={() => router.push(route)}
      style={storage === targetStorage ? styles.categorySelectedButton : styles.categoryButton}
    >
      <MaterialCommunityIcons name={icon} size={35} color="black" />
    </TouchableOpacity>
  );

  const renderBody = () => {
    if (authLoading || loading) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator color="#FF9800" />
          <Text style={styles.stateText}>Carregando alimentos...</Text>
        </View>
      );
    }

    if (!isAuthenticated) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Entre com Google para ver seus alimentos.</Text>
          <TouchableOpacity style={styles.stateButton} onPress={signInWithGoogle}>
            <Text style={styles.stateButtonText}>Entrar com Google</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.stateButton} onPress={refresh}>
            <Text style={styles.stateButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (foods.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      );
    }

    return foods.map((food) => (
      <View key={food.id} style={styles.foodCard}>
        <Text style={styles.foodName}>{food.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getFoodStatusColor(food) }]}>
          <Text style={styles.statusText}>{getFoodStatusLabel(food)}</Text>
        </View>
        <Text style={styles.dateText}>Validade: {formatDate(food.expirationDate)}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.fullScreenContainer}>
      <View style={styles.headerLaranja}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/profile")}>
          <Entypo name="dots-three-vertical" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.homeDireita}>FoodWise</Text>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/profile")}>
          <MaterialCommunityIcons name="account-circle-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentBody}>
        <View style={styles.categoryContainer}>
          {renderCategoryButton("geladeira", "fridge-outline", "/(tabs)/home")}
          {renderCategoryButton("freezer", "cube-outline", "/freezer")}
          {renderCategoryButton("despensa", "basket-outline", "/despensa")}
        </View>

        <Text style={styles.bodyText}>Lista de Itens</Text>

        <ScrollView
          style={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {renderBody()}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.scanButton} onPress={() => router.push("/scan")}>
        <MaterialCommunityIcons name="camera-outline" size={28} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/FoodCRUD")}>
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
  stateContainer: {
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 24,
    gap: 12,
  },
  stateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#b91c1c",
    textAlign: "center",
  },
  stateButton: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  stateButtonText: {
    color: "black",
    fontWeight: "700",
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
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: "#FFE0B2",
    position: "absolute",
    bottom: 180,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
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
