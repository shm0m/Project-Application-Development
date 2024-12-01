import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { auth } from '../FirebaseConfig';

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [dailyMeals, setDailyMeals] = useState([]);
  const [lastDayHistory, setLastDayHistory] = useState(null);
  const [suggestedMeals, setSuggestedMeals] = useState([]);
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
          setConsumedCalories(data.consumedCalories || 0);
          fetchDailyMeals(data.mealHistory);
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

  const fetchDailyMeals = (mealHistory) => {
    const today = new Date().toISOString().split('T')[0];
    if (mealHistory && mealHistory[today]) {
      setDailyMeals(mealHistory[today].meals || []);
    } else {
      setDailyMeals([]);
    }
  };

  const markAsConsumed = async (meal, index) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Erreur', 'Utilisateur non connecté.');
        return;
      }

      const db = getDatabase();
      const consumedRef = ref(db, `users/${userId}/mealHistory/${new Date().toISOString().split('T')[0]}/meals/${index}`);
      const updatedMeal = { ...meal, consumed: true };

      await update(consumedRef, updatedMeal);

      setDailyMeals((prev) => {
        const updatedMeals = [...prev];
        updatedMeals[index] = updatedMeal;
        return updatedMeals;
      });

      setConsumedCalories((prev) => prev + meal.calories);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du repas :', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le repas.');
    }
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
        <View style={styles.dailyMeals}>
          {dailyMeals.length > 0 ? (
            dailyMeals.map((meal, index) => (
              <View key={index} style={styles.mealRow}>
                <Text style={styles.mealText}>
                  {meal.type}: {meal.name} ({meal.calories} kcal)
                </Text>
                {!meal.consumed && (
                  <TouchableOpacity
                    style={styles.consumedButton}
                    onPress={() => markAsConsumed(meal, index)}
                  >
                    <Text style={styles.consumedButtonText}>Consumed</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No meals planned for today.</Text>
          )}
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
  dailyMeals: {
    marginTop: 20,
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#D1C4E9',
    borderRadius: 10,
  },
  mealText: {
    fontSize: 16,
    color: '#4B2B7F',
  },
  consumedButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  consumedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
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
  mealItem: {
    backgroundColor: '#D1C4E9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});
