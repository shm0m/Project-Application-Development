import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { getDatabase, ref, get, update } from 'firebase/database';
import { auth } from '../FirebaseConfig';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker

export default function Profil({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(
    'https://i.pinimg.com/736x/b0/bb/09/b0bb09e2211bc66f9b6341dbcab1a136.jpg' // URL par défaut
  );

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
          const data = snapshot.val();
          const updatedData = calculateBMIandBMR(data); // Calcul du BMI et BMR
          setUserData(updatedData);
          saveBMIandBMR(userId, updatedData.bmi, updatedData.bmr); // Enregistrement dans Firebase

          // Charger l'image de profil de Firebase (si existante)
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          }
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

  const calculateBMIandBMR = (data) => {
    if (!data.weight || !data.height || !data.age || !data.gender) {
      return { ...data, bmi: null, bmr: null };
    }

    const heightInMeters = data.height / 100; // Convertir la taille en mètres
    const bmi = (data.weight / (heightInMeters * heightInMeters)).toFixed(1); // BMI arrondi à 1 décimale

    const bmr =
      data.gender === 'Male'
        ? 88.362 + 13.397 * data.weight + 4.799 * data.height - 5.677 * data.age
        : 447.593 + 9.247 * data.weight + 3.098 * data.height - 4.330 * data.age;

    return { ...data, bmi: parseFloat(bmi), bmr: Math.round(bmr) };
  };

  const saveBMIandBMR = async (userId, bmi, bmr) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { bmi, bmr }); // Mise à jour de la base de données avec le BMI et BMR
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données :', error);
      Alert.alert('Erreur', "Impossible de sauvegarder les données utilisateur.");
    }
  };

  const pickImage = async () => {
    // Demander la permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission refusée', 'Vous devez autoriser l’accès à vos photos.');
      return;
    }

    // Ouvrir la galerie
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Carré
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;

      // Mettre à jour l'image localement
      setProfileImage(selectedImage);

      // Sauvegarder dans Firebase
      const userId = auth.currentUser?.uid;
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { profileImage: selectedImage });

      Alert.alert('Succès', 'Votre photo de profil a été mise à jour.');
    }
  };

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

  const { name, gender, age, goal, bmi, bmr, mealPreference } = userData; // Ajout de mealPreference

  return (
    <SafeAreaView style={styles.container}>
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.name}>{name}</Text>
      </View>

      {/* Details Section */}
      <View style={styles.detailsContainer}>
        {gender && <Text style={styles.detailText}>Gender: {gender}</Text>}
        {age && <Text style={styles.detailText}>Age: {age}</Text>}
        {goal && <Text style={styles.detailText}>Weight Goals: {goal}</Text>}
        {bmi && <Text style={styles.detailText}>BMI: {bmi}</Text>}
        {bmr && <Text style={styles.detailText}>BMR: {bmr}</Text>}
        {mealPreference && mealPreference.length > 0 && (
          <Text style={styles.detailText}>
            Meal Preferences: {mealPreference.join(', ')}
          </Text>
        )}
      </View>

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
  contactText: {
    marginTop: 30,
    fontSize: 16,
    color: '#6c63ff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
