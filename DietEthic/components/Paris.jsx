import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Paris() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenue à Paris!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
