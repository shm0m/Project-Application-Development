import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { auth } from '../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { calculateGoalWeight } from './tools';

export default function FormScreen({ navigation }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');
  const [goal, setGoal] = useState('');
  const [mealPreference, setMealPreference] = useState([]);
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    if (!heightInMeters || !weightInKg) return null;
    return (weightInKg / (heightInMeters ** 2)).toFixed(2);
  };

  const calculateBMR = (weight, height, age, gender) => {
    if (!weight || !height || !age || !gender) return null; 
  
    if (gender === "Male") {
      return (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age).toFixed(2);
    } else if (gender === "Female") {
      return (447.593 + 9.247 * weight + 3.098 * height - 4.330 * age).toFixed(2);
    }
  
    return null;
  };

  const saveUserData = async (userId) => {
    const db = getDatabase();
    const bmi = calculateBMI();
    const bmr = calculateBMR(parseFloat(weight), parseFloat(height), parseInt(age), gender);

    console.log("BMR Calculated:", bmr);

    const userData = {
      name,
      mail,
      password,
      age,
      height,
      weight,
      gender,
      goal,
      bmi,
      bmr, // Inclure le BMR calculé
      weightHistory: [parseFloat(weight)],
      dates: [new Date().toLocaleDateString('fr-FR')],
      mealPreference,
    };

    try {
      await set(ref(db, `users/${userId}`), userData);
      Alert.alert('Succès', 'Compte créé et données enregistrées dans la base de données !');
      navigation.navigate('Login');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données :", error);
      Alert.alert('Erreur', "Impossible d'enregistrer les données utilisateur.");
    }
  };

  const handleSaveProfile = async () => {
    // Calculer le poids cible
    const calculatedGoal = calculateGoalWeight(height);
    setGoal(calculatedGoal);

    console.log("Form data:");
    console.log("Mail:", mail);
    console.log("Password:", password);
    console.log("Name:", name);
    console.log("Age:", age);
    console.log("Height:", height);
    console.log("Weight:", weight);
    console.log("Gender:", gender);
    console.log("Goal:", calculatedGoal);
    console.log("MealPreference:", mealPreference);

    if (!mail || !password || !name || !age || !height || !weight || !gender || !calculatedGoal || mealPreference.length === 0) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, mail, password);
      const userId = userCredential.user.uid;
      await saveUserData(userId);
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      Alert.alert('Erreur', "Impossible de créer le compte.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Personal Informations</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={mail}
        onChangeText={setMail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

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
      <Text style={styles.label}>Meal Preference</Text>
      <View style={styles.buttonGroup}>
        {["Breakfast", "Lunch", "Dinner", "Snack"].map((option) => {
          const isSelected = mealPreference.includes(option);
          return (
            <TouchableOpacity
              key={option}
              style={[styles.button, isSelected && styles.buttonSelected]}
              onPress={() => {
                setMealPreference((prev) =>
                  isSelected
                    ? prev.filter((pref) => pref !== option)
                    : [...prev, option]
                );
              }}
            >
              <Text style={styles.buttonText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
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
    backgroundColor: "#F2F2F2",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6A4FD8",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#E5E0FF",
    borderRadius: 25,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 20,
  },

  label: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: "bold",
    color: "#6A4FD8",
  },

  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#E5E0FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    margin: 5,
  },

  buttonSelected: {
    backgroundColor: "#6A4FD8",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#6A4FD8",
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#6A4FD8",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
