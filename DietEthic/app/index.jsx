// index.jsx
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from '../components/Login';
import FormScreen from '../components/Form';
import ProfilScreen from '../components/Profil';

const Tab = createBottomTabNavigator();

export default function Index() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator initialRouteName="Login">
        <Tab.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ tabBarLabel: 'Login' }} 
        />
        <Tab.Screen 
          name="Form" 
          component={FormScreen} 
          options={{ tabBarLabel: 'Sign Up' }} 
        />
        <Tab.Screen 
          name="Profil" 
          component={ProfilScreen} 
          options={{ tabBarLabel: 'Profile' }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
