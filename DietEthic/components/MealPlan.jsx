import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity, View, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDatabase, ref, get, update, onValue } from 'firebase/database';
import { auth } from '../FirebaseConfig';

export default function MealPlan({ navigation }) {
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [userCalorieNeeds, setUserCalorieNeeds] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mealHistory, setMealHistory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(['Breakfast', 'Lunch', 'Dinner', 'Snack']);

  useEffect(() => {
    fetchUserData();
    fetchUserPreferences();
    fetchMealHistory();
  }, []);

  const fetchUserData = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Erreur', 'Utilisateur non connecté.');
      navigation.navigate('Login');
      return;
    }
  
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
  
    // Ajout d'un listener en temps réel
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUserCalorieNeeds(userData.calorieNeeds);
        console.log(userData.calorieNeeds);
      } else {
        Alert.alert('Erreur', 'Aucune donnée utilisateur trouvée.');
      }
    });
  };
  
 
  


// On calcule Bmi et Bmr dans Graph lorsque weigth change
 /* const calculateCalorieNeeds = async (data, userId) => {
    if (!data.bmi || !data.bmr) {
      Alert.alert('Erreur', 'Données BMI ou BMR manquantes.');
      setUserCalorieNeeds(2000); // Valeur par défaut si les données sont manquantes
      return;
    }

    const calorieNeeds = Math.round(data.bmr * (data.bmi < 18.5 ? 1.2 : data.bmi < 25 ? 1.5 : 1.8));
    setUserCalorieNeeds(calorieNeeds);

    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { calorieNeeds });
      console.log('Calorie needs sauvegardé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des besoins caloriques :', error);
    }
  };*/

  const fetchUserPreferences = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const db = getDatabase();
    const preferencesRef = ref(db, `users/${userId}/mealPreference`);

    onValue(preferencesRef, (snapshot) => {
      if (snapshot.exists()) {
        const preferences = snapshot.val();
        setSelectedCategories(preferences || []);
      } else {
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

    if (userCalorieNeeds && totalCalories + meal.calories > userCalorieNeeds) {
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

  const selectedCalories = selectedMeals.reduce((sum, meal) => sum + meal.calories, 0); // Calcul des calories sélectionnées

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Meal Plan</Text>
      <Text style={styles.subtitle}>
        Selected Calories: {selectedCalories} / {userCalorieNeeds ? `${userCalorieNeeds} kcal` : 'Loading...'}
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
    backgroundColor: '#F9F8FF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6C4AB6',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7E7E7E',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#6C4AB6',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#E9E6FE',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6C4AB6',
    textAlign: 'left',
  },
  mealItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
  },
  mealItem: {
    fontSize: 16,
    color: '#4B4B4B',
  },
  dateButton: {
    backgroundColor: '#6C4AB6',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    color: '#B3B3B3',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  historyItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#F4F1FE',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C4AB6',
    marginBottom: 5,
  },
  historyMeal: {
    fontSize: 14,
    color: '#4F4F4F',
  },
  saveButton: {
    backgroundColor: '#6C4AB6',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    marginTop: 2,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});