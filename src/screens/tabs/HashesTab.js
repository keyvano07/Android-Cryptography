// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StatusBar,
//   TouchableOpacity,
//   Image,
//   FlatList,
//   RefreshControl,
//   StyleSheet,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';

// const HashesTab = () => {
//   const navigation = useNavigation();

//   const DaftarHash = [
//     {
//       id: '1',
//       jenis: 'MD5',
//       deskripsi: 'Hash function 128-bit yang banyak digunakan untuk checksum data',
//       image: require('../../images/hash-icon.jpg'), // Create this image
//       route: 'MD5Hash', // You'll need to create this screen
//     },
//     {
//       id: '2',
//       jenis: 'SHA-256',
//       deskripsi: 'Hash function 256-bit dari keluarga SHA-2 yang aman',
//       image: require('../../images/hash-icon.jpg'),
//       route: 'SHA256Hash', 
//     },
//     {
//       id: '3',
//       jenis: 'Bcrypt',
//       deskripsi: 'Fungsi hash untuk password dengan salt terintegrasi',
//       image: require('../../images/hash-icon.jpg'),
//       route: 'BcryptHash', 
//     },
//   ];

//   const [refreshing, setRefreshing] = useState(false);

//   const onRefresh = () => {
//     setRefreshing(true);
//     setTimeout(() => setRefreshing(false), 1000);
//   };

//   const renderItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.card} 
//       onPress={() => navigation.navigate(item.route)}
//     >
//       <Image source={item.image} style={styles.cardImage} />
//       <View style={styles.cardContent}>
//         <Text style={styles.cardTitle}>{item.jenis}</Text>
//         <Text style={styles.cardDesc}>{item.deskripsi}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor="#0fd1aa" barStyle="light-content" />
      
//       <FlatList
//         data={DaftarHash}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         refreshControl={
//           <RefreshControl 
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor="#0fd1aa"
//           />
//         }
//         contentContainerStyle={styles.listContent}
//       />
//     </SafeAreaView>
//   );
// };

// // Reuse the same styles from HomeScreen for consistency
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#101010',
//   },
//   card: {
//     backgroundColor: '#1b1b1b',
//     borderRadius: 12,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     padding: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   cardImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 8,
//     marginRight: 12,
//   },
//   cardContent: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 16,
//     color: '#0fd1aa',
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   cardDesc: {
//     fontSize: 13,
//     color: '#ccc',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
// });

// export default HashesTab;