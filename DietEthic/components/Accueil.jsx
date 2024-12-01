import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../FirebaseConfig';

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [suggestedMeals, setSuggestedMeals] = useState([]);
  const [lastDayHistory, setLastDayHistory] = useState(null); // Historique du dernier jour
  const [loading, setLoading] = useState(true);

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
          fetchLastDayHistory(data.mealHistory); // Appelle la fonction pour obtenir l'historique du dernier jour
          generateSuggestedMeals(data.mealPreference, data.calorieNeeds || 2000);
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
  }, []);

  const fetchLastDayHistory = (mealHistory) => {
    if (!mealHistory || Object.keys(mealHistory).length === 0) {
      setLastDayHistory(null);
      return;
    }

    // Trier les dates dans l'historique pour trouver le dernier jour
    const sortedDates = Object.keys(mealHistory).sort((a, b) => new Date(b) - new Date(a));
    const lastDay = sortedDates[0]; // Récupère la dernière date
    setLastDayHistory({ date: lastDay, ...mealHistory[lastDay] });
  };

  const generateSuggestedMeals = (mealPreferences, calorieLimit) => {
    const allMeals = [
      { name: 'Oatmeal with Berries', calories: 300, type: 'Breakfast' },
      { name: 'Grilled Chicken Salad', calories: 400, type: 'Lunch' },
      { name: 'Vegetable Curry with Rice', calories: 450, type: 'Dinner' },
      { name: 'Smoothie Bowl', calories: 350, type: 'Snack' },
      { name: 'Avocado Toast', calories: 250, type: 'Breakfast' },
    ];

    // Filtrer selon les préférences utilisateur et le nombre de calories restant
    const suggestions = allMeals
      .filter(
        (meal) =>
          mealPreferences.includes(meal.type) && calorieLimit - meal.calories >= 0
      )
      .slice(0, 4);

    setSuggestedMeals(suggestions);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const calorieNeeds = userData?.calorieNeeds || 2000;

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
            <Text>{meal.type}: {meal.name}</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#E5E0FF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  mealItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  historyMeal: {
    marginLeft: 10,
    fontSize: 16,
    marginBottom: 5,
  },
});
