import React from 'react';
import { Text, StyleSheet, ScrollView, View, Image, TouchableOpacity} from 'react-native';

export const dinnerOptions = [
  { name: 'Grilled Salmon with Asparagus', calories: 450, image:'https://i.pinimg.com/736x/f8/25/69/f825699e2d17106b4563eb2940125a41.jpg'},
  { name: 'Beef Stew with Potatoes', calories: 550 , image:'https://i.pinimg.com/736x/df/29/d3/df29d33d58b9c7163ed79366cfbf9463.jpg'},
  { name: 'Chicken Alfredo Pasta', calories: 700 , image:'https://i.pinimg.com/736x/3b/87/08/3b870829e51a912147ad1edc773d254d.jpg'},
  { name: 'Vegetable Curry with Naan', calories: 500 , image:'https://i.pinimg.com/736x/cf/ae/72/cfae72b1d277b956161afa86db613488.jpg'},
  { name: 'Lentil Soup with Bread', calories: 350 , image:'https://i.pinimg.com/736x/f3/ba/ee/f3baee2547cfb036ec5afd5a38b7735e.jpg'},

  { name: 'Paella', calories: 650, image:'https://i.pinimg.com/736x/34/90/95/34909560e5374e19d8cd54f85f63b711.jpg' },  // Espagne
  { name: 'Ratatouille', calories: 400, image:'https://i.pinimg.com/736x/40/9c/4d/409c4d0cf85f7968abe4da332fae4651.jpg' },  // France
  { name: 'Udon', calories: 400, image:'https://i.pinimg.com/736x/1b/81/c0/1b81c0387b03643be27d4bb6d473648c.jpg' },  // Japon
  { name: 'Tacos with Beef', calories: 550, image:'https://i.pinimg.com/736x/0e/9f/0d/0e9f0dcc02a137459e4bb5a6236cc07a.jpg' },  // Mexique
  { name: 'Chili con Carne', calories: 600, image:'https://i.pinimg.com/736x/77/cb/5c/77cb5c3e45792e3047f8b4af63c1585a.jpg' },  // USA

  { name: 'Butter Chicken with Rice', calories: 700, image:'https://i.pinimg.com/736x/48/a9/25/48a925d19520bba1423f23bf35251e99.jpg' },  // Inde
  { name: 'Moussaka', calories: 600, image:'https://i.pinimg.com/736x/65/e7/02/65e702b9a402d94c34d48560a73aa875.jpg' },  // Grèce
  { name: 'Fish and Chips', calories: 700, image:'https://i.pinimg.com/736x/7a/4f/fc/7a4ffc4f7e8461baeff14926dcfd63a8.jpg' },  // Angleterre
  { name: 'Fried Rice with Shrimp', calories: 500, image:'https://i.pinimg.com/736x/4d/91/72/4d9172310d89532a0d87733e05eb1bbc.jpg' },  // Chine
  { name: 'Bangers and Mash', calories: 750, image:'https://i.pinimg.com/736x/63/f1/67/63f16796a9cd12f3dca5209a912829e4.jpg' },  // Royaume-Uni

  { name: 'Kimchi Jjigae', calories: 450, image:'https://i.pinimg.com/736x/46/94/6b/46946bb03ac6fba502190e9c99a2745b.jpg' },  // Corée du Sud
  { name: 'Pho', calories: 350, image:'https://i.pinimg.com/736x/e8/40/13/e84013373eb2553a50679221dc0d3517.jpg' },  // Vietnam
  { name: 'Ceviche', calories: 250, image:'https://i.pinimg.com/736x/16/68/c6/1668c65d194efc39704b50c156e5f03b.jpg' },  // Pérou
  { name: 'Shakshuka', calories: 400, image:'https://i.pinimg.com/736x/f6/4e/68/f64e68ba0ecd59652ef57f7952e0770f.jpg' },  // Israël
  { name: 'Tagine', calories: 500, image:'https://i.pinimg.com/736x/5d/05/3d/5d053d0928743bad264604bbfb4d721c.jpg' },  // Maroc

  { name: 'Rogan Josh', calories: 600, image:'https://i.pinimg.com/736x/f9/61/86/f96186e3ee5ff9d2249e755c35488fae.jpg' },  // Pakistan
  { name: 'Pasta Carbonara', calories: 700, image:'https://i.pinimg.com/736x/51/ba/e1/51bae1456b4196bd7ee215874c2040ca.jpg' },  // Italie
  { name: 'Feijoada', calories: 750, image:'https://i.pinimg.com/736x/10/a4/14/10a4145c6413d386cc9381bf4e79778f.jpg' },  // Brésil
  { name: 'Currywurst with Fries', calories: 800, image:'https://i.pinimg.com/736x/5c/b2/24/5cb2241c1b02f61e65ff2915ea8f2dc0.jpg' },  // Allemagne
  { name: 'Souvlaki with Pita', calories: 500, image:'https://i.pinimg.com/736x/66/04/f4/6604f421935e1a8d1ae56e2a531ad48d.jpg' },  // Grèce

  { name: 'Bulgogi with Rice', calories: 600, image:'https://i.pinimg.com/736x/d3/2b/65/d32b65d5fc82c6889faf13d0279512a4.jpg' },  // Corée du Sud
  { name: 'Boeuf Bourguignon', calories: 750, image:'https://i.pinimg.com/736x/03/a2/17/03a217bbddbf5cf252975720d4ba5b05.jpg' },  // France
  { name: 'Tom Yum Soup', calories: 350, image:'https://i.pinimg.com/736x/c9/28/5f/c9285f6cea90c7d15589744e4785342b.jpg' },  // Thaïlande
  { name: 'Peking Duck', calories: 800, image:'https://i.pinimg.com/736x/84/fc/e2/84fce2720d7a6ea35d3b40fd35327580.jpg' },  // Chine
];

export default function Dinner({ route }) {
  const { addMeal } = route.params; // Récupération de la fonction passée via les paramètres de navigation

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dinner Options</Text>
      {dinnerOptions.map((item, index) => (
        <View key={index} style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.calories}>{item.calories} kcal</Text>
          </View>
          <TouchableOpacity onPress={() => addMeal(item, 'Dinner')} style={styles.addButton}>
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
