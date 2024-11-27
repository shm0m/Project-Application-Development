import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../FirebaseConfig';

export default function Profil({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          Alert.alert('Erreur', 'Aucun utilisateur connecté.');
          navigation.navigate('Login');
          return;
        }

        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          Alert.alert('Erreur', 'Aucune donnée utilisateur trouvée.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        Alert.alert('Erreur', "Impossible de récupérer les données utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Aucune donnée utilisateur trouvée.</Text>
      </SafeAreaView>
    );
  }

  const { name, gender, age, goal, bmi, bmr } = userData;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profil Page</Text>
      {name && <Text style={styles.text}>Welcome, {name}</Text>}
      {gender && <Text style={styles.text}>Gender: {gender}</Text>}
      {age && <Text style={styles.text}>Age: {age}</Text>}
      {goal && <Text style={styles.text}>Goal: {goal}</Text>}
      {bmi && <Text style={styles.text}>BMI: {bmi}</Text>}
      {bmr && <Text style={styles.text}>BMR: {bmr}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
