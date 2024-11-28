import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
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
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: 'https://i.pinimg.com/736x/b0/bb/09/b0bb09e2211bc66f9b6341dbcab1a136.jpg', // Avatar URL
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{name || 'First Name Last Name'}</Text>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        {gender && <Text style={styles.detailText}>Gender: {gender}</Text>}
        {age && <Text style={styles.detailText}>Age: {age}</Text>}
        {goal && <Text style={styles.detailText}>Weight Goals: {goal}</Text>}
        {bmi && <Text style={styles.detailText}>BMI: {bmi}</Text>}
        {bmr && <Text style={styles.detailText}>BMR: {bmr}</Text>}
      </View>

      {/* Navigation Buttons */}
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Main', { screen: 'MealPlan' })}>
        <Text style={styles.navButtonText}>Go to Meal Plan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Main', { screen: 'Graph' })}>
        <Text style={styles.navButtonText}>Go to Graph</Text>
      </TouchableOpacity>


      {/* Contact Section */}
      <Text style={styles.contactText}>Contact us at: support@dietethic.fr</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#6c63ff',
  },
  detailsContainer: {
    marginTop: 30,
    width: '90%',
    alignItems: 'flex-start',
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#4b4b4b',
    lineHeight: 25,
  },
  navigationContainer: {
    marginTop: 30,
    width: '90%',
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: '#6c63ff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactText: {
    marginTop: 30,
    fontSize: 16,
    color: '#6c63ff',
  },
});
