# Vision Assistance App for Visually Impaired Users

## Thesis Project Overview

This React Native app is designed to assist visually impaired individuals by providing real-time object detection and audio feedback about their surroundings.

## Features (Phase 1 - Current)

### ✅ **Working Features:**
- **Mock AI Processing**: Simulates object detection with realistic data
- **Text-to-Speech**: Audio feedback describing detected objects
- **Accessibility-First Design**: Large buttons, high contrast, clear audio
- **Object Detection Simulation**: Detects walls, stairs, people, doors, chairs, tables, elevators
- **Distance & Direction**: Provides step-based distance and directional information
- **Emergency Stop**: Interrupt speech output when needed

### 🔄 **Mock Data Examples:**
- "wall 3 steps ahead" (95% confidence)
- "stairs 2 steps right" (87% confidence)
- "person 5 steps left" (78% confidence)
- "door 4 steps ahead" (92% confidence)

## Technical Architecture

### **Current Stack:**
- **Frontend**: React Native + Expo
- **Language**: TypeScript (for better AI debugging support)
- **Speech**: expo-speech for text-to-speech
- **UI**: Custom components with accessibility focus

### **Data Flow:**
```
User Tap → Mock AI Processing → Object Detection → 
Text-to-Speech → Audio Output
```

## Next Steps (Phase 2 & 3)

### **Phase 2: Real AI Integration (2-3 weeks)**
- [ ] Connect to Google Cloud Vision API or Azure Computer Vision
- [ ] Real-time image capture and processing
- [ ] Actual object detection with confidence scores
- [ ] Distance estimation algorithms

### **Phase 3: ESP32 Integration (Later)**
- [ ] Bluetooth/WiFi communication with ESP32
- [ ] Real-time camera feed from smart glasses
- [ ] Optimized data transmission
- [ ] Power management and battery optimization

## Getting Started

### **Prerequisites:**
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator

### **Installation:**
```bash
npm install
npm start
```

### **Testing the App:**
1. Open the app on your device/simulator
2. Tap "Enable Camera" (placeholder for now)
3. Tap "Analyze Scene" to simulate object detection
4. Listen to the audio feedback
5. Use "Stop" to interrupt speech

## Project Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Main vision assistance screen
│   └── _layout.tsx        # Tab navigation
├── components/             # Reusable UI components
├── constants/              # Colors and theme
└── hooks/                  # Custom React hooks
```

## Why TypeScript?

**TypeScript provides 3-5x better AI debugging support** because:
- **Type Safety**: Catches errors at compile time
- **Better IDE Support**: Autocomplete and error detection
- **AI Understanding**: AI can better understand your data structures
- **API Integration**: Clear contracts for external services

## Accessibility Features

- **High Contrast**: Dark theme with bright accent colors
- **Large Buttons**: Easy to tap and navigate
- **Audio Feedback**: Text-to-speech for all detections
- **Clear Status**: Visual and audio status updates
- **Emergency Controls**: Quick access to stop functionality

## Contributing

This is a thesis project. For questions or collaboration, please contact the project author.

## License

Academic use only - Thesis project.
