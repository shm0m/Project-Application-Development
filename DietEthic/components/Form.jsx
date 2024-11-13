// Form.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';

export default function FormScreen({ navigation }) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState('');
  const [Goal, setGoal] = useState(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [favoriteCuisines, setFavoriteCuisines] = useState([]);

  const handleSaveProfile = () => {
    const profileData = {
      name,
      gender,
      age,
      Goal,
      dietaryRestrictions,
      favoriteCuisines,
    };
    // Rediriger vers le profil avec les données du formulaire
    navigation.navigate('Profil', profileData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Profile</Text>
      
      {/* Champs de saisie et boutons (mêmes que dans votre code) */}
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  buttonSelected: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: '#FFF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  saveButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

