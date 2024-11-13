// index.jsx
import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from '../components/Login';
import FormScreen from '../components/Form';
import ProfilScreen from '../components/Profil';

const Stack = createStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Form" component={FormScreen} />
      <Stack.Screen name="Profil" component={ProfilScreen} />
    </Stack.Navigator>
  );
}
