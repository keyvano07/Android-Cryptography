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
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import CryptoJS from 'crypto-js';

const SHA256Generator = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [hashFormat, setHashFormat] = useState('hex'); // 'hex', 'base64'
  const [showVideo, setShowVideo] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Apa itu SHA-256?",
      content: "SHA-256 (Secure Hash Algorithm 256-bit) adalah fungsi hash kriptografi yang dikembangkan oleh NSA dan diterbitkan NIST pada tahun 2001. SHA-256 menghasilkan digest 256-bit (32 byte) dan merupakan bagian dari keluarga SHA-2 yang sangat aman dan banyak digunakan dalam sistem modern."
    },
    {
      title: "Karakteristik SHA-256",
      content: "Sifat-sifat SHA-256:\n• Deterministic: Input sama = output sama\n• Fixed Size: Selalu 256-bit (64 karakter hex)\n• Avalanche Effect: Perubahan kecil → perubahan besar\n• One-way: Tidak dapat di-reverse\n• Collision Resistant: Sangat sulit menemukan dua input dengan hash sama\n• Fast: Efisien untuk dihitung"
    },
    {
      title: "Algoritma SHA-256",
      content: "Langkah-langkah SHA-256:\n1. Pre-processing: Padding pesan\n2. Append Length: Tambahkan panjang asli\n3. Initialize: 8 nilai hash awal dari akar kuadrat prima\n4. Process: 64 putaran operasi dengan konstanta K\n5. Final Hash: Gabungkan hasil untuk 256-bit digest\n\nMenggunakan operasi bitwise: AND, OR, XOR, NOT, rotasi"
    },
    {
      title: "Kegunaan SHA-256",
      content: "SHA-256 digunakan dalam:\n• Bitcoin dan blockchain (Proof of Work)\n• Digital signatures dan certificates\n• Password hashing (dengan salt)\n• HMAC dan key derivation\n• File integrity verification\n• Secure random number generation\n• Merkle trees\n• TLS/SSL protokol"
    },
    {
      title: "Keamanan SHA-256",
      content: "Kekuatan keamanan SHA-256:\n• Collision Resistance: 2^128 operasi\n• Preimage Resistance: 2^256 operasi\n• Second Preimage: 2^256 operasi\n• Belum ada serangan praktis yang berhasil\n• Direkomendasikan untuk aplikasi kritis\n• Standar industri untuk keamanan tinggi"
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

  // SHA-256 hashing function
  const generateSHA256 = (inputText, format = 'hex') => {
    try {
      const hash = CryptoJS.SHA256(inputText);
      if (format === 'base64') {
        return hash.toString(CryptoJS.enc.Base64);
      }
      return hash.toString(CryptoJS.enc.Hex);
    } catch (error) {
      throw new Error('Gagal membuat hash SHA-256');
    }
  };

  const processText = () => {
    if (!text.trim()) {
      Alert.alert('Kesalahan', 'Silakan masukkan teks untuk di-hash');
      return;
    }

    try {
      const hash = generateSHA256(text, hashFormat);
      setResult(hash);
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
      Alert.alert('Berhasil Disalin', 'Hash SHA-256 telah disalin ke clipboard');
    }
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  // Generate comparison hashes for demonstration
  const getComparisonHashes = () => {
    const examples = [
      'Hello World',
      'Hello World!',
      'hello world',
      'Hello World ',
      ''
    ];

    return examples.map(example => ({
      text: example || '(teks kosong)',
      hash: generateSHA256(example, 'hex')
    }));
  };

  // Get hash properties
  const getHashProperties = () => {
    if (!result) return null;

    return {
      length: result.length,
      format: hashFormat,
      bits: hashFormat === 'hex' ? result.length * 4 : Math.ceil(result.length * 6),
      entropy: Math.log2(Math.pow(hashFormat === 'hex' ? 16 : 64, result.length)).toFixed(2)
    };
  };

  const hashProperties = getHashProperties();
  const comparisonHashes = getComparisonHashes();

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
                Tutorial SHA-256
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
      {/* HEADER PINDAH KELUAR DARI SCROLLVIEW */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Generator SHA-256</Text>
        <Text style={styles.subtitle}>
          Fungsi hash kriptografi yang menghasilkan hash 256-bit
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

      {/* SCROLLVIEW UNTUK KONTEN */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Format Selection */}
        <View style={styles.formatContainer}>
          <Text style={styles.formatLabel}>Format Output:</Text>
          <View style={styles.formatButtons}>
            <TouchableOpacity
              style={[styles.formatButton, hashFormat === 'hex' && styles.formatActive]}
              onPress={() => setHashFormat('hex')}
            >
              <Text style={[styles.formatText, hashFormat === 'hex' && styles.formatTextActive]}>
                Hexadecimal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formatButton, hashFormat === 'base64' && styles.formatActive]}
              onPress={() => setHashFormat('base64')}
            >
              <Text style={[styles.formatText, hashFormat === 'base64' && styles.formatTextActive]}>
                Base64
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Text Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Teks Input:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Masukkan teks untuk di-hash..."
            placeholderTextColor="#666"
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={4}
          />
          {text && (
            <Text style={styles.textInfo}>
              Panjang: {text.length} karakter | Ukuran: ~{new Blob([text]).size} bytes
            </Text>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.processButton]}
            onPress={processText}
          >
            <Text style={styles.buttonText}>Generate Hash SHA-256</Text>
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
              <Text style={styles.resultLabel}>Hash SHA-256:</Text>
              <TouchableOpacity onPress={copyToClipboard} style={styles.actionButton}>
                <Text style={styles.actionText}>Salin</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultText} selectable>
                {result}
              </Text>
            </View>
            {hashProperties && (
              <View style={styles.propertiesContainer}>
                <Text style={styles.propertiesTitle}>Properti Hash:</Text>
                <Text style={styles.propertyText}>
                  Panjang: {hashProperties.length} karakter ({hashProperties.bits} bit)
                </Text>
                <Text style={styles.propertyText}>
                  Format: {hashProperties.format === 'hex' ? 'Hexadecimal' : 'Base64'}
                </Text>
                <Text style={styles.propertyText}>
                  Entropi: ~{hashProperties.entropy} bit
                </Text>
              </View>
            )}
          </View>
        ) : null}

        {/* Hash Comparison */}
        <View style={styles.comparisonContainer}>
          <TouchableOpacity onPress={toggleComparison} style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>
              {showComparison ? 'Sembunyikan' : 'Tampilkan'} Perbandingan Hash
            </Text>
          </TouchableOpacity>

          {showComparison && (
            <View style={styles.comparisonContent}>
              <Text style={styles.comparisonTitle}>
                Demonstrasi Avalanche Effect:
              </Text>
              <Text style={styles.comparisonSubtitle}>
                Perubahan kecil input menghasilkan hash yang sangat berbeda
              </Text>

              {comparisonHashes.map((item, index) => (
                <View key={index} style={styles.comparisonItem}>
                  <Text style={styles.comparisonInput}>
                    Input: "{item.text}"
                  </Text>
                  <Text style={styles.comparisonHash}>
                    {item.hash.substring(0, 32)}...
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* SHA-256 Algorithm Steps */}
        <View style={styles.algorithmContainer}>
          <Text style={styles.algorithmTitle}>Langkah-langkah Algoritma SHA-256:</Text>
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Pre-processing</Text>
                <Text style={styles.stepText}>
                  Padding pesan dengan bit '1' diikuti bit '0' hingga panjang ≡ 448 (mod 512)
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Append Length</Text>
                <Text style={styles.stepText}>
                  Tambahkan panjang pesan asli sebagai 64-bit big-endian integer
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Initialize Hash Values</Text>
                <Text style={styles.stepText}>
                  8 nilai hash awal (H0-H7) dari akar kuadrat bilangan prima pertama
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>4</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Process Message</Text>
                <Text style={styles.stepText}>
                  Proses setiap blok 512-bit dengan 64 putaran operasi bitwise
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <Text style={styles.stepNumber}>5</Text>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Final Hash</Text>
                <Text style={styles.stepText}>
                  Gabungkan 8 nilai hash untuk menghasilkan digest 256-bit
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Hash Constants */}
        <View style={styles.constantsContainer}>
          <Text style={styles.constantsTitle}>Konstanta SHA-256:</Text>
          <View style={styles.constantsContent}>
            <Text style={styles.constantsSubtitle}>Initial Hash Values (H0-H7):</Text>
            <Text style={styles.constantsText}>
              6a09e667, bb67ae85, 3c6ef372, a54ff53a,{'\n'}
              510e527f, 9b05688c, 1f83d9ab, 5be0cd19
            </Text>

            <Text style={styles.constantsSubtitle}>Round Constants (K0-K63):</Text>
            <Text style={styles.constantsText}>
              428a2f98, 71374491, b5c0fbcf, e9b5dba5,{'\n'}
              3956c25b, 59f111f1, 923f82a4, ab1c5ed5...
            </Text>
            <Text style={styles.constantsNote}>
              * Konstanta diturunkan dari akar kubik 64 bilangan prima pertama
            </Text>
          </View>
        </View>

        {/* Security Properties */}
        <View style={styles.securityContainer}>
          <Text style={styles.securityTitle}>Properti Keamanan SHA-256:</Text>
          <View style={styles.securityContent}>
            <View style={styles.securityItem}>
              <Text style={styles.securityProperty}>Collision Resistance:</Text>
              <Text style={styles.securityValue}>2^128 operasi</Text>
            </View>
            <View style={styles.securityItem}>
              <Text style={styles.securityProperty}>Preimage Resistance:</Text>
              <Text style={styles.securityValue}>2^256 operasi</Text>
            </View>
            <View style={styles.securityItem}>
              <Text style={styles.securityProperty}>Second Preimage:</Text>
              <Text style={styles.securityValue}>2^256 operasi</Text>
            </View>
            <View style={styles.securityItem}>
              <Text style={styles.securityProperty}>Hash Length:</Text>
              <Text style={styles.securityValue}>256 bit (64 hex)</Text>
            </View>
          </View>
        </View>

        {/* Keunggulan SHA-256 */}
        <View style={styles.advantagesContainer}>
          <Text style={styles.advantagesTitle}>Keunggulan SHA-256</Text>
          <View style={styles.advantagesContent}>
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>Keamanan Tinggi</Text>
              <Text style={styles.advantageText}>
                Belum ada serangan praktis yang berhasil menembus SHA-256.
                Direkomendasikan untuk aplikasi kritis dan data sensitif.
              </Text>
            </View>

            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>Performa Optimal</Text>
              <Text style={styles.advantageText}>
                Dukungan hardware acceleration di sebagian besar processor modern
                membuat SHA-256 sangat efisien dalam komputasi.
              </Text>
            </View>

            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>Standar Global</Text>
              <Text style={styles.advantageText}>
                Standar keamanan industri dan pemerintah yang diakui secara global.
                Digunakan dalam SSL/TLS, digital certificates, dan sistem autentikasi.
              </Text>
            </View>

            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>Backbone Blockchain</Text>
              <Text style={styles.advantageText}>
                Menjadi tulang punggung teknologi blockchain dan cryptocurrency
                seperti Bitcoin, membuktikan kehandalannya dalam skala besar.
              </Text>
            </View>

            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>Avalanche Effect</Text>
              <Text style={styles.advantageText}>
                Perubahan sekecil apapun pada input akan menghasilkan hash yang
                sepenuhnya berbeda, memastikan integritas data yang sempurna.
              </Text>
            </View>

            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>Collision Resistant</Text>
              <Text style={styles.advantageText}>
                Sangat sulit (praktis tidak mungkin) untuk menemukan dua input
                yang berbeda menghasilkan hash yang sama dengan teknologi saat ini.
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>Tentang SHA-256</Text>
          <Text style={styles.aboutText}>
            SHA-256 (Secure Hash Algorithm 256-bit) adalah fungsi hash kriptografi yang
            dikembangkan oleh NSA dan diterbitkan oleh NIST pada tahun 2001. Algoritma ini
            merupakan bagian dari keluarga SHA-2 dan menghasilkan hash digest sepanjang 256 bit.
            SHA-256 banyak digunakan dalam sistem keamanan modern, termasuk Bitcoin dan
            aplikasi blockchain lainnya.
          </Text>

          <Text style={styles.aboutSubtitle}>Kegunaan SHA-256:</Text>
          <Text style={styles.aboutList}>
            • Blockchain dan cryptocurrency (Bitcoin){'\n'}
            • Digital signatures dan certificates{'\n'}
            • Password hashing (dengan salt){'\n'}
            • Data integrity verification{'\n'}
            • Proof of Work systems{'\n'}
            • HMAC dan key derivation
          </Text>

          <Text style={styles.aboutSubtitle}>Karakteristik Penting:</Text>
          <Text style={styles.aboutList}>
            • Deterministik - input sama = output sama{'\n'}
            • Avalanche effect - perubahan kecil = hash berbeda{'\n'}
            • One-way function - tidak dapat dibalik{'\n'}
            • Fixed output size - selalu 256 bit{'\n'}
            • Collision resistant - sulit menemukan duplikasi
          </Text>

          <TouchableOpacity onPress={toggleVideo} style={styles.videoButton}>
            <Text style={styles.videoButtonText}>
              {showVideo ? 'Sembunyikan Video' : 'Tampilkan Video Penjelasan'}
            </Text>
          </TouchableOpacity>

          {showVideo && (
            <View style={styles.videoContainer}>
              <WebView
                source={{ uri: 'https://www.youtube.com/embed/DMtFhACPnTY' }}
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
  // HEADER STYLES - DIBUAT TERPISAH
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#101010', // Pastikan background sama
    borderBottomWidth: 1,
    borderBottomColor: '#0fd1aa33',
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
  // SCROLL STYLES - DIPISAH
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  formatContainer: {
    marginBottom: 20,
  },
  formatLabel: {
    color: '#0fd1aa',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  formatButtons: {
    flexDirection: 'row',
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 4,
  },
  formatButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  formatActive: {
    backgroundColor: '#0fd1aa',
  },
  formatText: {
    color: '#999',
    fontWeight: 'bold',
  },
  formatTextActive: {
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
    borderColor: '#0fd1aa',
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
    marginBottom: 15,
  },
  resultText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
  propertiesContainer: {
    backgroundColor: '#0f0f0f',
    padding: 15,
    borderRadius: 8,
  },
  propertiesTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
  },
  propertyText: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  comparisonContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    marginBottom: 20,
  },
  toggleButton: {
    backgroundColor: '#0fd1aa',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#101010',
    fontWeight: 'bold',
    fontSize: 14,
  },
  comparisonContent: {
    marginTop: 15,
  },
  comparisonTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  comparisonSubtitle: {
    color: '#999',
    fontSize: 12,
    marginBottom: 15,
  },
  comparisonItem: {
    backgroundColor: '#0f0f0f',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  comparisonInput: {
    color: '#0fd1aa',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  comparisonHash: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  algorithmContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    marginBottom: 20,
  },
  algorithmTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 15,
  },
  stepContainer: {
    backgroundColor: '#0f0f0f',
    padding: 15,
    borderRadius: 8,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  stepNumber: {
    color: '#0fd1aa',
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
  },
  stepContent: {
    flex: 1,
    marginLeft: 15,
  },
  stepTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stepText: {
    color: '#ccc',
    fontSize: 12,
    lineHeight: 18,
  },
  constantsContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    marginBottom: 20,
  },
  constantsTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 15,
  },
  constantsContent: {
    backgroundColor: '#0f0f0f',
    padding: 15,
    borderRadius: 8,
  },
  constantsSubtitle: {
    color: '#0fd1aa',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  constantsText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 15,
    lineHeight: 18,
  },
  constantsNote: {
    color: '#666',
    fontSize: 11,
    fontStyle: 'italic',
  },
  securityContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    marginBottom: 20,
  },
  securityTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 15,
  },
  securityContent: {
    backgroundColor: '#0f0f0f',
    padding: 15,
    borderRadius: 8,
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  securityProperty: {
    color: '#ccc',
    fontSize: 13,
  },
  securityValue: {
    color: '#0fd1aa',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  // Keunggulan SHA-256 Styles
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

export default SHA256Generator;
