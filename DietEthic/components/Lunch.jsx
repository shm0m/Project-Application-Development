import React from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';

const lunchOptions = [
  { name: 'Grilled Chicken Salad', calories: 400 },
  { name: 'Spaghetti Bolognese', calories: 600 },
  { name: 'Vegetable Stir Fry with Rice', calories: 450 },
  { name: 'Turkey Sandwich', calories: 350 },
  { name: 'Quinoa Bowl with Veggies', calories: 500 },
];

export default function Lunch() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Lunch Options</Text>
      {lunchOptions.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.calories}>{item.calories} kcal</Text>
        </View>
      ))}
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
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
  },
  calories: {
    fontSize: 18,
    color: '#888',
  },
});
