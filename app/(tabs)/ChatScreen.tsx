import React from 'react';
import { StyleSheet, View, Text, TextInput, Image, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import QuicheImageLocal from '../../assets/QuicheEspinafre.jpg'; 

const ChatScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Cabeçalho "Mr. Bot" */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Mr.Bot</Text>
          <View style={styles.headerIcons}>
            <MaterialCommunityIcons name="minus" size={24} color="black" style={styles.iconMargin} />
            <MaterialCommunityIcons name="close" size={24} color="black" />
          </View>
        </View>

        {/* Área de Mensagens */}
        <ScrollView contentContainerStyle={styles.messagesContainer}>
          
          {/* Mensagem do Usuário */}
          <View style={styles.userBubbleWrapper}>
            <View style={styles.userBubble}>
              <Text style={styles.userText}>
                Oi! Quais alimentos estão perto de vencer aí na minha geladeira?
              </Text>
            </View>
          </View>

          {/* Mensagem do Bot */}
          <View style={styles.botBubbleWrapper}>
            <View style={styles.botBubble}>
              <Text style={styles.botText}>
                Olá, ! 🌿
              </Text>
              <Text style={styles.botText}>
                O espinafre e os cogumelos estão próximos da validade. Que tal aproveitar e fazer uma quiche de espinafre e cogumelos? Uma opção deliciosa e sem desperdício! 🧑‍🍳
              </Text>
            </View>
          </View>
          
          source= {QuicheImageLocal}
          <View style={styles.imageContainer}>
            <Image
              source={QuicheImageLocal}
              style={styles.suggestionImage}
            />
          </View>

        </ScrollView>

        {/* Campo de Entrada de Mensagem */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Mensagem..."
            placeholderTextColor="#888"
          />
        </View>

      </View>
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Cor de fundo do corpo do chat (clara)
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Cor de fundo do corpo do chat (clara)
  },
  
  // --- Estilos do Cabeçalho ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFA500', // Laranja do cabeçalho
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FF8C00',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconMargin: {
    marginRight: 15,
  },

  // --- Estilos da Área de Mensagens ---
  messagesContainer: {
    padding: 10,
  },
  
  // --- Balão do Usuário (Direita) ---
  userBubbleWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: '#D1D1D1', // Cinza claro
    borderRadius: 15,
    borderBottomRightRadius: 2, // Ajuste para o "canto"
    maxWidth: '80%',
    padding: 10,
  },
  userText: {
    fontSize: 16,
    color: 'black',
  },

  // --- Balão do Bot (Esquerda) ---
  botBubbleWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  botBubble: {
    backgroundColor: '#EBEBEB', 
    borderRadius: 15,
    borderBottomLeftRadius: 2, // Ajuste para o "canto"
    maxWidth: '80%',
    padding: 10,
  },
  botText: {
    fontSize: 16,
    color: 'black',
  },

  // --- Imagem Sugerida ---
  imageContainer: {
    alignSelf: 'flex-start', // Alinha a imagem na esquerda
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 4, // Borda laranja em volta da imagem
    borderColor: '#FFA500', 
    overflow: 'hidden',
  },
  suggestionImage: {
    // ESSENCIAL: Largura e altura definida para a imagem
    width: 250, 
    height: 180, 
    resizeMode: 'cover',
  },

  // --- Campo de Entrada ---
  inputContainer: {
    padding: 10,
    backgroundColor: '#F5F5DC', // Cor de fundo do corpo do chat (clara)
  },
  textInput: {
    height: 45,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#CCC',
  },
});

export default ChatScreen;