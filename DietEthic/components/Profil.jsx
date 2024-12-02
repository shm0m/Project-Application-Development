import React, { useState, useEffect } from "react";
import { ScrollView,Text,View,TextInput,TouchableOpacity,StyleSheet,ActivityIndicator,Alert,Image } from "react-native";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { auth } from "../FirebaseConfig";
import { signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({ weightHistory: [] });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://i.sstatic.net/YaL3s.jpg"
  );

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
  const mealOptions = ["Breakfast", "Lunch", "Snack", "Dinner"];
  const [lastHeight, setLastHeight] = useState([]);
  const latestHeight = lastHeight.length > 0 ? lastHeight[lastHeight.length - 1] : "No data";

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
  
      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists() && !isEditing) {
          const data = snapshot.val();
          setUserData(data);
  
          // Initialiser `height` et `lastHeight` avec les données existantes
          if (data.height) {
            setHeight(data.height.toString());
            setLastHeight([data.height]); // Initialise lastHeight avec la taille existante
          } else {
            setHeight("");
            setLastHeight([]); // Si aucune taille n'existe, on garde un tableau vide
          }
  
          setName(data.name || "");
          setMail(data.mail || "");
          setPassword(data.password || "");
          setAge(data.age?.toString() || "");
          setGender(data.gender || "");
          setGoal(data.goal || "");
          setMealPreference(data.mealPreference || []);
          setProfileImage(data.profileImage || profileImage);
  
          const last = data.weightHistory?.[data.weightHistory.length - 1];
          setLastWeight(last || "No data");
          setWeight(last);
        }
        setLoading(false);
      });
  
      return unsubscribe;
    };
  
    const unsubscribe = fetchUserDataRealtime();
    return () => unsubscribe();
  }, [navigation, isEditing]);
  
  
  
  const getLatestHeight = () => {
    return lastHeight.length > 0 ? lastHeight[lastHeight.length - 1] : "";
  };
  

  const handleSaveProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Erreur", "Aucun utilisateur connecté.");
        return;
      }
  

      const currentHeight = height || (lastHeight.length > 0 ? lastHeight[lastHeight.length - 1] : null);
      const currentWeight = weight || userData.weight; 
      const currentAge = age || userData.age; 
      const currentGender = gender || userData.gender;
  
      // Recalculer BMI et BMR uniquement si les valeurs nécessaires sont présentes
      const newBMI = calculateBMI(currentHeight, currentWeight);
      const newBMR = calculateBMR(currentWeight, currentHeight, currentAge, currentGender);
  
      const newCalorieNeeds = Math.round(
        newBMR * (newBMI < 18.5 ? 1.2 : newBMI < 25 ? 1.5 : 1.8)
      );
  
      const updatedData = {
        name,
        mail,
        password,
        age: parseInt(age || userData.age, 10),
        height: parseFloat(currentHeight),
        gender: gender || userData.gender,
        mealPreference,
        profileImage,
        bmi: parseFloat(newBMI),
        bmr: parseFloat(newBMR),
        calorieNeeds: newCalorieNeeds,
      };
  
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, updatedData);
  
      Alert.alert("Succès", "Profil mis à jour avec succès !");
      setLastHeight((prev) => [...prev, currentHeight]); // Ajouter la nouvelle taille dans lastHeight
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de la mise à jour.");
    }
  };
  
  

  const toggleMealPreference = (meal) => {
    setMealPreference((prev) =>
      prev.includes(meal)
        ? prev.filter((item) => item !== meal)
        : [...prev, meal]
    );
  };

  const handleSaveMealPreferences = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("Erreur", "Aucun utilisateur connecté.");
      return;
    }

    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);

    try {
      await update(userRef, { mealPreference });
      Alert.alert("Succès", "Les préférences de repas ont été mises à jour !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      Alert.alert("Erreur", "Impossible de mettre à jour les préférences.");
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Access denied",
        "Please enable photo permissions in your settings"
      );
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
    return (weightInKg / heightInMeters ** 2).toFixed(2);
  };

  const calculateBMR = (weight, height, age, gender) => {
    if (!weight || !height || !age || !gender) return null;

    if (gender === "Male") {
      return (88.362 + 13.397 * weight + 4.799 * height - 5.677 * age).toFixed(
        2
      );
    } else if (gender === "Female") {
      return (447.593 + 9.247 * weight + 3.098 * height - 4.33 * age).toFixed(
        2
      );
    }

    return null;
  };
  const calculateCalorie = () => {
    const bmrCalculated = calculateBMR(weight, height, age, gender);
    setBmr(bmrCalculated);

    const bmiCalculated = calculateBMI(height, weight);
    setBmi(bmiCalculated);

    const cn = Math.round(
      bmrCalculated *
        (bmiCalculated < 18.5 ? 1.2 : bmiCalculated < 25 ? 1.5 : 1.8)
    );
    setCalorieNeeds(cn);
  };
  const onHeigtChanged = (val) => {
    setHeight(val);
    calculateCalorie();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: profileImage }} style={styles.avatar} />
      </TouchableOpacity>

      {isEditing ? (
        <>
          <Text style={styles.changePhotoText}>
            Tap to change profile picture
          </Text>
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

          <View style={styles.optionsContainer}>
            {mealOptions.map((meal) => (
              <TouchableOpacity
                key={meal}
                style={[
                  styles.optionButton,
                  mealPreference.includes(meal) && styles.selectedOption,
                ]}
                onPress={() => toggleMealPreference(meal)}
              >
                <Text style={styles.optionText}>{meal}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
          >
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
          <Text style={styles.infoText}>Taille : {lastHeight.length > 0 ? lastHeight[lastHeight.length - 1] : "No data"} cm</Text>
          <Text style={styles.infoText}>Weight: {userData.weight} kg</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
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
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FA", 
  },
  avatar: {
    width: 120, 
    height: 120,
    borderRadius: 60, 
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 3, 
    borderColor: "##E5E0FF", 
  },
  changePhotoText: {
    textAlign: "center",
    color: "#6A4FD8",
    fontSize: 14,
    marginBottom: 25,
  },
  title: {
    fontSize: 24, 
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15, 
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#E0E0E0", 
    borderWidth: 1,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, 
  },
  saveButton: {
    backgroundColor: "#6A4FD8",
    paddingVertical: 15, 
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#6A4FD8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: "#FF6A6A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#FF6A6A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  cancelButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  editButton: {
    backgroundColor: "#E5E0FF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
  },
  logoutButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 8,
    color: "#555",
    textAlign: "left", 
  },
  mealPreferencesContainer: {
    marginVertical: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: "#6A4FD8",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#6A4FD8",
    borderColor: "#E5E0FF",
  },
  optionText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
