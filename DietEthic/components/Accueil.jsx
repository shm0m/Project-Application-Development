import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../FirebaseConfig';
import {breakfastOptions} from './Breakfast';
import {lunchOptions} from'./Lunch';
import {dinnerOptions} from'./Dinner';
import {snackRandomOptions} from'./Snack';
export default function HomeScreen() {
  const [userData, setUserData] = useState(null);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [suggestedMeals, setSuggestedMeals] = useState([]);
  const [lastDayHistory, setLastDayHistory] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [calorieNeeds, setCalorieNeeds] = useState(0);
  
  useEffect(() => {
    
    generateSuggestedMeals();
  }, []); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          Alert.alert('Erreur', 'Aucun utilisateur connecté.');
          return;
        }

        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setConsumedCalories(data.totalCalories || 0);
          setCalorieNeeds(data.calorieNeeds || 0);
          fetchLastDayHistory(data.mealHistory); 
         // generateSuggestedMeals();
        } else {
          Alert.alert('Erreur', 'Aucune donnée utilisateur trouvée.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        Alert.alert('Erreur', "Impossible de récupérer les données utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userData]);

  const fetchLastDayHistory = (mealHistory) => {
    if (!mealHistory || Object.keys(mealHistory).length === 0) {
      setLastDayHistory(null);
      return;
    }

    
    const sortedDates = Object.keys(mealHistory).sort((a, b) => new Date(b) - new Date(a));
    const lastDay = sortedDates[0]; // Récupère la dernière date
    setLastDayHistory({ date: lastDay, ...mealHistory[lastDay] });
  };
   
  const generateSuggestedMeals = () => {
    
 // Sélection aléatoire
 const randomBreakfast = getRandomElements(breakfastOptions, 1);
 const randomLunch = getRandomElements(lunchOptions, 1);
 const randomDinner = getRandomElements(dinnerOptions, 1);
 const randomSnack = getRandomElements(snackRandomOptions, 1);
 const resultMeals = [randomBreakfast,
   randomLunch,
   randomDinner,
   randomSnack
 ].flat();
 
  
 setSuggestedMeals(resultMeals);
  };

 
 function getRandomElements(array, count) {
  if (!Array.isArray(array)) {
    console.error('L\'argument "array" doit être un tableau valide, reçu :', array);
    return []; // Retourne un tableau vide pour éviter les erreurs
  }
  const shuffled = [...array].sort(() => 0.5 - Math.random()); // Mélange aléatoire
  return shuffled.slice(0, count); // Retourne les premiers 'count' éléments
}



  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  //const calorieNeeds = userData?.calorieNeeds || 2000;

  return (
    <ScrollView style={styles.container}>
      {/* Titre */}
      <Text style={styles.welcomeText}>
        Welcome Back, {userData?.name || 'User'}!
      </Text>
      <Text style={styles.subtitle}>Let's plan your healthy meals for today.</Text>

      {/* Daily Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Summary</Text>
        <View style={styles.row}>
          <Text>Calories Goal</Text>
          <Text>{calorieNeeds} kcal</Text>
        </View>
        <View style={styles.row}>
          <Text>Consumed</Text>
          <Text>{consumedCalories} kcal</Text>
        </View>
        <View style={styles.row}>
          <Text>Remaining</Text>
          <Text>{calorieNeeds - consumedCalories} kcal</Text>
        </View>
      </View>

      {/* Historique du dernier jour */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Last Day History</Text>
        {lastDayHistory ? (
          <>
            <Text style={styles.historyDate}>{lastDayHistory.date}</Text>
            <Text>Total Calories: {lastDayHistory.totalCalories} kcal</Text>
            {lastDayHistory.meals.map((meal, index) => (
              <View key={index} style={styles.historyMeal}>
                <Text>{meal.type}: {meal.name} ({meal.calories} kcal)</Text>
              </View>
            ))}
          </>
        ) : (
          <Text>No history available.</Text>
        )}
      </View>

      {/* Suggested Meals */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Suggested Meals</Text>
        {suggestedMeals.map((meal, index) => (
          <View key={index} style={styles.mealItem}>
            <Text> {meal.name}</Text>
            <Text>{meal.calories} kcal</Text>
          </View>
        ))}
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
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4B2B7F',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#E5E0FF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#4B2B7F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B2B7F',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mealItem: {
    backgroundColor: '#D1C4E9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  mealItemText: {
    fontSize: 16,
    color: '#4B2B7F',
    marginBottom: 5,
  },
  historyDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B2B7F',
    marginBottom: 10,
  },
  historyMeal: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4B2B7F',
    marginBottom: 5,
  },
  suggestedMealsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  suggestedMealBox: {
    backgroundColor: '#D1C4E9',
    borderRadius: 10,
    width: '48%',
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
  },
});
