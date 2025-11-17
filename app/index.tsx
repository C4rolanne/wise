import { Link } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Index() {
  // Removemos const router e const SPLASH_DURATION

  return (
    <View style={styles.container}>
      {/* 1. Logo foodwise */}
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      {/* 2. Nome do App */}
      <Text style={styles.appName}>FoodWise</Text>
      <Link
        href="/home"
        style={{
          width: 100,
          height: 30,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderRadius: 8,
          textAlign: "center",
        }}
      >
        {" "}
        home page
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFB74D", // Laranja
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center", // Centraliza horizontalmente
  },

  logo: {
    // Defina o tamanho da sua logo (exemplo)
    width: 200,
    height: 200,
    marginBottom: 3, // Espaçamento entre a logo e o nome
    resizeMode: "contain", // Garante que a imagem se ajuste bem
  },

  appName: {
    color: "black", // Cor do texto
    fontSize: 55,
    fontWeight: "bold",
  },
});
