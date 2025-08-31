import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { CameraPreview } from './CameraPreview';
import { ControlPanel } from './ControlPanel';
import { DetectionOverlay } from './DetectionOverlay';
import { StatusPanel } from './StatusPanel';

import { DetectedObject } from './types';

export const VisionScreen: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastDetection, setLastDetection] = useState<DetectedObject | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);

  // Mock AI processing - replace with real AI later
  const mockAnalyzeImage = async (): Promise<DetectedObject> => {
    const objects = [
      { label: 'wall', confidence: 0.95, distance: 3, direction: 'ahead' as const },
      { label: 'stairs', confidence: 0.87, distance: 2, direction: 'right' as const },
      { label: 'person', confidence: 0.78, distance: 5, direction: 'left' as const },
      { label: 'door', confidence: 0.92, distance: 4, direction: 'ahead' as const },
      { label: 'chair', confidence: 0.81, distance: 1.5, direction: 'right' as const },
      { label: 'table', confidence: 0.89, distance: 2.5, direction: 'left' as const },
      { label: 'elevator', confidence: 0.94, distance: 6, direction: 'ahead' as const },
    ];
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return objects[Math.floor(Math.random() * objects.length)];
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      // In real implementation, you'd capture image and send to AI
      const detection = await mockAnalyzeImage();
      setLastDetection(detection);
      
      // Text-to-speech feedback
      const speechText = `${detection.label} ${detection.distance} steps ${detection.direction}`;
      await Speech.speak(speechText, {
        language: 'en',
        pitch: 1.0,
        rate: 0.8,
      });
      
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEmergencyStop = () => {
    Speech.stop();
    setIsAnalyzing(false);
  };

  const handleCameraPermission = () => {
    setCameraPermission(true);
    Alert.alert(
      'Camera Permission', 
      'Camera permission granted! In the full version, this will enable live camera feed.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Full Screen Camera */}
      <CameraPreview
        hasPermission={cameraPermission}
        onRequestPermission={handleCameraPermission}
      />
      
      {/* Overlay Components */}
      <DetectionOverlay detection={lastDetection} />
      <ControlPanel
        isAnalyzing={isAnalyzing}
        onAnalyze={handleAnalyze}
        onStop={handleEmergencyStop}
      />
      <StatusPanel lastDetection={lastDetection} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
});
