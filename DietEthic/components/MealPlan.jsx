import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Image, ScrollView, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { auth } from '../FirebaseConfig';

export default function MealPlan({ navigation }) {
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [userCalorieNeeds, setUserCalorieNeeds] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          Alert.alert('Erreur', 'Aucun utilisateur connecté.');
          navigation.navigate('Login');
          return;
        }

        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          calculateCalorieNeeds(userData, userId); // Appeler avec les données utilisateur et l'ID
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
  }, [navigation]);

  const calculateCalorieNeeds = async (data, userId) => {
    if (!data.bmi || !data.bmr) {
      Alert.alert('Erreur', 'Données BMI ou BMR manquantes.');
      setUserCalorieNeeds(1900); // Valeur par défaut
      return;
    }

    // Calcul des besoins caloriques quotidiens
    const calorieNeeds = Math.round(data.bmr * (data.bmi < 18.5 ? 1.2 : data.bmi < 25 ? 1.5 : 1.8));
    setUserCalorieNeeds(calorieNeeds);

    // Sauvegarde dans Firebase
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { calorieNeeds }); // Met à jour la base avec userCalorieNeeds
      console.log('Calorie needs sauvegardé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des besoins caloriques :', error);
    }
  };

  const saveConsumedCaloriesToDatabase = async (userId, consumedCalories) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { consumedCalories }); // Enregistre le total des calories consommées dans Firebase
      console.log('Consumed calories sauvegardé avec succès.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des calories consommées :', error);
    }
  };

  const addMeal = (meal, type) => {
    const totalCalories = selectedMeals.reduce((sum, meal) => sum + meal.calories, 0);

    if (userCalorieNeeds && totalCalories + meal.calories > userCalorieNeeds + 50) {
      Alert.alert('Calorie Limit Exceeded', 'You have exceeded your calorie limit. Please adjust your plan.');
      return;
    }

    setSelectedMeals((prev) => [...prev, { ...meal, type }]);
  };

  const removeMeal = (mealIndex) => {
    setSelectedMeals((prev) => prev.filter((_, index) => index !== mealIndex));
  };

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    const totalCalories = selectedMeals.reduce((sum, meal) => sum + meal.calories, 0);
    if (userId) {
      saveConsumedCaloriesToDatabase(userId, totalCalories);
    }
  }, [selectedMeals]);

  const groupedMeals = selectedMeals.reduce((acc, meal) => {
    if (!acc[meal.type]) acc[meal.type] = [];
    acc[meal.type].push(meal);
    return acc;
  }, {});

  const totalCalories = selectedMeals.reduce((sum, meal) => sum + meal.calories, 0);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.title}>Loading calorie data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Meal Plan</Text>
      <Text style={styles.subtitle}>
        Daily Calorie Limit: {userCalorieNeeds} kcal
      </Text>

      {/* Sélection des repas */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Breakfast', { addMeal })}
      >
        <Image
          source={{
            uri: 'https://www.buzzwebzine.fr/wp-content/uploads/2022/02/petit-dejeuner-anglais-1-1024x576.jpg',
          }}
          style={styles.image}
        />
        <Text style={styles.cardText}>Breakfast</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Lunch', { addMeal })}
      >
        <Image
          source={{
            uri: 'https://i.pinimg.com/736x/7d/48/d7/7d48d7eecd31eefbe56fc86fde3406ca.jpg',
          }}
          style={styles.image}
        />
        <Text style={styles.cardText}>Lunch</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Dinner', { addMeal })}
      >
        <Image
          source={{
            uri: 'https://delhibrasserie.com/wp-content/uploads/2023/11/indian-cuisine-in-london.webp',
          }}
          style={styles.image}
        />
        <Text style={styles.cardText}>Dinner</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Snack', { addMeal })}
      >
        <Image
          source={{
            uri: 'https://i.pinimg.com/736x/c6/fe/df/c6fedf742ba92dd5d7c090a730bba17e.jpg',
          }}
          style={styles.image}
        />
        <Text style={styles.cardText}>Snack</Text>
      </TouchableOpacity>

      {/* Affichage des repas sélectionnés */}
      <View style={styles.bubble}>
        <Text style={styles.bubbleTitle}>Selected Meals</Text>
        {Object.keys(groupedMeals).map((type) => (
          <View key={type}>
            <Text style={styles.mealType}>{type}</Text>
            {groupedMeals[type].map((meal, index) => (
              <View key={index} style={styles.mealItemRow}>
                <Text style={styles.mealItem}>
                  {meal.name} - {meal.calories} kcal
                </Text>
                <TouchableOpacity onPress={() => removeMeal(index)}>
                  <Text style={styles.removeButton}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
        <Text style={styles.totalCalories}>
          Total Calories: {totalCalories} kcal
        </Text>
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
  mealType: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
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
  totalCalories: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
});
