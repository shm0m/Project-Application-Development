import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Keyboard } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { calculateGoalWeight } from './tools';

export default function Graph() {
  const [weightHistory, setWeightHistory] = useState([0]);
  const [dates, setDates] = useState(['']);
  const [goal, setGoal] = useState(0);
  const [bmr, setBmr] = useState(0);
  const [bmi, setBmi] = useState(0);
  const [newWeight, setNewWeight] = useState('');
  const [calorieNeeds, setCalorieNeeds] = useState(0);
  const [userData, setUserData] = useState(null);
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const snapshot = await get(ref(db, `users/${user.uid}`));
          if (snapshot.exists()) {
            const usr = snapshot.val();
            setUserData(usr);

            // Validation et traitement des données utilisateur
            const weights = (usr.weightHistory || []).map((weight) => parseFloat(weight) || 0);
            const weightDates = usr.dates || [new Date().toLocaleDateString('en-UK')];
            const goalWeight = parseFloat(usr.goal) || calculateGoalWeight(usr.height);

            setWeightHistory(weights);
            setDates(weightDates);
            setGoal(goalWeight);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const addWeight = async () => {
    if (!newWeight || isNaN(newWeight)) {
      alert('Enter a valid weight');
      return;
    }

    Keyboard.dismiss();

    const user = auth.currentUser;
    if (user) {
      const today = new Date().toLocaleDateString('en-UK');
      const updatedHistory = [...weightHistory, parseFloat(newWeight)];
      const updatedDates = [...dates, today];

      setWeightHistory(updatedHistory);
      setDates(updatedDates);

      const bmrCalculated = calculateBMR(newWeight, userData.height, userData.age, userData.gender);
      setBmr(bmrCalculated);

      const bmiCalculated = calculateBMI(userData.height, newWeight);
      setBmi(bmiCalculated);

      const cn = Math.round(bmrCalculated * (bmiCalculated < 18.5 ? 1.2 : bmiCalculated < 25 ? 1.5 : 1.8));
      setCalorieNeeds(cn);

      setNewWeight('');

      try {
        await update(ref(db, `users/${user.uid}`), {
          weightHistory: updatedHistory,
          dates: updatedDates,
          weight: newWeight,
          bmr: bmrCalculated,
          bmi: bmiCalculated,
          calorieNeeds: cn,
        });
        console.log('Weight successfully added to Firebase.');
      } catch (error) {
        console.error('Error updating weight in Firebase:', error);
      }
    }
  };

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

  const sanitizedWeightHistory = (weightHistory || []).filter(
    (value) => !isNaN(value) && value !== null && value !== undefined
  );
  const sanitizedGoal = !isNaN(goal) && goal !== null && goal !== undefined ? goal : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your weight progression</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your weight (kg)"
        keyboardType="numeric"
        value={newWeight}
        onChangeText={(text) => setNewWeight(text)}
      />
      <TouchableOpacity style={styles.addButton} onPress={addWeight}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      {sanitizedWeightHistory.length > 0 && dates.length > 0 ? (
        <LineChart
          data={{
            labels: dates,
            datasets: [
              {
                data: sanitizedWeightHistory,
                color: () => `rgba(134, 65, 244, 1)`,
                strokeWidth: 2,
              },
              {
                data: Array(sanitizedWeightHistory.length).fill(sanitizedGoal),
                color: () => `rgba(255, 0, 0, 0.5)`,
                strokeWidth: 1,
                withDots: false,
              },
            ],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisSuffix=" kg"
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f7f7f7',
            backgroundGradientTo: '#e4e4e4',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
        />
      ) : (
        <Text>No data to display yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
  },
  addButton: {
    backgroundColor: '#8543f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
