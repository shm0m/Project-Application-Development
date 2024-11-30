import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Image, ScrollView, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { getDatabase, ref, get, update, push } from 'firebase/database'; // Utilisation correcte des imports
import { auth } from '../FirebaseConfig';

export default function MealPlan({ navigation }) {
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [userCalorieNeeds, setUserCalorieNeeds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);


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
  };
 
  const markMealAsConsumed = async (meal, index) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Erreur', 'Utilisateur non connecté.');
        return;
      }

      const db = getDatabase();
      const consumedRef = ref(db, `users/${userId}/consumedMeals`);

      await push(consumedRef, {
        name: meal.name,
        calories: meal.calories,
        timestamp: new Date().toISOString(),
      });

      // Met à jour l'état local
      setSelectedMeals((prevMeals) =>
        prevMeals.map((m, i) =>
          i === index ? { ...m, consumed: true } : m
        )
      );

      Alert.alert('Succès', `${meal.name} a été enregistré comme consommé.`);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du repas :", error);
      Alert.alert('Erreur', "Impossible d'enregistrer le repas consommé.");
    }
  };
  
  
  const updateMealStatus = (index, consumed) => {
    setSelectedMeals((prev) =>
      prev.map((meal, i) =>
        i === index ? { ...meal, consumed } : meal
      )
    );
  };
  
  
  const saveConsumedCaloriesToDatabase = async (userId, consumedCalories) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { consumedCalories });
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
    setSelectedMeals((prev) => {
      const updatedMeals = [...prev]; // Crée une copie du tableau actuel
      updatedMeals.splice(mealIndex, 1); // Supprime l'élément à l'index donné
      return updatedMeals; // Retourne le nouveau tableau sans l'élément supprimé
    });
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
        <TouchableOpacity onPress={() => setEditing((prev) => !prev)} style={styles.modifyButton}>
          <Text style={styles.editButton}>
            {editing ? 'Finish' : 'Edit'}
          </Text>
        </TouchableOpacity>
        {Object.keys(groupedMeals).map((type) => (
          <View key={type}>
            <Text style={styles.mealType}>{type}</Text>
            {groupedMeals[type].map((meal, index) => (
              <View key={index} style={styles.mealItemRow}>
                <Text style={styles.mealItem}>
                  {meal.name} - {meal.calories} kcal
                </Text>
                <View style={styles.actionButtons}>
                  {editing ? (
                    <TouchableOpacity onPress={() => removeMeal(index)}>
                      <Text style={styles.removeButton}>Remove</Text>
                    </TouchableOpacity>
                  ) : !meal.consumed ? (
                    <TouchableOpacity onPress={() => markMealAsConsumed(meal, index)}>
                      <Text style={styles.consumeButton}>Consumed</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ))}
        <Text style={styles.totalCalories}>Total Calories: {totalCalories} kcal</Text>
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

  consumeButton: {
    color: 'green',
    marginLeft: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  editButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
 
  
  
});
