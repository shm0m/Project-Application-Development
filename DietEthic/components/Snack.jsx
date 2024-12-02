import React from 'react';
import { Text, StyleSheet, ScrollView, View, TouchableOpacity, Image} from 'react-native';

 const snackOptions = {
    salty: [
      { name: 'Salty Popcorn', calories: 150, image: 'https://i.pinimg.com/736x/99/b9/00/99b9005bea6b4a2669e7210a87c80c2b.jpg' },
      { name: 'Bretzels', calories: 120, image: 'https://i.pinimg.com/736x/77/b8/4d/77b84d9a41c924a04c671ea6f0af4015.jpg' },
      { name: 'Nachos with Cheese', calories: 300, image: 'https://i.pinimg.com/736x/fc/49/2b/fc492bf983c4f095d7482ccc8ed6a1fb.jpg' },
      { name: 'Salted Nuts', calories: 200, image: 'https://i.pinimg.com/736x/49/c2/b6/49c2b62f1c7a5b038941b81fd121f71d.jpg' },
      { name: 'Cheese Crackers', calories: 180, image: 'https://i.pinimg.com/736x/e6/ee/57/e6ee57d7364e6b780e29d935d7f69fd3.jpg' },
      { name: 'Spicy Chickpeas', calories: 250, image: 'https://i.pinimg.com/736x/95/8a/47/958a47b35b1e6205f934014cae4fa60a.jpg' },
      { name: 'Chips', calories: 170, image: 'https://i.pinimg.com/736x/47/fa/03/47fa035c652aa9edb45d72475e387a26.jpg' },
      { name: 'Stuffed Olives', calories: 90, image: 'https://i.pinimg.com/736x/3b/0d/bb/3b0dbbed3cf03044477f979d8c15cca1.jpg' },
      { name: 'Mini Pretzel Bites', calories: 140, image: 'https://i.pinimg.com/736x/05/57/87/055787185948df9ff5a97005433f8f43.jpg' },
      { name: 'Garlic Breadsticks', calories: 220, image: 'https://i.pinimg.com/736x/88/bf/40/88bf40298fca9d88f90e253e0885dc06.jpg' },
    ],
    sweet: [
      { name: 'Dark Chocolate', calories: 250, image: 'https://i.pinimg.com/736x/0d/c4/bf/0dc4bfbace614b2bfb7143edb8fc282b.jpg' },
      { name: 'Granola Bar', calories: 180, image: 'https://i.pinimg.com/736x/e5/d2/d5/e5d2d52b101e0e90efa370764d0acbd1.jpg' },
      { name: 'Dried Fruits', calories: 200, image: 'https://i.pinimg.com/736x/3c/52/05/3c5205aec961cdbcce6e7fc89de17d88.jpg' },
      { name: 'Honey-Coated Almonds', calories: 230, image: 'https://i.pinimg.com/736x/83/cf/14/83cf14a7edc319412a9862753f9541d9.jpg' },
      { name: 'Caramel Popcorn', calories: 300, image: 'https://i.pinimg.com/736x/97/6d/ec/976dec6a752917c5eae82f5d03ecddf5.jpg' },
      { name: 'Mini Pancakes with Syrup', calories: 320, image: 'https://i.pinimg.com/736x/f3/56/5c/f3565c6c6022efbeabeb6384c28b1da9.jpg' },
      { name: 'Fudge Brownie Bites', calories: 270, image: 'https://i.pinimg.com/736x/26/43/4a/26434a092691c26f23ac0ae7cf1e104d.jpg' },
      { name: 'Yogurt-Covered Raisins', calories: 190, image: 'https://i.pinimg.com/736x/f2/0f/1f/f20f1f007377733b90da678cb5af37de.jpg' },
      { name: 'Banana Chips', calories: 150, image: 'https://i.pinimg.com/736x/bc/34/22/bc3422dd54d14b471aff89e0a562bfda.jpg' },
      { name: 'Strawberry Muffins', calories: 210, image: 'https://i.pinimg.com/736x/7d/53/a9/7d53a941da947c0a43038fc6103c56e5.jpg' },
    ],
  };
  
 export const snackRandomOptions =[
    { name: 'Salty Popcorn', calories: 150, image: 'https://i.pinimg.com/736x/99/b9/00/99b9005bea6b4a2669e7210a87c80c2b.jpg' },
    { name: 'Bretzels', calories: 120, image: 'https://i.pinimg.com/736x/77/b8/4d/77b84d9a41c924a04c671ea6f0af4015.jpg' },
    { name: 'Nachos with Cheese', calories: 300, image: 'https://i.pinimg.com/736x/fc/49/2b/fc492bf983c4f095d7482ccc8ed6a1fb.jpg' },
    { name: 'Salted Nuts', calories: 200, image: 'https://i.pinimg.com/736x/49/c2/b6/49c2b62f1c7a5b038941b81fd121f71d.jpg' },
    { name: 'Cheese Crackers', calories: 180, image: 'https://i.pinimg.com/736x/e6/ee/57/e6ee57d7364e6b780e29d935d7f69fd3.jpg' },
    { name: 'Spicy Chickpeas', calories: 250, image: 'https://i.pinimg.com/736x/95/8a/47/958a47b35b1e6205f934014cae4fa60a.jpg' },
    { name: 'Chips', calories: 170, image: 'https://i.pinimg.com/736x/47/fa/03/47fa035c652aa9edb45d72475e387a26.jpg' },
    { name: 'Stuffed Olives', calories: 90, image: 'https://i.pinimg.com/736x/3b/0d/bb/3b0dbbed3cf03044477f979d8c15cca1.jpg' },
    { name: 'Mini Pretzel Bites', calories: 140, image: 'https://i.pinimg.com/736x/05/57/87/055787185948df9ff5a97005433f8f43.jpg' },
    { name: 'Garlic Breadsticks', calories: 220, image: 'https://i.pinimg.com/736x/88/bf/40/88bf40298fca9d88f90e253e0885dc06.jpg' },
    { name: 'Dark Chocolate', calories: 250, image: 'https://i.pinimg.com/736x/0d/c4/bf/0dc4bfbace614b2bfb7143edb8fc282b.jpg' },
    { name: 'Granola Bar', calories: 180, image: 'https://i.pinimg.com/736x/e5/d2/d5/e5d2d52b101e0e90efa370764d0acbd1.jpg' },
    { name: 'Dried Fruits', calories: 200, image: 'https://i.pinimg.com/736x/3c/52/05/3c5205aec961cdbcce6e7fc89de17d88.jpg' },
    { name: 'Honey-Coated Almonds', calories: 230, image: 'https://i.pinimg.com/736x/83/cf/14/83cf14a7edc319412a9862753f9541d9.jpg' },
    { name: 'Caramel Popcorn', calories: 300, image: 'https://i.pinimg.com/736x/97/6d/ec/976dec6a752917c5eae82f5d03ecddf5.jpg' },
    { name: 'Mini Pancakes with Syrup', calories: 320, image: 'https://i.pinimg.com/736x/f3/56/5c/f3565c6c6022efbeabeb6384c28b1da9.jpg' },
    { name: 'Fudge Brownie Bites', calories: 270, image: 'https://i.pinimg.com/736x/26/43/4a/26434a092691c26f23ac0ae7cf1e104d.jpg' },
    { name: 'Yogurt-Covered Raisins', calories: 190, image: 'https://i.pinimg.com/736x/f2/0f/1f/f20f1f007377733b90da678cb5af37de.jpg' },
    { name: 'Banana Chips', calories: 150, image: 'https://i.pinimg.com/736x/bc/34/22/bc3422dd54d14b471aff89e0a562bfda.jpg' },
    { name: 'Strawberry Muffins', calories: 210, image: 'https://i.pinimg.com/736x/7d/53/a9/7d53a941da947c0a43038fc6103c56e5.jpg' },
  ];

  export default function Snack({ route }) {
    const { addMeal } = route.params; 
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Snack Options</Text>
  
        <Text style={styles.subtitle}>Salty</Text>
        {snackOptions.salty.map((item, index) => (
          <View key={`salty-${index}`} style={styles.item}>
            {item.image ? ( 
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : null}
            <View style={styles.textContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.calories}>{item.calories} kcal</Text>
            </View>
            <TouchableOpacity onPress={() => addMeal(item, 'Snack')} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}
  
        <Text style={styles.subtitle}>Sweet</Text>
        {snackOptions.sweet.map((item, index) => (
          <View key={`sweet-${index}`} style={styles.item}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : null}
            <View style={styles.textContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.calories}>{item.calories} kcal</Text>
            </View>
            <TouchableOpacity onPress={() => addMeal(item, 'Snack')} style={styles.addButton}>
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
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: '#333',
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
  
