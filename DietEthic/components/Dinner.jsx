import React from 'react';
import { Text, StyleSheet, ScrollView, View } from 'react-native';

const dinnerOptions = [
  { name: 'Grilled Salmon with Asparagus', calories: 450 },
  { name: 'Beef Stew with Potatoes', calories: 550 },
  { name: 'Chicken Alfredo Pasta', calories: 700 },
  { name: 'Vegetable Curry with Naan', calories: 500 },
  { name: 'Lentil Soup with Bread', calories: 350 },
];

export default function Dinner() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dinner Options</Text>
      {dinnerOptions.map((item, index) => (
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
