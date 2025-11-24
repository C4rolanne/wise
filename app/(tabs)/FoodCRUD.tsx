// FoodCRUD.tsx
// Aplicativo de gerenciamento de alimentos com controle de validade
// Este código está pronto para React Native + Expo Go

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos de categoria disponíveis
type FoodCategory = 
  | 'carne' 
  | 'fruta' 
  | 'vegetal' 
  | 'fruto-do-mar' 
  | 'massas' 
  | 'doce' 
  | 'laticinio' 
  | 'condimentos'
  | 'graos'
  | 'bebidas'
  | 'ovos'
  | 'outros';

// Interface que define a estrutura de um alimento
interface Food {
  id: number;
  name: string;
  category: FoodCategory; // Tipo de alimento
  storage: 'geladeira' | 'freezer' | 'despensa'; // Local de armazenamento
  manufacturingDate: string; // Data de fabricação (formato: YYYY-MM-DD)
  expirationDate: string;    // Data de validade (formato: YYYY-MM-DD)
}

// Interface para os dados do formulário
interface FormData {
  name: string;
  category: string;
  storage: string;
  manufacturingDate: string;
  expirationDate: string;
}

// Chave para salvar os dados no AsyncStorage
const STORAGE_KEY = '@foods_database';

export default function FoodCRUD() {
  // Estado que armazena a lista de alimentos
  const [foods, setFoods] = useState<Food[]>([]);
  
  // Estado que controla se o modal está aberto ou fechado
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Estado que armazena o alimento que está sendo editado (null quando está criando novo)
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  
  // Estado que armazena os dados do formulário
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'outros',
    storage: 'geladeira',
    manufacturingDate: '',
    expirationDate: '',
  });

  // Estado que controla se o dropdown de categoria está aberto
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);

  // Hook que executa ao montar o componente (carrega os dados salvos)
  useEffect(() => {
    loadFoods();
  }, []);

  // Função que carrega os alimentos salvos no AsyncStorage
  const loadFoods = async (): Promise<void> => {
    try {
      const storedFoods = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedFoods) {
        setFoods(JSON.parse(storedFoods));
      } else {
        // Dados iniciais de exemplo
        const initialFoods: Food[] = [
          { 
            id: 1, 
            name: 'Leite', 
            category: 'laticinio',
            storage: 'geladeira',
            manufacturingDate: '2024-11-10',
            expirationDate: '2024-11-20'
          },
          { 
            id: 2, 
            name: 'Pão de Forma', 
            category: 'massas',
            storage: 'despensa',
            manufacturingDate: '2024-11-15',
            expirationDate: '2024-11-25'
          },
        ];
        setFoods(initialFoods);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialFoods));
      }
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    }
  };

  // Função que salva os alimentos no AsyncStorage
  const saveFoods = async (updatedFoods: Food[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFoods));
      setFoods(updatedFoods);
    } catch (error) {
      console.error('Erro ao salvar alimentos:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados');
    }
  };

  // Função que retorna o ícone da categoria
  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'carne': return '🥩';
      case 'fruta': return '🍎';
      case 'vegetal': return '🥬';
      case 'fruto-do-mar': return '🦐';
      case 'massas': return '🍝';
      case 'doce': return '🍰';
      case 'laticinio': return '🥛';
      case 'condimentos': return '🧂';
      case 'graos': return '🌾';
      case 'bebidas': return '🥤';
      case 'ovos': return '🥚';
      case 'outros': return '📦';
      default: return '📦';
    }
  };

  // Função que retorna o nome formatado da categoria
  const getCategoryName = (category: string): string => {
    switch (category) {
      case 'carne': return 'Carne';
      case 'fruta': return 'Fruta';
      case 'vegetal': return 'Vegetal';
      case 'fruto-do-mar': return 'Fruto do Mar';
      case 'massas': return 'Massas';
      case 'doce': return 'Doce';
      case 'laticinio': return 'Laticínio';
      case 'condimentos': return 'Condimentos';
      case 'graos': return 'Grãos';
      case 'bebidas': return 'Bebidas';
      case 'ovos': return 'Ovos';
      case 'outros': return 'Outros';
      default: return category;
    }
  };

  // Lista de categorias disponíveis
  const categories: FoodCategory[] = [
    'carne',
    'fruta',
    'vegetal',
    'fruto-do-mar',
    'massas',
    'doce',
    'laticinio',
    'condimentos',
    'graos',
    'bebidas',
    'ovos',
    'outros'
  ];

  // Função que retorna o ícone do local de armazenamento
  const getStorageIcon = (storage: string): string => {
    switch (storage) {
      case 'geladeira': return '🧊';
      case 'freezer': return '❄️';
      case 'despensa': return '🗄️';
      default: return '📦';
    }
  };

  // Função que retorna o nome formatado do local
  const getStorageName = (storage: string): string => {
    switch (storage) {
      case 'geladeira': return 'Geladeira';
      case 'freezer': return 'Freezer';
      case 'despensa': return 'Despensa';
      default: return storage;
    }
  };

  // Função que calcula quantos dias faltam para o alimento vencer
  const calculateDaysRemaining = (expirationDate: string): number => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Função que retorna a cor do status baseado nos dias restantes
  const getStatusColor = (daysRemaining: number): string => {
    if (daysRemaining < 0) return '#ef4444'; // Vermelho - Vencido
    if (daysRemaining <= 3) return '#f59e0b'; // Laranja - Vence em breve
    return '#10b981'; // Verde - Válido
  };

  // Função que retorna o texto do status
  const getStatusText = (daysRemaining: number): string => {
    if (daysRemaining < 0) return 'VENCIDO';
    if (daysRemaining === 0) return 'Vence HOJE';
    if (daysRemaining === 1) return 'Vence amanhã';
    return `${daysRemaining} dias restantes`;
  };

  // Função que formata a data para exibição (DD/MM/YYYY)
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Função que abre o modal (para criar ou editar)
  const openModal = (food: Food | null = null): void => {
    if (food) {
      // Modo edição - preenche o formulário com os dados do alimento
      setEditingFood(food);
      setFormData({
        name: food.name,
        category: food.category,
        storage: food.storage,
        manufacturingDate: food.manufacturingDate,
        expirationDate: food.expirationDate,
      });
    } else {
      // Modo criação - limpa o formulário
      setEditingFood(null);
      setFormData({ 
        name: '', 
        category: 'outros',
        storage: 'geladeira',
        manufacturingDate: '', 
        expirationDate: '' 
      });
    }
    setIsModalOpen(true);
    setIsCategoryDropdownOpen(false); // Fecha o dropdown ao abrir o modal
  };

  // Função que fecha o modal e limpa os dados
  const closeModal = (): void => {
    setIsModalOpen(false);
    setEditingFood(null);
    setIsCategoryDropdownOpen(false);
    setFormData({ 
      name: '', 
      category: 'outros',
      storage: 'geladeira',
      manufacturingDate: '', 
      expirationDate: '' 
    });
  };

  // Função que salva o alimento (criar ou atualizar)
  const handleSubmit = async (): Promise<void> => {
    // Validação: verifica se todos os campos estão preenchidos
    if (!formData.name || !formData.category || !formData.storage || !formData.manufacturingDate || !formData.expirationDate) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    // Validação: verifica se a data de validade é posterior à fabricação
    const manufacturing = new Date(formData.manufacturingDate);
    const expiration = new Date(formData.expirationDate);
    
    if (expiration <= manufacturing) {
      Alert.alert('Erro', 'A data de validade deve ser posterior à data de fabricação');
      return;
    }

    let updatedFoods: Food[];

    if (editingFood) {
      // UPDATE - atualiza o alimento existente
      updatedFoods = foods.map((f) =>
        f.id === editingFood.id
          ? { 
              ...f, 
              name: formData.name, 
              category: formData.category,
              storage: formData.storage as 'geladeira' | 'freezer' | 'despensa',
              manufacturingDate: formData.manufacturingDate,
              expirationDate: formData.expirationDate
            }
          : f
      );
    } else {
      // CREATE - cria um novo alimento
      const newFood: Food = {
        id: foods.length > 0 ? Math.max(...foods.map((f) => f.id)) + 1 : 1,
        name: formData.name,
        category: formData.category,
        storage: formData.storage as 'geladeira' | 'freezer' | 'despensa',
        manufacturingDate: formData.manufacturingDate,
        expirationDate: formData.expirationDate,
      };
      updatedFoods = [...foods, newFood];
    }

    await saveFoods(updatedFoods);
    closeModal();
  };

  // Função que exclui um alimento (DELETE)
  const handleDelete = (id: number): void => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este alimento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const updatedFoods = foods.filter((f) => f.id !== id);
            await saveFoods(updatedFoods);
          },
        },
      ]
    );
  };

  // Função que atualiza os dados do formulário
  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData({ ...formData, [field]: value });
  };

  // =======================
  // RENDERIZAÇÃO DA UI
  // =======================

  return (
    <View style={styles.container}>
      {/* Barra de status do sistema */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Cabeçalho fixo com título e botão de adicionar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍎 Controle de Validade</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de alimentos (com scroll) */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {foods.length === 0 ? (
          // Mensagem quando não há alimentos cadastrados
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Nenhum alimento cadastrado</Text>
            <Text style={styles.emptySubtitle}>Clique em Adicionar para começar</Text>
          </View>
        ) : (
          // Lista de alimentos cadastrados
          foods.map((food) => {
            const daysRemaining = calculateDaysRemaining(food.expirationDate);
            const statusColor = getStatusColor(daysRemaining);
            const statusText = getStatusText(daysRemaining);

            return (
              <View key={food.id} style={styles.foodCard}>
                {/* Informações do alimento */}
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  
                  {/* Categoria e Local de Armazenamento */}
                  <View style={styles.infoRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>
                        {getCategoryIcon(food.category)} {getCategoryName(food.category)}
                      </Text>
                    </View>
                    <View style={styles.storageBadge}>
                      <Text style={styles.storageText}>
                        {getStorageIcon(food.storage)} {getStorageName(food.storage)}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Status de validade com cor dinâmica */}
                  <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>{statusText}</Text>
                  </View>
                  
                  {/* Datas de fabricação e validade */}
                  <View style={styles.datesContainer}>
                    <Text style={styles.dateLabel}>
                      📅 Fabricação: <Text style={styles.dateValue}>{formatDate(food.manufacturingDate)}</Text>
                    </Text>
                    <Text style={styles.dateLabel}>
                      ⏰ Validade: <Text style={styles.dateValue}>{formatDate(food.expirationDate)}</Text>
                    </Text>
                  </View>
                </View>
                
                {/* Botões de ação (editar e excluir) */}
                <View style={styles.foodActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openModal(food)}
                  >
                    <Text style={styles.actionIcon}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(food.id)}
                  >
                    <Text style={styles.actionIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Modal para adicionar/editar alimento */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Cabeçalho do modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFood ? '✏️ Editar Alimento' : '➕ Novo Alimento'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Formulário */}
            <View style={styles.formContainer}>
              {/* Campo: Nome do Alimento */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nome do Alimento</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Ex: Leite Integral"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Campo: Categoria (Dropdown com scroll) */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Categoria</Text>
                
                {/* Botão que abre o dropdown */}
                <TouchableOpacity
                  style={styles.categorySelector}
                  onPress={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                >
                  <Text style={styles.categorySelectorText}>
                    {getCategoryIcon(formData.category)} {getCategoryName(formData.category)}
                  </Text>
                  <Text style={styles.dropdownArrow}>
                    {isCategoryDropdownOpen ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {/* Lista de opções (aparece quando o dropdown está aberto) */}
                {isCategoryDropdownOpen && (
                  <ScrollView style={styles.categoryDropdownList} nestedScrollEnabled={true}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryOption,
                          formData.category === cat && styles.categoryOptionActive
                        ]}
                        onPress={() => {
                          handleInputChange('category', cat);
                          setIsCategoryDropdownOpen(false);
                        }}
                      >
                        <Text style={[
                          styles.categoryOptionText,
                          formData.category === cat && styles.categoryOptionTextActive
                        ]}>
                          {getCategoryIcon(cat)} {getCategoryName(cat)}
                        </Text>
                        {formData.category === cat && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Campo: Local de Armazenamento (Dropdown) */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Local de Armazenamento</Text>
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      formData.storage === 'geladeira' && styles.dropdownOptionActive
                    ]}
                    onPress={() => handleInputChange('storage', 'geladeira')}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      formData.storage === 'geladeira' && styles.dropdownOptionTextActive
                    ]}>
                      🧊 Geladeira
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      formData.storage === 'freezer' && styles.dropdownOptionActive
                    ]}
                    onPress={() => handleInputChange('storage', 'freezer')}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      formData.storage === 'freezer' && styles.dropdownOptionTextActive
                    ]}>
                      ❄️ Freezer
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dropdownOption,
                      formData.storage === 'despensa' && styles.dropdownOptionActive
                    ]}
                    onPress={() => handleInputChange('storage', 'despensa')}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      formData.storage === 'despensa' && styles.dropdownOptionTextActive
                    ]}>
                      🗄️ Despensa
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Campo: Data de Fabricação */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Data de Fabricação</Text>
                <TextInput
                  style={styles.input}
                  value={formData.manufacturingDate}
                  onChangeText={(value) => handleInputChange('manufacturingDate', value)}
                  placeholder="AAAA-MM-DD (Ex: 2024-11-10)"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Campo: Data de Validade */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Data de Validade</Text>
                <TextInput
                  style={styles.input}
                  value={formData.expirationDate}
                  onChangeText={(value) => handleInputChange('expirationDate', value)}
                  placeholder="AAAA-MM-DD (Ex: 2024-11-25)"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Botões de ação do modal */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={closeModal}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.saveButtonText}>💾 Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// =======================
// ESTILOS DO COMPONENTE
// =======================

const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Cabeçalho fixo
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  
  // Área de scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  
  // Estado vazio
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  
  // Card de alimento
  foodCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  foodCategory: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  
  // Linha de informações (categoria + storage)
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  
  // Badge da categoria
  categoryBadge: {
    backgroundColor: '#fef3c7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
  },
  
  // Badge do local de armazenamento
  storageBadge: {
    backgroundColor: '#dbeafe',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  storageText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
  
  // Badge de status
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  
  // Container de datas
  datesContainer: {
    gap: 4,
  },
  dateLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  dateValue: {
    fontWeight: '600',
    color: '#1f2937',
  },
  
  // Ações do card
  foodActions: {
    justifyContent: 'center',
    gap: 8,
    marginLeft: 12,
  },
  editButton: {
    backgroundColor: '#eff6ff',
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 28,
    color: '#6b7280',
    fontWeight: '300',
  },
  
  // Formulário
  formContainer: {
    gap: 18,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1f2937',
  },
  
  // Dropdown de categoria
  categorySelector: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categorySelectorText: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6b7280',
  },
  categoryDropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryOptionActive: {
    backgroundColor: '#fef3c7',
  },
  categoryOptionText: {
    fontSize: 15,
    color: '#374151',
  },
  categoryOptionTextActive: {
    color: '#92400e',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#92400e',
    fontWeight: 'bold',
  },
  
  // Dropdown customizado (botões de opção)
  dropdownContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dropdownOption: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownOptionActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  dropdownOptionText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  dropdownOptionTextActive: {
    color: '#1e40af',
    fontWeight: '700',
  },
  
  // Botões do modal
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});