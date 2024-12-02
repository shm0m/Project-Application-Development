import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FirebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Please ensure that you entered the right informations');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Connexion réussie pour l\'utilisateur :', user);

      Alert.alert('Success', 'Connection sucessfull !');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main', params: { screen: 'Profil' } }],
      });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', "User not found");
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', "Wrong password");
      } else {
        console.error('Error while connecting :', error);
        Alert.alert('Error', error.message);
      }
    }
  };

  const navigateToSignUp = () => {
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
    color: '#6A4FD8', 
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
