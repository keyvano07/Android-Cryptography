import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
  Modal,
  Switch,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

// RSA Implementation
class RSACipher {
  constructor() {
    this.publicKey = null;
    this.privateKey = null;
  }

  generatePrime(bits = 8) {
    let prime;
    do {
      prime = Math.floor(Math.random() * (Math.pow(2, bits) - Math.pow(2, bits - 1))) + Math.pow(2, bits - 1);
    } while (!this.isPrime(prime));
    return prime;
  }

  isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  }

  gcd(a, b) {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  extendedGcd(a, b) {
    if (a === 0) return [b, 0, 1];
    
    const [gcd, x1, y1] = this.extendedGcd(b % a, a);
    const x = y1 - Math.floor(b / a) * x1;
    const y = x1;
    
    return [gcd, x, y];
  }

  modInverse(e, phi) {
    const [gcd, x, y] = this.extendedGcd(e, phi);
    if (gcd !== 1) return null;
    return ((x % phi) + phi) % phi;
  }

  modPow(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  }

  generateKeyPair(keySize = 8) {
    const p = this.generatePrime(keySize);
    const q = this.generatePrime(keySize);
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    
    let e = 65537;
    if (e >= phi) e = 3;
    
    while (this.gcd(e, phi) !== 1) {
      e += 2;
    }
    
    const d = this.modInverse(e, phi);
    
    if (!d) throw new Error('Unable to generate valid key pair');
    
    this.publicKey = { e, n };
    this.privateKey = { d, n };
    
    return {
      publicKey: this.publicKey,
      privateKey: this.privateKey,
      details: { p, q, phi, e, d, n }
    };
  }

  encrypt(message, publicKey = this.publicKey) {
    if (!publicKey) throw new Error('Public key not available');
    
    const { e, n } = publicKey;
    const encrypted = [];
    
    for (let i = 0; i < message.length; i++) {
      const charCode = message.charCodeAt(i);
      if (charCode >= n) {
        throw new Error(`Character code ${charCode} is too large for key size`);
      }
      const encryptedChar = this.modPow(charCode, e, n);
      encrypted.push(encryptedChar);
    }
    
    return encrypted;
  }

  decrypt(encryptedArray, privateKey = this.privateKey) {
    if (!privateKey) throw new Error('Private key not available');
    
    const { d, n } = privateKey;
    let decrypted = '';
    
    for (let i = 0; i < encryptedArray.length; i++) {
      const decryptedChar = this.modPow(encryptedArray[i], d, n);
      decrypted += String.fromCharCode(decryptedChar);
    }
    
    return decrypted;
  }

  formatEncrypted(encrypted) {
    return encrypted.join(',');
  }

  parseEncrypted(encryptedString) {
    return encryptedString.split(',').map(num => parseInt(num.trim()));
  }
}

// Main Component
const RSAEncryptionApp = () => {
  // RSA state
  const [rsa] = useState(new RSACipher());
  const [rsaKeys, setRsaKeys] = useState(null);
  const [rsaInputText, setRsaInputText] = useState('');
  const [rsaEncryptedText, setRsaEncryptedText] = useState('');
  const [rsaDecryptedText, setRsaDecryptedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [keySize, setKeySize] = useState(8);
  const [showDetails, setShowDetails] = useState(false);
  
  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  
  const tutorialSteps = [
    {
      title: "Apa itu RSA?",
      content: "RSA adalah algoritma enkripsi asimetris yang diciptakan oleh Ron Rivest, Adi Shamir, dan Leonard Adleman pada tahun 1977. RSA menggunakan sepasang kunci yang berbeda untuk enkripsi dan dekripsi, membuatnya sangat aman untuk komunikasi digital."
    },
    {
      title: "Prinsip Kerja RSA",
      content: "RSA bekerja berdasarkan kesulitan memfaktorkan bilangan bulat yang sangat besar. Keamanan RSA bergantung pada fakta bahwa mudah mengalikan dua bilangan prima besar, tetapi sangat sulit memfaktorkan hasil perkaliannya kembali ke bilangan prima aslinya."
    },
    {
      title: "Pembangkitan Kunci",
      content: "1. Pilih dua bilangan prima besar p dan q\n2. Hitung n = p × q (modulus)\n3. Hitung φ(n) = (p-1)(q-1) (fungsi Euler)\n4. Pilih e yang relatif prima dengan φ(n)\n5. Hitung d = e⁻¹ mod φ(n)\n\nPublic Key: (e, n)\nPrivate Key: (d, n)"
    },
    {
      title: "Proses Enkripsi & Dekripsi",
      content: "Enkripsi: C = M^e mod n\nDekripsi: M = C^d mod n\n\nDimana:\n• M = Pesan asli (plaintext)\n• C = Pesan terenkripsi (ciphertext)\n• e, n = Public key\n• d, n = Private key"
    },
    {
      title: "Keamanan & Aplikasi",
      content: "RSA digunakan dalam:\n• HTTPS (SSL/TLS)\n• Email encryption (PGP)\n• Digital signatures\n• VPN connections\n• Cryptocurrency\n\nUkuran kunci minimal 2048 bit untuk keamanan modern, demo ini menggunakan kunci kecil untuk pembelajaran."
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

  // RSA functions
  const generateRsaKeys = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const keyPair = rsa.generateKeyPair(keySize);
      setRsaKeys(keyPair);
      setRsaEncryptedText('');
      setRsaDecryptedText('');
      
      Alert.alert('Berhasil', 'Pasangan kunci RSA berhasil dibangkitkan!');
    } catch (error) {
      Alert.alert('Kesalahan', `Gagal membangkitkan kunci: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const encryptRsaMessage = async () => {
    if (!rsaKeys) {
      Alert.alert('Kesalahan', 'Silakan bangkitkan kunci terlebih dahulu');
      return;
    }
    
    if (!rsaInputText.trim()) {
      Alert.alert('Kesalahan', 'Silakan masukkan teks untuk dienkripsi');
      return;
    }

    setIsEncrypting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const encrypted = rsa.encrypt(rsaInputText, rsaKeys.publicKey);
      const formattedEncrypted = rsa.formatEncrypted(encrypted);
      setRsaEncryptedText(formattedEncrypted);
      setRsaDecryptedText('');
      
      Alert.alert('Berhasil', 'Pesan berhasil dienkripsi!');
    } catch (error) {
      Alert.alert('Kesalahan', `Enkripsi gagal: ${error.message}`);
    } finally {
      setIsEncrypting(false);
    }
  };

  const decryptRsaMessage = async () => {
    if (!rsaKeys) {
      Alert.alert('Kesalahan', 'Silakan bangkitkan kunci terlebih dahulu');
      return;
    }
    
    if (!rsaEncryptedText.trim()) {
      Alert.alert('Kesalahan', 'Tidak ada teks terenkripsi untuk didekripsi');
      return;
    }

    setIsDecrypting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const encryptedArray = rsa.parseEncrypted(rsaEncryptedText);
      const decrypted = rsa.decrypt(encryptedArray, rsaKeys.privateKey);
      setRsaDecryptedText(decrypted);
      
      Alert.alert('Berhasil', 'Pesan berhasil didekripsi!');
    } catch (error) {
      Alert.alert('Kesalahan', `Dekripsi gagal: ${error.message}`);
    } finally {
      setIsDecrypting(false);
    }
  };

  const clearRsa = () => {
    setRsaInputText('');
    setRsaEncryptedText('');
    setRsaDecryptedText('');
    setRsaKeys(null);
  };

  const swapInputOutput = () => {
    setRsaInputText(rsaDecryptedText);
    setRsaDecryptedText('');
    setRsaEncryptedText('');
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
                Tutorial RSA Encryption
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
        <Text style={styles.title}>RSA Encryption</Text>
        <Text style={styles.subtitle}>
          Enkripsi asimetris yang aman dan terpercaya
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
        {/* Key Generation */}
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>
             Generate Kunci RSA
          </Text>
          
          <View style={styles.inputSection}>
            <Text style={styles.label}>Ukuran Kunci (bits):</Text>
            <View style={styles.typeContainer}>
              {[6, 8, 10, 12].map(size => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setKeySize(size)}
                  style={[
                    styles.typeButton,
                    keySize === size && styles.typeActive
                  ]}
                >
                  <Text style={[
                    styles.typeText,
                    keySize === size && styles.typeTextActive
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.infoText}>
               Ukuran kunci kecil untuk demo pembelajaran. Gunakan minimal 2048 bit untuk produksi.
            </Text>
          </View>

          <TouchableOpacity
            onPress={generateRsaKeys}
            disabled={isGenerating}
            style={[styles.button, styles.processButton]}
          >
            {isGenerating ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#101010" />
                <Text style={styles.buttonText}>  Membangkitkan Kunci...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Bangkitkan Kunci</Text>
            )}
          </TouchableOpacity>

          {rsaKeys && (
            <View style={styles.keysContainer}>
              <View style={styles.keyBox}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultLabel}> Public Key (untuk enkripsi):</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(`e=${rsaKeys.publicKey.e}, n=${rsaKeys.publicKey.n}`, 'Public Key')}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultText}>
                    e={rsaKeys.publicKey.e}, n={rsaKeys.publicKey.n}
                  </Text>
                </View>
              </View>

              <View style={styles.keyBox}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultLabel}> Private Key (untuk dekripsi):</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(`d=${rsaKeys.privateKey.d}, n=${rsaKeys.privateKey.n}`, 'Private Key')}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultText}>
                    d={rsaKeys.privateKey.d}, n={rsaKeys.privateKey.n}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsToggle}>
                <Text style={styles.label}>Tampilkan Detail Pembangkitan</Text>
                <Switch
                  value={showDetails}
                  onValueChange={setShowDetails}
                  trackColor={{ false: '#666', true: '#0fd1aa' }}
                  thumbColor="#fff"
                />
              </View>

              {showDetails && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.resultLabel}>🔍 Detail Pembangkitan Kunci</Text>
                  <View style={styles.detailsList}>
                    {[
                      ['Prima p:', rsaKeys.details.p],
                      ['Prima q:', rsaKeys.details.q],
                      ['n = p × q:', rsaKeys.details.n],
                      ['φ(n) = (p-1)(q-1):', rsaKeys.details.phi],
                      ['Eksponen publik (e):', rsaKeys.details.e],
                      ['Eksponen privat (d):', rsaKeys.details.d]
                    ].map(([label, value]) => (
                      <View key={label} style={styles.detailItem}>
                        <Text style={styles.detailLabel}>{label}</Text>
                        <Text style={styles.detailValue}>{value}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.infoText}>
                    💡 Rumus: d ≡ e⁻¹ (mod φ(n))
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Encryption Section */}
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>
            Enkripsi Pesan
          </Text>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Pesan untuk dienkripsi:</Text>
            <TextInput
              value={rsaInputText}
              onChangeText={setRsaInputText}
              multiline
              numberOfLines={3}
              style={[styles.textInput, styles.textArea]}
              placeholder="Masukkan pesan untuk dienkripsi..."
              placeholderTextColor="#666"
            />
            <Text style={styles.infoText}>
              Rumus enkripsi: C = M^e mod n
            </Text>
          </View>

          <TouchableOpacity
            onPress={encryptRsaMessage}
            disabled={isEncrypting || !rsaKeys}
            style={[styles.button, styles.processButton, (!rsaKeys || isEncrypting) && styles.disabledButton]}
          >
            {isEncrypting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#101010" />
                <Text style={styles.buttonText}>  Mengenkripsi...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Enkripsi Pesan</Text>
            )}
          </TouchableOpacity>

          {rsaEncryptedText && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}> Pesan Terenkripsi:</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(rsaEncryptedText)}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionText}>Copy</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultText} selectable>
                  {rsaEncryptedText}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Decryption Section */}
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>
            Dekripsi Pesan
          </Text>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Teks Terenkripsi:</Text>
            <TextInput
              value={rsaEncryptedText}
              onChangeText={setRsaEncryptedText}
              multiline
              numberOfLines={3}
              style={[styles.textInput, styles.textArea]}
              placeholder="Masukkan teks terenkripsi (angka dipisah koma)..."
              placeholderTextColor="#666"
            />
            <Text style={styles.infoText}>
              Rumus dekripsi: M = C^d mod n
            </Text>
          </View>

          <TouchableOpacity
            onPress={decryptRsaMessage}
            disabled={isDecrypting || !rsaKeys}
            style={[styles.button, styles.processButton, (!rsaKeys || isDecrypting) && styles.disabledButton]}
          >
            {isDecrypting ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#101010" />
                <Text style={styles.buttonText}>  Mendekripsi...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Dekripsi Pesan</Text>
            )}
          </TouchableOpacity>

          {rsaDecryptedText && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}>Pesan Terdekripsi:</Text>
                <View style={styles.resultActions}>
                  <TouchableOpacity onPress={swapInputOutput} style={styles.actionButton}>
                    <Text style={styles.actionText}>Paste</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(rsaDecryptedText)}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionText}>Copy</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultText} selectable>
                  {rsaDecryptedText}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Clear Button */}
        <TouchableOpacity
          onPress={clearRsa}
          style={[styles.button, styles.clearButton]}
        >
          <Text style={styles.clearButtonText}>Hapus Semua</Text>
        </TouchableOpacity>

        {/* About Section */}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>Tentang RSA Encryption</Text>
          <Text style={styles.aboutText}>
            RSA (Rivest-Shamir-Adleman) adalah algoritma enkripsi asimetris yang dikembangkan pada tahun 1977. 
            Algoritma ini menggunakan sepasang kunci (public dan private key) dan berdasarkan pada kesulitan 
            matematika memfaktorkan bilangan bulat yang sangat besar menjadi faktor prima.
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Public Key</Text>: Digunakan untuk enkripsi, dapat dibagikan secara bebas
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Private Key</Text>: Digunakan untuk dekripsi, harus dijaga kerahasiaannya
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Keamanan</Text>: Berdasarkan kesulitan memfaktorkan bilangan prima besar
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Aplikasi</Text>: HTTPS, email encryption, digital signature, cryptocurrency
          </Text>

          <TouchableOpacity onPress={toggleVideo} style={styles.videoButton}>
            <Text style={styles.videoButtonText}>
              {showVideo ? 'Sembunyikan Video' : 'Tampilkan Video Penjelasan RSA'}
            </Text>
          </TouchableOpacity>

          {showVideo && (
            <View style={styles.videoContainer}>
              <Text style={styles.videoTitle}>Tutorial RSA Encryption</Text>
              <WebView
                source={{ uri: 'https://www.youtube.com/embed/4zahvcJ9glg' }}
                style={styles.videoPlayer}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsFullscreenVideo={true}
              />
            </View>
          )}

          <View style={styles.securityNoteContainer}>
            <Text style={styles.securityNoteTitle}>Catatan Keamanan</Text>
            <Text style={styles.securityNoteText}>
              • Demo ini menggunakan kunci kecil (6-12 bit) untuk pembelajaran
            </Text>
            <Text style={styles.securityNoteText}>
              • Untuk aplikasi nyata, gunakan minimal 2048 bit (rekomendasi 4096 bit)
            </Text>
            <Text style={styles.securityNoteText}>
              • Jangan pernah membagikan private key Anda
            </Text>
            <Text style={styles.securityNoteText}>
              • RSA dengan kunci kecil dapat dipecahkan dengan mudah
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
  inputSection: {
    marginBottom: 20,
  },
  label: {
    color: '#0fd1aa',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 4,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  typeActive: {
    backgroundColor: '#0fd1aa',
  },
  typeText: {
    color: '#999',
    fontWeight: 'bold',
    fontSize: 14,
  },
  typeTextActive: {
    color: '#101010',
  },
  infoText: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    backgroundColor: '#1b1b1b',
    padding: 15,
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 8,
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
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
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
  keysContainer: {
    marginTop: 16,
    gap: 12,
  },
  keyBox: {
    marginBottom: 12,
  },
  detailsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailsContainer: {
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    padding: 15,
    marginTop: 12,
  },
  detailsList: {
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
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

export default RSAEncryptionApp;