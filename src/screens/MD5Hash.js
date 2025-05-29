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
import CryptoJS from 'crypto-js';

const MD5Hash = () => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Apa itu Hash Function?",
      content: "Hash function adalah fungsi matematika yang mengubah data input dengan ukuran sembarang menjadi string dengan panjang tetap. Hash bersifat satu arah (irreversible) - mudah menghitung hash dari input, tetapi sangat sulit mengembalikan input dari hash-nya."
    },
    {
      title: "Tentang MD5 Algorithm",
      content: "MD5 (Message-Digest Algorithm 5) dikembangkan oleh Ronald Rivest pada tahun 1991. MD5 menghasilkan hash 128-bit (32 karakter heksadesimal) dan telah banyak digunakan untuk:\n• Verifikasi integritas file\n• Checksum\n• Password hashing (tidak disarankan lagi)\n• Digital fingerprinting"
    },
    {
      title: "Karakteristik MD5",
      content: "Sifat-sifat MD5:\n• Deterministic: Input sama selalu menghasilkan hash sama\n• Fixed Length: Selalu 128-bit (32 hex chars)\n• Avalanche Effect: Perubahan kecil input → perubahan besar hash\n• Fast Computation: Cepat dihitung\n• One-way: Tidak bisa di-reverse\n\nContoh: 'hello' → '5d41402abc4b2a76b9719d911017c592'"
    },
    {
      title: "Kegunaan dan Aplikasi",
      content: "MD5 digunakan untuk:\n• File integrity checking\n• Data deduplication\n• Non-cryptographic checksums\n• Legacy system compatibility\n• Digital forensics\n• Software distribution verification\n\nTidak untuk: Password storage, digital signatures, atau aplikasi keamanan kritis"
    },
    {
      title: "Keamanan dan Kelemahan",
      content: "MD5 memiliki kelemahan serius:\n• Collision attacks: Dua input berbeda bisa menghasilkan hash sama\n• Rainbow table attacks\n• Tidak collision-resistant\n• Deprecated untuk aplikasi kriptografi\n\nAlternatif: SHA-256, SHA-3, BLAKE2 untuk keamanan modern"
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

  const copyToClipboard = (text, label = 'Hash') => {
    Clipboard.setString(text);
    Alert.alert('Berhasil Disalin', `${label} telah disalin ke clipboard!`);
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const generateHash = async () => {
    if (!input.trim()) {
      Alert.alert('Kesalahan', 'Silakan masukkan teks untuk di-hash');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const md5Hash = CryptoJS.MD5(input).toString();
      setHash(md5Hash);
      
      Alert.alert('Berhasil', 'Hash MD5 berhasil dibuat!');
    } catch (error) {
      Alert.alert('Kesalahan', 'Gagal membuat hash');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setInput('');
    setHash('');
  };

  const generateExamples = () => {
    const examples = [
      'Hello World',
      'password123',
      'The quick brown fox jumps over the lazy dog',
      '12345',
      'admin'
    ];
    
    return examples.map(text => ({
      input: text,
      hash: CryptoJS.MD5(text).toString()
    }));
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
                Tutorial MD5 Hash
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
        <Text style={styles.title}>MD5 Hash Generator</Text>
        <Text style={styles.subtitle}>
          Pembuat hash MD5 untuk verifikasi integritas data
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
        {/* Input Section */}
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Input Data</Text>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Teks untuk di-hash:</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Masukkan teks untuk dibuat hash MD5..."
              placeholderTextColor="#666"
              value={input}
              onChangeText={setInput}
              multiline
              numberOfLines={4}
            />
            <Text style={styles.infoText}>
              MD5 akan menghasilkan hash 128-bit (32 karakter hex) untuk input apapun
            </Text>
            <Text style={styles.infoText}>
              MD5 tidak aman untuk password atau data sensitif
            </Text>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={[styles.button, styles.processButton, isProcessing && styles.disabledButton]}
            onPress={generateHash}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#101010" />
                <Text style={styles.buttonText}>  Membuat Hash...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Buat Hash MD5</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Result Section */}
        {hash && (
          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Hasil Hash MD5</Text>
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}>Hash MD5:</Text>
                <TouchableOpacity onPress={() => copyToClipboard(hash)} style={styles.actionButton}>
                  <Text style={styles.actionText}>Copy</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.hashContainer}>
                <Text style={styles.resultText} selectable>
                  {hash}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Panjang:</Text>
                  <Text style={styles.infoValue}>{hash.length} karakter</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Algoritma:</Text>
                  <Text style={styles.infoValue}>MD5 (128-bit)</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Format:</Text>
                  <Text style={styles.infoValue}>Hexadecimal</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Input:</Text>
                  <Text style={styles.infoValue} numberOfLines={2}>"{input}"</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Examples Section */}
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Contoh Hash MD5</Text>
          <Text style={styles.aboutText}>
            Berikut beberapa contoh hash MD5 dari input yang umum:
          </Text>
          {generateExamples().map((example, index) => (
            <View key={index} style={styles.exampleItem}>
              <View style={styles.exampleHeader}>
                <Text style={styles.exampleInput}>"{example.input}"</Text>
                <TouchableOpacity 
                  onPress={() => copyToClipboard(example.hash)}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionText}>Copy</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.resultTextContainer}>
                <Text style={styles.exampleHash} selectable>
                  {example.hash}
                </Text>
              </View>
            </View>
          ))}
          <Text style={styles.infoText}>
            Perhatikan: Input yang sama selalu menghasilkan hash yang sama
          </Text>
        </View>

        {/* Hash Properties Demo */}
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Demonstrasi Avalanche Effect</Text>
          <Text style={styles.aboutText}>
            Perubahan kecil pada input menghasilkan perubahan besar pada hash:
          </Text>
          <View style={styles.avalancheDemo}>
            <View style={styles.avalancheItem}>
              <Text style={styles.avalancheLabel}>Input: "hello"</Text>
              <View style={styles.resultTextContainer}>
                <Text style={styles.avalancheHash}>
                  {CryptoJS.MD5("hello").toString()}
                </Text>
              </View>
            </View>
            <View style={styles.avalancheItem}>
              <Text style={styles.avalancheLabel}>Input: "Hello" (huruf H besar)</Text>
              <View style={styles.resultTextContainer}>
                <Text style={styles.avalancheHash}>
                  {CryptoJS.MD5("Hello").toString()}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.infoText}>
            Perubahan satu huruf menghasilkan hash yang sepenuhnya berbeda!
          </Text>
        </View>

        {/* Clear Button */}
        <TouchableOpacity
          onPress={clearAll}
          style={[styles.button, styles.clearButton]}
        >
          <Text style={styles.clearButtonText}>Hapus Semua</Text>
        </TouchableOpacity>

        {/* Keunggulan MD5 */}
        <View style={styles.advantagesContainer}>
          <Text style={styles.advantagesTitle}>Keunggulan MD5</Text>
          <View style={styles.advantagesContent}>
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>Extremely Fast Performance</Text>
              <Text style={styles.advantageText}>
                MD5 adalah salah satu algoritma hash tercepat yang tersedia. 
                Sangat efisien untuk memproses data dalam jumlah besar dan 
                ideal untuk aplikasi yang membutuhkan performa tinggi.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>Universal Platform Support</Text>
              <Text style={styles.advantageText}>
                Didukung oleh hampir semua bahasa pemrograman, platform, dan 
                sistem operasi. MD5 telah menjadi standar de facto selama 
                lebih dari 30 tahun.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>Compact Output Size</Text>
              <Text style={styles.advantageText}>
                Menghasilkan hash berukuran kecil (128-bit) yang efisien untuk 
                penyimpanan dan transmisi. Ideal untuk checksum dan identifikasi 
                file dalam database.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>Perfect Deterministic Behavior</Text>
              <Text style={styles.advantageText}>
                Input yang sama selalu menghasilkan hash yang identik. 
                Properti ini sangat berguna untuk verifikasi integritas data 
                dan deteksi perubahan file.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>Legacy System Compatibility</Text>
              <Text style={styles.advantageText}>
                Masih banyak digunakan dalam sistem legacy dan aplikasi lama. 
                Penting untuk backward compatibility dan interoperabilitas 
                dengan sistem existing.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>Non-Cryptographic Applications</Text>
              <Text style={styles.advantageText}>
                Sangat baik untuk aplikasi non-kriptografi seperti checksums, 
                ETags, data deduplication, dan cache keys dimana collision 
                resistance bukan prioritas utama.
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>Tentang MD5 Hash Function</Text>
          <Text style={styles.aboutText}>
            MD5 (Message-Digest Algorithm 5) adalah fungsi hash kriptografi yang dikembangkan oleh 
            Ronald Rivest pada tahun 1991. MD5 menghasilkan nilai hash 128-bit dan telah banyak 
            digunakan untuk verifikasi integritas data dan checksum file.
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Deterministic</Text>: Input sama selalu menghasilkan hash sama
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Fixed Length</Text>: Selalu menghasilkan 32 karakter hexadecimal
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Avalanche Effect</Text>: Perubahan kecil input = perubahan besar hash
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Fast Computation</Text>: Sangat cepat untuk dihitung
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>One-way Function</Text>: Tidak dapat di-reverse untuk mendapatkan input asli
          </Text>

          <TouchableOpacity onPress={toggleVideo} style={styles.videoButton}>
            <Text style={styles.videoButtonText}>
              {showVideo ? 'Sembunyikan Video' : 'Tampilkan Video Penjelasan MD5'}
            </Text>
          </TouchableOpacity>

          {showVideo && (
            <View style={styles.videoContainer}>
              <Text style={styles.videoTitle}>Tutorial MD5 Hash Function</Text>
              <WebView
                source={{ uri: 'https://www.youtube.com/embed/5MiMK45gkTY?start=53' }}
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
              • MD5 tidak aman untuk aplikasi kriptografi modern
            </Text>
            <Text style={styles.securityNoteText}>
              • Rentan terhadap collision attacks dan rainbow table attacks
            </Text>
            <Text style={styles.securityNoteText}>
              • Jangan gunakan untuk password hashing atau digital signatures
            </Text>
            <Text style={styles.securityNoteText}>
              • Gunakan SHA-256, SHA-3, atau BLAKE2 untuk keamanan modern
            </Text>
            <Text style={styles.securityNoteText}>
              • MD5 masih berguna untuk checksum non-kriptografi dan legacy systems
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
  },
  actionButton: {
    marginLeft: 15,
  },
  actionText: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  hashContainer: {
    backgroundColor: '#0f0f0f',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
  },
  resultText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
    letterSpacing: 1,
  },
  resultTextContainer: {
    backgroundColor: '#0f0f0f',
    padding: 15,
    borderRadius: 8,
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#0fd1aa33',
    paddingTop: 15,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    color: '#0fd1aa',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  infoValue: {
    color: '#ccc',
    fontSize: 14,
    flex: 2,
    textAlign: 'right',
  },
  exampleItem: {
    marginBottom: 12,
    gap: 8,
  },
  exampleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exampleInput: {
    color: '#ccc',
    fontSize: 14,
    fontStyle: 'italic',
    flex: 1,
  },
  exampleHash: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  avalancheDemo: {
    gap: 12,
    marginBottom: 12,
  },
  avalancheItem: {
    gap: 8,
  },
  avalancheLabel: {
    color: '#0fd1aa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  avalancheHash: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  // Keunggulan MD5 Styles
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

export default MD5Hash;
