import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Clipboard,
  Modal,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Base64Converter = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('encode'); 
  const [showVideo, setShowVideo] = useState(false);
  
  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Apa itu Base64?",
      content: "Base64 adalah skema encoding yang mengkonversi data binary menjadi representasi teks ASCII menggunakan 64 karakter yang dapat dibaca. Encoding ini menggunakan karakter A-Z, a-z, 0-9, plus (+), dan slash (/), dengan equals (=) sebagai padding. Base64 memungkinkan data binary dikirim melalui media yang dirancang untuk teks."
    },
    {
      title: "Cara Kerja Base64",
      content: "Proses Base64:\n• Input dibagi menjadi grup 3 byte (24 bit)\n• Setiap grup 24 bit dibagi menjadi 4 grup 6 bit\n• Setiap 6 bit (0-63) dipetakan ke karakter Base64\n• Jika byte tidak habis dibagi 3, ditambahkan padding '='\n• Output selalu kelipatan 4 karakter\n\nContoh: 'ABC' → 'QUJD' (tanpa padding)"
    },
    {
      title: "Karakter Base64",
      content: "64 karakter standar Base64:\n• A-Z (26 karakter): nilai 0-25\n• a-z (26 karakter): nilai 26-51\n• 0-9 (10 karakter): nilai 52-61\n• + (plus): nilai 62\n• / (slash): nilai 63\n• = (equals): karakter padding\n\nSetiap karakter merepresentasikan nilai 6-bit (0-63)."
    },
    {
      title: "Padding Base64",
      content: "Sistem padding Base64:\n• 1 byte input → 2 karakter + '=='\n• 2 byte input → 3 karakter + '='\n• 3 byte input → 4 karakter (tanpa padding)\n\nPadding memastikan output selalu kelipatan 4 karakter.\n\nContoh:\n'A' → 'QQ=='\n'AB' → 'QUI='\n'ABC' → 'QUJD'"
    },
    {
      title: "Kegunaan Base64",
      content: "Base64 digunakan dalam:\n• Email attachments (MIME encoding)\n• Data URLs dalam HTML/CSS\n• JSON/XML untuk data binary\n• HTTP Basic Authentication\n• Encoding gambar untuk web\n• API tokens dan credentials\n• Database storage untuk binary data\n• Cryptocurrency addresses"
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

  const base64Encode = (str) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (error) {
      throw new Error('Gagal mengenkode teks');
    }
  };

  const base64Decode = (str) => {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (error) {
      throw new Error('Teks Base64 tidak valid atau rusak');
    }
  };

  const processText = () => {
    if (!text.trim()) {
      Alert.alert('Kesalahan', 'Silakan masukkan teks untuk diproses');
      return;
    }

    try {
      let processed;
      if (mode === 'encode') {
        processed = base64Encode(text);
      } else {
        processed = base64Decode(text);
      }
      setResult(processed);
    } catch (error) {
      Alert.alert('Kesalahan', error.message);
    }
  };

  const clearAll = () => {
    setText('');
    setResult('');
  };

  const copyToClipboard = () => {
    if (result) {
      Clipboard.setString(result);
      Alert.alert('Berhasil Disalin', 'Hasil telah disalin ke clipboard');
    }
  };

  const swapInputOutput = () => {
    setText(result);
    setResult('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const generateBase64Table = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const table = [];
    
    for (let i = 0; i < 64; i += 8) {
      const row = [];
      for (let j = 0; j < 8 && (i + j) < 64; j++) {
        row.push({
          index: i + j,
          char: chars[i + j],
          binary: (i + j).toString(2).padStart(6, '0')
        });
      }
      table.push(row);
    }
    
    return table;
  };

  const base64Table = generateBase64Table();

  const getConversionExample = () => {
    if (!text || text.length === 0) return null;
    
    const exampleText = text.substring(0, 8); 
    const bytes = [];
    
    for (let i = 0; i < exampleText.length; i++) {
      const charCode = exampleText.charCodeAt(i);
      bytes.push({
        char: exampleText[i],
        ascii: charCode,
        binary: charCode.toString(2).padStart(8, '0')
      });
    }
    
    return bytes;
  };

  const conversionExample = getConversionExample();

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
                Tutorial Base64
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

              <Text style={styles.tutorialStepTitle}>{tutorialSteps[currentStep].title}</Text>
              <Text style={styles.tutorialStepContent}>{tutorialSteps[currentStep].content}</Text>

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Konverter Base64</Text>
          <Text style={styles.subtitle}>
            Enkode dan dekode teks menggunakan encoding Base64
          </Text>
          <TouchableOpacity
            onPress={() => {
              setCurrentStep(0);
              setShowTutorial(true);
            }}
            style={styles.tutorialButton}
          >
            <Text style={styles.tutorialButtonText}>Tutorial</Text>
          </TouchableOpacity>
        </View>

        {/* Mode Selection */}
        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'encode' && styles.modeActive]}
            onPress={() => setMode('encode')}
          >
            <Text style={[styles.modeText, mode === 'encode' && styles.modeTextActive]}>
              Enkode
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'decode' && styles.modeActive]}
            onPress={() => setMode('decode')}
          >
            <Text style={[styles.modeText, mode === 'decode' && styles.modeTextActive]}>
              Dekode
            </Text>
          </TouchableOpacity>
        </View>

        {/* Text Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>
            {mode === 'encode' ? 'Teks Asli:' : 'Teks Base64:'}
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={`Masukkan teks untuk di${mode === 'encode' ? 'enkode' : 'dekode'}...`}
            placeholderTextColor="#666"
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={4}
          />
          {text && (
            <Text style={styles.textInfo}>
              Panjang karakter: {text.length} | 
              Ukuran byte: ~{new Blob([text]).size} bytes
            </Text>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.processButton]} 
            onPress={processText}
          >
            <Text style={styles.buttonText}>
              {mode === 'encode' ? 'Enkode ke Base64' : 'Dekode dari Base64'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.clearButton]} 
            onPress={clearAll}
          >
            <Text style={styles.clearButtonText}>Hapus</Text>
          </TouchableOpacity>
        </View>

        {/* Result */}
        {result ? (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultLabel}>
                {mode === 'encode' ? 'Hasil Base64:' : 'Teks Asli:'}
              </Text>
              <View style={styles.resultActions}>
                <TouchableOpacity onPress={swapInputOutput} style={styles.actionButton}>
                  <Text style={styles.actionText}>Paste</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={copyToClipboard} style={styles.actionButton}>
                  <Text style={styles.actionText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultText} selectable>
                {result}
              </Text>
            </View>
            <Text style={styles.resultInfo}>
              Panjang hasil: {result.length} karakter
              {mode === 'encode' && text && (
                <Text> | Efisiensi: {((result.length / text.length) * 100).toFixed(1)}%</Text>
              )}
            </Text>
          </View>
        ) : null}

        {/* Conversion Example */}
        {conversionExample && conversionExample.length > 0 ? (
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Contoh Konversi (8 karakter pertama):</Text>
            <View style={styles.conversionContainer}>
              {conversionExample.map((byte, index) => (
                <View key={index} style={styles.byteContainer}>
                  <Text style={styles.byteChar}>'{byte.char}'</Text>
                  <Text style={styles.byteAscii}>ASCII: {byte.ascii}</Text>
                  <Text style={styles.byteBinary}>{byte.binary}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.conversionNote}>
              * Setiap karakter dikonversi ke 8-bit binary, lalu dikelompokkan dalam 6-bit untuk Base64
            </Text>
          </View>
        ) : null}

        {/* Base64 Character Table */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Tabel Karakter Base64</Text>
          <Text style={styles.tableSubtitle}>64 karakter standar yang digunakan dalam Base64</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.table}>
              {base64Table.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  {row.map((item, colIndex) => (
                    <View key={colIndex} style={styles.tableCell}>
                      <Text style={styles.tableCellIndex}>{item.index}</Text>
                      <Text style={styles.tableCellChar}>{item.char}</Text>
                      <Text style={styles.tableCellBinary}>{item.binary}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
          <Text style={styles.tableNote}>
            Karakter ke-65 '=' digunakan sebagai padding
          </Text>
        </View>

        {/* Padding Example */}
        <View style={styles.paddingContainer}>
          <Text style={styles.paddingTitle}>Contoh Padding Base64:</Text>
          <View style={styles.paddingExamples}>
            <View style={styles.paddingExample}>
              <Text style={styles.paddingText}>"A" → "QQ=="</Text>
              <Text style={styles.paddingDesc}>1 byte → 4 karakter (2 padding)</Text>
            </View>
            <View style={styles.paddingExample}>
              <Text style={styles.paddingText}>"AB" → "QUI="</Text>
              <Text style={styles.paddingDesc}>2 byte → 4 karakter (1 padding)</Text>
            </View>
            <View style={styles.paddingExample}>
              <Text style={styles.paddingText}>"ABC" → "QUJD"</Text>
              <Text style={styles.paddingDesc}>3 byte → 4 karakter (tanpa padding)</Text>
            </View>
          </View>
        </View>

        {/* Keunggulan Base64 */}
        <View style={styles.advantagesContainer}>
          <Text style={styles.advantagesTitle}>Keunggulan Base64</Text>
          <View style={styles.advantagesContent}>
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>📝 Text-Safe Encoding</Text>
              <Text style={styles.advantageText}>
                Base64 mengkonversi data binary menjadi teks ASCII yang aman 
                untuk dikirim melalui protokol yang hanya mendukung teks, 
                seperti email atau HTTP headers.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>🔗 Universal Compatibility</Text>
              <Text style={styles.advantageText}>
                Didukung oleh hampir semua bahasa pemrograman dan platform. 
                Menjadi standar de facto untuk encoding data binary dalam 
                format teks di web dan aplikasi.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>⚡ Simple & Fast</Text>
              <Text style={styles.advantageText}>
                Algoritma encoding/decoding yang simpel dan cepat. Tidak 
                memerlukan komputasi kompleks, sehingga efisien untuk 
                digunakan dalam real-time applications.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>🌐 Web Standard</Text>
              <Text style={styles.advantageText}>
                Standar encoding untuk Data URLs, MIME email attachments, 
                dan JSON/XML data. Terintegrasi langsung dengan teknologi 
                web modern dan APIs.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>🔄 Reversible</Text>
              <Text style={styles.advantageText}>
                Proses encoding yang sepenuhnya reversible tanpa kehilangan 
                data. Input original dapat dipulihkan 100% dari output Base64.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>📊 Predictable Size</Text>
              <Text style={styles.advantageText}>
                Output size yang dapat diprediksi: sekitar 4/3 dari input size. 
                Padding memastikan output selalu kelipatan 4 karakter, 
                memudahkan parsing dan validasi.
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>Tentang Base64</Text>
          <Text style={styles.aboutText}>
            Base64 adalah skema encoding yang mengkonversi data binary menjadi representasi 
            teks ASCII menggunakan 64 karakter yang dapat dibaca. Encoding ini menggunakan 
            karakter A-Z, a-z, 0-9, plus (+), dan slash (/), dengan equals (=) sebagai 
            padding. Base64 sering digunakan untuk mengirim data binary melalui media yang 
            dirancang untuk menangani data teks, seperti email atau HTTP.
          </Text>
          
          <Text style={styles.aboutSubtitle}>Kegunaan Base64:</Text>
          <Text style={styles.aboutList}>
            • Encoding email attachments (MIME){'\n'}
            • Menyimpan data binary dalam format JSON/XML{'\n'}
            • Data URLs dalam HTML/CSS{'\n'}
            • Authentication tokens{'\n'}
            • Encoding gambar untuk web
          </Text>
          
          <TouchableOpacity onPress={toggleVideo} style={styles.videoButton}>
            <Text style={styles.videoButtonText}>
              {showVideo ? 'Sembunyikan Video' : 'Tampilkan Video Penjelasan'}
            </Text>
          </TouchableOpacity>

          {showVideo && (
            <View style={styles.videoContainer}>
              <WebView
                source={{ uri: 'https://www.youtube.com/embed/8qkxeZmKmOY' }}
                style={styles.videoPlayer}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsFullscreenVideo={true}
              />
            </View>
          )}
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
  scrollContent: {
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
  tutorialButton: {
    backgroundColor: '#0fd1aa',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tutorialButtonText: {
    color: '#101010',
    fontWeight: 'bold',
  },
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
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
    marginBottom: 20,
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
    backgroundColor: '#1b1b1b',
    padding: 15,
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  textInfo: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  processButton: {
    backgroundColor: '#0fd1aa',
  },
  clearButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0fd1aa33',
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
  resultContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    marginBottom: 20,
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
    marginBottom: 10,
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'monospace',
  },
  resultInfo: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },
  exampleContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    marginBottom: 20,
  },
  exampleTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 15,
  },
  conversionContainer: {
    backgroundColor: '#0f0f0f',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  byteContainer: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  byteChar: {
    color: '#0fd1aa',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  byteAscii: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 2,
  },
  byteBinary: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginTop: 2,
  },
  conversionNote: {
    color: '#666',
    fontSize: 11,
    fontStyle: 'italic',
  },
  tableContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    marginBottom: 20,
  },
  tableTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  tableSubtitle: {
    color: '#999',
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'center',
  },
  table: {
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  tableCell: {
    backgroundColor: '#1a1a1a',
    marginRight: 5,
    marginBottom: 5,
    padding: 8,
    borderRadius: 4,
    minWidth: 70,
    alignItems: 'center',
  },
  tableCellIndex: {
    color: '#0fd1aa',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCellChar: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginVertical: 2,
  },
  tableCellBinary: {
    color: '#999',
    fontSize: 9,
    fontFamily: 'monospace',
  },
  tableNote: {
    color: '#666',
    fontSize: 11,
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  paddingContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    marginBottom: 20,
  },
  paddingTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 15,
  },
  paddingExamples: {
    backgroundColor: '#0f0f0f',
    padding: 15,
    borderRadius: 8,
  },
  paddingExample: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  paddingText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  paddingDesc: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  // Keunggulan Base64 Styles
  advantagesContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    marginBottom: 20,
  },
  advantagesTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  advantagesContent: {
    backgroundColor: '#0f0f0f',
    padding: 15,
    borderRadius: 8,
  },
  advantageItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  advantageTitle: {
    color: '#0fd1aa',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  advantageText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  aboutContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
  },
  aboutTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  aboutText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  aboutSubtitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },
  aboutList: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
    marginLeft: 10,
  },
  videoButton: {
    backgroundColor: '#0fd1aa',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  videoButtonText: {
    color: '#101010',
    fontWeight: 'bold',
    fontSize: 14,
  },
  videoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoPlayer: {
    height: 200,
    width: '100%',
  },
  // Tutorial Modal Styles
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
  tutorialStepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0fd1aa',
    marginBottom: 16,
    textAlign: 'center',
  },
  tutorialStepContent: {
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

export default Base64Converter;
