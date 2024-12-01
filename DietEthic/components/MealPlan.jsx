import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity, View, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDatabase, ref, update, onValue } from 'firebase/database';
import { auth } from '../FirebaseConfig';

export default function MealPlan({ navigation }) {
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [userCalorieNeeds, setUserCalorieNeeds] = useState(2000);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mealHistory, setMealHistory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(['Breakfast', 'Lunch', 'Dinner', 'Snack']);

  useEffect(() => {
    fetchUserPreferences();
    fetchMealHistory();
  }, []);

  const fetchUserPreferences = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
  
    const db = getDatabase();
    const preferencesRef = ref(db, `users/${userId}/mealPreference`);
  
    onValue(preferencesRef, (snapshot) => {
      if (snapshot.exists()) {
        const preferences = snapshot.val();
        console.log('Meal Preferences from Firebase:', preferences);
        setSelectedCategories(preferences || []);
      } else {
        console.log('No meal preferences found. Defaulting to all categories.');
        setSelectedCategories(['Breakfast', 'Lunch', 'Dinner', 'Snack']);
      }
    });
  };
  

  // Récupérer l'historique des repas
  const fetchMealHistory = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const db = getDatabase();
    const mealHistoryRef = ref(db, `users/${userId}/mealHistory`);

    onValue(mealHistoryRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const historyArray = Object.keys(data).map((date) => ({
          date,
          ...data[date],
        }));
        setMealHistory(historyArray);
      } else {
        setMealHistory([]);
      }
    });
  };

  // Ajouter un repas
  const addMeal = (meal, type) => {
    const totalCalories = selectedMeals.reduce((sum, meal) => sum + meal.calories, 0);
    if (totalCalories + meal.calories > userCalorieNeeds) {
      Alert.alert(
        'Calorie Limit Exceeded',
        `Adding ${meal.name} (${meal.calories} kcal) will exceed your daily calorie limit.`
      );
      return;
    }
    setSelectedMeals((prev) => [...prev, { ...meal, type }]);
  };

  // Supprimer un repas
  const removeMeal = (index) => {
    setSelectedMeals((prev) => prev.filter((_, i) => i !== index));
  };

  // Sauvegarder les repas
  const saveMealsForDate = async () => {
    if (selectedMeals.length === 0) {
      Alert.alert('Error', 'No meals selected to save.');
      return;
    }

    const totalCalories = selectedMeals.reduce((sum, meal) => sum + meal.calories, 0);
    if (totalCalories > userCalorieNeeds) {
      Alert.alert(
        'Calorie Limit Exceeded',
        `Your selected meals total ${totalCalories} kcal, which exceeds your daily calorie limit of ${userCalorieNeeds} kcal.`
      );
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];
    const db = getDatabase();
    const mealHistoryRef = ref(db, `users/${userId}/mealHistory/${formattedDate}`);

    try {
      await update(mealHistoryRef, { totalCalories, meals: selectedMeals });
      Alert.alert('Success', `Meals for ${formattedDate} saved successfully!`);
      setSelectedMeals([]);
    } catch (error) {
      console.error('Error saving meals:', error);
      Alert.alert('Error', 'Could not save meals.');
    }
  };

  // Gestion du changement de date
  const handleDateChange = (event, date) => {
    if (event.type === 'set' && date) {
      setSelectedDate(date);
    }
    setShowDatePicker(false);
  };

  return (
    <ScrollView style={styles.container}>
  <Text style={styles.title}>Your Meal Plan</Text>
  <Text style={styles.totalCalories}>
    Selected Calories: {selectedMeals.reduce((sum, meal) => sum + meal.calories, 0)} / {userCalorieNeeds} kcal
  </Text>

  {/* Catégories filtrées selon les préférences */}
  <View style={styles.categorySelector}>
    {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((category) => (
      selectedCategories.includes(category) && ( // Afficher uniquement les catégories préférées
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategories.includes(category) && styles.categoryButtonActive,
          ]}
          onPress={() => navigation.navigate(category, { addMeal })}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategories.includes(category) && styles.categoryButtonTextActive,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      )
    ))}
  </View>

  {/* Liste des repas sélectionnés */}
  <View style={styles.bubble}>
    <Text style={styles.bubbleTitle}>Selected Meals</Text>
    {selectedCategories.map((category) => {
      const mealsByCategory = selectedMeals.filter((meal) => meal.type === category);
      if (mealsByCategory.length === 0) return null;

      return (
        <View key={category} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{category}</Text>
          {mealsByCategory.map((meal, index) => (
            <View key={index} style={styles.mealItemRow}>
              <Text style={styles.mealItem}>
                {meal.name} ({meal.calories} kcal)
              </Text>
              <TouchableOpacity onPress={() => removeMeal(index)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      );
    })}
    {selectedMeals.length === 0 && <Text style={styles.emptyText}>No meals selected yet.</Text>}
  </View>

  {/* Sélecteur de date */}
  <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
    <Text style={styles.dateButtonText}>
      Select Date: {selectedDate.toISOString().split('T')[0]}
    </Text>
  </TouchableOpacity>
  {showDatePicker && (
    <DateTimePicker
      value={selectedDate}
      mode="date"
      display="default"
      onChange={handleDateChange}
    />
  )}

  {/* Bouton pour sauvegarder */}
  <TouchableOpacity style={styles.saveButton} onPress={saveMealsForDate}>
    <Text style={styles.saveButtonText}>Validate and Save Meals</Text>
  </TouchableOpacity>

  {/* Historique des repas */}
  <View style={styles.historySection}>
    <Text style={styles.historyTitle}>Meal History</Text>
    {mealHistory.length === 0 ? (
      <Text style={styles.emptyText}>No history yet.</Text>
    ) : (
      mealHistory.map((day, index) => (
        <View key={index} style={styles.historyItem}>
          <Text style={styles.historyDate}>{day.date}</Text>
          <Text>Total Calories: {day.totalCalories} kcal</Text>
          {day.meals.map((meal, i) => (
            <Text key={i} style={styles.historyMeal}>
              {meal.type}: {meal.name} ({meal.calories} kcal)
            </Text>
          ))}
        </View>
      ))
    )}
  </View>
</ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  dateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  cardText: {
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bubble: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  bubbleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  mealItem: {
    fontSize: 16,
  },
  removeButton: {
    fontSize: 14,
    color: 'red',
    textDecorationLine: 'underline',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  
});