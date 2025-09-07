import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

import { DetectedObject, YOLODetection } from './types';

interface DetectionOverlayProps {
  detection: DetectedObject | null;
  yoloDetections?: YOLODetection[];
  imageSize?: { width: number; height: number };
}

export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ 
  detection, 
  yoloDetections = [], 
  imageSize = { width: 640, height: 480 } 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (detection || yoloDetections.length > 0) {
      // Show the overlay when detection is received
      setIsVisible(true);
      
      // Hide it after 5 seconds (longer for multiple detections)
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      // Cleanup timer on unmount or when detection changes
      return () => clearTimeout(timer);
    } else {
      // Hide immediately when no detection
      setIsVisible(false);
    }
  }, [detection, yoloDetections]);

  // Don't render if no detection or not visible
  if ((!detection && yoloDetections.length === 0) || !isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Main detection overlay */}
      {detection && (
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
      )}

      {/* YOLO bounding boxes */}
      {yoloDetections.map((yoloDetection, index) => (
        <View
          key={index}
          style={[
            styles.boundingBox,
            {
              left: `${(yoloDetection.bbox.x / imageSize.width) * 100}%`,
              top: `${(yoloDetection.bbox.y / imageSize.height) * 100}%`,
              width: `${(yoloDetection.bbox.width / imageSize.width) * 100}%`,
              height: `${(yoloDetection.bbox.height / imageSize.height) * 100}%`,
            }
          ]}
        >
          <View style={styles.labelContainer}>
            <ThemedText style={styles.boundingBoxLabel}>
              {yoloDetection.label} ({Math.round(yoloDetection.confidence * 100)}%)
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none', // Allow touches to pass through
  },
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
  boundingBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
  },
  labelContainer: {
    position: 'absolute',
    top: -25,
    left: 0,
    backgroundColor: 'rgba(0, 255, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  boundingBoxLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
