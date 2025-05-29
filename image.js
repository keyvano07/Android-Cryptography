import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Image } from 'react-native'


const App = () => {
        return (
                <View style={{ flex: 1, backgroundColor: "white" }}>
                        <StatusBar barStyle={"dark-content"} backgroundColor={"black"} />
                        <View style={{
                                backgroundColor: "#0fd1aa",
                                paddingTop: 50,
                                paddingBottom: 50,
                                paddingLeft: 50,
                                paddingRight: 50
                        }}>
                                <Text style={{
                                        color: "#ffff",
                                        fontWeight: "bold",
                                        fontSize: 20,
                                        textAlign: 'center',
                                        elevation: 3,
                                }}>
                                        Aplikasi Cryptography
                                </Text>
                        </View>
                        <View style={{
                                alignItems: "center",
                                justifyContent:"center"
                          }}>
                                {/* <Image source={require('./src/images/lock.png')} style={{ 
                                        width: 150,
                                        height: 150,
                                        borderBottomRightRadius: 20
                                        
                                        }} /> */}

                                <Image source={{ uri: 'https://img.freepik.com/free-vector/illustration-cloud-security-icon_53876-6325.jpg?semt=ais_hybrid&w=740'}}
                                        style={{ 
                                                width: 200,
                                                height: 200,
                                                borderRadius: 250/2,
                                                borderWidth: 3,
                                                borderColor: "#0fd1aa"
                                         }}
                                        
                                />

                        </View>
                </View>




        );
}

export default App;