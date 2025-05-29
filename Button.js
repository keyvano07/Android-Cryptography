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
        Button,
        Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import Icon from 'react-native-vector-icons/Ionicons';

const crypto = ['Caesar Cipher', 'Vignare Cipher', 'Atbash Cipher', 'ROT 13'];
const App = () => {
        return (
               <View>
                <Button  title='Login' color={'#0fd1aa'} onPress={() => Alert.alert('Hello')} style/>
               </View> 
        );
}

export default App;

// style={{marginVertical: 20,marginTop: 10}}