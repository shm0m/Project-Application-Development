/*import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Me() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenue dans l'espace personel!</Text>
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
});*/
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  // State variables to store form inputs
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState('');
  const [weightGoal, setWeightGoal] = useState(null);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [favoriteCuisines, setFavoriteCuisines] = useState([]);

  // Toggle selection for multi-select options
  const toggleSelection = (option, array, setArray) => {
    setArray((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  // Handle saving the profile (add functionality as needed)
  const handleSaveProfile = () => {
    const profileData = {
      name,
      gender,
      age,
      weightGoal,
      dietaryRestrictions,
      favoriteCuisines,
    };
    console.log('Profile Saved:', profileData);
    // Save or process the profile data as needed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, gender === 'Male' && styles.buttonSelected]}
          onPress={() => setGender('Male')}
        >
          <Text style={styles.buttonText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, gender === 'Female' && styles.buttonSelected]}
          onPress={() => setGender('Female')}
        >
          <Text style={styles.buttonText}>Female</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Weight Goals</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, weightGoal === 'Lose Weight' && styles.buttonSelected]}
          onPress={() => setWeightGoal('Lose Weight')}
        >
          <Text style={styles.buttonText}>Lose Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, weightGoal === 'Gain Weight' && styles.buttonSelected]}
          onPress={() => setWeightGoal('Gain Weight')}
        >
          <Text style={styles.buttonText}>Gain Weight</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Personal Taste Quiz</Text>

      <Text style={styles.label}>Dietary Restrictions</Text>
      <View style={styles.buttonGroup}>
        {['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free'].map((restriction) => (
          <TouchableOpacity
            key={restriction}
            style={[styles.button, dietaryRestrictions.includes(restriction) && styles.buttonSelected]}
            onPress={() => toggleSelection(restriction, dietaryRestrictions, setDietaryRestrictions)}
          >
            <Text style={styles.buttonText}>{restriction}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Favorite Cuisines</Text>
      <View style={styles.buttonGroup}>
        {['Italian', 'Mexican', 'Asian', 'Mediterranean'].map((cuisine) => (
          <TouchableOpacity
            key={cuisine}
            style={[styles.button, favoriteCuisines.includes(cuisine) && styles.buttonSelected]}
            onPress={() => toggleSelection(cuisine, favoriteCuisines, setFavoriteCuisines)}
          >
            <Text style={styles.buttonText}>{cuisine}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

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

export default ProfileScreen;