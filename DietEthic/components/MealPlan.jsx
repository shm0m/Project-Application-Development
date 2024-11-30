import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Image, ScrollView, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { getDatabase, ref, get, update, push, onValue } from 'firebase/database';
import { auth } from '../FirebaseConfig';
import * as FileSystem from 'expo-file-system';

const FILE_PATH = `${FileSystem.documentDirectory}user_data.json`;

export default function MealPlan({ navigation }) {
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [userCalorieNeeds, setUserCalorieNeeds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        Alert.alert('Error', 'No user logged in.');
        navigation.navigate('Login');
        return;
      }

      // Fetch data from Firebase and update JSON file
      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);

        const unsubscribe = onValue(userRef, async (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log("Real-time user data:", userData);

            // Update local JSON file
            await updateJsonFile(userId, userData);
            calculateCalorieNeeds(userData, userId); // Update calorie needs dynamically
          } else {
            Alert.alert('Error', 'No user data found.');
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Could not fetch user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  const calculateCalorieNeeds = async (data, userId) => {
    if (!data.height || !data.age || !data.gender || !data.weightHistory?.length) {
      Alert.alert('Error', 'Insufficient data to calculate calorie needs.');
      setUserCalorieNeeds(1900);
      return;
    }

    const currentWeight = data.weightHistory[data.weightHistory.length - 1];
    const height = data.height;
    const age = data.age;
    const gender = data.gender;

    const bmr =
      gender === 'Male'
        ? 88.362 + 13.397 * currentWeight + 4.799 * height - 5.677 * age
        : 447.593 + 9.247 * currentWeight + 3.098 * height - 4.330 * age;

    const bmi = currentWeight / ((height / 100) ** 2);
    const calorieNeeds = Math.round(bmr * (bmi < 18.5 ? 1.2 : bmi < 25 ? 1.5 : 1.8));

    setUserCalorieNeeds(calorieNeeds);

    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { bmr, calorieNeeds });
      console.log('BMR and calorie needs updated successfully in Firebase.');
    } catch (error) {
      console.error('Error updating calorie needs in Firebase:', error);
    }
  };

  const updateJsonFile = async (userId, data) => {
    try {
      const fileExists = await FileSystem.getInfoAsync(FILE_PATH);
      let jsonData = {};

      if (fileExists.exists) {
        const fileContent = await FileSystem.readAsStringAsync(FILE_PATH);
        jsonData = JSON.parse(fileContent);
      }

      jsonData[userId] = data;

      await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(jsonData, null, 2));
      console.log('JSON file updated successfully.');
      console.log('File saved at:', FILE_PATH);
    } catch (error) {
      console.error('Error updating JSON file:', error);
    }
  };

  const loadUserDataFromJson = async (userId) => {
    try {
      const fileExists = await FileSystem.getInfoAsync(FILE_PATH);

      if (!fileExists.exists) {
        console.log('No local JSON file found.');
        return null;
      }

      const fileContent = await FileSystem.readAsStringAsync(FILE_PATH);
      const jsonData = JSON.parse(fileContent);

      return jsonData[userId] || null;
    } catch (error) {
      console.error('Error reading JSON file:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadLocalData = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const localData = await loadUserDataFromJson(userId);
        if (localData) {
          console.log('Loaded user data from local JSON:', localData);
          setUserCalorieNeeds(localData.calorieNeeds || 1900);
        }
      }
    };

    loadLocalData();
  }, []);

  // Other functions remain the same (markMealAsConsumed, addMeal, removeMeal, etc.)

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
