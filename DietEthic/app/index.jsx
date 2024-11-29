import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../components/Login';
import FormScreen from '../components/Form';
import ProfilScreen from '../components/Profil';
import HomePage from '../components/HomePage';
import MealPlan from '../components/MealPlan';
import Graph from '../components/Graph';

import Breakfast from '../components/Breakfast';
import Lunch from '../components/Lunch';
import Dinner from '../components/Dinner';
import Snack from '../components/Snack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Création du composant TabNavigator
function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Profil" // Définit "Profil" comme l'onglet actif par défaut
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="MealPlan" component={MealPlanStack} />
      <Tab.Screen name="Graph" component={Graph} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

// Création d'une pile spécifique pour MealPlan et ses sous-écrans
function MealPlanStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MealPlan" component={MealPlan} />
      <Stack.Screen name="Breakfast" component={Breakfast} />
      <Stack.Screen name="Lunch" component={Lunch} />
      <Stack.Screen name="Dinner" component={Dinner} />
      <Stack.Screen name="Snack" component={Snack} />
    </Stack.Navigator>
  );
}

export default function Index() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Form" component={FormScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
}
