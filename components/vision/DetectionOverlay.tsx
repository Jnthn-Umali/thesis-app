import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

import { DetectedObject } from './types';

interface DetectionOverlayProps {
  detection: DetectedObject | null;
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ detection }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (detection) {
      // Show the overlay when detection is received
      setIsVisible(true);
      
      // Hide it after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      
      // Cleanup timer on unmount or when detection changes
      return () => clearTimeout(timer);
    } else {
      // Hide immediately when no detection
      setIsVisible(false);
    }
  }, [detection]);

  // Don't render if no detection or not visible
  if (!detection || !isVisible) return null;

  return (
    <View style={styles.overlay}>
      <ThemedText style={styles.objectLabel}>
        {detection.label.toUpperCase()}
      </ThemedText>
      <ThemedText style={styles.distanceText}>
        {detection.distance} steps {detection.direction}
      </ThemedText>
      <ThemedText style={styles.confidenceText}>
        Confidence: {Math.round(detection.confidence * 100)}%
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  objectLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  distanceText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  confidenceText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
  },
});
