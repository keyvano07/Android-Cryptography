import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import CaesarCipher from './src/screens/CaesarCipher';
import MD5Hash from './src/screens/MD5Hash';
import VigenereCipher from './src/screens/VigenereCipher';
import Base64Encoding from './src/screens/Base64Encoding';
import SHA256 from './src/screens/SHA256Hash';
import URLEncoding from './src/screens/URLEncoding';
import TextAnalyzer from './src/screens/TextAnalyzer';
import RandomGenerator from './src/screens/RandomGenerator';
import WifiTracker from './src/screens/WifiTracker';
import RSA from './src/screens/RSA';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CaesarCipher"
          component={CaesarCipher}
          options={screenOptions}
        />
        <Stack.Screen
          name="MD5Hash"
          component={MD5Hash}
          options={screenOptions}
        />
        <Stack.Screen
          name="VigenereCipher"
          component={VigenereCipher}
          options={screenOptions}
        />
        <Stack.Screen
          name="Base64Encoding"
          component={Base64Encoding}
          options={screenOptions}
        />
        <Stack.Screen
          name="SHA-256"
          component={SHA256}
          options={screenOptions}
        />
        <Stack.Screen
          name="URLEncoding"
          component={URLEncoding}
          options={screenOptions}
        />
        <Stack.Screen
          name="TextAnalyzer"
          component={TextAnalyzer}
          options={screenOptions}
        />
        <Stack.Screen
          name="RandomGenerator"
          component={RandomGenerator}
          options={screenOptions}
        />
        <Stack.Screen
          name="WifiTracker"
          component={WifiTracker}
          options={screenOptions}
        />
        <Stack.Screen
          name="RSA"
          component={RSA}
          options={screenOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const screenOptions = {
  title: '',
  headerStyle: {
    backgroundColor: '#101010',
  },
  headerShadowVisible: true,
  headerTintColor: '#0fd1aa',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

export default App;