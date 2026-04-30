import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { formatDate, getFoodStatusLabel } from "@/utils/foodDisplay";

export default function ChatScreen() {
  const { isAuthenticated, loading: authLoading, signInWithGoogle } = useAuth();
  const { messages, loading, error, sendMessage, clear } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;
    setInput("");
    await sendMessage(message);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  const renderAssistantDetails = (messageId: string, message: (typeof messages)[number]) => (
    <View>
      {message.warnings?.map((warning, index) => (
        <Text key={`${messageId}-warning-${index}`} style={styles.detailText}>
          Aviso: {warning}
        </Text>
      ))}

      {message.prioritizedFoods?.map((food) => (
        <Text key={`${messageId}-food-${food.id}`} style={styles.detailText}>
          Prioridade: {food.name} - {getFoodStatusLabel(food)} - {formatDate(food.expirationDate)}
        </Text>
      ))}

      {message.recipes?.map((recipe, index) => (
        <View key={`${messageId}-recipe-${index}`} style={styles.recipeBox}>
          <Text style={styles.recipeTitle}>{recipe.title ?? recipe.name ?? "Ideia de receita"}</Text>
          {recipe.description ? <Text style={styles.recipeText}>{recipe.description}</Text> : null}
          {recipe.ingredients?.length ? (
            <Text style={styles.recipeText}>Ingredientes: {recipe.ingredients.join(", ")}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );

  const renderBody = () => {
    if (authLoading) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator color="#FFA500" />
        </View>
      );
    }

    if (!isAuthenticated) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Entre com Google para conversar com a IA.</Text>
          <TouchableOpacity style={styles.stateButton} onPress={signInWithGoogle}>
            <Text style={styles.stateButtonText}>Entrar com Google</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (messages.length === 0) {
      return (
        <View style={styles.emptyChat}>
          <Text style={styles.stateText}>Pergunte sobre receitas, validade ou como priorizar seus alimentos.</Text>
        </View>
      );
    }

    return messages.map((message) => {
      const isUser = message.role === "user";

      return (
        <View
          key={message.id}
          style={isUser ? styles.userBubbleWrapper : styles.botBubbleWrapper}
        >
          <View style={isUser ? styles.userBubble : styles.botBubble}>
            <Text style={styles.messageText}>{message.content}</Text>
            {!isUser ? renderAssistantDetails(message.id, message) : null}
          </View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Mr.Bot</Text>
          <TouchableOpacity onPress={clear}>
            <MaterialCommunityIcons name="delete-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {renderBody()}
          {loading ? (
            <View style={styles.botBubbleWrapper}>
              <View style={styles.botBubble}>
                <ActivityIndicator color="#FFA500" />
              </View>
            </View>
          ) : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Mensagem..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
            editable={isAuthenticated && !loading}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!input.trim() || loading}
          >
            <MaterialCommunityIcons name="send" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFA500",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FF8C00",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  messagesContainer: {
    padding: 10,
    flexGrow: 1,
  },
  stateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  emptyChat: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  stateText: {
    color: "#4b5563",
    textAlign: "center",
    fontSize: 16,
  },
  stateButton: {
    backgroundColor: "#FFA500",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  stateButtonText: {
    color: "black",
    fontWeight: "700",
  },
  userBubbleWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: "#D1D1D1",
    borderRadius: 15,
    borderBottomRightRadius: 2,
    maxWidth: "82%",
    padding: 10,
  },
  botBubbleWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  botBubble: {
    backgroundColor: "#EBEBEB",
    borderRadius: 15,
    borderBottomLeftRadius: 2,
    maxWidth: "86%",
    padding: 10,
  },
  messageText: {
    fontSize: 16,
    color: "black",
  },
  detailText: {
    marginTop: 8,
    color: "#374151",
    fontSize: 14,
  },
  recipeBox: {
    marginTop: 10,
    backgroundColor: "#fff7ed",
    borderRadius: 8,
    padding: 10,
  },
  recipeTitle: {
    fontWeight: "800",
    color: "#7c2d12",
    marginBottom: 4,
  },
  recipeText: {
    color: "#7c2d12",
    fontSize: 14,
  },
  errorText: {
    color: "#b91c1c",
    textAlign: "center",
    marginVertical: 8,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: "#F5F5DC",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 45,
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
