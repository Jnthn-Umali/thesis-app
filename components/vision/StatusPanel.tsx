import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

import { DetectedObject } from './types';

interface StatusPanelProps {
  lastDetection: DetectedObject | null;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ lastDetection }) => {
  return (
    <View style={styles.container}>
      {/* Only show status when there's a detection */}
      {lastDetection && (
        <ThemedText style={styles.lastDetectionText}>
          Last detected: {lastDetection.label} {lastDetection.distance} steps {lastDetection.direction}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderTopColor: '#007AFF',
    borderTopWidth: 2,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    alignItems: 'center',
  },
  lastDetectionText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
