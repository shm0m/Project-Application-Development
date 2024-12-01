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

  const removeMeal = (index) => {
    setSelectedMeals((prev) => prev.filter((_, i) => i !== index));
  };

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

  const handleDateChange = (event, date) => {
    if (event.type === 'set' && date) {
      setSelectedDate(date);
    }
    setShowDatePicker(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Meal Plan</Text>
      <Text style={styles.subtitle}>
        Selected Calories: {selectedMeals.reduce((sum, meal) => sum + meal.calories, 0)} / {userCalorieNeeds} kcal
      </Text>

      <View style={styles.categoryContainer}>
        {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((category) => (
          selectedCategories.includes(category) && (
            <TouchableOpacity
              key={category}
              style={styles.categoryButton}
              onPress={() => navigation.navigate(category, { addMeal })}
            >
              <Text style={styles.categoryButtonText}>{category}</Text>
            </TouchableOpacity>
          )
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Selected Meals</Text>
        {selectedMeals.length === 0 ? (
          <Text style={styles.emptyText}>No meals selected yet.</Text>
        ) : (
          selectedMeals.map((meal, index) => (
            <View key={index} style={styles.mealItemRow}>
              <Text style={styles.mealItem}>
                {meal.name} ({meal.calories} kcal)
              </Text>
              <TouchableOpacity onPress={() => removeMeal(index)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

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

      <TouchableOpacity style={styles.saveButton} onPress={saveMealsForDate}>
        <Text style={styles.saveButtonText}>Validate and Save Meals</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Meal History</Text>
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
    color: '#4B3F72',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    width: '45%',
  },
  categoryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#EAE8FD',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B3F72',
  },
  mealItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mealItem: {
    fontSize: 16,
    color: '#333',
  },
  dateCard: {
    backgroundColor: '#EAE8FD',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#B8A0FF',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },
  historyItem: {
    marginBottom: 10,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyMeal: {
    fontSize: 14,
    color: '#555',
  },
  saveButton: {
    backgroundColor: '#6C63FF', // Couleur principale (violet moderne)
    padding: 15,               // Padding généreux pour un bouton bien visible
    borderRadius: 15,          // Coins arrondis pour une touche moderne
    alignItems: 'center',      // Centrer le texte horizontalement
    marginTop: 15,             // Espacement supérieur pour éviter la surcharge visuelle
    marginBottom: 15,          // Ajout d'un espace de 10 px sous le bouton
    shadowColor: '#000',       // Ombre subtile
    shadowOpacity: 0.2,        // Transparence de l'ombre
    shadowRadius: 4,           // Diffusion de l'ombre
    elevation: 5,              // Ombre pour Android
  },
  saveButtonText: {
    color: '#FFFFFF',          // Texte blanc pour le contraste
    fontWeight: 'bold',        // Texte en gras pour une meilleure lisibilité
    fontSize: 16,              // Taille de texte confortable
    textAlign: 'center',       // Centrer le texte dans le bouton
  },
});