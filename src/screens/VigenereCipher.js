import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Modal,
    ActivityIndicator,
    BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';

const VigenereCipher = () => {
    const [text, setText] = useState('');
    const [key, setKey] = useState('KEY');
    const [result, setResult] = useState('');
    const [mode, setMode] = useState('encrypt'); // 'encrypt' or 'decrypt'
    const [showVideo, setShowVideo] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Tutorial state
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const tutorialSteps = [
        {
            title: "Apa itu Vigenère Cipher?",
            content: "Vigenère Cipher adalah metode enkripsi polialfabetik yang dikembangkan oleh Blaise de Vigenère pada abad ke-16. Berbeda dengan Caesar Cipher yang menggunakan satu pergeseran tetap, Vigenère menggunakan kata kunci yang berulang untuk menciptakan pergeseran yang berbeda-beda."
        },
        {
            title: "Prinsip Kerja Vigenère",
            content: "Setiap huruf dalam plaintext dienkripsi menggunakan huruf yang berbeda dari kata kunci:\n• Kata kunci diulang sepanjang teks\n• Setiap huruf kunci menentukan pergeseran Caesar\n• Huruf A=0, B=1, C=2, dan seterusnya\n• Hasil lebih aman karena frekuensi huruf menjadi tersembunyi"
        },
        {
            title: "Proses Enkripsi",
            content: "Langkah enkripsi Vigenère:\n1. Tulis plaintext\n2. Ulangi kata kunci di bawahnya\n3. Untuk setiap pasangan huruf, gunakan tabel Vigenère\n4. Atau gunakan rumus: (Pi + Ki) mod 26\n\nContoh: HELLO + KEY = RIJVS"
        },
        {
            title: "Proses Dekripsi",
            content: "Langkah dekripsi Vigenère:\n1. Tulis ciphertext\n2. Ulangi kata kunci di bawahnya\n3. Gunakan tabel Vigenère secara terbalik\n4. Atau gunakan rumus: (Ci - Ki + 26) mod 26\n\nKunci yang sama digunakan untuk enkripsi dan dekripsi"
        },
        {
            title: "Keamanan & Kelemahan",
            content: "Kelebihan:\n• Lebih aman dari Caesar Cipher\n• Menyembunyikan pola frekuensi huruf\n• Sulit dipecahkan tanpa kata kunci\n\nKelemahan:\n• Dapat dipecahkan dengan analisis Kasiski\n• Rentan jika kata kunci pendek atau berulang\n• Tidak aman untuk standar modern"
        }
    ];

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (showTutorial) {
                setShowTutorial(false);
                return true;
            }
            return false;
        });

        return () => backHandler.remove();
    }, [showTutorial]);

    const copyToClipboard = (text, label = 'Text') => {
        Clipboard.setString(text);
        Alert.alert('Berhasil Disalin', `${label} telah disalin ke clipboard!`);
    };

    const toggleVideo = () => {
        setShowVideo(!showVideo);
    };

    // Function to process a single character with Vigenère cipher
    const processChar = (char, keyChar, isEncrypt = true) => {
        if (!/[a-zA-Z]/.test(char)) {
            return char; // Return non-alphabetic characters unchanged
        }

        const isUpperCase = char >= 'A' && char <= 'Z';
        const charBase = isUpperCase ? 65 : 97; // ASCII value of 'A' or 'a'
        const keyBase = keyChar >= 'A' && keyChar <= 'Z' ? 65 : 97;

        // Convert characters to 0-25 range
        const charIndex = char.charCodeAt(0) - charBase;
        const keyIndex = keyChar.toUpperCase().charCodeAt(0) - 65;

        let resultIndex;
        if (isEncrypt) {
            resultIndex = (charIndex + keyIndex) % 26;
        } else {
            resultIndex = (charIndex - keyIndex + 26) % 26;
        }

        return String.fromCharCode(resultIndex + charBase);
    };

    const vigenereCipher = (inputText, keyText, isEncrypt = true) => {
        if (!inputText.trim()) return '';
        if (!keyText.trim()) return inputText;

        // Remove non-alphabetic characters from key and convert to uppercase
        const cleanKey = keyText.replace(/[^a-zA-Z]/g, '').toUpperCase();
        if (cleanKey.length === 0) return inputText;

        let result = '';
        let keyIndex = 0;

        for (let i = 0; i < inputText.length; i++) {
            const char = inputText[i];

            if (/[a-zA-Z]/.test(char)) {
                const keyChar = cleanKey[keyIndex % cleanKey.length];
                result += processChar(char, keyChar, isEncrypt);
                keyIndex++;
            } else {
                result += char;
            }
        }

        return result;
    };

    const processText = async () => {
        if (!text.trim()) {
            Alert.alert('Kesalahan', 'Silakan masukkan teks untuk diproses');
            return;
        }

        if (!key.trim()) {
            Alert.alert('Kesalahan', 'Silakan masukkan kunci');
            return;
        }

        const cleanKey = key.replace(/[^a-zA-Z]/g, '');
        if (cleanKey.length === 0) {
            Alert.alert('Kesalahan', 'Kunci harus mengandung setidaknya satu huruf');
            return;
        }

        setIsProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const processed = vigenereCipher(text, key, mode === 'encrypt');
            setResult(processed);
            Alert.alert('Berhasil', `Teks berhasil di${mode === 'encrypt' ? 'enkripsi' : 'dekripsi'}!`);
        } catch (error) {
            Alert.alert('Kesalahan', 'Gagal memproses teks');
        } finally {
            setIsProcessing(false);
        }
    };

    const clearAll = () => {
        setText('');
        setResult('');
        setKey('KEY');
    };

    const swapInputOutput = () => {
        setText(result);
        setResult('');
        setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
    };

    // Generate Vigenère table for display
    const generateVigenereTable = () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const table = [];

        for (let i = 0; i < 26; i++) {
            const row = [];
            for (let j = 0; j < 26; j++) {
                row.push(alphabet[(i + j) % 26]);
            }
            table.push(row);
        }

        return table;
    };

    const vigenereTable = generateVigenereTable();

    const renderTutorial = () => {
        if (!showTutorial) return null;
        
        return (
            <Modal
                visible={showTutorial}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowTutorial(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.tutorialModal}>
                        <View style={styles.tutorialHeader}>
                            <Text style={styles.tutorialTitle}>
                                Tutorial Vigenère Cipher
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowTutorial(false)}
                                style={styles.closeButton}
                            >
                                <Icon name="close" size={24} color="#0fd1aa" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.tutorialContent}>
                            <View style={styles.stepIndicator}>
                                {tutorialSteps.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.stepDot,
                                            { backgroundColor: index === currentStep ? '#0fd1aa' : '#666' }
                                        ]}
                                    />
                                ))}
                            </View>

                            <Text style={styles.stepTitle}>{tutorialSteps[currentStep].title}</Text>
                            <Text style={styles.stepContent}>{tutorialSteps[currentStep].content}</Text>

                            <View style={styles.tutorialNavigation}>
                                <TouchableOpacity
                                    onPress={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                    disabled={currentStep === 0}
                                    style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
                                >
                                    <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
                                        Sebelumnya
                                    </Text>
                                </TouchableOpacity>

                                <Text style={styles.stepCounter}>
                                    {currentStep + 1} / {tutorialSteps.length}
                                </Text>

                                <TouchableOpacity
                                    onPress={() => setCurrentStep(Math.min(tutorialSteps.length - 1, currentStep + 1))}
                                    disabled={currentStep === tutorialSteps.length - 1}
                                    style={[styles.navButton, styles.nextButton, currentStep === tutorialSteps.length - 1 && styles.navButtonDisabled]}
                                >
                                    <Text style={[styles.navButtonText, currentStep === tutorialSteps.length - 1 && styles.navButtonTextDisabled]}>
                                        Selanjutnya
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Vigenère Cipher</Text>
                <Text style={styles.subtitle}>
                    Enkripsi polialfabetik dengan kata kunci berulang
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        setCurrentStep(0);
                        setShowTutorial(true);
                    }}
                    style={styles.helpButton}
                >
                    <Text style={styles.helpButtonText}>Tutorial</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent}>
                {/* Mode Selection */}
                <View style={styles.examplesContainer}>
                    <Text style={styles.examplesTitle}>Mode Operasi</Text>
                    <View style={styles.modeContainer}>
                        <TouchableOpacity
                            style={[styles.modeButton, mode === 'encrypt' && styles.modeActive]}
                            onPress={() => setMode('encrypt')}
                        >
                            <Text style={[styles.modeText, mode === 'encrypt' && styles.modeTextActive]}>
                                Enkripsi
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modeButton, mode === 'decrypt' && styles.modeActive]}
                            onPress={() => setMode('decrypt')}
                        >
                            <Text style={[styles.modeText, mode === 'decrypt' && styles.modeTextActive]}>
                                Dekripsi
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Key Input */}
                <View style={styles.examplesContainer}>
                    <Text style={styles.examplesTitle}>🗝️ Kata Kunci</Text>
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Masukkan Kata Kunci:</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Masukkan kunci (huruf saja)"
                            placeholderTextColor="#666"
                            value={key}
                            onChangeText={setKey}
                            autoCapitalize="characters"
                        />
                        <Text style={styles.infoText}>
                             Kunci aktif: {key.replace(/[^a-zA-Z]/g, '').toUpperCase() || 'Tidak ada'}
                        </Text>
                        <Text style={styles.infoText}>
                             Hanya huruf yang akan digunakan sebagai kunci
                        </Text>
                    </View>
                </View>

                {/* Text Input */}
                <View style={styles.examplesContainer}>
                    <Text style={styles.examplesTitle}>
                        {mode === 'encrypt' ? ' Teks Asli' : ' Teks Sandi'}
                    </Text>
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>
                            {mode === 'encrypt' ? 'Teks untuk dienkripsi:' : 'Teks untuk didekripsi:'}
                        </Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            placeholder={`Masukkan teks untuk di${mode === 'encrypt' ? 'enkripsi' : 'dekripsi'}...`}
                            placeholderTextColor="#666"
                            value={text}
                            onChangeText={setText}
                            multiline
                            numberOfLines={4}
                        />
                        <Text style={styles.infoText}>
                            💡 Rumus {mode === 'encrypt' ? 'enkripsi' : 'dekripsi'}: 
                            {mode === 'encrypt' ? ' (P + K) mod 26' : ' (C - K + 26) mod 26'}
                        </Text>
                    </View>

                    {/* Process Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.processButton, isProcessing && styles.disabledButton]}
                        onPress={processText}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color="#101010" />
                                <Text style={styles.buttonText}>  Memproses...</Text>
                            </View>
                        ) : (
                            <Text style={styles.buttonText}>
                                {mode === 'encrypt' ? 'Enkripsi Teks' : 'Dekripsi Teks'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Result */}
                {result && (
                    <View style={styles.examplesContainer}>
                        <Text style={styles.examplesTitle}>
                            {mode === 'encrypt' ? ' Hasil Enkripsi' : ' Hasil Dekripsi'}
                        </Text>
                        <View style={styles.resultContainer}>
                            <View style={styles.resultHeader}>
                                <Text style={styles.resultLabel}>
                                    {mode === 'encrypt' ? 'Teks Sandi:' : 'Teks Asli:'}
                                </Text>
                                <View style={styles.resultActions}>
                                    <TouchableOpacity onPress={swapInputOutput} style={styles.actionButton}>
                                        <Text style={styles.actionText}>Paste</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => copyToClipboard(result)} style={styles.actionButton}>
                                        <Text style={styles.actionText}>Copy</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.resultTextContainer}>
                                <Text style={styles.resultText} selectable>
                                    {result}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Key Pattern Example */}
                {text && key && (
                    <View style={styles.examplesContainer}>
                        <Text style={styles.examplesTitle}>🔍 Pola Kata Kunci</Text>
                        <View style={styles.patternContainer}>
                            <View style={styles.patternRow}>
                                <Text style={styles.patternLabel}>Teks:</Text>
                                <View style={styles.resultTextContainer}>
                                    <Text style={styles.patternText}>
                                        {text.substring(0, 20)}{text.length > 20 ? '...' : ''}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.patternRow}>
                                <Text style={styles.patternLabel}>Kunci:</Text>
                                <View style={styles.resultTextContainer}>
                                    <Text style={styles.patternText}>
                                        {(() => {
                                            const cleanKey = key.replace(/[^a-zA-Z]/g, '').toUpperCase();
                                            const displayText = text.substring(0, 20);
                                            let keyPattern = '';
                                            let keyIndex = 0;

                                            for (let i = 0; i < displayText.length; i++) {
                                                if (/[a-zA-Z]/.test(displayText[i])) {
                                                    keyPattern += cleanKey[keyIndex % cleanKey.length] || '?';
                                                    keyIndex++;
                                                } else {
                                                    keyPattern += ' ';
                                                }
                                            }

                                            return keyPattern + (text.length > 20 ? '...' : '');
                                        })()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.infoText}>
                             Kata kunci berulang sesuai panjang teks yang akan diproses
                        </Text>
                    </View>
                )}

                {/* Vigenère Table */}
                <View style={styles.examplesContainer}>
                    <Text style={styles.examplesTitle}> Tabel Vigenère</Text>
                    <Text style={styles.aboutText}>
                        Tabel referensi untuk enkripsi/dekripsi manual. Baris = huruf kunci, Kolom = huruf teks.
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.table}>
                            {/* Header row */}
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.tableHeader]}> </Text>
                                {vigenereTable[0].slice(0, 13).map((char, index) => (
                                    <Text key={index} style={[styles.tableCell, styles.tableHeader]}>
                                        {char}
                                    </Text>
                                ))}
                            </View>

                            {/* Table rows (first 8 rows) */}
                            {vigenereTable.slice(0, 8).map((row, rowIndex) => (
                                <View key={rowIndex} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, styles.tableHeader]}>
                                        {String.fromCharCode(65 + rowIndex)}
                                    </Text>
                                    {row.slice(0, 13).map((char, colIndex) => (
                                        <Text key={colIndex} style={styles.tableCell}>
                                            {char}
                                        </Text>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                    <Text style={styles.infoText}>
                         Hanya menampilkan sebagian tabel untuk kemudahan tampilan
                    </Text>
                </View>

                {/* Clear Button */}
                <TouchableOpacity
                    onPress={clearAll}
                    style={[styles.button, styles.clearButton]}
                >
                    <Text style={styles.clearButtonText}>Hapus Semua</Text>
                </TouchableOpacity>

                {/* About Section */}
                <View style={styles.aboutContainer}>
                    <Text style={styles.aboutTitle}>Tentang Vigenère Cipher</Text>
                    <Text style={styles.aboutText}>
                        Vigenère Cipher adalah metode enkripsi polialfabetik yang dikembangkan oleh Blaise de Vigenère 
                        pada abad ke-16. Algoritma ini menggunakan kata kunci yang berulang untuk mengenkripsi teks, 
                        memberikan keamanan yang lebih baik dibandingkan Caesar Cipher.
                    </Text>
                    <Text style={styles.aboutText}>
                        • <Text style={styles.bold}>Polialfabetik</Text>: Menggunakan multiple substitution alphabets
                    </Text>
                    <Text style={styles.aboutText}>
                        • <Text style={styles.bold}>Kata Kunci</Text>: Menentukan pola pergeseran yang berbeda-beda
                    </Text>
                    <Text style={styles.aboutText}>
                        • <Text style={styles.bold}>Keamanan</Text>: Menyembunyikan pola frekuensi huruf dalam teks
                    </Text>
                    <Text style={styles.aboutText}>
                        • <Text style={styles.bold}>Sejarah</Text>: Dikenal sebagai "le chiffre indéchiffrable" (sandi yang tidak dapat dipecahkan)
                    </Text>

                    <TouchableOpacity onPress={toggleVideo} style={styles.videoButton}>
                        <Text style={styles.videoButtonText}>
                            {showVideo ? 'Sembunyikan Video' : 'Tampilkan Video Penjelasan Vigenère'}
                        </Text>
                    </TouchableOpacity>

                    {showVideo && (
                        <View style={styles.videoContainer}>
                            <Text style={styles.videoTitle}>Tutorial Vigenère Cipher</Text>
                            <WebView
                                source={{ uri: 'https://www.youtube.com/embed/LaWp_Kq0cKs' }}
                                style={styles.videoPlayer}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                allowsFullscreenVideo={true}
                            />
                        </View>
                    )}

                    <View style={styles.securityNoteContainer}>
                        <Text style={styles.securityNoteTitle}> Catatan Keamanan</Text>
                        <Text style={styles.securityNoteText}>
                            • Vigenère dapat dipecahkan dengan analisis Kasiski dan analisis frekuensi
                        </Text>
                        <Text style={styles.securityNoteText}>
                            • Gunakan kata kunci yang panjang dan acak untuk keamanan maksimal
                        </Text>
                        <Text style={styles.securityNoteText}>
                            • Tidak cocok untuk aplikasi keamanan modern
                        </Text>
                        <Text style={styles.securityNoteText}>
                            • Tetap berguna untuk pembelajaran konsep kriptografi
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Tutorial Modal */}
            {renderTutorial()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101010',
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        fontSize: 28,
        color: '#0fd1aa',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 16,
    },
    helpButton: {
        backgroundColor: '#0fd1aa',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },
    helpButtonText: {
        color: '#101010',
        fontWeight: 'bold',
    },
    scrollContent: {
        flex: 1,
        padding: 20,
    },
    examplesContainer: {
        backgroundColor: '#1b1b1b',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#0fd1aa33',
        marginBottom: 20,
    },
    examplesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#0fd1aa',
    },
    modeContainer: {
        flexDirection: 'row',
        backgroundColor: '#0f0f0f',
        borderRadius: 12,
        padding: 4,
    },
    modeButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    modeActive: {
        backgroundColor: '#0fd1aa',
    },
    modeText: {
        color: '#999',
        fontWeight: 'bold',
    },
    modeTextActive: {
        color: '#101010',
    },
    inputSection: {
        marginBottom: 16,
    },
    label: {
        color: '#0fd1aa',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#0fd1aa33',
        backgroundColor: '#0f0f0f',
        padding: 15,
        borderRadius: 12,
        color: 'white',
        fontSize: 16,
        marginBottom: 8,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    infoText: {
        color: '#999',
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 4,
    },
    button: {
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 5,
    },
    processButton: {
        backgroundColor: '#0fd1aa',
    },
    clearButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#0fd1aa33',
    },
    disabledButton: {
        backgroundColor: '#666',
    },
    buttonText: {
        color: '#101010',
        fontWeight: 'bold',
        fontSize: 16,
    },
    clearButtonText: {
        color: '#0fd1aa',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultContainer: {
        marginTop: 16,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    resultLabel: {
        color: '#0fd1aa',
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
    },
    resultActions: {
        flexDirection: 'row',
    },
    actionButton: {
        marginLeft: 15,
    },
    actionText: {
        color: '#0fd1aa',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    resultTextContainer: {
        backgroundColor: '#0f0f0f',
        padding: 15,
        borderRadius: 8,
    },
    resultText: {
        color: '#fff',
        fontSize: 16,
        lineHeight: 24,
    },
    patternContainer: {
        gap: 12,
        marginBottom: 12,
    },
    patternRow: {
        gap: 8,
    },
    patternLabel: {
        color: '#0fd1aa',
        fontSize: 14,
        fontWeight: 'bold',
    },
    patternText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'monospace',
        letterSpacing: 1,
    },
    table: {
        backgroundColor: '#0f0f0f',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'monospace',
        width: 20,
        height: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderWidth: 0.5,
        borderColor: '#333',
    },
    tableHeader: {
        backgroundColor: '#0fd1aa33',
        color: '#0fd1aa',
        fontWeight: 'bold',
    },
    aboutContainer: {
        backgroundColor: '#1b1b1b',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#0fd1aa33',
        marginBottom: 20,
    },
    aboutTitle: {
        color: '#0fd1aa',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 15,
    },
    aboutText: {
        color: '#ccc',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    bold: {
        fontWeight: 'bold',
        color: '#0fd1aa',
    },
    videoButton: {
        backgroundColor: '#0fd1aa',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    videoButtonText: {
        color: '#101010',
        fontWeight: 'bold',
        fontSize: 14,
    },
    videoContainer: {
        marginTop: 15,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#0fd1aa',
    },
    videoPlayer: {
        height: 200,
        borderRadius: 8,
        backgroundColor: '#000',
    },
    securityNoteContainer: {
        backgroundColor: '#0f0f0f',
        borderRadius: 8,
        padding: 15,
        marginTop: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    securityNoteTitle: {
        color: '#f59e0b',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    securityNoteText: {
        color: '#ccc',
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    tutorialModal: {
        backgroundColor: '#1b1b1b',
        borderRadius: 12,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: '#0fd1aa33',
    },
    tutorialHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#0fd1aa33',
    },
    tutorialTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0fd1aa',
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    tutorialContent: {
        padding: 20,
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 8,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0fd1aa',
        marginBottom: 16,
        textAlign: 'center',
    },
    stepContent: {
        fontSize: 16,
        color: '#ccc',
        lineHeight: 24,
        marginBottom: 32,
    },
    tutorialNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#666',
        borderRadius: 8,
    },
    nextButton: {
        backgroundColor: '#0fd1aa',
    },
    navButtonDisabled: {
        backgroundColor: '#333',
    },
    navButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    navButtonTextDisabled: {
        color: '#666',
    },
    stepCounter: {
        color: '#ccc',
        fontSize: 14,
    },
});

export default VigenereCipher;
