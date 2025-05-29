import React, { useState } from 'react';
import { View, Switch, StyleSheet } from 'react-native';

const App = () => {
  const [lampu, setLampu] = useState(false);

  return (
    <View style={styles.container}>
      <Switch value={lampu} onValueChange={() => setLampu(!lampu)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                     
    justifyContent: 'center',   
    alignItems: 'center',       
    backgroundColor: '#fff',
  },
});

export default App;
