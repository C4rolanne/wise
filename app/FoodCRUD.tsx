import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { useFoods } from "@/hooks/useFoods";
import type { CreateFoodInput, Food, FoodStorage } from "@/types/food";
import {
  categories,
  formatDate,
  getCategoryName,
  getFoodStatusColor,
  getFoodStatusLabel,
  storageLabels,
} from "@/utils/foodDisplay";

type FormData = {
  name: string;
  category: string;
  storage: FoodStorage;
  manufacturingDate: string;
  expirationDate: string;
};

const emptyForm: FormData = {
  name: "",
  category: "outros",
  storage: "geladeira",
  manufacturingDate: "",
  expirationDate: "",
};

const validityFilters = [
  { label: "Todas", value: "" },
  { label: "Vencidos", value: "expired" },
  { label: "Proximos", value: "expiring_soon" },
  { label: "Validos", value: "valid" },
];

export default function FoodCRUD() {
  const { isAuthenticated, loading: authLoading, signInWithGoogle } = useAuth();
  const [storageFilter, setStorageFilter] = useState<FoodStorage | "">("");
  const [validityFilter, setValidityFilter] = useState("");
  const filters = useMemo(
    () => ({
      storage: storageFilter || undefined,
      validityStatus: validityFilter || undefined,
    }),
    [storageFilter, validityFilter],
  );
  const { foods, loading, saving, error, success, createFood, updateFood, deleteFood, refresh } =
    useFoods(filters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  useEffect(() => {
    if (success) Alert.alert("Sucesso", success);
  }, [success]);

  const openModal = (food: Food | null = null) => {
    setEditingFood(food);
    setFormData(
      food
        ? {
            name: food.name,
            category: food.category,
            storage: food.storage,
            manufacturingDate: food.manufacturingDate ?? "",
            expirationDate: food.expirationDate,
          }
        : emptyForm,
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFood(null);
    setFormData(emptyForm);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.category || !formData.storage || !formData.expirationDate) {
      Alert.alert("Atencao", "Preencha nome, categoria, local e validade.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload: CreateFoodInput = {
      name: formData.name.trim(),
      category: formData.category,
      storage: formData.storage,
      manufacturingDate: formData.manufacturingDate || null,
      expirationDate: formData.expirationDate,
    };

    try {
      if (editingFood) {
        await updateFood(editingFood.id, payload);
      } else {
        await createFood(payload);
      }
      closeModal();
    } catch (err) {
      Alert.alert("Erro", err instanceof Error ? err.message : "Nao foi possivel salvar.");
    }
  };

  const handleDelete = (food: Food) => {
    Alert.alert("Excluir alimento", `Deseja excluir ${food.name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFood(food.id);
          } catch (err) {
            Alert.alert("Erro", err instanceof Error ? err.message : "Nao foi possivel excluir.");
          }
        },
      },
    ]);
  };

  const renderContent = () => {
    if (authLoading || loading) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator color="#3b82f6" />
          <Text style={styles.stateText}>Carregando alimentos...</Text>
        </View>
      );
    }

    if (!isAuthenticated) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Entre com Google para gerenciar seus alimentos.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={signInWithGoogle}>
            <Text style={styles.primaryButtonText}>Entrar com Google</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={refresh}>
            <Text style={styles.primaryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (foods.length === 0) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.emptyTitle}>Nenhum alimento encontrado</Text>
          <Text style={styles.stateText}>Crie um novo alimento ou ajuste os filtros.</Text>
        </View>
      );
    }

    return foods.map((food) => (
      <View key={food.id} style={styles.foodCard}>
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{food.name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.categoryBadge}>{getCategoryName(food.category)}</Text>
            <Text style={styles.storageBadge}>{storageLabels[food.storage]}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getFoodStatusColor(food) }]}>
            <Text style={styles.statusText}>{getFoodStatusLabel(food)}</Text>
          </View>
          <Text style={styles.dateText}>Fabricacao: {formatDate(food.manufacturingDate)}</Text>
          <Text style={styles.dateText}>Validade: {formatDate(food.expirationDate)}</Text>
        </View>

        <View style={styles.foodActions}>
          <TouchableOpacity style={styles.editButton} onPress={() => openModal(food)}>
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(food)}>
            <Text style={styles.actionText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Controle de Validade</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Local</Text>
          <Picker selectedValue={storageFilter} onValueChange={(value) => setStorageFilter(value)}>
            <Picker.Item label="Todos" value="" />
            <Picker.Item label="Geladeira" value="geladeira" />
            <Picker.Item label="Freezer" value="freezer" />
            <Picker.Item label="Despensa" value="despensa" />
          </Picker>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Validade</Text>
          <Picker selectedValue={validityFilter} onValueChange={(value) => setValidityFilter(value)}>
            {validityFilters.map((filter) => (
              <Picker.Item key={filter.value} label={filter.label} value={filter.value} />
            ))}
          </Picker>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>

      <Modal visible={isModalOpen} animationType="slide" transparent onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingFood ? "Editar alimento" : "Novo alimento"}</Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
              placeholder="Ex: Leite integral"
            />

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.pickerBox}>
              <Picker selectedValue={formData.category} onValueChange={(value) => handleChange("category", value)}>
                {categories.map((category) => (
                  <Picker.Item key={category} label={getCategoryName(category)} value={category} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Local</Text>
            <View style={styles.pickerBox}>
              <Picker selectedValue={formData.storage} onValueChange={(value) => handleChange("storage", value)}>
                <Picker.Item label="Geladeira" value="geladeira" />
                <Picker.Item label="Freezer" value="freezer" />
                <Picker.Item label="Despensa" value="despensa" />
              </Picker>
            </View>

            <Text style={styles.label}>Data de fabricacao</Text>
            <TextInput
              style={styles.input}
              value={formData.manufacturingDate}
              onChangeText={(value) => handleChange("manufacturingDate", value)}
              placeholder="AAAA-MM-DD"
            />

            <Text style={styles.label}>Data de validade</Text>
            <TextInput
              style={styles.input}
              value={formData.expirationDate}
              onChangeText={(value) => handleChange("expirationDate", value)}
              placeholder="AAAA-MM-DD"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSubmit} disabled={saving}>
                <Text style={styles.saveButtonText}>{saving ? "Salvando..." : "Salvar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  filters: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    gap: 12,
  },
  filterGroup: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    overflow: "hidden",
  },
  filterLabel: {
    color: "#4b5563",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
    gap: 12,
  },
  stateText: {
    color: "#6b7280",
    fontSize: 15,
    textAlign: "center",
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 15,
    textAlign: "center",
  },
  emptyTitle: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 18,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  foodCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    gap: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "700",
  },
  storageBadge: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "700",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  dateText: {
    fontSize: 13,
    color: "#6b7280",
  },
  foodActions: {
    justifyContent: "center",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#eff6ff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: "#fef2f2",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionText: {
    color: "#1f2937",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f2937",
  },
  closeButton: {
    color: "#6b7280",
    fontWeight: "700",
  },
  label: {
    color: "#374151",
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  pickerBox: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#4b5563",
    fontWeight: "700",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
