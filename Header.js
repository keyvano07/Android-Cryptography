import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native'


const App = () => {
        return (
                // HEADER 1
                < View style={{ backgroundColor: "" }} >
                        <Text style={{
                                fontSize: 30,
                                fontWeight: "bold",
                                marginVertical: 15,
                                marginHorizontal: 15
                                // textAlign: 'center',
                                // fontSize: 30,
                                // fontWeight: "bold",
                                // color: "green",
                                // // marginTop: 10,
                                // // marginBottom: 10,
                                // marginVertical: 30,
                                // marginHorizontal: 30,
                                // // marginLeft: 10,
                                // // marginRight: 10 
                                // letterSpacing: 2
                        }}>
                                Keyvano!
                        </Text>


                        {/* HEADER 2 */}
                        <View style={{
                                marginLeft: 30,
                                width: 350,
                                height: 150,
                                backgroundColor: "black",
                                borderRadius: 9,
                                // justifyContent: "center",
                                // alignItems: "center"
                        }}>
                                <Text style={{
                                        color: "white",
                                        fontSize: 20,
                                        fontWeight: "bold",
                                        marginVertical: 50,
                                        marginHorizontal: 15





                                }}>Selamat Datang di Aplikasi Cryptography</Text>
                        </View>
                </View>);
}

export default App;