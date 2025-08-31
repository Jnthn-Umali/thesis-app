export interface DetectedObject {
  label: string;
  confidence: number;
  distance: number;
  direction: 'left' | 'right' | 'ahead' | 'behind';
}
