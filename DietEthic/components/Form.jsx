import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { auth } from '../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { calculateGoalWeight } from './tools'

export default function FormScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [goal, setGoal] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

   // Fonction pour calculer le BMI
   const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100; 
    const weightInKg = parseFloat(weight);
    if (!heightInMeters || !weightInKg) return null; 
    return (weightInKg / (heightInMeters ** 2)).toFixed(2); 
  };

  // Fonction pour calculer le BMR
  const calculateBMR = () => {
    const weightInKg = parseFloat(weight);
    const heightInCm = parseFloat(height);
    const ageInYears = parseInt(age);
    if (!weightInKg || !heightInCm || !ageInYears || !gender) return null; 

    if (gender === 'Male') {
      return (10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears + 5).toFixed(2); 
    } else if (gender === 'Female') {
      return (10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears - 161).toFixed(2); 
    }
    return null;
  };

  // Fonction pour enregistrer les données utilisateur dans Firebase Realtime Database
  const saveUserData = async (userId) => {
    const db = getDatabase();
  
    // Calculs des valeurs
    const bmi = calculateBMI();
    const goalWeight = calculateGoalWeight();
  
    const userData = {
      name,
      mail,
      password,
      age,
      height,
      weight, // Poids initial
      gender,
      goal: goalWeight,
      bmi,
      weightHistory: [parseFloat(weight)], // Initialiser l'historique avec le poids initial
      dates: [new Date().toLocaleDateString('fr-FR')], // Ajouter la date actuelle
    };
  
    try {
      // Sauvegarder dans Firebase
      await set(ref(db, `users/${userId}`), userData);
      Alert.alert('Succès', 'Compte créé et données enregistrées dans la base de données !');
      navigation.navigate('Login');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données :", error);
      Alert.alert('Erreur', "Impossible d'enregistrer les données utilisateur.");
    }
  };  

  // Fonction pour gérer l'inscription
  const handleSaveProfile = async () => {
    if (!mail || !password || !name || !age || !height || !weight || !gender || !goal) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, mail, password);
      const userId = userCredential.user.uid;
      await saveUserData(userId);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erreur', "L'adresse email est déjà utilisée.");
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Erreur', "L'adresse email est invalide.");
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Erreur', 'Le mot de passe est trop faible.');
      } else {
        Alert.alert('Erreur', "Une erreur est survenue. Veuillez réessayer.");
      }
      console.error("Erreur lors de l'inscription :", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Personal Informations</Text>

      {/* Name Field */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      {/* Email Field */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={mail}
        onChangeText={setMail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Age Field */}
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      {/* Height Field */}
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />

      {/* Weight Field */}
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      {/* Gender Selection */}
      <Text style={styles.label}>Gender</Text>
      <View style={styles.buttonGroup}>
        {["Male", "Female", "Other"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.button, gender === option && styles.buttonSelected]}
            onPress={() => setGender(option)}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Weight Goals */}
      <Text style={styles.label}>Weight Goals</Text>
      <View style={styles.buttonGroup}>
        {["Lose Weight", "Gain Weight"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.button, goal === option && styles.buttonSelected]}
            onPress={() => setGoal(option)}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F2F2',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A4FD8',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#E5E0FF',
    borderRadius: 25,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 20,
  },

  label: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#6A4FD8',
  },

  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },

  button: {
    backgroundColor: '#E5E0FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    margin: 5,
  },

  buttonSelected: {
    backgroundColor: '#6A4FD8',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#6A4FD8',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#6A4FD8',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
