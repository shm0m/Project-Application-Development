import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';

export default function FormScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState(null);
  const [goal, setGoal] = useState(null);
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [favoriteCuisines, setFavoriteCuisines] = useState([]);

  const toggleSelection = (option, array, setArray) => {
    setArray((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  // Fonction pour calculer le BMI
  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100; // Convertir en mètres
    const weightInKg = parseFloat(weight);
    if (!heightInMeters || !weightInKg) return null; // Vérifier si les valeurs sont valides
    return (weightInKg / (heightInMeters ** 2)).toFixed(2); // Formule BMI
  };

  // Fonction pour calculer le BMR
  const calculateBMR = () => {
    const weightInKg = parseFloat(weight);
    const heightInCm = parseFloat(height);
    const ageInYears = parseInt(age);
    if (!weightInKg || !heightInCm || !ageInYears || !gender) return null; // Vérifier si les valeurs sont valides

    if (gender === 'Male') {
      return (10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears + 5).toFixed(2); // Formule pour homme
    } else if (gender === 'Female') {
      return (10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears - 161).toFixed(2); // Formule pour femme
    }
    return null;
  };

  const handleSaveProfile = () => {
    const bmi = calculateBMI();
    const bmr = calculateBMR();

    if (!bmi || !bmr || !mail || !password) {
      Alert.alert('Error', 'Please ensure all fields are filled correctly.');
      return;
    }

    const profileData = {
      name,
      age,
      height,
      weight,
      gender,
      goal,
      mail,
      password,
      bmi,
      bmr,
    };

    Alert.alert(
      'Profile Saved',
      `Your BMI is ${bmi} and your BMR is ${bmr}.`,
      [{ text: 'OK', onPress: () => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Main' }] })) }]
    );
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
