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
        Alert,
        FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const App = () => {
        const crypto = ['Caesar Cipher', 'Vignare Cipher', 'Atbash Cipher', 'ROT 13', 'Rail Fence', 'Keyword', 'Beaufort'];

        const DaftarCrypto = [
                {
                        "jenis": "Caesar Cipher",
                        "deskripsi": "Caesar Cipher (Rot1–25) adalah metode kriptografi klasik yang menggeser tiap huruf dalam alfabet sesuai nilai kunci tertentu.",
                        "image": require('./src/images/julius-caesar2.jpg')
                },
                {
                        "jenis": "Vigenere Cipher",
                        "deskripsi": "Vigenere adalah teknik kriptografi yang menggunakan kata kunci untuk melakukan enkripsi dengan sistem pergeseran huruf.",
                        "image": "vigenere.png"
                },
                {
                        "jenis": "Atbash Cipher",
                        "deskripsi": "Atbash adalah cipher sederhana yang membalik alfabet, misal A menjadi Z, B menjadi Y, dan seterusnya.",
                        "image": "atbash.png"
                },
                {
                        "jenis": "ROT 13",
                        "deskripsi": "Rot13 merupakan versi Caesar dengan pergeseran tetap 13 huruf. Enkripsi dan dekripsi menggunakan metode yang sama.",
                        "image": "rot13.png"
                },
                {
                        "jenis": "Rail Fence",
                        "deskripsi": "Rail Fence adalah teknik transposisi di mana huruf-huruf dari pesan ditulis dalam pola zig-zag.",
                        "image": "railfence.png"
                },
                {
                        "jenis": "Keyword Cipher",
                        "deskripsi": "Cipher ini menggunakan kata kunci unik untuk menggantikan huruf alfabet secara manual.",
                        "image": "keyword.png"
                },
                {
                        "jenis": "Beaufort Cipher",
                        "deskripsi": "Cipher ini mirip Vigenere, tetapi menggunakan operasi berbeda pada tabel Vigenere.",
                        "image": "beaufort.png"
                },
                {
                        "jenis": "Beaufort Cipher",
                        "deskripsi": "Cipher ini mirip Vigenere, tetapi menggunakan operasi berbeda pada tabel Vigenere.",
                        "image": "beaufort.png"
                }
        ]
        return (

                <View style={{ flex: 1, backgroundColor: "white" }}>
                        <View>
                                <StatusBar backgroundColor={"black"} barStyle={"dark-content"} />
                        </View>

                        <FlatList
                                data={DaftarCrypto}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                        <TouchableOpacity>
                                                <View
                                                        style={{
                                                                flexDirection: "row",
                                                                backgroundColor: "#0fd1aa", // background utama
                                                                marginHorizontal: 16,
                                                                marginTop: 16,
                                                                padding: 16,
                                                                borderRadius: 12,
                                                                elevation: 4,
                                                                alignItems: "center"
                                                        }}
                                                >
                                                        <View style={{
                                                                width: 70,
                                                                height: 70,
                                                                borderRadius: 12,
                                                                backgroundColor: "#0fd1aa",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                overflow: "hidden"
                                                        }}>
                                                                <Image
                                                                        source={item.image}
                                                                        style={{ width: 70, height: 70 }}
                                                                        resizeMode="cover"
                                                                />
                                                        </View>

                                                        <View style={{ flex: 1, marginLeft: 16, flexShrink: 1 }}>
                                                                <Text style={{
                                                                        fontSize: 16,
                                                                        fontWeight: "bold",
                                                                        color: "#ffffff"
                                                                }}>{item.jenis}</Text>
                                                                <Text numberOfLines={3} ellipsizeMode='tail' style={{
                                                                        fontSize: 13,
                                                                        color: "#e8fdfa",
                                                                        marginTop: 4,
                                                                        lineHeight: 18
                                                                }}>{item.deskripsi}</Text>
                                                        </View>

                                                        <TouchableOpacity>
                                                                <Icon name="star-outline" size={24} color="#ffffff" style={{ marginLeft: 12 }} />
                                                        </TouchableOpacity>
                                                </View>
                                        </TouchableOpacity>
                                )}
                        />

                </View>
        );
}

export default App;

// style={{marginVertical: 20,marginTop: 10}}