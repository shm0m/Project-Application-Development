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

  // Local states for editing
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [mealPreference, setMealPreference] = useState([]);
  const [lastWeight, setLastWeight] = useState("No data");
  const [weight, setWeight] = useState();
  const [bmr, setBmr] = useState(0);
  const [bmi, setBmi] = useState(0);
  const [calorieNeeds, setCalorieNeeds] = useState(0);

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

     // Listen to user data in real time
      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists() && !isEditing) { // Do not update fields in edit mode
          const data = snapshot.val();
          setUserData(data);

          // Update fields only if not in edit mode
          setName(data.name || "");
          setMail(data.mail || "");
          setPassword(data.password || "");
          setAge(data.age?.toString() || "");
          setHeight(data.height?.toString() || "");
          setGender(data.gender || "");
          setGoal(data.goal || "");
          setMealPreference(data.mealPreference || []);
          setProfileImage(data.profileImage || profileImage);

        // Updates the last weight
          const last = data.weightHistory?.[data.weightHistory.length - 1];
          setLastWeight(last || "No data");
          setWeight(last);
        }
        setLoading(false); // Loading completed
      });

      return unsubscribe;
    };

    const unsubscribe = fetchUserDataRealtime();
    return () => unsubscribe();
  }, [navigation, isEditing]); // Added `isEditing` as a dependency

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
        weight,
        bmi,
        bmr,
        calorieNeeds
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
  const calculateBMI = (height, weight) => {
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
const calculateCalorie=()=>{
  const bmrCalculated = calculateBMR(weight, height, age, gender);
  setBmr(bmrCalculated);

  const bmiCalculated = calculateBMI(height, weight);
  setBmi(bmiCalculated);

  const cn = Math.round(bmrCalculated * (bmiCalculated < 18.5 ? 1.2 : bmiCalculated < 25 ? 1.5 : 1.8));
  setCalorieNeeds(cn);
};
  const onHeigtChanged=(val)=>{
    setHeight(val);
    calculateCalorie();
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
            onChangeText={onHeigtChanged}
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
          <Text style={styles.title}>Profil Information </Text>
          <Text style={styles.infoText}>Name : {userData.name}</Text>
          <Text style={styles.infoText}>Email : {userData.mail}</Text>
          <Text style={styles.infoText}>Age : {userData.age}</Text>
          <Text style={styles.infoText}>Taille : {userData.height} cm</Text>
          <Text style={styles.infoText}>Weight: {userData.weight} kg</Text>

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
    backgroundColor: "#F9F9FB", 
    flex: 1, 
  },
  avatar: {
    width: 100, 
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#6A4FD8", 
  },
  changePhotoText: {
    textAlign: "center",
    color: "#6A4FD8",
    fontSize: 14,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#4B3F72", 
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#F0EBFF", 
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderColor: "#6A4FD8", 
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: "#6A4FD8",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#FF6A6A",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#6A4FD8",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 15,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#6A4FD8", 
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14, 
  },
  infoText: {
    fontSize: 16,
    marginVertical: 6,
    color: "#333",
  },
});
