import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Clipboard,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RandomGenerator = () => {
    const [generatorType, setGeneratorType] = useState('password');
    const [result, setResult] = useState('');
    const [history, setHistory] = useState([]);

    // Password settings
    const [passwordLength, setPasswordLength] = useState('12');
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = [
        { label: 'Angka (0-9)', value: 'numbers' },
        { label: 'Simbol (!@#$%)', value: 'symbols' },
        { label: 'Huruf Kecil (a-z)', value: 'lowercase' },
        { label: 'Huruf Besar (A-Z)', value: 'uppercase' },
    ];
    const [selectedCharacterTypes, setSelectedCharacterTypes] = useState({
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
    });

    // Number settings
    const [minNumber, setMinNumber] = useState('1');
    const [maxNumber, setMaxNumber] = useState('100');
    const [decimalPlaces, setDecimalPlaces] = useState('0');

    // Text settings
    const [wordCount, setWordCount] = useState('5');
    const [textType, setTextType] = useState('lorem');

    // Color settings
    const [colorFormat, setColorFormat] = useState('hex');

    const generatePassword = () => {
        const length = parseInt(passwordLength) || 12;
        let charset = '';

        if (selectedCharacterTypes.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (selectedCharacterTypes.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (selectedCharacterTypes.numbers) charset += '0123456789';
        if (selectedCharacterTypes.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (!charset) {
            Alert.alert('Error', 'Pilih minimal satu jenis karakter');
            return;
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        return password;
    };

    const generateNumber = () => {
        const min = parseFloat(minNumber) || 0;
        const max = parseFloat(maxNumber) || 100;
        const decimals = parseInt(decimalPlaces) || 0;

        if (min >= max) {
            Alert.alert('Error', 'Nilai minimum harus lebih kecil dari maksimum');
            return;
        }

        const randomNum = Math.random() * (max - min) + min;
        return decimals > 0 ? randomNum.toFixed(decimals) : Math.floor(randomNum).toString();
    };

    const generateText = () => {
        const count = parseInt(wordCount) || 5;

        if (textType === 'lorem') {
            const loremWords = [
                'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
                'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
                'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
                'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
                'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
                'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
                'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
                'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
            ];

            const selectedWords = [];
            for (let i = 0; i < count; i++) {
                selectedWords.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
            }
            return selectedWords.join(' ');
        } else {
            const randomWords = [
                'kucing', 'anjing', 'rumah', 'mobil', 'buku', 'komputer', 'meja', 'kursi',
                'pintu', 'jendela', 'bunga', 'pohon', 'matahari', 'bulan', 'bintang',
                'laut', 'gunung', 'sungai', 'danau', 'hutan', 'kota', 'desa', 'sekolah',
                'kantor', 'toko', 'pasar', 'makanan', 'minuman', 'musik', 'film'
            ];

            const selectedWords = [];
            for (let i = 0; i < count; i++) {
                selectedWords.push(randomWords[Math.floor(Math.random() * randomWords.length)]);
            }
            return selectedWords.join(' ');
        }
    };

    const generateColor = () => {
        const colors = [];
        for (let i = 0; i < 3; i++) {
            colors.push(Math.floor(Math.random() * 256));
        }
        const hex = '#' + colors.map(c => c.toString(16).padStart(2, '0')).join('');
        const rgb = `rgb(${colors.join(', ')})`;
        const hsl = rgbToHsl(colors[0], colors[1], colors[2]);

        switch (colorFormat) {
            case 'hex':
                return hex;
            case 'rgb':
                return rgb;
            case 'hsl':
                return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
            default:
                return hex;
        }
    };

    const rgbToHsl = (r, g, b) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    };

    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const generate = () => {
        let newResult;

        switch (generatorType) {
            case 'password':
                newResult = generatePassword();
                break;
            case 'number':
                newResult = generateNumber();
                break;  
            case 'text':
                newResult = generateText();
                break;
            case 'color':
                newResult = generateColor();
                break;
            case 'uuid':
                newResult = generateUUID();
                break;
            default:
                return;
        }

        if (newResult) {
            setResult(newResult);
            setHistory(prev => [newResult, ...prev.slice(0, 9)]);
        }
    };

    const copyResult = () => {
        if (result) {
            Clipboard.setString(result);
            Alert.alert('Berhasil Disalin', 'Hasil telah disalin ke clipboard');
        }
    };

    const clearHistory = () => {
        setHistory([]);
        setResult('');
    };

    const renderPasswordSettings = () => {
        if (generatorType !== 'password') return null;

        return (
            <View style={styles.settingsContainer}>
                <Text style={styles.settingsTitle}>Pengaturan Password</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Panjang Password:</Text>
                    <TextInput
                        style={styles.numberInput}
                        value={passwordLength}
                        onChangeText={setPasswordLength}
                        keyboardType="numeric"
                        placeholder="12"
                        placeholderTextColor="#666"
                    />
                </View>

                <View style={styles.characterTypeContainer}>
                    {selectedCharacterTypes && Object.keys(selectedCharacterTypes).map((type) => (
                        <View style={styles.switchItem} key={type}>
                            <Text style={styles.switchLabel}>
                                {type === 'numbers' ? 'Angka (0-9)' :
                                    type === 'symbols' ? 'Simbol (!@#$%)' :
                                        type === 'lowercase' ? 'Huruf Kecil (a-z)' :
                                            'Huruf Besar (A-Z)'}
                            </Text>
                            <Switch
                                value={selectedCharacterTypes[type]}
                                onValueChange={(value) => setSelectedCharacterTypes(prev => ({ ...prev, [type]: value }))}
                                trackColor={{ false: '#333', true: '#0fd1aa' }}
                                thumbColor={selectedCharacterTypes[type] ? '#fff' : '#666'}
                            />
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const renderNumberSettings = () => {
        if (generatorType !== 'number') return null;

        return (
            <View style={styles.settingsContainer}>
                <Text style={styles.settingsTitle}>Pengaturan Angka</Text>

                <View style={styles.inputRow}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Minimum:</Text>
                        <TextInput
                            style={styles.numberInput}
                            value={minNumber}
                            onChangeText={setMinNumber}
                            keyboardType="numeric"
                            placeholder="1"
                            placeholderTextColor="#666"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Maksimum:</Text>
                        <TextInput
                            style={styles.numberInput}
                            value={maxNumber}
                            onChangeText={setMaxNumber}
                            keyboardType="numeric"
                            placeholder="100"
                            placeholderTextColor="#666"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Jumlah Desimal:</Text>
                    <TextInput
                        style={styles.numberInput}
                        value={decimalPlaces}
                        onChangeText={setDecimalPlaces}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#666"
                    />
                </View>
            </View>
        );
    };

    const renderTextSettings = () => {
        if (generatorType !== 'text') return null;

        return (
            <View style={styles.settingsContainer}>
                <Text style={styles.settingsTitle}>Pengaturan Teks</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Jumlah Kata:</Text>
                    <TextInput
                        style={styles.numberInput}
                        value={wordCount}
                        onChangeText={setWordCount}
                        keyboardType="numeric"
                        placeholder="5"
                        placeholderTextColor="#666"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Tipe Teks:</Text>
                    <View style={styles.typeContainer}>
                        <TouchableOpacity
                            style={[styles.typeButton, textType === 'lorem' && styles.typeActive]}
                            onPress={() => setTextType('lorem')}
                        >
                            <Text style={[styles.typeText, textType === 'lorem' && styles.typeTextActive]}>Lorem Ipsum</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, textType === 'random' && styles.typeActive]}
                            onPress={() => setTextType('random')}
                        >
                            <Text style={[styles.typeText, textType === 'random' && styles.typeTextActive]}>Kata Acak</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const renderColorSettings = () => {
        if (generatorType !== 'color') return null;

        return (
            <View style={styles.settingsContainer}>
                <Text style={styles.settingsTitle}>Pengaturan Warna</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Format Warna:</Text>
                    <View style={styles.typeContainer}>
                        <TouchableOpacity
                            style={[styles.typeButton, colorFormat === 'hex' && styles.typeActive]}
                            onPress={() => setColorFormat('hex')}
                        >
                            <Text style={[styles.typeText, colorFormat === 'hex' && styles.typeTextActive]}>HEX</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, colorFormat === 'rgb' && styles.typeActive]}
                            onPress={() => setColorFormat('rgb')}
                        >
                            <Text style={[styles.typeText, colorFormat === 'rgb' && styles.typeTextActive]}>RGB</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeButton, colorFormat === 'hsl' && styles.typeActive]}
                            onPress={() => setColorFormat('hsl')}
                        >
                            <Text style={[styles.typeText, colorFormat === 'hsl' && styles.typeTextActive]}>HSL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Random Generator</Text>

                <View style={styles.typeContainer}>
                    {['password', 'number', 'text', 'color', 'uuid'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.generatorTypeButton, generatorType === type && styles.generatorTypeActive]}
                            onPress={() => setGeneratorType(type)}
                        >
                            <Text style={[styles.generatorTypeText, generatorType === type && styles.generatorTypeTextActive]}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {renderPasswordSettings()}
                {renderNumberSettings()}
                {renderTextSettings()}
                {renderColorSettings()}

                <TouchableOpacity style={styles.generateButton} onPress={generate}>
                    <Text style={styles.generateButtonText}>Generate</Text>
                </TouchableOpacity>

                {result && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultLabel}>Hasil:</Text>
                        <Text style={styles.resultText}>{result}</Text>
                        <TouchableOpacity style={styles.copyButton} onPress={copyResult}>
                            <Text style={styles.copyButtonText}>Salin</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {history.length > 0 && (
                    <View style={styles.historyContainer}>
                        <Text style={styles.historyTitle}>Riwayat:</Text>
                        {history.map((item, index) => (
                            <Text key={index} style={styles.historyItem}>{item}</Text>
                        ))}
                        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
                            <Text style={styles.clearButtonText}>Hapus Riwayat</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101010',
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        color: '#0fd1aa',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    typeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    generatorTypeButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#1b1b1b',
    },
    generatorTypeActive: {
        backgroundColor: '#0fd1aa',
    },
    generatorTypeText: {
        color: '#ccc',
        fontSize: 16,
    },
    generatorTypeTextActive: {
        color: '#101010',
    },
    settingsContainer: {
        backgroundColor: '#1b1b1b',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    settingsTitle: {
        fontSize: 18,
        color: '#0fd1aa',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        color: '#ccc',
        fontSize: 16,
        marginBottom: 5,
    },
    numberInput: {
        backgroundColor: '#0f0f0f',
        padding: 10,
        borderRadius: 8,
        color: '#fff',
    },
    characterTypeContainer: {
        flexDirection: 'column',
    },
    switchItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    switchLabel: {
        color: '#ccc',
        fontSize: 16,
    },
    generateButton: {
        backgroundColor: '#0fd1aa',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    generateButtonText: {
        color: '#101010',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultContainer: {
        backgroundColor: '#1b1b1b',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    resultLabel: {
        color: '#0fd1aa',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    resultText: {
        color: '#fff',
        fontSize: 16,
    },
    copyButton: {
        backgroundColor: '#0fd1aa',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    copyButtonText: {
        color: '#101010',
        fontSize: 16,
    },
    historyContainer: {
        backgroundColor: '#1b1b1b',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    historyTitle: {
        color: '#0fd1aa',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    historyItem: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 5,
    },
    clearButton: {
        backgroundColor: 'transparent',
        borderColor: '#0fd1aa',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#0fd1aa',
        fontSize: 16,
    },
    typeButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#1b1b1b',
        marginRight: 10,
    },
    typeActive: {
        backgroundColor: '#0fd1aa',
    },
    typeText: {
        color: '#ccc',
        fontSize: 16,
    },
    typeTextActive: {
        color: '#101010',
    },
});

export default RandomGenerator;