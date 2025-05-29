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

const URLEncoder = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState('encode'); 
  const [encodingType, setEncodingType] = useState('component'); 
  const [showVideo, setShowVideo] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  
  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Apa itu URL Encoding?",
      content: "URL Encoding (juga dikenal sebagai Percent Encoding) adalah metode untuk mengkonversi karakter khusus dalam URL menjadi format yang aman untuk transmisi web. Karakter yang tidak aman diubah menjadi format %XX dimana XX adalah kode hexadecimal ASCII. Ini memastikan URL dapat ditransmisikan dengan benar melalui internet tanpa mengalami kerusakan atau kesalahan interpretasi."
    },
    {
      title: "Mengapa URL Encoding Diperlukan?",
      content: "URL Encoding diperlukan karena:\n• URL hanya boleh mengandung karakter ASCII yang aman\n• Karakter seperti spasi, &, ?, # memiliki arti khusus dalam URL\n• Non-ASCII characters (é, ñ, 中) perlu dikonversi\n• Mencegah konflik dengan struktur URL\n• Memastikan data dapat dikirim dengan benar\n\nTanpa encoding, URL dapat rusak atau salah interpretasi."
    },
    {
      title: "Tipe-tipe URL Encoding",
      content: "Tiga jenis utama URL encoding:\n\n• encodeURIComponent: Mengenkode hampir semua karakter kecuali A-Z, a-z, 0-9, -, _, ., ~\n• encodeURI: Mengenkode karakter berbahaya tapi mempertahankan struktur URI (:, /, ?, #, dll.)\n• Form Encoding: Seperti component tapi menggunakan + untuk spasi (application/x-www-form-urlencoded)\n\nPilih tipe sesuai kebutuhan!"
    },
    {
      title: "Karakter Reserved & Unsafe",
      content: "Karakter yang perlu di-encode:\n\nReserved Characters:\n: / ? # [ ] @ ! $ & ' ( ) * + , ; =\n\nUnsafe Characters:\nSpasi, <, >, \", %, {, }, |, \\, ^, ~, `, non-ASCII\n\nContoh:\n• Spasi → %20 (atau + dalam form)\n• @ → %40\n• & → %26\n• é → %C3%A9"
    },
    {
      title: "Penggunaan URL Encoding",
      content: "URL Encoding digunakan dalam:\n• Query parameters: ?name=John%20Doe\n• Form submissions (POST/GET)\n• API endpoints dengan parameter\n• File paths dengan spasi atau karakter khusus\n• Social media sharing URLs\n• Email links dan redirects\n• Database URLs dan connection strings\n• OAuth dan authentication flows"
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

  // URL encoding/decoding functions
  const urlEncode = (str, type = 'component') => {
    try {
      switch (type) {
        case 'component':
          return encodeURIComponent(str);
        case 'uri':
          return encodeURI(str);
        case 'form':
          return encodeURIComponent(str).replace(/%20/g, '+');
        default:
          return encodeURIComponent(str);
      }
    } catch (error) {
      throw new Error('Gagal mengenkode URL');
    }
  };

  const urlDecode = (str, type = 'component') => {
    try {
      let decodedStr = str;
      // Handle form encoding (+ to space)
      if (type === 'form') {
        decodedStr = str.replace(/\+/g, '%20');
      }
      return decodeURIComponent(decodedStr);
    } catch (error) {
      throw new Error('URL tidak valid atau rusak');
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
        processed = urlEncode(text, encodingType);
      } else {
        processed = urlDecode(text, encodingType);
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

  const toggleExamples = () => {
    setShowExamples(!showExamples);
  };

  // Generate URL encoding examples
  const getURLExamples = () => {
    const examples = [
      'Hello World!',
      'user@example.com',
      'https://example.com/path?query=value&key=data',
      'Café & Restaurant',
      '100% Pure Java',
      'Data with spaces and symbols: @#$%^&*()',
      'path/to/file name.txt',
      'query=search term&category=books'
    ];

    return examples.map(example => ({
      original: example,
      component: encodeURIComponent(example),
      uri: encodeURI(example),
      form: encodeURIComponent(example).replace(/%20/g, '+')
    }));
  };

  // Generate reserved characters table
  const getReservedChars = () => {
    return [
      { char: ' ', name: 'Space', encoded: '%20', form: '+' },
      { char: '!', name: 'Exclamation', encoded: '%21', form: '%21' },
      { char: '"', name: 'Quote', encoded: '%22', form: '%22' },
      { char: '#', name: 'Hash', encoded: '%23', form: '%23' },
      { char: '$', name: 'Dollar', encoded: '%24', form: '%24' },
      { char: '%', name: 'Percent', encoded: '%25', form: '%25' },
      { char: '&', name: 'Ampersand', encoded: '%26', form: '%26' },
      { char: "'", name: 'Apostrophe', encoded: '%27', form: '%27' },
      { char: '(', name: 'Left Paren', encoded: '%28', form: '%28' },
      { char: ')', name: 'Right Paren', encoded: '%29', form: '%29' },
      { char: '*', name: 'Asterisk', encoded: '%2A', form: '%2A' },
      { char: '+', name: 'Plus', encoded: '%2B', form: '%2B' },
      { char: ',', name: 'Comma', encoded: '%2C', form: '%2C' },
      { char: '/', name: 'Slash', encoded: '%2F', form: '%2F' },
      { char: ':', name: 'Colon', encoded: '%3A', form: '%3A' },
      { char: ';', name: 'Semicolon', encoded: '%3B', form: '%3B' },
      { char: '=', name: 'Equal', encoded: '%3D', form: '%3D' },
      { char: '?', name: 'Question', encoded: '%3F', form: '%3F' },
      { char: '@', name: 'At', encoded: '%40', form: '%40' },
      { char: '[', name: 'Left Bracket', encoded: '%5B', form: '%5B' },
      { char: ']', name: 'Right Bracket', encoded: '%5D', form: '%5D' }
    ];
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
                Tutorial URL Encoding
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

  const renderExamples = () => {
    if (!showExamples) return null;

    const examples = getURLExamples();
    
    return (
      <View style={styles.examplesContainer}>
        <Text style={styles.examplesTitle}>Contoh URL Encoding</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.examplesTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: 200 }]}>Original</Text>
              <Text style={[styles.tableHeaderText, { width: 250 }]}>Component</Text>
              <Text style={[styles.tableHeaderText, { width: 250 }]}>URI</Text>
              <Text style={[styles.tableHeaderText, { width: 250 }]}>Form</Text>
            </View>
            {examples.map((example, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCellText, { width: 200 }]}>
                  {example.original}
                </Text>
                <Text style={[styles.tableCellText, { width: 250 }]}>
                  {example.component}
                </Text>
                <Text style={[styles.tableCellText, { width: 250 }]}>
                  {example.uri}
                </Text>
                <Text style={[styles.tableCellText, { width: 250 }]}>
                  {example.form}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.reservedTitle}>Karakter Reserved</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.reservedTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: 60 }]}>Char</Text>
              <Text style={[styles.tableHeaderText, { width: 120 }]}>Name</Text>
              <Text style={[styles.tableHeaderText, { width: 100 }]}>Encoded</Text>
              <Text style={[styles.tableHeaderText, { width: 100 }]}>Form</Text>
            </View>
            {getReservedChars().map((char, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCellText, { width: 60 }]}>
                  {char.char}
                </Text>
                <Text style={[styles.tableCellText, { width: 120 }]}>
                  {char.name}
                </Text>
                <Text style={[styles.tableCellText, { width: 100 }]}>
                  {char.encoded}
                </Text>
                <Text style={[styles.tableCellText, { width: 100 }]}>
                  {char.form}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderVideo = () => {
    if (!showVideo) return null;

    return (
      <View style={styles.videoContainer}>
        <Text style={styles.videoTitle}>Tutorial URL Encoding</Text>
        <WebView
          style={styles.webview}
          source={{ uri: 'https://www.youtube.com/embed/4bt0yrAYJRo' }}
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>URL Encoder/Decoder</Text>
          <Text style={styles.subtitle}>
            Encode dan decode URL dengan mudah
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
              Encode
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mode === 'decode' && styles.modeActive]}
            onPress={() => setMode('decode')}
          >
            <Text style={[styles.modeText, mode === 'decode' && styles.modeTextActive]}>
              Decode
            </Text>
          </TouchableOpacity>
        </View>

        {/* Encoding Type Selection */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Tipe Encoding:</Text>
          <View style={styles.typeContainer}>
            {['component', 'uri', 'form'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  encodingType === type && styles.typeActive
                ]}
                onPress={() => setEncodingType(type)}
              >
                <Text style={[
                  styles.typeText,
                  encodingType === type && styles.typeTextActive
                ]}>
                  {type.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Text Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>
            {mode === 'encode' ? 'Teks untuk di-encode:' : 'URL untuk di-decode:'}
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={
              mode === 'encode' 
                ? 'Masukkan teks yang akan di-encode...' 
                : 'Masukkan URL yang akan di-decode...'
            }
            placeholderTextColor="#666"
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.processButton]} 
            onPress={processText}
          >
            <Text style={styles.buttonText}>
              {mode === 'encode' ? 'Encode' : 'Decode'}
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
              <Text style={styles.resultLabel}>Hasil:</Text>
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
          </View>
        ) : null}

        {/* Toggle Buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleExamples}>
            <Text style={styles.toggleButtonText}>
              {showExamples ? 'Sembunyikan Contoh' : 'Tampilkan Contoh'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toggleButton} onPress={toggleVideo}>
            <Text style={styles.toggleButtonText}>
              {showVideo ? 'Sembunyikan Video' : 'Tampilkan Tutorial'}
            </Text>
          </TouchableOpacity>
        </View>

        {renderExamples()}
        {renderVideo()}

        {/* Keunggulan URL Encoding */}
        <View style={styles.advantagesContainer}>
          <Text style={styles.advantagesTitle}>Keunggulan URL Encoding</Text>
          <View style={styles.advantagesContent}>
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>🌐 Universal Web Safety</Text>
              <Text style={styles.advantageText}>
                Memastikan karakter khusus aman untuk transmisi melalui HTTP/HTTPS. 
                Mencegah kerusakan URL dan kesalahan interpretasi oleh browser 
                atau server web.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>🔗 Cross-Platform Compatibility</Text>
              <Text style={styles.advantageText}>
                Bekerja konsisten di semua browser, platform, dan sistem operasi. 
                Mendukung karakter internasional dan emoji dalam URL dengan sempurna.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>📊 Data Integrity</Text>
              <Text style={styles.advantageText}>
                Menjaga integritas data saat dikirim melalui query parameters atau 
                form submissions. Mencegah kehilangan atau korupsi data yang 
                mengandung karakter khusus.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>🔧 Multiple Encoding Types</Text>
              <Text style={styles.advantageText}>
                Menyediakan tiga tipe encoding yang berbeda (Component, URI, Form) 
                untuk berbagai kebutuhan, dari query parameters hingga complete URLs.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>⚡ Fast & Efficient</Text>
              <Text style={styles.advantageText}>
                Proses encoding/decoding yang cepat dan ringan. Built-in di semua 
                browser modern dan tidak memerlukan library tambahan.
              </Text>
            </View>
            
            <View style={styles.advantageItem}>
              <Text style={styles.advantageTitle}>🛡️ Security Enhancement</Text>
              <Text style={styles.advantageText}>
                Mencegah URL injection attacks dan XSS melalui parameter URL. 
                Membuat aplikasi web lebih aman dengan properly encoded user input.
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>Tentang URL Encoding</Text>
          <Text style={styles.aboutText}>
            URL encoding adalah proses mengkonversi karakter khusus dalam URL menjadi 
            format yang dapat diterima oleh web browser dan server. Ada tiga tipe utama:
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>encodeURIComponent</Text>: Mengenkode semua karakter kecuali huruf, angka, dan -_.~
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>encodeURI</Text>: Mengenkode karakter khusus tapi mempertahankan struktur URI
          </Text>
          <Text style={styles.aboutText}>
            • <Text style={styles.bold}>Form encoding</Text>: Seperti component tapi menggunakan + untuk spasi
          </Text>
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
  typeContainer: {
    flexDirection: 'row',
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 4,
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
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: '#0fd1aa',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  toggleButtonText: {
    color: '#101010',
    fontWeight: 'bold',
    fontSize: 14,
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
  examplesTable: {
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    borderRadius: 8,
    backgroundColor: '#0f0f0f',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0fd1aa',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#101010',
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#0fd1aa33',
  },
  tableCellText: {
    fontSize: 12,
    color: '#ccc',
    paddingHorizontal: 4,
  },
  reservedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#0fd1aa',
  },
  reservedTable: {
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    borderRadius: 8,
    backgroundColor: '#0f0f0f',
  },
  videoContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    marginBottom: 20,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0fd1aa',
  },
  webview: {
    height: 200,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  // Keunggulan URL Encoding Styles
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
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#0fd1aa',
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

export default URLEncoder;
