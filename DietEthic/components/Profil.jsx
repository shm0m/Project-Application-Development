import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { auth } from "../FirebaseConfig";
import { signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({ weightHistory: [] });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("https://i.sstatic.net/YaL3s.jpg");

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [mealPreference, setMealPreference] = useState([]);
  const [lastWeight, setLastWeight] = useState("No data");

  useEffect(() => {
    const fetchUserDataRealtime = () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Erreur", "Aucun utilisateur connecté.");
        navigation.navigate("Login");
        return;
      }

      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);

      // Écouter toutes les données utilisateur
      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);

          setName(data.name || "");
          setMail(data.mail || "");
          setPassword(data.password || "");
          setAge(data.age?.toString() || "");
          setHeight(data.height?.toString() || "");
          setGender(data.gender || "");
          setGoal(data.goal || "");
          setMealPreference(data.mealPreference || []);
          setProfileImage(data.profileImage || profileImage);

          // Met à jour le dernier poids
          const last = data.weightHistory?.[data.weightHistory.length - 1];
          setLastWeight(last || "No data");
        } else {
          Alert.alert("Erreur", "Aucune donnée utilisateur trouvée.");
        }
        setLoading(false); // Charger terminé
      });

      // Retourner la fonction pour désinscrire le listener lors du démontage
      return unsubscribe;
    };

    const unsubscribe = fetchUserDataRealtime();
    return () => unsubscribe();
  }, [navigation]);

  const handleSaveProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);

      const updatedData = {
        name,
        mail,
        password,
        age: parseInt(age, 10),
        height: parseFloat(height),
        gender,
        goal,
        mealPreference,
        profileImage,
      };

      await update(userRef, updatedData);

      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error while updating:", error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Access denied", "Please enable photo permissions in your settings");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setProfileImage(selectedImage);

      const userId = auth.currentUser?.uid;
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { profileImage: selectedImage });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("You are now disconnected");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error while disconnecting :", error);
      Alert.alert("Error", "It's not you, it's us");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6A4FD8" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Utilisateur non trouvé.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: profileImage }} style={styles.avatar} />
      </TouchableOpacity>

      {isEditing ? (
        <>
          <Text style={styles.changePhotoText}>Tap to change profile picture</Text>
          <Text style={styles.title}>Edit personal informations</Text>

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
            placeholder="Height"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsEditing(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Informations du Profil</Text>
          <Text style={styles.infoText}>Name : {userData.name}</Text>
          <Text style={styles.infoText}>Email : {userData.mail}</Text>
          <Text style={styles.infoText}>Age : {userData.age}</Text>
          <Text style={styles.infoText}>Taille : {userData.height} cm</Text>
          <Text style={styles.infoText}>Weight: {lastWeight} kg</Text>

          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log out</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F2F2F2",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 10,
  },
  changePhotoText: {
    textAlign: "center",
    color: "#6A4FD8",
    marginBottom: 20,
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
  },
  saveButton: {
    backgroundColor: "#6A4FD8",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF6A6A",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#6A4FD8",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF6A6A",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
