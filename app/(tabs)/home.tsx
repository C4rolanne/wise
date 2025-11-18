import { Link, router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// ÍCONES: Importamos as famílias necessárias
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    // 1. Container Principal com Fundo Creme
    <View style={styles.fullScreenContainer}>
      {/* 2. Header Laranja (personalizado) */}
      <View style={styles.headerLaranja}>
        {/* Lado Esquerdo: Ícone */}
        <TouchableOpacity style={styles.iconButton}>
          <Entypo
            name="dots-three-vertical"
            size={24}
            color="black"
            onPress={() => router.push("/pages/settings")}
          />
        </TouchableOpacity>

        {/* Lado Direito: Nome FoodWise */}
        <Text style={styles.homeDireita}>FoodWise</Text>

        {/* Espaço Vazio para alinhamento */}
        <View style={styles.iconButton} />
      </View>

      {/* 3. Corpo da Tela (Conteúdo Principal) */}
      <View style={styles.contentBody}>
        {/* 💡 NOVO: Container para as Categorias (Layout Horizontal) */}
        <View style={styles.categoryContainer}>
          {/* Botão 1: Geladeira */}
          <TouchableOpacity style={styles.categoryButton}>
            <MaterialCommunityIcons
              name="fridge-outline"
              size={35}
              color="black"
            />
          </TouchableOpacity>

          {/* Botão 2: Freezer */}
          <TouchableOpacity style={styles.categoryButton}>
            <MaterialCommunityIcons
              name="cube-outline"
              size={35}
              color="black"
            />
          </TouchableOpacity>

          {/* Botão 3: Despensa */}
          <TouchableOpacity style={styles.categoryButton}>
            <MaterialCommunityIcons
              name="basket-outline"
              size={35}
              color="black"
            />
          </TouchableOpacity>
        </View>

        {/* Aqui virá o restante do conteúdo */}
        <Text style={styles.bodyText}>Lista de Itens</Text>
        <Link href="/login">Login page</Link>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/pages/categorias")}
      >
        <Entypo name="plus" size={32} color={"black"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // ----------- 1. ESTILOS DE TELA E HEADER ------------
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

  // --------- 2. ESTILOS DAS CATEGORIAS (Corrigidos) ------------

  // PASSO 1: categoryContainer
  categoryContainer: {
    // 💡 FLEXBOX: Faz os itens (botões) ficarem lado a lado (na linha)
    flexDirection: "row",
    // Distribui os botões ao longo da linha
    justifyContent: "space-between",

    // Margem no topo e na base (para separá-los)
    marginTop: 10,
    marginBottom: 20,
  },

  // PASSO 2: categoryButton (O seu estilo que estava faltando)
  categoryButton: {
    backgroundColor: "#E0E0E0", // Fundo cinza claro
    borderRadius: 15, // Borda arredondada
    padding: 10,
    // 💡 FLEX: Faz o botão ocupar 1/3 do espaço disponível
    flex: 1,
    // Espaçamento entre cada botão (para não ficarem colados)
    marginHorizontal: 5,

    // Centraliza o ícone dentro do botão
    alignItems: "center",
    justifyContent: "center",
    height: 65,
  },

  // ----------------------- 3. ESTILOS DO CORPO -----------------------
  bodyText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
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
