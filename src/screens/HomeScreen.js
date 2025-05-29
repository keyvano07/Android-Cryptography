import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl,
    StyleSheet,
    TextInput,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();

    const cryptoData = {
        Ciphers: [
            {
                jenis: 'Caesar Cipher',
                deskripsi: 'Caesar Cipher (Rot1-25) adalah metode kriptografi klasik yang menggeser tiap huruf dalam alfabet sesuai nilai kunci tertentu.',
                image: require('../images/julius-caesar2.jpg'),
                route: 'CaesarCipher',
            },
            {
                jenis: 'Vigenère Cipher',
                deskripsi: 'Vigenère Cipher adalah metode kriptografi yang menggunakan deretan kunci untuk enkripsi.',
                image: require('../images/giovan-bellaso.jpg'),
                route: 'VigenereCipher'
            },
            {
                jenis: 'RSA',
                deskripsi: 'Vigenère Cipher adalah metode kriptografi yang menggunakan deretan kunci untuk enkripsi.',
                image: require('../images/RSA.png'),
                route: 'RSA'
            },
        ],
        Hashes: [
            {
                jenis: 'MD5 Hash',
                deskripsi: 'MD5 adalah fungsi hash kriptografis yang menghasilkan nilai hash 128-bit.',
                image: require('../images/md5.png'),
                route: 'MD5Hash',
            },
            {
                jenis: 'SHA-256',
                deskripsi: 'SHA-256 adalah fungsi hash kriptografis yang menghasilkan nilai hash 256-bit.',
                image: require('../images/sha256.png'),
                route: 'SHA-256',
            },
        ],
        Encoding: [
            {
                jenis: 'Base64',
                deskripsi: 'Base64 adalah skema encoding yang mengonversi data biner menjadi teks ASCII.',
                image: require('../images/base64.png'),
                route: 'Base64Encoding',
            },
            {
                jenis: 'URL Encoding',
                deskripsi: 'URL encoding mengonversi karakter khusus menjadi format yang aman untuk URL.',
                image: require('../images/url-encoder-icon.png'),
                route: 'URLEncoding',
            },
        ],
        Tools: [
            {
                jenis: 'Text Analyzer',
                deskripsi: 'Alat untuk menganalisis teks, menghitung frekuensi karakter, dan statistik lainnya.',
                image: require('../images/textanalyzer.png'),
                route: 'TextAnalyzer',
            },
            {
                jenis: 'Random Generator',
                deskripsi: 'Generator untuk membuat kunci acak, password, dan data kriptografi lainnya.',
                image: require('../images/password-generator-3.webp'),
                route: 'RandomGenerator',
            },
            {
                jenis: 'Wifi Tracker',
                deskripsi: 'Wifi Tracker untuk membuat melacak wifi sekitar .',
                image: require('../images/wifitracket.png'),
                route: 'WifiTracker',
            },
        ],
    };

    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('Ciphers');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const tabs = ['Ciphers', 'Hashes', 'Encoding', 'Tools'];

    const allData = useMemo(() => {
        const combined = [];
        Object.keys(cryptoData).forEach(category => {
            cryptoData[category].forEach(item => {
                combined.push({
                    ...item,
                    category: category
                });
            });
        });
        return combined;
    }, []);

    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) {
            return cryptoData[activeTab] || [];
        }

        const query = searchQuery.toLowerCase();

        // Jika sedang mencari, tampilkan dari semua kategori
        if (isSearchVisible && searchQuery.trim()) {
            return allData.filter(item =>
                item.jenis.toLowerCase().includes(query) ||
                item.deskripsi.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
        }

        // Jika tidak mencari, filter hanya dari tab aktif
        return (cryptoData[activeTab] || []).filter(item =>
            item.jenis.toLowerCase().includes(query) ||
            item.deskripsi.toLowerCase().includes(query)
        );
    }, [searchQuery, activeTab, allData, isSearchVisible]);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleSearch = () => {
        setIsSearchVisible(true);
    };

    const closeSearch = () => {
        setIsSearchVisible(false);
        setSearchQuery('');
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate(item.route)}
        >
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.jenis}</Text>
                    {item.category && isSearchVisible && (
                        <Text style={styles.categoryBadge}>{item.category}</Text>
                    )}
                </View>
                <Text style={styles.cardDesc}>{item.deskripsi}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderSearchResults = () => {
        if (!searchQuery.trim()) {
            return (
                <View style={styles.emptySearch}>
                    <Icon name="search-outline" size={48} color="#666" />
                    <Text style={styles.emptySearchText}>Mulai mengetik untuk mencari...</Text>
                </View>
            );
        }

        if (filteredData.length === 0) {
            return (
                <View style={styles.emptySearch}>
                    <Icon name="search-outline" size={48} color="#666" />
                    <Text style={styles.emptySearchText}>Tidak ada hasil ditemukan</Text>
                    <Text style={styles.emptySearchSubtext}>Coba kata kunci lain</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item, index) => `search-${index}`}
                contentContainerStyle={styles.listContent}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#0fd1aa" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cryptography</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={handleSearch}>
                        <Icon name="search-outline" size={24} color="#0fd1aa" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.moreIcon}>
                        <Icon name="ellipsis-vertical-outline" size={24} color="#0fd1aa" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Modal */}
            <Modal
                visible={isSearchVisible}
                animationType="slide"
                onRequestClose={closeSearch}
            >
                <SafeAreaView style={styles.searchContainer}>
                    <View style={styles.searchHeader}>
                        <TouchableOpacity onPress={closeSearch} style={styles.backButton}>
                            <Icon name="arrow-back" size={24} color="#0fd1aa" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Cari cipher, hash, encoding, atau tools..."
                            placeholderTextColor="#666"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoFocus={true}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                                <Icon name="close-circle" size={20} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.searchContent}>
                        {renderSearchResults()}
                    </View>
                </SafeAreaView>
            </Modal>

            {/* Tabs - Hide when searching */}
            {!isSearchVisible && (
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
            )}

            {/* Content */}
            {!isSearchVisible && (
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${activeTab}-${index}`}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#0fd1aa"
                        />
                    }
                    contentContainerStyle={styles.listContent}
                />
            )}
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
    searchContainer: {
        flex: 1,
        backgroundColor: '#101010',
    },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#0fd1aa33',
    },
    backButton: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#1b1b1b',
        borderRadius: 20,
        paddingHorizontal: 16,
        color: '#fff',
        fontSize: 16,
    },
    clearButton: {
        marginLeft: 8,
    },
    searchContent: {
        flex: 1,
    },
    emptySearch: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptySearchText: {
        color: '#666',
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
    emptySearchSubtext: {
        color: '#444',
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
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
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 16,
        color: '#0fd1aa',
        fontWeight: 'bold',
        flex: 1,
    },
    categoryBadge: {
        backgroundColor: '#0fd1aa22',
        color: '#0fd1aa',
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        overflow: 'hidden',
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