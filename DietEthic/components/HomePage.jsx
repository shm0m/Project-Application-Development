import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';

export default function HomePage() {
  const navigation = useNavigation();
  const [displayText, setDisplayText] = useState('');
  const message = 'Welcome to DietEthic 🍉';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= message.length) {
        setDisplayText(message.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Empêche le retour à la HomePage
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          );
        }, 1000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{displayText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  text: {
    fontSize: 28,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#6A4FD8',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
