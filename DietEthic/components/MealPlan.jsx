import React from 'react';
import { Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

export default function MealPlan() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Meal Plan</Text>
      <Text style={styles.subtitle}>Plan Suggestions</Text>

      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: 'https://example.com/image1.jpg' }} style={styles.image} />
        <Text style={styles.cardText}>100 Days Healthy Foods</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: 'https://example.com/image2.jpg' }} style={styles.image} />
        <Text style={styles.cardText}>28 Days Balanced Healthy Foods</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: 'https://example.com/image3.jpg' }} style={styles.image} />
        <Text style={styles.cardText}>14 Days Bulking Foods</Text>
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
