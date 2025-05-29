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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TextAnalyzer = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Analisis teks real-time
  useEffect(() => {
    if (text.trim()) {
      analyzeText(text);
    } else {
      setAnalysis(null);
    }
  }, [text]);

  const analyzeText = (inputText) => {
    const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;
    
    // Hitung frekuensi kata
    const wordFreq = {};
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      if (cleanWord.length > 0) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });

    // Kata yang paling sering muncul
    const sortedWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);

    // Estimasi waktu baca (rata-rata 200 kata per menit)
    const readingTime = Math.ceil(words.length / 200);

    // Analisis tingkat kesulitan (berdasarkan panjang kata dan kalimat)
    const avgWordsPerSentence = words.length / sentences.length || 0;
    const avgCharsPerWord = charactersNoSpaces / words.length || 0;
    
    let difficulty = 'Mudah';
    if (avgWordsPerSentence > 20 || avgCharsPerWord > 6) {
      difficulty = 'Sulit';
    } else if (avgWordsPerSentence > 15 || avgCharsPerWord > 5) {
      difficulty = 'Sedang';
    }

    setAnalysis({
      characters,
      charactersNoSpaces,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      avgCharsPerWord: Math.round(avgCharsPerWord * 10) / 10,
      readingTime,
      difficulty,
      wordFreq: sortedWords,
      longestWord: words.reduce((a, b) => a.length > b.length ? a : b, ''),
      uniqueWords: Object.keys(wordFreq).length
    });
  };

  const clearText = () => {
    setText('');
    setAnalysis(null);
  };

  const copyAnalysis = () => {
    if (!analysis) return;
    
    const report = `
ANALISIS TEKS
=============
Karakter: ${analysis.characters}
Karakter (tanpa spasi): ${analysis.charactersNoSpaces}
Kata: ${analysis.words}
Kalimat: ${analysis.sentences}
Paragraf: ${analysis.paragraphs}
Rata-rata kata per kalimat: ${analysis.avgWordsPerSentence}
Rata-rata karakter per kata: ${analysis.avgCharsPerWord}
Estimasi waktu baca: ${analysis.readingTime} menit
Tingkat kesulitan: ${analysis.difficulty}
Kata unik: ${analysis.uniqueWords}
Kata terpanjang: ${analysis.longestWord}

FREKUENSI KATA TERATAS:
${analysis.wordFreq.map(([word, freq]) => `${word}: ${freq}x`).join('\n')}
    `.trim();
    
    Clipboard.setString(report);
    Alert.alert('Berhasil Disalin', 'Laporan analisis telah disalin ke clipboard');
  };

  const renderBasicStats = () => {
    if (!analysis) return null;

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Statistik Dasar</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{analysis.characters}</Text>
            <Text style={styles.statLabel}>Karakter</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{analysis.charactersNoSpaces}</Text>
            <Text style={styles.statLabel}>Tanpa Spasi</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{analysis.words}</Text>
            <Text style={styles.statLabel}>Kata</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{analysis.sentences}</Text>
            <Text style={styles.statLabel}>Kalimat</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{analysis.paragraphs}</Text>
            <Text style={styles.statLabel}>Paragraf</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{analysis.readingTime}</Text>
            <Text style={styles.statLabel}>Menit Baca</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAdvancedStats = () => {
    if (!analysis || !showAdvanced) return null;

    return (
      <View style={styles.advancedContainer}>
        <Text style={styles.advancedTitle}>Analisis Lanjutan</Text>
        
        <View style={styles.advancedItem}>
          <Text style={styles.advancedLabel}>Rata-rata kata per kalimat:</Text>
          <Text style={styles.advancedValue}>{analysis.avgWordsPerSentence}</Text>
        </View>
        
        <View style={styles.advancedItem}>
          <Text style={styles.advancedLabel}>Rata-rata karakter per kata:</Text>
          <Text style={styles.advancedValue}>{analysis.avgCharsPerWord}</Text>
        </View>
        
        <View style={styles.advancedItem}>
          <Text style={styles.advancedLabel}>Tingkat kesulitan:</Text>
          <Text style={[styles.advancedValue, styles.difficultyText]}>{analysis.difficulty}</Text>
        </View>
        
        <View style={styles.advancedItem}>
          <Text style={styles.advancedLabel}>Kata unik:</Text>
          <Text style={styles.advancedValue}>{analysis.uniqueWords}</Text>
        </View>
        
        <View style={styles.advancedItem}>
          <Text style={styles.advancedLabel}>Kata terpanjang:</Text>
          <Text style={styles.advancedValue}>{analysis.longestWord}</Text>
        </View>

        <Text style={styles.frequencyTitle}>Frekuensi Kata Teratas</Text>
        <View style={styles.frequencyContainer}>
          {analysis.wordFreq.map(([word, freq], index) => (
            <View key={index} style={styles.frequencyItem}>
              <Text style={styles.frequencyWord}>{word}</Text>
              <View style={styles.frequencyBar}>
                <View 
                  style={[
                    styles.frequencyFill, 
                    { width: `${(freq / analysis.wordFreq[0][1]) * 100}%` }
                  ]} 
                />
                <Text style={styles.frequencyCount}>{freq}x</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Analisis Teks</Text>
        <Text style={styles.subtitle}>
          Analisis mendalam untuk teks Anda
        </Text>

        {/* Text Input */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Masukkan teks untuk dianalisis:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ketik atau paste teks Anda di sini..."
            placeholderTextColor="#666"
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={8}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.clearButton]} 
            onPress={clearText}
          >
            <Text style={styles.clearButtonText}>Hapus Teks</Text>
          </TouchableOpacity>
          
          {analysis && (
            <TouchableOpacity 
              style={[styles.button, styles.copyButton]} 
              onPress={copyAnalysis}
            >
              <Text style={styles.buttonText}>Copy Laporan</Text>
            </TouchableOpacity>
          )}
        </View>

        {renderBasicStats()}

        {analysis && (
          <TouchableOpacity 
            style={styles.toggleButton} 
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            <Text style={styles.toggleButtonText}>
              {showAdvanced ? 'Sembunyikan Analisis Lanjutan' : 'Tampilkan Analisis Lanjutan'}
            </Text>
          </TouchableOpacity>
        )}

        {renderAdvancedStats()}

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Tentang Analisis Teks</Text>
          <Text style={styles.infoText}>
            Tool ini memberikan analisis komprehensif untuk teks Anda meliputi:
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.bold}>Statistik Dasar</Text>: Jumlah karakter, kata, kalimat, dan paragraf
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.bold}>Estimasi Waktu Baca</Text>: Berdasarkan rata-rata 200 kata per menit
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.bold}>Tingkat Kesulitan</Text>: Berdasarkan kompleksitas kalimat dan kata
          </Text>
          <Text style={styles.infoText}>
            • <Text style={styles.bold}>Frekuensi Kata</Text>: Kata yang paling sering digunakan
          </Text>
        </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
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
    minHeight: 150,
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
  copyButton: {
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
  statsContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    marginBottom: 20,
  },
  statsTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '32%',
    backgroundColor: '#0f0f0f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  statNumber: {
    color: '#0fd1aa',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: '#0fd1aa',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleButtonText: {
    color: '#101010',
    fontWeight: 'bold',
    fontSize: 14,
  },
  advancedContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
    marginBottom: 20,
  },
  advancedTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
  },
  advancedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#0fd1aa22',
  },
  advancedLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  advancedValue: {
    color: '#0fd1aa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  difficultyText: {
    color: '#0fd1aa',
  },
  frequencyTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  frequencyContainer: {
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    padding: 15,
  },
  frequencyItem: {
    marginBottom: 12,
  },
  frequencyWord: {
    color: '#0fd1aa',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  frequencyBar: {
    backgroundColor: '#333',
    height: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  frequencyFill: {
    backgroundColor: '#0fd1aa',
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  frequencyCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  infoContainer: {
    backgroundColor: '#1b1b1b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0fd1aa33',
  },
  infoTitle: {
    color: '#0fd1aa',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  infoText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#0fd1aa',
  },
});

export default TextAnalyzer;