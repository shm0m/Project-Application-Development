// Login.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      // Si l'email et le mot de passe sont valides, naviguer vers l'onglet principal
      navigation.navigate('Profil'); 
    } else {
      alert('Please enter your email and password');
    }
  };

  const navigateToSignUp = () => {
    // Navigation vers la page Form pour l'inscription
    navigation.navigate('Form');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hey Ya!</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#9B9B9B"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        placeholderTextColor="#9B9B9B"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={navigateToSignUp}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A4FD8', // Couleur violette
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#E5E0FF',
    borderRadius: 25,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#6A4FD8',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
