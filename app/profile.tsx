import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";

export default function ProfileScreen() {
  const { isAuthenticated, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { user, loading, saving, error, success, update } = useUser();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(user?.name ?? user?.fullName ?? "");
  }, [user]);

  useEffect(() => {
    if (success) Alert.alert("Sucesso", success);
  }, [success]);

  const handleSave = async () => {
    try {
      await update({ name, fullName: name });
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Nao foi possivel atualizar o perfil.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Nao foi possivel sair.");
    }
  };

  if (authLoading || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#FF9800" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.centered}>
        <Text style={styles.stateText}>Entre com Google para acessar seu perfil.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={signInWithGoogle}>
          <Text style={styles.primaryButtonText}>Entrar com Google</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <View style={styles.content}>
        {user?.avatarUrl || user?.picture ? (
          <Image source={{ uri: user.avatarUrl ?? user.picture ?? "" }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{(name || user?.email || "U").charAt(0).toUpperCase()}</Text>
          </View>
        )}

        <Text style={styles.email}>{user?.email}</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Seu nome" />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={saving}>
          <Text style={styles.primaryButtonText}>{saving ? "Salvando..." : "Salvar perfil"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleSignOut}>
          <Text style={styles.secondaryButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3E0",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: "#FFF3E0",
  },
  header: {
    backgroundColor: "#FFB74D",
    paddingTop: 54,
    paddingBottom: 22,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "black",
  },
  content: {
    padding: 20,
    gap: 12,
    alignItems: "stretch",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: "center",
  },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FF9800",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 38,
    fontWeight: "800",
    color: "black",
  },
  email: {
    textAlign: "center",
    color: "#4b5563",
    marginBottom: 12,
  },
  label: {
    fontWeight: "800",
    color: "#374151",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  stateText: {
    color: "#4b5563",
    textAlign: "center",
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#FF9800",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: "black",
    fontWeight: "800",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#ef4444",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#b91c1c",
    fontWeight: "800",
  },
  errorText: {
    color: "#b91c1c",
    textAlign: "center",
  },
});
