import React from 'react';
import { Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

export default function MealPlan() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Meal Plan</Text>
      <Text style={styles.subtitle}>Plan Suggestions</Text>

      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: 'https://www.buzzwebzine.fr/wp-content/uploads/2022/02/petit-dejeuner-anglais-1-1024x576.jpg' }} style={styles.image} />
        <Text style={styles.cardText}>100 days Breakfast </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: 'https://metro.co.uk/wp-content/uploads/2023/01/SEI_140890509-9e32.jpg?quality=90&strip=all' }} style={styles.image} />
        <Text style={styles.cardText}>Healthy Lunch</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: 'https://delhibrasserie.com/wp-content/uploads/2023/11/indian-cuisine-in-london.webp' }} style={styles.image} />
        <Text style={styles.cardText}>Dinner</Text>
      </TouchableOpacity>
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
});
