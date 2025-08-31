import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

interface ControlPanelProps {
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onStop: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isAnalyzing,
  onAnalyze,
  onStop,
}) => {
  return (
    <View style={styles.container}>
      {/* Main Analyze Button */}
      <TouchableOpacity 
        style={[styles.button, styles.analyzeButton]} 
        onPress={onAnalyze}
        disabled={isAnalyzing}
      >
        <Ionicons 
          name={isAnalyzing ? "scan" : "eye"} 
          size={32} 
          color="white" 
        />
        <ThemedText style={styles.buttonText}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze Scene'}
        </ThemedText>
      </TouchableOpacity>

      {/* Emergency Stop */}
      <TouchableOpacity 
        style={[styles.button, styles.stopButton]} 
        onPress={onStop}
      >
        <Ionicons name="stop-circle" size={24} color="white" />
        <ThemedText style={styles.buttonText}>Stop</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeButton: {
    backgroundColor: '#007AFF',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
