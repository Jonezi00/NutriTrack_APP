import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Switch
} from 'react-native';

// Estrutura de dados para o Histórico
const HISTORY_DATA = [
  {
    id: '1',
    date: 'Ontem, 31 Jan',
    totalKcal: '1,820 kcal',
    meals: [
      { name: 'Oatmeal & Berries', kcal: '350 kcal' },
      { name: 'Grilled Chicken & Rice', kcal: '620 kcal' },
      { name: 'Protein Shake', kcal: '250 kcal' },
      { name: 'Salmon & Vegetables', kcal: '600 kcal' },
    ],
  },
  {
    id: '2',
    date: 'Sexta-feira, 30 Jan',
    totalKcal: '1,950 kcal',
    meals: [
      { name: 'Scrambled Eggs & Toast', kcal: '420 kcal' },
      { name: 'Beef Wrap & Salad', kcal: '680 kcal' },
      { name: 'Greek Yogurt & Honey', kcal: '200 kcal' },
      { name: 'Pasta Primavera', kcal: '650 kcal' },
    ],
  },
];

// Alimentos pré-cadastrados para a aba FOODS
const PRESET_FOODS = [
  { id: '1', name: 'Maçã (1 unidade)', kcal: 95, category: 'Frutas' },
  { id: '2', name: 'Banana (1 unidade)', kcal: 105, category: 'Frutas' },
  { id: '3', name: 'Peito de Frango (100g)', kcal: 165, category: 'Proteínas' },
  { id: '4', name: 'Arroz Integral (100g)', kcal: 111, category: 'Carboidratos' },
  { id: '5', name: 'Ovo Cozido (1 unidade)', kcal: 78, category: 'Proteínas' },
  { id: '6', name: 'Iogurte Natural (170g)', kcal: 130, category: 'Laticínios' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'TODAY' | 'HISTORY' | 'FOODS' | 'SETTINGS'>('TODAY');
  
  // Estado para Refeições de Hoje
  const [todayMeals, setTodayMeals] = useState([
    { id: '1', name: 'Oatmeal with berries', details: '2% Milk, Almonds', kcal: 380 },
    { id: '2', name: 'Grilled Chicken Salad', details: 'Whole Wheat Bread, Olive Oil', kcal: 450 },
  ]);

  // Estados do Modal e Formulário
  const [modalVisible, setModalVisible] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealDetails, setMealDetails] = useState('');
  const [mealKcal, setMealKcal] = useState('');

  // Estados das Configurações
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [notifications, setNotifications] = useState(true);

  // Cálculos dinâmicos de Calorias
  const totalConsumedKcal = todayMeals.reduce((sum, item) => sum + item.kcal, 0);
  const remainingKcal = Math.max(0, dailyGoal - totalConsumedKcal);
  const progressPercentage = Math.min(100, Math.round((totalConsumedKcal / dailyGoal) * 100));

  // Função para adicionar nova refeição
  const handleAddMeal = () => {
    if (!mealName.trim() || !mealKcal.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o nome e as calorias!');
      return;
    }

    const newMeal = {
      id: Date.now().toString(),
      name: mealName,
      details: mealDetails || 'Sem detalhes',
      kcal: parseInt(mealKcal) || 0,
    };

    setTodayMeals([...todayMeals, newMeal]);
    setMealName('');
    setMealDetails('');
    setMealKcal('');
    setModalVisible(false);
  };

  // Função para adicionar alimento pré-definido direto para as refeições de Hoje
  const handleQuickAddFood = (food: { name: string; kcal: number }) => {
    const newMeal = {
      id: Date.now().toString(),
      name: food.name,
      details: 'Adicionado da Biblioteca',
      kcal: food.kcal,
    };
    setTodayMeals([...todayMeals, newMeal]);
    Alert.alert('Sucesso', `${food.name} adicionado ao seu dia!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Seção Superior Verde */}
        <View style={styles.topHeaderCard}>
          <Text style={styles.appTitle}>NutriTrack 🌿</Text>

          {/* Resumo de calorias (exibido apenas na aba TODAY) */}
          {activeTab === 'TODAY' && (
            <View style={styles.summaryRow}>
              <View style={styles.circleContainer}>
                <Text style={styles.goalText}>{progressPercentage}% of daily goal</Text>
                <View style={styles.circleRing}>
                  <Text style={styles.calorieNumber}>{remainingKcal}</Text>
                  <Text style={styles.calorieLabel}>kcal left</Text>
                </View>
              </View>

              <View style={styles.macrosRight}>
                <Text style={styles.macroText}><Text style={styles.bold}>Protein</Text>  80g / 120g</Text>
                
                <Text style={styles.macroText}><Text style={styles.bold}>Carbs</Text>  200g / 250g</Text>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: '80%' }]} />
                </View>

                <Text style={styles.macroText}><Text style={styles.bold}>Fat</Text></Text>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: '70%' }]} />
                </View>
                <Text style={styles.macroSubText}>50g / 70g</Text>
              </View>
            </View>
          )}

          {/* Abas de Navegação */}
          <View style={styles.tabsRow}>
            {(['TODAY', 'HISTORY', 'FOODS', 'SETTINGS'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={activeTab === tab ? styles.activeTab : styles.tab}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Conteúdo dinâmico das Abas */}
        <View style={styles.contentSection}>
          
          {/* TAB: TODAY */}
          {activeTab === 'TODAY' && (
            <>
              <Text style={styles.sectionTitle}>MEALS</Text>

              {todayMeals.map((meal) => (
                <View key={meal.id} style={styles.mealCard}>
                  <View>
                    <Text style={styles.mealItemMain}>{meal.name}</Text>
                    {meal.details.split(', ').map((detail, idx) => (
                      <Text key={idx} style={styles.mealItemSub}>{detail}</Text>
                    ))}
                  </View>
                  <Text style={styles.mealKcal}>{meal.kcal} kcal</Text>
                </View>
              ))}

              <TouchableOpacity style={styles.addMealCard} onPress={() => setModalVisible(true)}>
                <View style={styles.plusIcon}>
                  <Text style={styles.plusText}>+</Text>
                </View>
                <Text style={styles.addMealText}>Add Meal</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.logButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.logButtonText}>LOG FOOD</Text>
              </TouchableOpacity>
            </>
          )}

          {/* TAB: HISTORY */}
          {activeTab === 'HISTORY' && (
            <>
              <Text style={styles.sectionTitle}>HISTÓRICO POR DIAS</Text>
              {HISTORY_DATA.map((day) => (
                <View key={day.id} style={styles.historyGroup}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyDate}>{day.date}</Text>
                    <Text style={styles.historyTotalKcal}>{day.totalKcal}</Text>
                  </View>

                  <View style={styles.historyCard}>
                    {day.meals.map((meal, index) => (
                      <View 
                        key={index} 
                        style={[
                          styles.historyMealItem, 
                          index < day.meals.length - 1 && styles.borderBottom
                        ]}
                      >
                        <Text style={styles.historyMealName}>{meal.name}</Text>
                        <Text style={styles.historyMealKcal}>{meal.kcal}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </>
          )}

          {/* TAB: FOODS */}
          {activeTab === 'FOODS' && (
            <>
              <Text style={styles.sectionTitle}>BIBLIOTECA DE ALIMENTOS</Text>
              {PRESET_FOODS.map((food) => (
                <View key={food.id} style={styles.foodItemCard}>
                  <View>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodCategory}>{food.category} • {food.kcal} kcal</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.quickAddButton}
                    onPress={() => handleQuickAddFood(food)}
                  >
                    <Text style={styles.quickAddText}>+ Adicionar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'SETTINGS' && (
            <>
              <Text style={styles.sectionTitle}>CONFIGURAÇÕES DO PERFIL</Text>
              
              <View style={styles.settingCard}>
                <Text style={styles.settingLabel}>Meta Diária de Calorias</Text>
                <View style={styles.goalRow}>
                  <TouchableOpacity 
                    style={styles.goalBtn} 
                    onPress={() => setDailyGoal(prev => Math.max(1000, prev - 100))}
                  >
                    <Text style={styles.goalBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.goalValueText}>{dailyGoal} kcal</Text>
                  <TouchableOpacity 
                    style={styles.goalBtn} 
                    onPress={() => setDailyGoal(prev => prev + 100)}
                  >
                    <Text style={styles.goalBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.settingCardRow}>
                <Text style={styles.settingLabel}>Lembretes de Refeição</Text>
                <Switch 
                  value={notifications} 
                  onValueChange={setNotifications} 
                  trackColor={{ false: '#D1D5DB', true: '#81C784' }}
                  thumbColor={notifications ? '#4CAF50' : '#f4f3f4'}
                />
              </View>

              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setTodayMeals([]);
                  Alert.alert('Limpeza', 'Refeições de hoje resetadas!');
                }}
              >
                <Text style={styles.resetButtonText}>Limpar Refeições de Hoje</Text>
              </TouchableOpacity>
            </>
          )}

        </View>

      </ScrollView>

      {/* Modal de Adicionar/Registrar Alimento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Nova Refeição</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da refeição (ex: Frango Grelhado)"
              value={mealName}
              onChangeText={setMealName}
            />

            <TextInput
              style={styles.input}
              placeholder="Acompanhamentos (ex: Arroz, Salada)"
              value={mealDetails}
              onChangeText={setMealDetails}
            />

            <TextInput
              style={styles.input}
              placeholder="Calorias (ex: 450)"
              value={mealKcal}
              onChangeText={setMealKcal}
              keyboardType="numeric"
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleAddMeal}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF4EC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  topHeaderCard: {
    backgroundColor: '#E2F0E5',
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  circleContainer: {
    alignItems: 'center',
    width: '45%',
  },
  goalText: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 6,
    fontWeight: '500',
  },
  circleRing: {
    width: 105,
    height: 105,
    borderRadius: 52.5,
    borderWidth: 6,
    borderColor: '#52C480',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF4EC',
  },
  calorieNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  calorieLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  macrosRight: {
    width: '50%',
  },
  macroText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 4,
  },
  macroSubText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 2,
  },
  bold: {
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#C8E6C9',
    borderRadius: 4,
    marginVertical: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#D1E7D6',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  activeTab: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#388E3C',
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  activeTabText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '700',
  },
  contentSection: {
    backgroundColor: '#F3F4F6',
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  mealItemMain: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  mealItemSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  mealKcal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  addMealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  plusIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  plusText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  addMealText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  logButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    minWidth: 150,
    alignItems: 'center',
  },
  logButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  historyGroup: {
    marginBottom: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  historyTotalKcal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#388E3C',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  historyMealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyMealName: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  historyMealKcal: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  foodItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  foodCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  quickAddButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  quickAddText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingCardRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  goalBtn: {
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  goalValueText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  resetButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  resetButtonText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});