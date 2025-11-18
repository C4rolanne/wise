import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 💡 CORREÇÃO: Definição de Tipos para a Estrutura de Dados
type Category = {
  name: string;
  image: string;
  route: string;
};

// Dados simulados para as categorias
const categories: Category[] = [
  // Linha 1: Frutas, Legumes, Carnes, Laticínio
  { name: "Frutas", image: "https://via.placeholder.com/65x65/FFEB3B/000000?text=🍌", route: "/pages/comidas/Frutas" },
  { name: "Legumes", image: "https://via.placeholder.com/65x65/4CAF50/000000?text=🥦", route: "/pages/comidas/Legumes" },
  { name: "Carnes", image: "/icarne.png", route: "/pages/comidas/Carnes" },
  { name: "Laticínio", image: "https://via.placeholder.com/65x65/2196F3/000000?text=🥛", route: "/pages/comidas/Laticinio" },
  // Linha 2: Comida, Bebida, Frutos do mar, Pão
  { name: "Comida", image: "https://via.placeholder.com/65x65/9E9E9E/000000?text=🍽️", route: "/pages/comidas/Comida" },
  { name: "Bebida", image: "https://via.placeholder.com/65x65/03A9F4/000000?text=🥤", route: "/pages/comidas/Bebida" },
  { name: "Frutos do mar", image: "https://via.placeholder.com/65x65/00BCD4/000000?text=🦐", route: "/pages/comidas/FrutosDoMar" },
  { name: "Pão", image: "https://via.placeholder.com/65x65/FFC107/000000?text=", route: "/pages/comidas/Pao" },
];

// Componente individual de botão de categoria
const CategoryButton = ({ name, image, route }: Category) => (
  <TouchableOpacity 
    style={styles.categoryButton} 
    onPress={() => router.push(route as any)} // Forçamos o tipo para ignorar o erro de tipagem da rota dinâmica
  >
    <Image source={{ uri: image }} style={styles.iconImage} />
    <Text style={styles.categoryText}>{name}</Text>
  </TouchableOpacity>
);

export default function CategoriasScreen() {
  return (
    <View style={styles.container}>
      {/* Header Laranja (Baseado no Figma) */}
      <View style={styles.headerLaranja}>
        {/* Botão de Menu (Hambúrguer) */}
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Categorias</Text>
        
        {/* Placeholder para alinhamento simétrico, se necessário */}
        <View style={styles.menuButton} /> 
      </View>

      {/* Conteúdo Principal: O Grid de Categorias */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <CategoryButton key={cat.name} {...cat} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3E0", // Fundo Creme
  },
  // --- Estilos do Header ---
  headerLaranja: {
    backgroundColor: "#FFB74D", // Laranja
    height: 120, 
    paddingTop: 50,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28, 
    fontWeight: "bold",
    color: "black",
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  // --- Grid de Conteúdo ---
  contentContainer: {
    padding: 20,
    marginTop: 10, 
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", 
  },
  categoryButton: {
    width: "23%", 
    alignItems: "center",
    marginBottom: 5,
    padding: 5,
  },
  iconImage: {
    width: 65,
    height: 65,
    borderRadius: 15, 
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
});