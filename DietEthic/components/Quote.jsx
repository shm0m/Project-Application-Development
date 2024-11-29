import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import quotes from '../assets/quotes.json';

const Quote = () => {
  const [randomQuote, setRandomQuote] = useState({});

  // Fonction pour sélectionner une citation aléatoire
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.quotes.length);
    return quotes.quotes[randomIndex];
  };

  // Charger une citation aléatoire au montage du composant
  useEffect(() => {
    const quote = getRandomQuote();
    setRandomQuote(quote);
  }, []);

  return (
    <View style={styles.quoteContainer}>
      {randomQuote && (
        <>
          <Text style={styles.quoteText}>"{randomQuote.quote}"</Text>
          <Text style={styles.quoteAuthor}>- {randomQuote.author}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  quoteContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 5,
  },
  quoteAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Quote;
