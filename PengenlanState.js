import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';

let saldo = 100000
const App = () => {
        function countdiskon() {
                saldo = saldo - 100
                Alert.alert('Woe ajg saldo mu segini ' + saldo)
        }

        return (
                <View>
                        <Text>{saldo}</Text>
                        <TouchableOpacity onPress={() => countdiskon()}>
                                <Text>TEKAN INI UNTUK DISKON JING</Text>
                        </TouchableOpacity>
                </View>
        );
}

export default App;