export interface DetectedObject {
  label: string;
  confidence: number;
  distance: number;
  direction: 'left' | 'right' | 'ahead' | 'behind';
  bbox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

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
