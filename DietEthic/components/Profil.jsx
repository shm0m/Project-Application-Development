import React, { useState, useEffect } from 'react';
import { Text,View, SafeAreaView, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
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
        <Text style={styles.errorText}>User not found.</Text>
      </SafeAreaView>
    );
  }

  const { name, gender, age, goal, bmi, bmr } = userData;

  return (
    
    <SafeAreaView style={styles.container}>
    {/* Avatar */}
    <View style={styles.avatarContainer}>
      <Image
        source={{
          uri: 'https://i.pinimg.com/736x/b0/bb/09/b0bb09e2211bc66f9b6341dbcab1a136.jpg', // Remplace cette URL par celle d'un avatar réel
        }}
        style={styles.avatar}
      />
      <Text style={styles.name}>{name || 'First Name Last Name'}</Text>
    </View>
    <Text style={styles.title}>Profil Page</Text>
        {name && <Text style={styles.text}>Welcome, {name}</Text>}
        {gender && <Text style={styles.text}>Gender: {gender}</Text>}
        {age && <Text style={styles.text}>Age: {age}</Text>}
        {goal && <Text style={styles.text}>Goal: {goal}</Text>}
        {bmi && <Text style={styles.text}>BMI: {bmi}</Text>}
        {bmr && <Text style={styles.text}>BMR: {bmr}</Text>}

    {/* Contact */}
    <Text style={styles.contactText}>Contact us at: support@dietethic.fr</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#6c63ff', // Couleur similaire au design
  },
  detailsContainer: {
    marginTop: 20,
    width: '100%',
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  contactText: {
    marginTop: 20,
    fontSize: 16,
    color: '#6c63ff',
  },
});