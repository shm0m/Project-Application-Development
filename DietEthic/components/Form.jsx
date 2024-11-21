import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CommonActions } from '@react-navigation/native';  // Ajoutez cette ligne

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

  const handleSaveProfile = () => {
    const profileData = {
      name,
      age,
      height,
      weight,
      gender,
      goal,
      dietaryRestrictions,
      favoriteCuisines,
    };
    // Rediriger vers Main au lieu de Profil
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
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
        placeholder="Height"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />

      {/* Weight Field */}
      <TextInput
        style={styles.input}
        placeholder="Weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      {/* Mail Field */}
      <TextInput
         style={styles.input}
         placeholder="Mail"
         value={mail }
         onChangeText={setMail}
      />

      {/* PassWord Field */}
      <TextInput
      style={styles.input}
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry={true}
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

      <Text style={styles.sectionTitle}>Personal Test Quizz</Text>

      {/* Dietary Restrictions */}
      <Text style={styles.label}>Dietary Restrictions</Text>
      <View style={styles.buttonGroup}>
        {["Vegetarian", "Vegan", "Gluten-free", "Dairy-free"].map((restriction) => (
          <TouchableOpacity
            key={restriction}
            style={[styles.button, dietaryRestrictions.includes(restriction) && styles.buttonSelected]}
            onPress={() => toggleSelection(restriction, dietaryRestrictions, setDietaryRestrictions)}
          >
            <Text style={styles.buttonText}>{restriction}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Favorite Cuisines */}
      <Text style={styles.label}>Favorite Cuisines</Text>
      <View style={styles.buttonGroup}>
        {["Asian", "French", "Italian", "Mexican", "Mediterranean"].map((cuisine) => (
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
