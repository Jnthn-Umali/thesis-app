import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { DetectedObject } from './types';

interface DebugPanelProps {
  isAnalyzing: boolean;
  lastDetection: DetectedObject | null;
  cameraPermission: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  isAnalyzing,
  lastDetection,
  cameraPermission,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <TouchableOpacity 
        style={styles.debugToggle} 
        onPress={() => setIsVisible(true)}
      >
        <ThemedText style={styles.debugToggleText}>🐛 Debug</ThemedText>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Debug Panel</ThemedText>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => setIsVisible(false)}
        >
          <ThemedText style={styles.closeButtonText}>✕</ThemedText>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>State Variables:</ThemedText>
          <ThemedText style={styles.debugText}>
            isAnalyzing: {isAnalyzing ? 'true' : 'false'}
          </ThemedText>
          <ThemedText style={styles.debugText}>
            cameraPermission: {cameraPermission ? 'true' : 'false'}
          </ThemedText>
          <ThemedText style={styles.debugText}>
            lastDetection: {lastDetection ? 'exists' : 'null'}
          </ThemedText>
        </View>

        {lastDetection && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Last Detection:</ThemedText>
            <ThemedText style={styles.debugText}>
              Label: {lastDetection.label}
            </ThemedText>
            <ThemedText style={styles.debugText}>
              Confidence: {lastDetection.confidence}
            </ThemedText>
            <ThemedText style={styles.debugText}>
              Distance: {lastDetection.distance} steps
            </ThemedText>
            <ThemedText style={styles.debugText}>
              Direction: {lastDetection.direction}
            </ThemedText>
          </View>
        )}

                 <View style={styles.section}>
           <ThemedText style={styles.sectionTitle}>Component Info:</ThemedText>
           <ThemedText style={styles.debugText}>
             VisionScreen: Main orchestrator
           </ThemedText>
           <ThemedText style={styles.debugText}>
             CameraPreview: Camera simulation (expo-camera fixing)
           </ThemedText>
           <ThemedText style={styles.debugText}>
             DetectionOverlay: Object display
           </ThemedText>
           <ThemedText style={styles.debugText}>
             ControlPanel: Buttons
           </ThemedText>
           <ThemedText style={styles.debugText}>
             StatusPanel: Status & instructions
           </ThemedText>
         </View>

         <View style={styles.section}>
           <ThemedText style={styles.sectionTitle}>Camera Status:</ThemedText>
           <ThemedText style={styles.debugText}>
             ⚠️ Camera simulation active
           </ThemedText>
           <ThemedText style={styles.debugText}>
             🔧 Fixing expo-camera import
           </ThemedText>
           <ThemedText style={styles.debugText}>
             🔄 Front/back switching works
           </ThemedText>
         </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  debugToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 4,
    zIndex: 1000,
  },
  debugToggleText: {
    color: 'white',
    fontSize: 12,
  },
  container: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 250,
    maxHeight: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 8,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  content: {
    padding: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  debugText: {
    color: '#ccc',
    fontSize: 11,
    marginBottom: 2,
  },
});
