import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const DaftarCrypto = [
    {
      jenis: 'Caesar Cipher',
      deskripsi: 'Caesar Cipher (Rot1-25) adalah metode kriptografi klasik yang menggeser tiap huruf dalam alfabet sesuai nilai kunci tertentu.',
      image: require('../images/julius-caesar2.jpg'),
      route: 'CaesarCipher',
    },
    {
      jenis: 'Vignare',
      deskripsi: 'Vigenère Cipher adalah metode kriptografi yang menggunakan deretan kunci untuk enkripsi.',
      image: require('../images/giovan-bellaso.jpg'),
      route: 'Vignare',
    },
  ];

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Ciphers');
  const tabs = ['Ciphers', 'Hashes', 'Encoding', 'Tools'];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate(item.route)}
    >
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.jenis}</Text>
        <Text style={styles.cardDesc}>{item.deskripsi}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0fd1aa" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cryptography</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Icon name="search-outline" size={24} color="#0fd1aa" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreIcon}>
            <Icon name="ellipsis-vertical-outline" size={24} color="#0fd1aa" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabItem, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <FlatList
        data={DaftarCrypto}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0fd1aa"
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#0fd1aa33',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0fd1aa',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  moreIcon: {
    marginLeft: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#0f0f0f',
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tabText: {
    color: '#999',
    fontSize: 14,
  },
  tabActive: {
    backgroundColor: '#0fd1aa33',
  },
  tabTextActive: {
    color: '#0fd1aa',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: '#0fd1aa',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#ccc',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default HomeScreen;