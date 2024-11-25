import React from 'react';
import { Text, StyleSheet, ScrollView, View, Image, TouchableOpacity } from 'react-native';

const breakfastOptions = [
  { name: 'Pancakes', calories: 350, image: 'https://i.pinimg.com/474x/25/72/3f/25723ff7d7b63a89265b6a9d1c6de237.jpg' },
  { name: 'Omelette', calories: 250, image: 'https://i.pinimg.com/474x/4c/0d/e8/4c0de8036b41f0ded861fd8babe6c183.jpg' },
  { name: 'Fruit Salad', calories: 150, image: 'https://i.pinimg.com/736x/bf/ef/97/bfef97712edce45e6299968f3d6072a8.jpg' },
  { name: 'Granola with Yogurt', calories: 300, image:'https://thebalancednutritionist.com/wp-content/uploads/2022/12/Yogurt-with-granola-1.jpg'},
  { name: 'Avocado Toast', calories: 280, image: 'https://i.pinimg.com/736x/4b/91/56/4b9156c6d9c5be6cde10dbf4ea6c5446.jpg'},
  { name: 'Bagel with Cream Cheese', calories: 330, image: 'https://i.pinimg.com/736x/04/0f/1b/040f1b5fd8338793bd2163dae3098bbf.jpg'},
  { name: 'Scrambled Eggs', calories: 220, image: 'https://i.pinimg.com/736x/22/70/23/2270234d793c5df2264912be5de84593.jpg'},
  { name: 'French Toast', calories: 400, image: 'https://i.pinimg.com/736x/96/7f/2c/967f2cc8911ab3e018fed45bd393af80.jpg'},
  { name: 'Smoothie Bowl', calories: 350, image: 'https://i.pinimg.com/736x/fa/18/cd/fa18cd93bd2cb1c387f2d48816a01a96.jpg'},
  { name: 'Cereal with Milk', calories: 200, image: 'https://i.pinimg.com/736x/47/44/d6/4744d6822f1c88f70a0aa6cbbbdfd804.jpg'},
  { name: 'Breakfast Burrito', calories: 450, image: 'https://i.pinimg.com/736x/4a/0e/a4/4a0ea4c27daa2d912000551f37029a63.jpg'},
  { name: 'Blueberry Muffin', calories: 320, image: 'https://i.pinimg.com/736x/9c/fb/2e/9cfb2e8a03d4ad805da130b672f44ead.jpg'},
  { name: 'Egg and Cheese Sandwich', calories: 300, image: 'https://i.pinimg.com/736x/4c/2a/21/4c2a21a781319a814b62a9788387e75d.jpg'},
  { name: 'Greek Yogurt with Honey', calories: 200, image: 'https://i.pinimg.com/736x/6f/0f/a7/6f0fa708409e20cb36555b86f71f32b6.jpg'},
  { name: 'Chia Seed Pudding', calories: 180, image: 'https://i.pinimg.com/736x/8f/e1/41/8fe141d834afb92f7c51b2f081a0e4ff.jpg'},
  { name: 'Croissant', calories: 250, image: 'https://i.pinimg.com/736x/bb/7d/50/bb7d50e2cb2bc7ca916dbb528b72ae1d.jpg'},
  { name: 'Hash Browns', calories: 190, image: 'https://i.pinimg.com/736x/d5/e7/91/d5e7910304bc7bd24a4e3e63faa31529.jpg'},
  { name: 'Breakfast Sausage', calories: 280, image: 'https://i.pinimg.com/736x/81/9e/60/819e603266b51391b18594ee7d943a00.jpg'},
  { name: 'Quiche Lorraine', calories: 350, image: 'https://i.pinimg.com/736x/ca/38/ff/ca38ff8689f95eed3bce27646bafcd58.jpg'},
  { name: 'English Muffin with Jam', calories: 220, image: 'https://i.pinimg.com/736x/d5/4b/14/d54b145b74ca1dd1a18d9790eee8f339.jpg'},
  { name: 'Breakfast Pizza', calories: 500, image: 'https://i.pinimg.com/736x/0a/0b/cb/0a0bcb41ce840136f2cf1c01918789ba.jpg'},
  { name: 'Tofu Scramble', calories: 180, image: 'https://i.pinimg.com/736x/af/cf/99/afcf996e67a0b0592b1faee4676f5c9a.jpg'},
  { name: 'Breakfast Tacos', calories: 300, image: 'https://i.pinimg.com/736x/31/a7/cd/31a7cd02d45f686cb2d102e148d3a52e.jpg'},
  { name: 'Peanut Butter Toast', calories: 250, image: 'https://i.pinimg.com/736x/e3/1a/0a/e31a0a9e3ccda3d9f65a97035abcd546.jpg'},
  { name: 'Cinnamon Roll', calories: 400, image: 'https://i.pinimg.com/736x/d1/68/0e/d1680e19c0b14209f129ef94e40812d2.jpg'},
  { name: 'Acai Bowl', calories: 250, image: 'https://i.pinimg.com/736x/0f/e7/00/0fe700b8ae2ba772a72bc2faeeff2f55.jpg'},
  { name: 'Breakfast Sandwich', calories: 350, image: 'https://i.pinimg.com/736x/a1/65/c8/a165c8f90c9b252920dc77887addf380.jpg'},
  { name: 'Protein Shake', calories: 200, image: 'https://i.pinimg.com/736x/47/9d/5e/479d5e31df4c9b0f796eaa60e7975824.jpg'},
  { name: 'Waffles', calories: 320, image: 'https://i.pinimg.com/736x/3f/84/d7/3f84d758fd5e9f31691f325618bc4103.jpg'},
  
];

export default function Breakfast({ route }) {
  const { addMeal } = route.params;

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
          <TouchableOpacity onPress={() => addMeal(item, 'Breakfast')} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  textContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  itemText: {
    fontSize: 18,
    fontWeight: '600',
  },
  calories: {
    fontSize: 16,
    color: '#888',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});