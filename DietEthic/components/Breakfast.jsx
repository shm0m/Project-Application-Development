import React from 'react';
import { Text, StyleSheet, ScrollView, View, Image } from 'react-native';

const breakfastOptions = [
  { name: 'Pancakes', calories: 350, image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { name: 'Omelette', calories: 250, image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { name: 'Fruit Salad', calories: 150, image: 'https://images.unsplash.com/photo-1598515213694-72f24c99f1e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  { name: 'Granola with Yogurt', calories: 300 image: 'https://thebalancednutritionist.com/wp-content/uploads/2022/12/Yogurt-with-granola-1.jpg'},
  { name: 'Avocado Toast', calories: 280 image: ''},
  { name: 'Bagel with Cream Cheese', calories: 330 image: ''},
  { name: 'Scrambled Eggs', calories: 220 image: ''},
  { name: 'French Toast', calories: 400 image: ''},
  { name: 'Smoothie Bowl', calories: 350 image: ''},
  { name: 'Cereal with Milk', calories: 200 image: ''},
  { name: 'Breakfast Burrito', calories: 450 image: ''},
  { name: 'Blueberry Muffin', calories: 320 image: ''},
  { name: 'Egg and Cheese Sandwich', calories: 300 image: ''},
  { name: 'Greek Yogurt with Honey', calories: 200 image: ''},
  { name: 'Chia Seed Pudding', calories: 180 image: ''},
  { name: 'Croissant', calories: 250 image: ''},
  { name: 'Hash Browns', calories: 190 image: ''},
  { name: 'Breakfast Sausage', calories: 280 image: ''},
  { name: 'Quiche Lorraine', calories: 350 image: ''},
  { name: 'English Muffin with Jam', calories: 220 image: ''},
  { name: 'Breakfast Pizza', calories: 500 image: ''},
  { name: 'Tofu Scramble', calories: 180 image: ''},
  { name: 'Breakfast Tacos', calories: 300 image: ''},
  { name: 'Peanut Butter Toast', calories: 250 image: ''},
  { name: 'Cinnamon Roll', calories: 400 image: ''},
  { name: 'Acai Bowl', calories: 250 image: ''},
  { name: 'Breakfast Sandwich', calories: 350 image: ''},
  { name: 'Protein Shake', calories: 200 image: ''},
  { name: 'Waffles', calories: 320 image: ''},
  { name: 'Breakfast Quesadilla', calories: 400 image: ''},
  { name: 'Cheese Danish', calories: 380 image: ''},
  { name: 'Banana Bread', calories: 300 image: ''},
  { name: 'Vegetable Omelette', calories: 250 image: ''},
  { name: 'Toast with Butter', calories: 200 image: ''},
  { name: 'Frittata', calories: 300 image: ''},
  { name: 'Sweet Potato Hash', calories: 250 image: ''},
  { name: 'Huevos Rancheros', calories: 350 image: ''},
  { name: 'Yogurt Parfait', calories: 300 image: ''},
  { name: 'Breakfast Casserole', calories: 450 image: ''},
  { name: 'Breakfast Bagel Sandwich', calories: 400 image: ''},
  { name: 'Breakfast Croissant Sandwich', calories: 450 image: ''},
  { name: 'Eggs Benedict', calories: 500 image: ''},
  { name: 'Breakfast Burger', calories: 600 image: ''},
  { name: 'Coconut Rice Pudding', calories: 250 image: ''},
  { name: 'Toasted English Muffin', calories: 180 image: ''},
  { name: 'Savory Crepes', calories: 300 image: ''},
  { name: 'Breakfast Empanadas', calories: 400 image: ''},
  { name: 'Apple Cinnamon Oatmeal', calories: 200 image: ''},
  { name: 'Maple Bacon Donut', calories: 350 image: ''},
  { name: 'Breakfast Flatbread', calories: 450 image: ''},
  { name: 'Corned Beef Hash', calories: 400 image: ''},
  { name: 'Breakfast Poutine', calories: 600 image: ''},
  { name: 'Turkey Bacon', calories: 120 image: ''},
  { name: 'Breakfast Polenta', calories: 250 image: ''},
  { name: 'Ham and Cheese Croissant', calories: 450 image: ''},
  { name: 'Breakfast Ramen', calories: 500 image: ''},
  { name: 'Breakfast Sushi Rolls', calories: 300 image: ''},
  { name: 'Spinach and Feta Wrap', calories: 320 image: ''},
  { name: 'Baked Beans on Toast', calories: 350 image: ''},
  { name: 'Breakfast Fried Rice', calories: 400 image: ''},
  { name: 'Egg Drop Soup', calories: 150 image: ''},
];

export default function Breakfast() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Breakfast Options</Text>
      {breakfastOptions.map((item, index) => (
        <View key={index} style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.calories}>{item.calories} kcal</Text>
          </View>
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
    marginBottom: 15,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  textContainer: {
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 18,
    fontWeight: '600',
  },
  calories: {
    fontSize: 16,
    color: '#888',
  },
});
