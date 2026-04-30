import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { useFoods } from "@/hooks/useFoods";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import type { CreateFoodInput, FoodStorage } from "@/types/food";
import { categories, getCategoryName } from "@/utils/foodDisplay";

type ReviewForm = {
  name: string;
  category: string;
  storage: FoodStorage;
  manufacturingDate: string;
  expirationDate: string;
};

const emptyReviewForm: ReviewForm = {
  name: "",
  category: "outros",
  storage: "geladeira",
  manufacturingDate: "",
  expirationDate: "",
};

export default function ScanScreen() {
  const { isAuthenticated, loading: authLoading, signInWithGoogle } = useAuth();
  const { createFood, saving } = useFoods();
  const { imageUri, suggestion, loading, error, takePhoto, pickImage, reset } = useImageAnalysis();
  const [form, setForm] = useState<ReviewForm>(emptyReviewForm);

  useEffect(() => {
    if (!suggestion) return;

    setForm({
      name: suggestion.name ?? "",
      category: suggestion.category ?? "outros",
      storage: (suggestion.storage as FoodStorage | undefined) ?? "geladeira",
      manufacturingDate: suggestion.manufacturingDate ?? "",
      expirationDate: suggestion.expirationDate ?? "",
    });
  }, [suggestion]);

  const updateField = (field: keyof ReviewForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.category || !form.storage || !form.expirationDate) {
      Alert.alert("Atencao", "Revise e preencha nome, categoria, local e validade antes de salvar.");
      return;
    }

    const payload: CreateFoodInput = {
      name: form.name.trim(),
      category: form.category,
      storage: form.storage,
      manufacturingDate: form.manufacturingDate || null,
      expirationDate: form.expirationDate,
    };

    try {
      await createFood(payload);
      Alert.alert("Sucesso", "Alimento salvo.");
      reset();
      setForm(emptyReviewForm);
      router.replace("/FoodCRUD");
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Nao foi possivel salvar.");
    }
  };

  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#FF9800" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.centered}>
        <Text style={styles.stateText}>Entre com Google para analisar imagens.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={signInWithGoogle}>
          <Text style={styles.primaryButtonText}>Entrar com Google</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analisar alimento</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={takePhoto} disabled={loading}>
            <Text style={styles.primaryButtonText}>Tirar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={pickImage} disabled={loading}>
            <Text style={styles.secondaryButtonText}>Escolher imagem</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#FF9800" />
            <Text style={styles.stateText}>Enviando imagem para IA...</Text>
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {imageUri ? <Image source={{ uri: imageUri }} style={styles.previewImage} /> : null}

        {suggestion ? (
          <View style={styles.reviewBox}>
            <Text style={styles.sectionTitle}>Revisar sugestao</Text>
            {typeof suggestion.confidence === "number" ? (
              <Text style={styles.metaText}>Confianca: {Math.round(suggestion.confidence * 100)}%</Text>
            ) : null}
            {suggestion.notes ? <Text style={styles.metaText}>{suggestion.notes}</Text> : null}

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(value) => updateField("name", value)}
              placeholder="Nome do alimento"
            />

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.pickerBox}>
              <Picker selectedValue={form.category} onValueChange={(value) => updateField("category", value)}>
                {categories.map((category) => (
                  <Picker.Item key={category} label={getCategoryName(category)} value={category} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Local</Text>
            <View style={styles.pickerBox}>
              <Picker selectedValue={form.storage} onValueChange={(value) => updateField("storage", value)}>
                <Picker.Item label="Geladeira" value="geladeira" />
                <Picker.Item label="Freezer" value="freezer" />
                <Picker.Item label="Despensa" value="despensa" />
              </Picker>
            </View>

            <Text style={styles.label}>Data de fabricacao</Text>
            <TextInput
              style={styles.input}
              value={form.manufacturingDate}
              onChangeText={(value) => updateField("manufacturingDate", value)}
              placeholder="AAAA-MM-DD"
            />

            <Text style={styles.label}>Data de validade</Text>
            <TextInput
              style={styles.input}
              value={form.expirationDate}
              onChangeText={(value) => updateField("expirationDate", value)}
              placeholder="AAAA-MM-DD"
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleSave} disabled={saving}>
              <Text style={styles.primaryButtonText}>
                {saving ? "Salvando..." : "Confirmar e salvar"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.stateText}>A IA sugerira os dados antes de qualquer alimento ser salvo.</Text>
        )}
      </ScrollView>
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
    gap: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
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
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#FF9800",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#7c2d12",
    fontWeight: "800",
  },
  loadingBox: {
    alignItems: "center",
    gap: 8,
  },
  stateText: {
    color: "#4b5563",
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    color: "#b91c1c",
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
  },
  reviewBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f2937",
  },
  metaText: {
    color: "#6b7280",
  },
  label: {
    color: "#374151",
    fontWeight: "800",
    marginTop: 8,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  pickerBox: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
  },
});
