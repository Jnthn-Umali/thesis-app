import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { CameraPreview } from './CameraPreview';
import { ControlPanel } from './ControlPanel';
import { DetectionOverlay } from './DetectionOverlay';
import { StatusPanel } from './StatusPanel';
import { yoloDetectionService } from './YOLODetectionService';

import { DetectedObject, YOLODetection, YOLODetectionResult } from './types';

export const VisionScreen: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastDetection, setLastDetection] = useState<DetectedObject | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [yoloDetections, setYoloDetections] = useState<YOLODetection[]>([]);
  const [imageSize, setImageSize] = useState({ width: 640, height: 480 });
  const [yoloInitialized, setYoloInitialized] = useState(false);
  const [yoloModelLoaded, setYoloModelLoaded] = useState(false);
  
  const cameraRef = useRef<any>(null);

  // Initialize YOLO detection service
  useEffect(() => {
    const initializeYOLO = async () => {
      try {
        await yoloDetectionService.initialize();
        setYoloInitialized(true);
        // Check if real model is loaded
        const hasModel = yoloDetectionService.hasModel();
        setYoloModelLoaded(hasModel);
        console.log('YOLO detection service initialized successfully');
        if (hasModel) {
          console.log('✅ Real YOLO model loaded - using real object detection');
        } else {
          console.log('⚠️ No YOLO model loaded - using fallback mode (no false detections)');
        }
      } catch (error) {
        console.error('Failed to initialize YOLO:', error);
        setYoloModelLoaded(false);
        Alert.alert('YOLO Initialization Failed', 'Object detection will use fallback mode');
      }
    };

    initializeYOLO();
  }, []);

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
    console.log('🔘 Analyze button pressed, setting isAnalyzing to true');
    setIsAnalyzing(true);
    
    try {
      let detection: DetectedObject | null = null;
      let yoloResult: YOLODetectionResult | null = null;

      if (yoloInitialized && cameraRef.current) {
        // Use real YOLO detection
        try {
          console.log('🔍 Starting YOLO detection...');
          yoloResult = await yoloDetectionService.detectObjectsFromCamera(cameraRef);
          console.log('📊 YOLO detection results:', yoloResult);
          setYoloDetections(yoloResult.detections);
          setImageSize(yoloResult.imageSize);

          // Convert YOLO detection to our format for the main detection
          if (yoloResult.detections.length > 0) {
            console.log('✅ Found', yoloResult.detections.length, 'detections');
            const primaryDetection = yoloResult.detections[0]; // Use the first detection
            console.log('🎯 Primary detection:', primaryDetection);
            detection = yoloDetectionService.convertToDetectedObject(
              primaryDetection, 
              yoloResult.imageSize.width, 
              yoloResult.imageSize.height
            );
            console.log('🔄 Converted detection:', detection);
          } else {
            console.log('❌ No objects detected by YOLO');
          }
        } catch (yoloError) {
          console.error('YOLO detection failed, falling back to mock:', yoloError);
          // Fallback to mock detection
          detection = await mockAnalyzeImage();
          setYoloDetections([]);
        }
      } else {
        console.log('⚠️ Using mock detection (YOLO not initialized or camera not ready)');
        // Use mock detection
        detection = await mockAnalyzeImage();
        setYoloDetections([]);
      }

      if (detection) {
        setLastDetection(detection);
        
        // Text-to-speech feedback
        const speechText = `${detection.label} ${detection.distance} steps ${detection.direction}`;
        console.log('🗣️ Speaking:', speechText);
        try {
          await Speech.speak(speechText, {
            language: 'en',
            pitch: 1.0,
            rate: 0.8,
          });
          console.log('✅ Speech completed');
        } catch (speechError) {
          console.error('❌ Speech error:', speechError);
        }
      } else {
        console.log('❌ No detection to speak');
      }
      
    } catch (error) {
      console.error('❌ Error in handleAnalyze:', error);
      Alert.alert('Error', 'Failed to analyze image');
    } finally {
      console.log('🔘 Setting isAnalyzing to false');
      setIsAnalyzing(false);
    }
  };

  const handleEmergencyStop = () => {
    console.log('🛑 Emergency stop pressed');
    Speech.stop();
    setIsAnalyzing(false);
    console.log('🛑 Set isAnalyzing to false');
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
        ref={cameraRef}
        hasPermission={cameraPermission}
        onRequestPermission={handleCameraPermission}
      />
      
      {/* Overlay Components */}
      <DetectionOverlay 
        detection={lastDetection} 
        yoloDetections={yoloDetections}
        imageSize={imageSize}
      />
      <ControlPanel
        isAnalyzing={isAnalyzing}
        onAnalyze={handleAnalyze}
        onStop={handleEmergencyStop}
      />
      {/* YOLO Status Indicator */}
      <View style={styles.statusIndicator}>
        <ThemedText style={styles.statusText}>
          {yoloModelLoaded ? '✅ Real YOLO Detection' : '⚠️ Fallback Mode (No False Detections)'}
        </ThemedText>
      </View>
      
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
  statusIndicator: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
