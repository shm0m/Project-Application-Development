// index.jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../components/Login';
import FormScreen from '../components/Form';
import ProfilScreen from '../components/Profil';
import HomePage from '../components/HomePage';
import MealPlan from '../components/MealPlan';
import Graph from '../components/Graph';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Création du Tab Navigator pour les écrans principaux
function Espaces_personnels() {
  return (
    
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profil" component={ProfilScreen} /> 
        <Stack.Screen name="Form" component={FormScreen} />
      </Stack.Navigator>
    
  );
}

// Navigation principale de l'application
export default function Index() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="MealPlan" component={MealPlan} />
      <Tab.Screen name="Graph" component={Graph} />
      <Tab.Screen name="Me" component={Espaces_personnels} />
    </Tab.Navigator>
  );
}
