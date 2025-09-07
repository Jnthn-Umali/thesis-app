import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

// Import expo-camera with proper error handling
let Camera: any = null;
let CameraType: any = null;
let useCameraPermissions: any = null;

// Try to load expo-camera
try {
  // Use require to avoid TypeScript import issues
  const expoCamera = require('expo-camera');
  
  // Try to get Camera component - handle different export patterns
  if (expoCamera.CameraView && typeof expoCamera.CameraView === 'function') {
    Camera = expoCamera.CameraView;
  } else if (expoCamera.Camera && typeof expoCamera.Camera === 'function') {
    Camera = expoCamera.Camera;
  } else if (expoCamera.default && expoCamera.default.Camera && typeof expoCamera.default.Camera === 'function') {
    Camera = expoCamera.default.Camera;
  } else if (expoCamera.default && typeof expoCamera.default === 'function') {
    Camera = expoCamera.default;
  }
  
  // Try to get useCameraPermissions hook
  if (expoCamera.useCameraPermissions && typeof expoCamera.useCameraPermissions === 'function') {
    useCameraPermissions = expoCamera.useCameraPermissions;
  }
  
  // Try to get CameraType
  if (expoCamera.CameraType) {
    CameraType = expoCamera.CameraType;
  } else {
    // Create fallback CameraType
    CameraType = {
      back: 'back',
      front: 'front'
    };
  }
} catch (error) {
  // Create fallback values
  CameraType = {
    back: 'back',
    front: 'front'
  };
}

interface CameraPreviewProps {
  hasPermission: boolean;
  onRequestPermission: () => void;
  onPictureTaken?: (uri: string) => void;
}

export const CameraPreview = forwardRef<any, CameraPreviewProps>(({
  hasPermission,
  onRequestPermission,
  onPictureTaken,
}, ref) => {
  const cameraRef = useRef<any>(null);

  // Method to take a picture
  const takePicture = async (): Promise<string | null> => {
    if (!cameraRef.current || !hasPermission) {
      return null;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      if (onPictureTaken) {
        onPictureTaken(photo.uri);
      }
      
      return photo.uri;
    } catch (error) {
      console.error('Error taking picture:', error);
      return null;
    }
  };

  // Expose takePicture method via ref
  useImperativeHandle(ref, () => ({
    takePicture,
  }));

  // Request camera permission on component mount
  useEffect(() => {
    (async () => {
      try {
        if (Camera && Camera.requestCameraPermissionsAsync) {
          const { status } = await Camera.requestCameraPermissionsAsync();
          if (status === 'granted') {
            onRequestPermission();
          } else {
            Alert.alert(
              'Camera Permission Required',
              'This app needs camera access to help you see your surroundings. Please grant camera permission in your device settings.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Grant Permission', onPress: () => Camera.requestCameraPermissionsAsync() }
              ]
            );
          }
        } else {
          // Fallback to simulation if Camera import failed
          setTimeout(() => {
            onRequestPermission();
          }, 1000);
        }
      } catch (error) {
        // Fallback to simulation
        setTimeout(() => {
          onRequestPermission();
        }, 1000);
      }
    })();
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Ionicons name="camera" size={80} color="#007AFF" />
          <ThemedText style={styles.title}>Camera Permission Required</ThemedText>
          <ThemedText style={styles.description}>
            This app needs camera access to help you see your surroundings
          </ThemedText>
          
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={onRequestPermission}
          >
            <ThemedText style={styles.buttonText}>Grant Camera Permission</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // If Camera component is available, use real camera
  if (Camera && CameraType) {
    return (
      <View style={styles.container}>
        {/* Real Camera Feed - Back camera for seeing surroundings */}
        <Camera 
          ref={cameraRef}
          style={styles.camera} 
          type={CameraType.back}
        />
      </View>
    );
  }

  // Fallback to simulation if Camera import failed
  return (
    <View style={styles.container}>
      {/* Camera Simulation - Will replace with real camera once expo-camera is fixed */}
      <View style={styles.cameraSimulation}>
        <View style={styles.cameraHeader}>
          <ThemedText style={styles.cameraTypeText}>
            📷 Back Camera
          </ThemedText>
        </View>
        
        <View style={styles.cameraContent}>
          <Ionicons name="eye" size={120} color="#007AFF" />
          <ThemedText style={styles.cameraStatusText}>
            Live Camera Feed
          </ThemedText>
          <ThemedText style={styles.cameraSubText}>
            (Real camera will be integrated once expo-camera is fixed)
          </ThemedText>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#007AFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: '100%',
    minWidth: '100%',
  },
  cameraSimulation: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    alignItems: 'center',
  },
  cameraTypeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  cameraStatusText: {
    color: '#007AFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  cameraSubText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});
