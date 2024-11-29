import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../FirebaseConfig';

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);
  const [consumedCalories, setConsumedCalories] = useState(0); // Pour stocker le totalCalories de MealPlan
  const [suggestedMeals, setSuggestedMeals] = useState([]);
  const [history, setHistory] = useState([]);
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
          setConsumedCalories(data.totalCalories || 0); // Récupérer le total des calories consommées
          setHistory(data.mealHistory || []); // Charger l'historique
          generateSuggestedMeals(data.mealPreference, data.calorieNeeds || 2000); // Utiliser calorieNeeds pour suggérer des repas
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

  const generateSuggestedMeals = (mealPreferences, calorieLimit) => {
    // Simule des suggestions de repas en fonction des préférences de l'utilisateur
    const allMeals = [
      { name: 'Oatmeal with Berries', calories: 300 },
      { name: 'Grilled Chicken Salad', calories: 400 },
      { name: 'Avocado Toast', calories: 250 },
      { name: 'Smoothie Bowl', calories: 350 },
      { name: 'Pasta Primavera', calories: 500 },
    ];

    const suggestions = allMeals
      .filter((meal) => calorieLimit - meal.calories >= 0) // Respecter la limite calorique
      .slice(0, 4); // Limiter à 4 suggestions

    setSuggestedMeals(suggestions);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const calorieNeeds = userData?.calorieNeeds || 2000; // Calorie Needs par défaut

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

        {/* Calories Goal */}
        <View style={styles.row}>
          <Text>Calories Goal</Text>
          <Text>{calorieNeeds} kcal</Text>
        </View>

        {/* Consumed */}
        <View style={styles.row}>
          <Text>Consumed</Text>
          <Text>{consumedCalories} kcal</Text>
        </View>

        {/* Remaining */}
        <View style={styles.row}>
          <Text>Remaining</Text>
          <Text>{calorieNeeds - consumedCalories} kcal</Text>
        </View>
      </View>

      {/* Suggested Meals */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Suggested Meals</Text>
        {suggestedMeals.map((meal, index) => (
          <TouchableOpacity key={index} style={styles.mealItem}>
            <Text>{meal.name}</Text>
            <Text>{meal.calories} kcal</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Historique */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>History</Text>
        {history.map((entry, index) => (
          <View key={index} style={styles.row}>
            <Text>{entry.name}</Text>
            <Text>{entry.calories} kcal</Text>
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
});
