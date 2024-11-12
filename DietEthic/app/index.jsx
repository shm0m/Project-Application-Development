import { Text, View, Image, TextInput, StyleSheet, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; 

import HomePage from "../components/HomePage";
import Form from "../components/Form";

const Tab = createBottomTabNavigator();

export default function Index() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator initialRouteName="HomePage">
        <Tab.Screen name="HomePage" component={HomePage} />
        <Tab.Screen name="Form" component={Form} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}