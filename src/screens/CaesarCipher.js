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

const CaesarCipher = () => {
  const [text, setText] = useState('');
  const [key, setKey] = useState('3');
  const [result, setResult] = useState('');
  const [allResults, setAllResults] = useState([]);
  const [mode, setMode] = useState('encrypt');
  const [showVideo, setShowVideo] = useState(false);
  const [showAllShifts, setShowAllShifts] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Apa itu Caesar Cipher?",
      content: "Caesar Cipher adalah salah satu teknik enkripsi substitusi tertua yang dinamakan menurut Julius Caesar, yang menggunakannya untuk komunikasi rahasia pada tahun 50-60 SM. Cipher ini bekerja dengan menggeser setiap huruf dalam alphabet dengan jumlah posisi tetap (shift value)."
    },
    {
      title: "Cara Kerja Caesar Cipher",
      content: "Proses enkripsi Caesar Cipher:\n• Tentukan nilai pergeseran (shift) antara 1-25\n• Untuk setiap huruf, geser maju sebanyak nilai shift\n• Jika melewati Z, kembali ke A (modulo 26)\n• Huruf non-alphabet tetap tidak berubah\n\nContoh: dengan shift 3, A→D, B→E, C→F"
    },
    {
      title: "Kelebihan Caesar Cipher",
      content: "Keunggulan Caesar Cipher:\n• Sangat mudah dipahami dan diimplementasikan\n• Cepat untuk enkripsi/dekripsi manual\n• Tidak memerlukan kunci yang kompleks\n• Cocok untuk pembelajaran kriptografi dasar\n• Efisien secara komputasi\n• Dapat digunakan untuk obfuskasi sederhana"
    },
    {
      title: "Kelemahan dan Kerentanan",
      content: "Kelemahan Caesar Cipher:\n• Hanya 25 kemungkinan kunci (mudah brute force)\n• Tidak aman untuk data sensitif atau komunikasi rahasia\n• Vulnerable terhadap frequency analysis\n• Pattern recognition mudah dilakukan\n• Mudah dipecahkan secara manual atau otomatis"
    },
    {
      title: "Cryptanalysis dan Aplikasi",
      content: "Cara memecahkan Caesar Cipher:\n• Brute force: coba semua 25 kemungkinan shift\n• Frequency analysis: analisis distribusi huruf\n• Pattern recognition: cari kata umum\n\nAplikasi modern:\n• Pembelajaran kriptografi\n• Puzzle dan permainan\n• ROT13 untuk spoiler text"
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

  const shiftChar = (char, shift, isEncrypt = true) => {
    if (!/[a-zA-Z]/.test(char)) {
      return char;
    }

    const actualShift = isEncrypt ? shift : -shift;
    const isUpperCase = char >= 'A' && char <= 'Z';
    const base = isUpperCase ? 65 : 97;

    const shifted = ((char.charCodeAt(0) - base + actualShift) % 26 + 26) % 26;

    return String.fromCharCode(shifted + base);
  };

  const caesarCipher = (inputText, shiftValue, isEncrypt = true) => {
    if (!inputText.trim()) return '';

    const shift = parseInt(shiftValue) || 0;
    return inputText
      .split('')
      .map(char => shiftChar(char, shift, isEncrypt))
      .join('');
  };

  const generateAllShifts = (inputText, isEncrypt = true) => {
    if (!inputText.trim()) return [];

    const results = [];
    for (let i = 1; i <= 25; i++) {
      const shifted = caesarCipher(inputText, i, isEncrypt);
      results.push({
        shift: i,
        result: shifted
      });
    }
    return results;
  };

  const processText = async () => {
    if (!text.trim()) {
      Alert.alert('Kesalahan', 'Silakan masukkan teks untuk diproses');
      return;
    }

    const keyValue = parseInt(key);
    if (isNaN(keyValue) || keyValue < 1 || keyValue > 25) {
      Alert.alert('Kesalahan', 'Silakan masukkan kunci yang valid (1-25)');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const processed = caesarCipher(text, keyValue, mode === 'encrypt');
      setResult(processed);

      // Always generate all shifts (1-25)
      const allShifts = generateAllShifts(text, mode === 'encrypt');
      setAllResults(allShifts);
      
      // Automatically show all shifts after processing
      setShowAllShifts(true);
      
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
    setAllResults([]);
    setKey('3');
    setShowAllShifts(false);
  };

  const swapInputOutput = () => {
    setText(result);
    setResult('');
    setAllResults([]);
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
    setShowAllShifts(false);
  };

  const toggleAllShifts = () => {
    setShowAllShifts(!showAllShifts);
  };

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
                Tutorial Caesar Cipher
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
        <Text style={styles.title}>Caesar Cipher</Text>
        <Text style={styles.subtitle}>
          Metode enkripsi klasik yang digunakan oleh Julius Caesar
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
          <Text style={styles.infoText}>
            💡 Caesar cipher menggunakan pergeseran yang sama untuk enkripsi dan dekripsi
          </Text>
        </View>

        {/* Key Input */}
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Kunci Pergeseran</Text>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Nilai Pergeseran (1-25):</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Masukkan nilai pergeseran"
              placeholderTextColor="#666"
              value={key}
              onChangeText={setKey}
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={styles.infoText}>
              Julius Caesar menggunakan pergeseran 3 dalam komunikasi militernya
            </Text>
            <Text style={styles.infoText}>
              Hanya ada 25 kemungkinan kunci, mudah dipecahkan dengan brute force
            </Text>
          </View>
        </View>

        {/* Text Input */}
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>
            {mode === 'encrypt' ? '📝 Teks Asli' : ' Teks Sandi'}
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
              {mode === 'encrypt' ? ' (karakter + shift) mod 26' : ' (karakter - shift) mod 26'}
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

        {/* Main Result - User's Selected Key */}
        {result && (
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>
              {mode === 'encrypt' ? ' Hasil Enkripsi' : ' Hasil Dekripsi'}
            </Text>
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}>
                  {mode === 'encrypt' ? 'Teks Sandi:' : 'Teks Asli:'} (Kunci {key})
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

        {/* All Shifts Analysis */}
        {allResults.length > 0 && (
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>🔍 Analisis Brute Force</Text>
            <TouchableOpacity onPress={toggleAllShifts} style={styles.toggleButton}>
              <Text style={styles.toggleButtonText}>
                {showAllShifts ? 'Sembunyikan' : 'Tampilkan'} Semua Pergeseran (1-25)
              </Text>
            </TouchableOpacity>

            {showAllShifts && (
              <View style={styles.allShiftsContent}>
                <Text style={styles.aboutText}>
                  Semua kemungkinan hasil {mode === 'encrypt' ? 'enkripsi' : 'dekripsi'} dengan pergeseran 1-25.
                  Berguna untuk cryptanalysis - temukan pergeseran yang tepat!
                </Text>

                {allResults.map((item) => {
                  const isSelectedKey = parseInt(key) === item.shift;
                  return (
                    <View 
                      key={item.shift} 
                      style={[
                        styles.shiftResultContainer,
                        isSelectedKey && styles.selectedShiftContainer
                      ]}
                    >
                      <View style={styles.shiftHeader}>
                        <Text style={[
                          styles.shiftLabel,
                          isSelectedKey && styles.selectedShiftLabel
                        ]}>
                          Kunci {item.shift}:{isSelectedKey ? ' PILIHAN ANDA' : ''}
                        </Text>
                        <TouchableOpacity
                          onPress={() => copyToClipboard(item.result)}
                          style={styles.actionButton}
                        >
                          <Text style={styles.actionText}>Copy</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.resultTextContainer}>
                        <Text style={styles.shiftText} selectable>
                          {item.result}
                        </Text>
                      </View>
                    </View>
                  );
                })}
                <Text style={styles.infoText}>
                   Ini menunjukkan mengapa Caesar Cipher tidak aman - mudah dipecahkan!
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Cipher Reference Table */}
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}> Tabel Referensi Caesar</Text>
          <Text style={styles.aboutText}>
            Tabel pergeseran alphabet dengan kunci {key}:
          </Text>
          <View style={styles.tableContainer}>
            <View style={styles.alphabetRow}>
              <Text style={styles.alphabetLabel}>Asli:</Text>
              <View style={styles.resultTextContainer}>
                <Text style={styles.alphabetText}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</Text>
              </View>
            </View>
            <View style={styles.alphabetRow}>
              <Text style={styles.alphabetLabel}>Digeser:</Text>
              <View style={styles.resultTextContainer}>
                <Text style={styles.alphabetText}>
                  {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char =>
                    shiftChar(char, parseInt(key) || 0, true)
                  ).join('')}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.infoText}>
             Setiap huruf di baris atas diganti dengan huruf di baris bawah
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
          <Text style={styles.aboutTitle}>Tentang Caesar Cipher</Text>
          <Text style={styles.aboutText}>
            Caesar Cipher adalah salah satu teknik enkripsi yang paling sederhana dan paling dikenal luas. 
            Ini adalah sandi substitusi di mana setiap huruf dalam teks asli digeser sejumlah tempat tertentu 
            ke bawah atau ke atas dalam alfabet. Julius Caesar menggunakan sandi ini dengan pergeseran 3 
            untuk melindungi pesan-pesan yang penting secara militer.
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Substitution Cipher</Text>: Mengganti setiap huruf dengan huruf lain
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Fixed Shift</Text>: Menggunakan pergeseran yang sama untuk semua huruf
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Modular Arithmetic</Text>: Menggunakan modulo 26 untuk wrapping
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Brute Force Vulnerable</Text>: Hanya 25 kemungkinan kunci
          </Text>
          <Text style={styles.aboutText}>
            Fitur "Analisis Brute Force" berguna untuk cryptanalysis - ketika Anda memiliki teks sandi tetapi 
            tidak tahu kuncinya, Anda dapat melihat semua kemungkinan hasil dekripsi dan memilih yang paling masuk akal.
          </Text>

          <TouchableOpacity onPress={toggleVideo} style={styles.videoButton}>
            <Text style={styles.videoButtonText}>
              {showVideo ? 'Sembunyikan Video' : 'Tampilkan Video Penjelasan Caesar Cipher'}
            </Text>
          </TouchableOpacity>

          {showVideo && (
            <View style={styles.videoContainer}>
              <Text style={styles.videoTitle}>Tutorial Caesar Cipher</Text>
              <WebView
                source={{ uri: 'https://www.youtube.com/embed/sMOZf4GN3oc' }}
                style={styles.videoPlayer}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsFullscreenVideo={true}
              />
            </View>
          )}

          <View style={styles.securityNoteContainer}>
            <Text style={styles.securityNoteTitle}>Peringatan Keamanan</Text>
            <Text style={styles.securityNoteText}>
              • Caesar Cipher TIDAK aman untuk data sensitif atau komunikasi rahasia modern
            </Text>
            <Text style={styles.securityNoteText}>
              • Hanya 25 kemungkinan kunci - mudah dipecahkan dengan brute force dalam hitungan detik
            </Text>
            <Text style={styles.securityNoteText}>
              • Vulnerable terhadap frequency analysis dan pattern recognition
            </Text>
            <Text style={styles.securityNoteText}>
              • Gunakan hanya untuk pembelajaran, puzzle, atau obfuskasi sangat ringan
            </Text>
            <Text style={styles.securityNoteText}>
              • Untuk keamanan nyata, gunakan AES, RSA, atau algoritma kriptografi modern
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
    marginBottom: 8,
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
  toggleButton: {
    backgroundColor: '#0fd1aa22',
    borderWidth: 1,
    borderColor: '#0fd1aa',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleButtonText: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 14,
  },
  allShiftsContent: {
    marginTop: 15,
    gap: 12,
  },
  shiftResultContainer: {
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedShiftContainer: {
    borderWidth: 2,
    borderColor: '#0fd1aa',
    backgroundColor: '#0fd1aa11',
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shiftLabel: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
  },
  selectedShiftLabel: {
    color: '#0fd1aa',
    fontSize: 15,
  },
  shiftText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  tableContainer: {
    gap: 12,
    marginBottom: 12,
  },
  alphabetRow: {
    gap: 8,
  },
  alphabetLabel: {
    color: '#0fd1aa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  alphabetText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
    letterSpacing: 1,
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

export default CaesarCipher;
