import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';

export interface YOLODetection {
  label: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  center: {
    x: number;
    y: number;
  };
}

export interface YOLODetectionResult {
  detections: YOLODetection[];
  processingTime: number;
  imageSize: {
    width: number;
    height: number;
  };
}

class YOLODetectionService {
  private isInitialized = false;
  private model: cocoSsd.ObjectDetection | null = null;
  
  // COCO class names for YOLO detection
  private readonly classNames = [
    'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
    'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat',
    'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack',
    'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
    'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
    'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
    'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake',
    'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop',
    'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink',
    'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
  ];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing TensorFlow.js...');
      
      // Initialize TensorFlow.js platform
      await tf.ready();
      console.log('TensorFlow.js is ready');

      // Load the COCO-SSD model
      console.log('Loading COCO-SSD model...');
      try {
        this.model = await cocoSsd.load();
        console.log('COCO-SSD model loaded successfully');
      } catch (modelError) {
        console.warn('COCO-SSD model failed to load, using fallback mode...', modelError);
        this.model = null;
      }

      this.isInitialized = true;
      console.log('YOLO detection service initialized successfully');
      
      if (!this.model) {
        console.log('⚠️ No YOLO model loaded - using fallback mode (no false detections)');
      }
    } catch (error) {
      console.error('Failed to initialize YOLO detection service:', error);
      // Fallback to local detection
      console.log('Falling back to local detection mode');
      this.model = null;
      this.isInitialized = true;
    }
  }

  async detectObjects(imageUri: string): Promise<YOLODetectionResult> {
    if (!this.isInitialized) {
      throw new Error('YOLO detection service not initialized');
    }

    const startTime = Date.now();

    try {
      if (this.model) {
        console.log('🤖 Using real YOLO model for detection');
        // Use real YOLO detection
        const detections = await this.performRealDetection(imageUri);
        console.log('🤖 Real detection results:', detections);
        const processingTime = Date.now() - startTime;

        return {
          detections,
          processingTime,
          imageSize: { width: 640, height: 480 }
        };
      } else {
        console.log('⚠️ No model available, using fallback detection');
        // Fallback to local detection
        return this.fallbackDetection();
      }
    } catch (error) {
      console.error('Error during object detection:', error);
      return this.fallbackDetection();
    }
  }

  private async performRealDetection(imageUri: string): Promise<YOLODetection[]> {
    if (!this.model) {
      throw new Error('COCO-SSD model not loaded');
    }

    try {
      console.log('🖼️ Loading image from URI:', imageUri);
      const imageTensor = await this.loadImage(imageUri); // tf.Tensor3D
      console.log('🖼️ Image tensor shape:', imageTensor.shape);

      console.log('🔍 Running COCO-SSD detection...');
      // Pass the raw decoded tensor directly - COCO-SSD handles preprocessing internally
      const predictions = await this.model.detect(imageTensor, 20, 0.2);
      console.log('🔍 Raw COCO-SSD predictions:', predictions);

      // Clean up tensor
      imageTensor.dispose();

      // Convert results to your format
      const detections: YOLODetection[] = predictions.map((prediction, index) => {
        const [x, y, width, height] = prediction.bbox;
        return {
          label: prediction.class,
          confidence: prediction.score,
          bbox: { x, y, width, height },
          center: { x: x + width / 2, y: y + height / 2 }
        };
      });

      console.log('🎯 Final detections array:', detections);
      return detections;
    } catch (error) {
      console.error('Real detection failed:', error);
      throw error;
    }
  }

  private async loadImage(imageUri: string): Promise<tf.Tensor3D> {
    try {
      console.log('📁 Reading image file...');//
      const imgB64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('📁 Image base64 length:', imgB64.length);
  
      // Convert to UInt8Array
      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer);
      console.log('📁 Raw image buffer size:', raw.length);
  
      // Decode JPEG → int32 tensor
      console.log('🖼️ Decoding JPEG...');
      let tensor = decodeJpeg(raw); // [h, w, 3], dtype: int32
      console.log('🖼️ Decoded tensor shape:', tensor.shape, 'dtype:', tensor.dtype);
  
      // Resize → cast back to int32 (important!)
      tensor = tf.image.resizeBilinear(tensor, [640, 640]).toInt();
      console.log('🖼️ Resized tensor shape:', tensor.shape, 'dtype:', tensor.dtype);
  
      return tensor as tf.Tensor3D;
    } catch (error) {
      console.error('❌ Error loading image:', error);
      throw error;
    }
  }
  


  private async fallbackDetection(): Promise<YOLODetectionResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return empty detections to avoid false positives
    // This prevents the app from showing fake "person" detections when no one is there
    const detections: YOLODetection[] = [];

    console.log('Using fallback mode - no objects detected (avoiding false positives)');

    return {
      detections,
      processingTime: 300,
      imageSize: { width: 640, height: 480 }
    };
  }

  async detectObjectsFromCamera(cameraRef: any): Promise<YOLODetectionResult> {
    if (!this.isInitialized) {
      throw new Error('YOLO detection service not initialized');
    }

    const startTime = Date.now();

    try {
      // Take a picture from the camera
      if (!cameraRef || !cameraRef.current) {
        throw new Error('Camera reference not available');
      }

      console.log('📸 Capturing image from camera...');
      // Capture image from camera using the exposed takePicture method
      const imageUri = await cameraRef.current.takePicture();
      if (!imageUri) {
        throw new Error('Failed to capture image from camera');
      }
      console.log('📸 Image captured:', imageUri);

      // Process the captured image with YOLO
      console.log('🔍 Processing image with YOLO...');
      const result = await this.detectObjects(imageUri);
      console.log('🔍 YOLO processing completed:', result);
      
      const processingTime = Date.now() - startTime;

      return {
        ...result,
        processingTime
      };
    } catch (error) {
      console.error('Error during camera object detection:', error);
      // Return fallback detection
      return this.fallbackDetection();
    }
  }

  // Convert YOLO detection to our app's DetectedObject format
  convertToDetectedObject(detection: YOLODetection, imageWidth: number, imageHeight: number): any {
    const centerX = detection.center.x / imageWidth;
    const centerY = detection.center.y / imageHeight;
    
    // Determine direction based on center position
    let direction: 'left' | 'right' | 'ahead' | 'behind';
    if (centerX < 0.3) {
      direction = 'left';
    } else if (centerX > 0.7) {
      direction = 'right';
    } else {
      direction = 'ahead';
    }

    // Estimate distance based on bounding box size (larger = closer)
    const bboxArea = detection.bbox.width * detection.bbox.height;
    const imageArea = imageWidth * imageHeight;
    const relativeSize = bboxArea / imageArea;
    
    // Convert relative size to distance estimate (inverse relationship)
    const distance = Math.max(1, Math.round(10 / (relativeSize * 20)));

    return {
      label: detection.label,
      confidence: detection.confidence,
      distance: distance,
      direction: direction,
      bbox: detection.bbox
    };
  }

  hasModel(): boolean {
    return this.model !== null;
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.isInitialized = false;
  }
}

// Export singleton instance
export const yoloDetectionService = new YOLODetectionService();
