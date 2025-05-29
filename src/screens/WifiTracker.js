import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const RADAR_SIZE = width - 40;
const RADAR_CENTER = RADAR_SIZE / 2;

const WiFiTracker = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [wifiNetworks, setWifiNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanHistory, setScanHistory] = useState([]);
  const rotationValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(0)).current;

  // Generate mock WiFi data / data dumy
  const generateMockWiFiData = () => {
    const mockNetworks = [
      { ssid: 'Rumah_WiFi', signal: -45, security: 'WPA2', frequency: '2.4GHz', distance: 50 },
      { ssid: 'Indihome_5G', signal: -55, security: 'WPA3', frequency: '5GHz', distance: 80 },
      { ssid: 'OFFICE_NET', signal: -65, security: 'WPA2', frequency: '2.4GHz', distance: 120 },
      { ssid: 'MyRepublic_Fast', signal: -40, security: 'WPA2', frequency: '5GHz', distance: 30 },
      { ssid: 'Tetangga_123', signal: -75, security: 'WEP', frequency: '2.4GHz', distance: 150 },
      { ssid: 'Cafe_Free_WiFi', signal: -60, security: 'Open', frequency: '2.4GHz', distance: 100 },
      { ssid: 'IndiHome_Gaming', signal: -50, security: 'WPA2', frequency: '5GHz', distance: 70 },
      { ssid: 'Android_Hotspot', signal: -70, security: 'WPA2', frequency: '2.4GHz', distance: 130 },
    ];

    return mockNetworks.map(network => ({
      ...network,
      id: Math.random().toString(36).substr(2, 9),
      angle: Math.random() * 360,
      lastSeen: new Date(),
      macAddress: Array.from({length: 6}, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':'),
      channel: Math.floor(Math.random() * 11) + 1,
    }));
  };

  // Animation effects
  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    if (isScanning) {
      rotateAnimation.start();
      pulseAnimation.start();
    } else {
      rotateAnimation.stop();
      pulseAnimation.stop();
    }

    return () => {
      rotateAnimation.stop();
      pulseAnimation.stop();
    };
  }, [isScanning]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setWifiNetworks([]);

    // Simulate scanning process
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(scanInterval);
          setIsScanning(false);
          const newNetworks = generateMockWiFiData();
          setWifiNetworks(newNetworks);
          setScanHistory(prev => [
            {
              timestamp: new Date(),
              networks: newNetworks,
              count: newNetworks.length
            },
            ...prev.slice(0, 4)
          ]);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const stopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
  };

  const getSignalStrength = (signal) => {
    if (signal > -50) return 'Sangat Kuat';
    if (signal > -60) return 'Kuat';
    if (signal > -70) return 'Sedang';
    return 'Lemah';
  };

  const getSignalColor = (signal) => {
    if (signal > -50) return '#00ff00';
    if (signal > -60) return '#ffff00';
    if (signal > -70) return '#ff8800';
    return '#ff0000';
  };

  const getDistanceFromSignal = (signal) => {
    return Math.floor(Math.pow(10, (-signal - 27) / 20));
  };

  const renderRadar = () => {
    const rotation = rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const pulseOpacity = pulseValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.8],
    });

    const pulseScale = pulseValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1.2],
    });

    return (
      <View style={styles.radarContainer}>
        <Svg height={RADAR_SIZE} width={RADAR_SIZE} style={styles.radarSvg}>
          {/* Radar grid circles */}
          {[0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <Circle
              key={`circle-${index}`}
              cx={RADAR_CENTER}
              cy={RADAR_CENTER}
              r={RADAR_CENTER * ratio}
              stroke="#333"
              strokeWidth="1"
              fill="none"
            />
          ))}

          {/* Cross lines */}
          <Line
            x1={0}
            y1={RADAR_CENTER}
            x2={RADAR_SIZE}
            y2={RADAR_CENTER}
            stroke="#333"
            strokeWidth="1"
          />
          <Line
            x1={RADAR_CENTER}
            y1={0}
            x2={RADAR_CENTER}
            y2={RADAR_SIZE}
            stroke="#333"
            strokeWidth="1"
          />

          {/* Radar sweep line */}
          <Animated.View style={{
            position: 'absolute',
            width: RADAR_SIZE,
            height: RADAR_SIZE,
            transform: [{ rotate: rotation }]
          }}>
            <Svg height={RADAR_SIZE} width={RADAR_SIZE}>
              <Line
                x1={RADAR_CENTER}
                y1={RADAR_CENTER}
                x2={RADAR_CENTER}
                y2={0}
                stroke="#0fd1aa"
                strokeWidth="2"
              />
            </Svg>
          </Animated.View>

          {/* Pulse effect */}
          <Animated.View style={{
            position: 'absolute',
            width: RADAR_SIZE,
            height: RADAR_SIZE,
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }]
          }}>
            <Svg height={RADAR_SIZE} width={RADAR_SIZE}>
              <Circle
                cx={RADAR_CENTER}
                cy={RADAR_CENTER}
                r={RADAR_CENTER}
                stroke="#0fd1aa"
                strokeWidth="2"
                fill="none"
              />
            </Svg>
          </Animated.View>

          {/* WiFi network points */}
          {wifiNetworks.map((network) => (
            <G key={`wifi-${network.id}`}>
              <Circle
                cx={RADAR_CENTER + Math.cos(network.angle * Math.PI / 180) * (network.distance / 200) * RADAR_CENTER}
                cy={RADAR_CENTER + Math.sin(network.angle * Math.PI / 180) * (network.distance / 200) * RADAR_CENTER}
                r="6"
                fill={getSignalColor(network.signal)}
              />
              <SvgText
                x={RADAR_CENTER + Math.cos(network.angle * Math.PI / 180) * (network.distance / 200) * RADAR_CENTER + 10}
                y={RADAR_CENTER + Math.sin(network.angle * Math.PI / 180) * (network.distance / 200) * RADAR_CENTER}
                fill="#fff"
                fontSize="10"
                fontWeight="bold"
              >
                {network.ssid}
              </SvgText>
            </G>
          ))}
        </Svg>
      </View>
    );
  };

  const renderNetworkDetails = () => {
    if (!selectedNetwork) return null;

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Detail Jaringan</Text>
          <TouchableOpacity onPress={() => setSelectedNetwork(null)}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.detailsContent}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nama:</Text>
            <Text style={styles.detailValue}>{selectedNetwork.ssid}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>MAC Address:</Text>
            <Text style={styles.detailValue}>{selectedNetwork.macAddress}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kekuatan Sinyal:</Text>
            <Text style={[styles.detailValue, { color: getSignalColor(selectedNetwork.signal) }]}>
              {selectedNetwork.signal} dBm ({getSignalStrength(selectedNetwork.signal)})
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Keamanan:</Text>
            <Text style={styles.detailValue}>{selectedNetwork.security}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Frekuensi:</Text>
            <Text style={styles.detailValue}>{selectedNetwork.frequency}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Channel:</Text>
            <Text style={styles.detailValue}>{selectedNetwork.channel}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Perkiraan Jarak:</Text>
            <Text style={styles.detailValue}>{getDistanceFromSignal(selectedNetwork.signal)} meter</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Terakhir Terlihat:</Text>
            <Text style={styles.detailValue}>
              {selectedNetwork.lastSeen.toLocaleTimeString()}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WiFi Tracker</Text>
        <View style={styles.headerStats}>
          <Text style={styles.statText}>
            <Icon name="wifi" size={16} color="#0fd1aa" /> {wifiNetworks.length} Jaringan
          </Text>
          {scanHistory.length > 0 && (
            <Text style={styles.statText}>
              <Icon name="history" size={16} color="#0fd1aa" /> {scanHistory[0].timestamp.toLocaleTimeString()}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.radarWrapper}>
        {renderRadar()}

        {isScanning && (
          <View style={styles.scanProgressContainer}>
            <Text style={styles.scanProgressText}>
              <Icon name="search" size={16} color="#fff" /> Scanning... {scanProgress}%
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${scanProgress}%` }]} />
            </View>
          </View>
        )}
      </View>

      <View style={styles.controlContainer}>
        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanButtonActive]}
          onPress={isScanning ? stopScan : startScan}
        >
          <Icon
            name={isScanning ? "stop" : "wifi-tethering"}
            size={24}
            color="#fff"
            style={styles.scanButtonIcon}
          />
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Stop Scan' : 'Start Scan'}
          </Text>
        </TouchableOpacity>
      </View>

      {selectedNetwork ? (
        renderNetworkDetails()
      ) : (
        <ScrollView style={styles.networkList}>
          {scanHistory.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.sectionTitle}>Riwayat Scan</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {scanHistory.map((scan, index) => (
                  <TouchableOpacity
                    key={`scan-${index}`}
                    style={styles.historyItem}
                    onPress={() => setWifiNetworks(scan.networks)}
                  >
                    <Text style={styles.historyTime}>{scan.timestamp.toLocaleTimeString()}</Text>
                    <Text style={styles.historyCount}>{scan.count} jaringan</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <Text style={styles.sectionTitle}>
            Jaringan Terdeteksi ({wifiNetworks.length})
          </Text>

          {wifiNetworks.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="wifi-off" size={48} color="#666" />
              <Text style={styles.emptyText}>Tidak ada jaringan terdeteksi</Text>
              <Text style={styles.emptySubtext}>Tekan "Start Scan" untuk memulai</Text>
            </View>
          ) : (
            wifiNetworks.map(network => (
              <TouchableOpacity
                key={network.id}
                style={[
                  styles.networkItem,
                  { borderLeftColor: getSignalColor(network.signal) }
                ]}
                onPress={() => setSelectedNetwork(network)}
              >
                <View style={styles.networkHeader}>
                  <Text style={styles.networkName}>{network.ssid}</Text>
                  <View style={styles.networkSignal}>
                    <Icon
                      name="wifi"
                      size={20}
                      color={getSignalColor(network.signal)}
                    />
                    <Text style={[styles.networkSignalText, { color: getSignalColor(network.signal) }]}>
                      {network.signal} dBm
                    </Text>
                  </View>
                </View>
                <View style={styles.networkDetails}>
                  <Text style={styles.networkDetail}>
                    <Icon name="security" size={14} color="#666" /> {network.security}
                  </Text>
                  <Text style={styles.networkDetail}>
                    <Icon name="speed" size={14} color="#666" /> {network.frequency}
                  </Text>
                  <Text style={styles.networkDetail}>
                    <Icon name="place" size={14} color="#666" /> {getDistanceFromSignal(network.signal)}m
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
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
    padding: 15,
    backgroundColor: '#1b1b1b',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    color: '#0fd1aa',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    color: '#ccc',
    fontSize: 12,
  },
  radarWrapper: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#151515',
  },
  radarContainer: {
    position: 'relative',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    backgroundColor: '#000',
    borderRadius: RADAR_SIZE / 2,
    borderWidth: 2,
    borderColor: '#333',
  },
  radarSvg: {
    backgroundColor: 'transparent',
  },
  scanProgressContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  scanProgressText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0fd1aa',
  },
  controlContainer: {
    padding: 20,
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0fd1aa',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#0fd1aa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scanButtonActive: {
    backgroundColor: '#ff4444',
  },
  scanButtonIcon: {
    marginRight: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  networkList: {
    flex: 1,
    padding: 15,
  },
  historyContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#0fd1aa',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: '#1b1b1b',
    padding: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 120,
  },
  historyTime: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  historyCount: {
    color: '#ccc',
    fontSize: 10,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
  },
  emptySubtext: {
    color: '#555',
    fontSize: 12,
    marginTop: 5,
  },
  networkItem: {
    backgroundColor: '#1b1b1b',
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  networkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  networkName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  networkSignal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkSignalText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  networkDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  networkDetail: {
    color: '#999',
    fontSize: 12,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#1b1b1b',
    margin: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  detailsTitle: {
    color: '#0fd1aa',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContent: {
    flex: 1,
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  detailLabel: {
    color: '#ccc',
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
});

export default WiFiTracker;