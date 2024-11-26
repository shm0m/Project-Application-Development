import React, { useState } from 'react';
import { Text, StyleSheet, Image, ScrollView, TouchableOpacity, View, Alert } from 'react-native';

export default function MealPlan({ navigation }) {
  const [selectedMeals, setSelectedMeals] = useState([]);

  // Simule le besoin calorique quotidien de l'utilisateur (à remplacer par des données dynamiques)
  const userCalorieNeeds = 1900;

  const addMeal = (meal, type) => {
    setSelectedMeals((prev) => {
      // Vérifie qu'un seul plat par type est sélectionné
      if (prev.some((m) => m.type === type)) {
        Alert.alert('Error', `You can only select one ${type}`);
        return prev;
      }
      return [...prev, { ...meal, type }];
    });
  };

  const removeMeal = (type) => {
    setSelectedMeals((prev) => prev.filter((meal) => meal.type !== type));
  };

  const groupedMeals = selectedMeals.reduce((acc, meal) => {
    if (!acc[meal.type]) acc[meal.type] = [];
    acc[meal.type].push(meal);
    return acc;
  }, {});

  // Calcul des calories totales
  const totalCalories = selectedMeals.reduce((sum, meal) => sum + meal.calories, 0);

  // Vérification des limites caloriques avec une marge de 100 kcal en dessous
  let calorieMessage = '';
  if (totalCalories > userCalorieNeeds) {
    calorieMessage = 'Sorry, you need to change your meal plan, too much calories.';
  } else if (totalCalories < userCalorieNeeds - 100) {
    calorieMessage = 'Sorry, you need to add a meal, not enough calories.';
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Meal Plan</Text>
      <Text style={styles.subtitle}>Plan Suggestions</Text>

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
        <Text style={styles.cardText}> Breakfast </Text>
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
        <Text style={styles.cardText}> Lunch</Text>
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
        <Text style={styles.cardText}> Dinner </Text>
      </TouchableOpacity>

      <View style={styles.bubble}>
        <Text style={styles.bubbleTitle}>Selected Meals</Text>
        {Object.keys(groupedMeals).map((type) => (
          <View key={type}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealType}>{type}</Text>
              <TouchableOpacity onPress={() => removeMeal(type)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
            {groupedMeals[type]
              .sort((a, b) => a.calories - b.calories)
              .map((meal, index) => (
                <Text key={index} style={styles.mealItem}>
                  {meal.name} - {meal.calories} kcal
                </Text>
              ))}
          </View>
        ))}
        <Text style={styles.totalCalories}>
          Total Calories: {totalCalories} kcal
        </Text>
        {calorieMessage ? (
          <Text style={styles.warning}>{calorieMessage}</Text>
        ) : (
          <Text style={styles.success}>Your meal plan looks great!</Text>
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
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  mealType: {
    fontSize: 18,
    fontWeight: '600',
  },
  mealItem: {
    fontSize: 16,
    marginVertical: 2,
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
  warning: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 10,
  },
  success: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
    marginTop: 10,
  },
});
