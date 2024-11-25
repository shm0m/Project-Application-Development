import React, { useState } from 'react';
import { Text, StyleSheet, Image, ScrollView, TouchableOpacity, View } from 'react-native';

export default function MealPlan({ navigation }) {
  const [selectedMeals, setSelectedMeals] = useState([]);

  const addMeal = (meal, type) => {
    setSelectedMeals((prev) => [...prev, { ...meal, type }]);
  };

  const groupedMeals = selectedMeals.reduce((acc, meal) => {
    if (!acc[meal.type]) acc[meal.type] = [];
    acc[meal.type].push(meal);
    return acc;
  }, {});

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Meal Plan</Text>
      <Text style={styles.subtitle}>Plan Suggestions</Text>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Breakfast', { addMeal })}>
        <Image source={{ uri: 'https://www.buzzwebzine.fr/wp-content/uploads/2022/02/petit-dejeuner-anglais-1-1024x576.jpg' }} style={styles.image} />
        <Text style={styles.cardText}> Breakfast </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Lunch', { addMeal })}>
        <Image source={{ uri: 'https://i.pinimg.com/736x/7d/48/d7/7d48d7eecd31eefbe56fc86fde3406ca.jpg' }} style={styles.image} />
        <Text style={styles.cardText}> Lunch</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Dinner', { addMeal })}>
        <Image source={{ uri: 'https://delhibrasserie.com/wp-content/uploads/2023/11/indian-cuisine-in-london.webp' }} style={styles.image} />
        <Text style={styles.cardText}> Dinner </Text>
      </TouchableOpacity>

      <View style={styles.bubble}>
        <Text style={styles.bubbleTitle}>Selected Meals</Text>
        {Object.keys(groupedMeals).map((type) => (
          <View key={type}>
            <Text style={styles.mealType}>{type}</Text>
            {groupedMeals[type]
              .sort((a, b) => a.calories - b.calories)
              .map((meal, index) => (
                <Text key={index} style={styles.mealItem}>
                  {meal.name} - {meal.calories} kcal
                </Text>
              ))}
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
    marginTop: 10,
  },
  mealItem: {
    fontSize: 16,
    marginVertical: 2,
  },
});
