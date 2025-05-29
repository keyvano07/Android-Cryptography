import React, { useState } from 'react';
import {
        View,
        Text,
        StatusBar,
        TextInput,
        TouchableOpacity,
        Image,
        ScrollView,
        StyleSheet,
        KeyboardAvoidingView,
        Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import Icon from 'react-native-vector-icons/Ionicons';

const App = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [secureText, setSecureText] = useState(true);

        return (
                <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={{ flex: 1 }}>
                        <ScrollView style={{ backgroundColor: '#f2f2f2' }}>
                                <View style={styles.container}>
                                        <StatusBar backgroundColor={'white'} barStyle="dark-content" />

                                        <Image
                                                source={{
                                                        uri: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png',
                                                }}
                                                style={styles.foto}
                                        />

                                        <Text style={styles.title}>Login</Text>
                                        <Text style={styles.subtitle}>Silahkan Masukkan Email dan Password</Text>

                                        <View style={styles.card}>
                                                <TextInput
                                                        value={email}
                                                        onChangeText={text => setEmail(text)}
                                                        placeholder="Masukkan Email"
                                                        style={styles.input}
                                                        keyboardType="email-address"
                                                />

                                                <View style={styles.passwordWrapper}>
                                                        <TextInput
                                                                value={password}
                                                                secureTextEntry={secureText}
                                                                onChangeText={text => setPassword(text)}
                                                                placeholder="Masukkan Password"
                                                                style={[styles.input, { flex: 1, marginTop: 0 }]}
                                                        />
                                                        <TouchableOpacity
                                                                onPress={() => setSecureText(!secureText)}
                                                                style={styles.eyeIcon}>
                                                                <Icon
                                                                        name={secureText ? 'eye-off' : 'eye'}
                                                                        size={20}
                                                                        color="#888"
                                                                />
                                                        </TouchableOpacity>
                                                </View>

                                                <TouchableOpacity style={{ alignSelf: 'flex-end', marginRight: 20 }}>
                                                        <Text style={styles.forgot}>Lupa Password?</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity>
                                                        <LinearGradient
                                                                colors={['#0fd1aa', '#0cb69b']}
                                                                style={styles.button}>
                                                                <Text style={styles.buttonText}>Login</Text>
                                                        </LinearGradient>
                                                </TouchableOpacity>
                                        </View>
                                </View>
                        </ScrollView>
                </KeyboardAvoidingView>
        );
};

const styles = StyleSheet.create({
        container: {
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 30,
        },
        foto: {
                width: 160,
                height: 160,
                borderRadius: 80,
                borderWidth: 5.5,
                borderColor: '#0fd1aa',
                marginTop: 10,
        },
        title: {
                textAlign: 'center',
                fontSize: 32,
                fontWeight: 'bold',
                marginTop: 15,
                color: '#333',
                textShadowColor: 'rgba(0,0,0,0.2)',
                textShadowOffset: { width: 1, height: 2 },
                textShadowRadius: 2,
        },
        subtitle: {
                textAlign: 'center',
                fontSize: 14,
                color: '#555',
                marginBottom: 15,
        },
        card: {
                backgroundColor: 'white',
                marginTop: 10,
                borderRadius: 15,
                paddingVertical: 20,
                paddingHorizontal: 15,
                width: '90%',
                elevation: 5,
        },
        input: {
                backgroundColor: '#f8f8f8',
                elevation: 1,
                borderRadius: 10,
                paddingLeft: 13,
                paddingVertical: 13,
                marginVertical: 10,
        },
        passwordWrapper: {
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 5,
        },
        eyeIcon: {
                position: 'absolute',
                right: 15,
                top: 15,
        },
        forgot: {
                color: '#0cb69b',
                fontSize: 13,
                fontWeight: '600',
                marginTop: 5,
        },
        button: {
                marginTop: 20,
                marginHorizontal: 5,
                paddingVertical: 14,
                borderRadius: 10,
                alignItems: 'center',
                elevation: 5,
        },
        buttonText: {
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
        },
});

export default App;
