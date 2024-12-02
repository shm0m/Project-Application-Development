import React from 'react';
import { Text, StyleSheet, ScrollView, View, Image, TouchableOpacity } from 'react-native';

export const lunchOptions = [
  { name: 'Grilled Chicken Salad', calories: 400, image: 'https://i.pinimg.com/736x/c1/16/46/c11646a428c4232d0e62aacaefd2c91b.jpg' },
  { name: 'Spaghetti Bolognese', calories: 600, image: 'https://i.pinimg.com/736x/b3/f1/ad/b3f1ada878dcbf073760058dd30c607c.jpg' },
  { name: 'Vegetable Stir Fry with Rice', calories: 450, image: 'https://i.pinimg.com/736x/00/8f/71/008f7199633912aff659c9ab16e357ba.jpg' },
  { name: 'Turkey Sandwich', calories: 350, image: 'https://i.pinimg.com/736x/1b/34/2c/1b342cd5f92f1b8aa8c14d522d78f95d.jpg' },
  { name: 'Quinoa Bowl with Veggies', calories: 500, image: 'https://i.pinimg.com/736x/f5/b1/a4/f5b1a41b613f250968c97ac921190f6b.jpg' },
  { name: 'Chicken Caesar Salad', calories: 550, image: 'https://i.pinimg.com/736x/4a/19/a3/4a19a33de486390cdb989199822c701e.jpg' },
  { name: 'Grilled Salmon with Asparagus', calories: 600, image: 'https://i.pinimg.com/736x/0d/e6/b2/0de6b2f8429aab3569d95f6841e2a95b.jpg' },
  { name: 'Falafel Wrap', calories: 350, image: 'https://i.pinimg.com/736x/02/0b/1b/020b1b9d0f13731e21128a7605291a91.jpg' },
  { name: 'Veggie Burger', calories: 400, image: 'https://i.pinimg.com/736x/ac/45/f4/ac45f45265f937964ab7098fe1de0348.jpg' },
  { name: 'Grilled Shrimp Tacos', calories: 450, image: 'https://i.pinimg.com/736x/e4/9d/2b/e49d2b9779d841a4e2a54828c5de36da.jpg' },
  { name: 'Chicken Wrap', calories: 500, image: 'https://i.pinimg.com/736x/01/97/0a/01970a7426bb7f59cbf915008b5337b6.jpg' },
  { name: 'Beef Burrito', calories: 600, image: 'https://i.pinimg.com/736x/aa/42/6c/aa426c52b612d2783548f15497d7d2ac.jpg' },
  { name: 'Vegetarian Sushi', calories: 350, image: 'https://i.pinimg.com/736x/6d/29/d8/6d29d84f40961a205a0ff88bf68a961d.jpg' },
  { name: 'Chicken Quesadilla', calories: 500, image: 'https://i.pinimg.com/736x/69/38/41/693841f09ee867561cf4b94eb153b456.jpg' },
  { name: 'Salmon Salad', calories: 450, image: 'https://i.pinimg.com/736x/85/f1/3c/85f13c75d4d80395861f410f1dcc84b8.jpg' },
  { name: 'Vegetarian Chili', calories: 400, image: 'https://i.pinimg.com/736x/85/6c/34/856c34354a61013913a11edb467f1411.jpg' },
  { name: 'Cobb Salad', calories: 500, image: 'https://i.pinimg.com/736x/6d/2c/18/6d2c18accac1aa04180107dec18d4a33.jpg' },
  { name: 'Pasta Primavera', calories: 550, image: 'https://i.pinimg.com/736x/c3/82/93/c38293a0fa5c1d8a768d5fd14546e220.jpg' },
  { name: 'Grilled Cheese Sandwich', calories: 450, image: 'https://i.pinimg.com/736x/97/3f/cf/973fcf12a92d6937fd54445a29530656.jpg' },
  { name: 'Egg Salad Sandwich', calories: 400, image: 'https://i.pinimg.com/736x/5a/1c/b9/5a1cb9045274d6cf654e3c1f29d04fa9.jpg' },
  { name: 'Lentil Soup', calories: 300, image: 'https://i.pinimg.com/736x/e5/34/aa/e534aa33847b9d569e489415f7d5d45b.jpg' },
  { name: 'Tuna Salad', calories: 350, image: 'https://i.pinimg.com/736x/cc/c0/28/ccc0285fca4c4c79b315852dd0b05c80.jpg' },
  { name: 'Dumplings', calories: 350, image: 'https://i.pinimg.com/736x/6e/e3/79/6ee379214b6c214f01f693e63653f308.jpg' },
  { name: 'Ramen', calories: 700, image: 'https://i.pinimg.com/736x/9a/c8/59/9ac859a46cf322d67c69a4ae8f0d8c7e.jpg' },
  { name: 'Gyoza', calories: 250, image: 'https://i.pinimg.com/736x/2a/a3/67/2aa367728880130b88c4ec13d3d98495.jpg'},
  { name: 'Japanese Curry', calories: 600, image: 'https://i.pinimg.com/736x/5e/8c/12/5e8c12ffbcfaffb9c4db22a8e4a800f4.jpg' },

];

export default function Lunch({ route }) {
    const { addMeal } = route.params; // Récupération de la fonction passée via les paramètres de navigation
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Lunch Options</Text>
        {lunchOptions.map((item, index) => (
          <View key={index} style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.calories}>{item.calories} kcal</Text>
            </View>
            <TouchableOpacity onPress={() => addMeal(item, 'Lunch')} style={styles.addButton}>
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
      backgroundColor: '#6A4FD8',
      padding: 10,
      borderRadius: 5,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
