import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert, Image } from 'react-native';


const App = () => {
        function hello() {
                Alert.alert("Pilih Kategori Encrypt dan Decrypt")
        }


        return (
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <StatusBar backgroundColor={'black'} barStyle={'dark-content'} />

                        <TouchableOpacity style={{
                                backgroundColor: "#0fd1aa",
                                marginHorizontal: 50,
                                marginTop: 50,
                                justifyContent: "center",
                                alignItems: "center",
                                paddingTop: 12,
                                paddingBottom: 12,
                                borderRadius: 12,
                                elevation: 12
                        }}
                                onPressIn={() => hello()}
                        ><Text style={{
                                fontSize: 17,
                                fontWeight: "bold",
                                color: "white"
                        }}>Registrasi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPressIn={() => hello()} style={{ 
                                marginHorizontal: "auto",
                                marginVertical: "auto"
                                // justifyContent:"center",
                                // alignItems: "center"
                         }}>
                                <Image source={{ uri: 'https://img.freepik.com/free-vector/illustration-cloud-security-icon_53876-6325.jpg?semt=ais_hybrid&w=740'}}
                                        style={{ 
                                                width: 200,
                                                height: 200,
                                                borderRadius: 250/2,
                                                borderWidth: 3,
                                                borderColor: "#0fd1aa"
                                         }}></Image>

                                         <Text style={{ 
                                                fontSize: 20,
                                                fontWeight: "bold",
                                                color: "black",
                                                marginHorizontal: "auto",
                                                paddingTop: 12,
                                                elevation: 10

                                          }}>Aplikasi Cryptography</Text>
                        </TouchableOpacity>
                </View>
        );
}


export default App;