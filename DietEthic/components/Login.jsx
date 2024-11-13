import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default Login = () => {
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.description}>Connectez-vous pour accéder à votre compte.</Text>
            <Text style={styles.button}>Se connecter</Text>
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        color: '#fff',
    },
});

