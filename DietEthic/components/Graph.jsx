import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getDatabase, ref, get, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { calculateGoalWeight } from './tools';
import Quote from './Quote';
import { Keyboard } from 'react-native';

export default function Graph() {
  const [weightHistory, setWeightHistory] = useState([0]);
  const [dates, setDates] = useState(['']);
  const [goal, setGoal] = useState(0);
  const [newWeight, setNewWeight] = useState('');

  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const snapshot = await get(ref(db, `users/${user.uid}`));
          if (snapshot.exists()) {
            const userData = snapshot.val();

            const weights = (userData.weightHistory || []).map((weight) => parseFloat(weight) || 0);
            const weightDates = userData.dates || [new Date().toLocaleDateString('fr-FR')];
            const goalWeight = parseFloat(userData.goal) || calculateGoalWeight(userData.height);

            setWeightHistory(weights);
            setDates(weightDates);
            setGoal(goalWeight);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur :', error);
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
      setNewWeight('');

      try {
        await update(ref(db, `users/${user.uid}`), {
          weightHistory: updatedHistory,
          dates: updatedDates,
        });
        console.log('Poids ajouté avec succès dans Firebase.');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du poids dans Firebase :', error);
      }
    }
  };

  const sanitizedWeightHistory = weightHistory.filter((value) => !isNaN(value) && value !== null && value !== undefined);
  const sanitizedGoal = !isNaN(goal) && goal !== null && goal !== undefined ? goal : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your weight progression</Text>

      {/* weight input*/}
      <TextInput
        style={styles.input}
        placeholder="Entrez votre poids (kg)"
        keyboardType="numeric"
        value={newWeight}
        onChangeText={(text) => setNewWeight(text)}
      />
      <Button title="Ajouter" onPress={addWeight} />

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
        <Text>Pas encore de données à afficher.</Text>
      )}
      {/* Citation inspirante */}
    <Quote />
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
});
