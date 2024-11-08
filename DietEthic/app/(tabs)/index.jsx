import React from 'react';
import {Text,Image,StyleSheet,Button,SafeAreaView,Statusbar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import Paris from '../../components/Paris';
import London from '../../components/London';


export default function Index() {
  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator>
        <Tab.Screen name='Paris' component={Paris} initialRouteName='Paris'></Tab.Screen>
        <Tab.Screen name='London' component={London} initialRouteName='London'></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
