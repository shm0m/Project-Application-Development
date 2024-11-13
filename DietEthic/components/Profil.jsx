// Profil.jsx
import React from 'react';
import { Text, SafeAreaView } from 'react-native';

export default function ProfilScreen({ route }) {
  const { name, gender, age, Goal, dietaryRestrictions, favoriteCuisines } = route.params || {};

  return (
    <SafeAreaView>
      <Text>Profil Page</Text>
      {name && <Text>Welcome, {name}</Text>}
      {gender && <Text>Gender: {gender}</Text>}
      {age && <Text>Age: {age}</Text>}
      {Goal && <Text>Goal: {Goal}</Text>}
      {dietaryRestrictions && <Text>Dietary Restrictions: {dietaryRestrictions.join(', ')}</Text>}
      {favoriteCuisines && <Text>Favorite Cuisines: {favoriteCuisines.join(', ')}</Text>}
    </SafeAreaView>
  );
}
