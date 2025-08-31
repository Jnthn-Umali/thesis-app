# Vision Components Architecture

## Component Structure

```
VisionScreen (Main Orchestrator)
├── CameraPreview (Camera placeholder & permissions)
├── DetectionOverlay (Shows detected objects)
├── ControlPanel (Analyze & Stop buttons)
├── StatusPanel (Status & instructions)
└── DebugPanel (Development debugging)
```

## Debugging Each Component

### 🎯 **VisionScreen** (`VisionScreen.tsx`)
**Purpose**: Main state manager and orchestrator
**Debug**: Check state variables, mock AI function, speech integration
**Common Issues**: 
- State not updating
- Speech not working
- Mock AI timing

### 📷 **CameraPreview** (`CameraPreview.tsx`)
**Purpose**: Camera placeholder and permission handling
**Debug**: Permission state, button interactions
**Common Issues**:
- Permission not updating
- Button not responding

### 🔍 **DetectionOverlay** (`DetectionOverlay.tsx`)
**Purpose**: Display detected objects with confidence
**Debug**: Object data, overlay positioning
**Common Issues**:
- Overlay not showing
- Text not displaying
- Positioning issues

### 🎮 **ControlPanel** (`ControlPanel.tsx`)
**Purpose**: Main interaction buttons
**Debug**: Button states, press handlers
**Common Issues**:
- Buttons not responding
- States not updating
- Icons not showing

### 📊 **StatusPanel** (`StatusPanel.tsx`)
**Purpose**: Status display and instructions
**Debug**: Status text, instruction formatting
**Common Issues**:
- Status not updating
- Text formatting issues

### 🐛 **DebugPanel** (`DebugPanel.tsx`)
**Purpose**: Development debugging tool
**Debug**: All state variables, component info
**Usage**: Tap "🐛 Debug" button to toggle

## Debugging Workflow

1. **Enable Debug Panel**: Tap the 🐛 button in top-right
2. **Check State Variables**: Verify all states are correct
3. **Test Individual Components**: Each component can be tested in isolation
4. **Check Console**: Look for errors in Metro bundler
5. **Component Isolation**: Comment out components to isolate issues

## Adding New Features

### **New Component:**
1. Create `NewComponent.tsx` in this folder
2. Add to `index.ts` exports
3. Import and use in `VisionScreen.tsx`

### **New State:**
1. Add to `VisionScreen.tsx` state
2. Pass down as props to relevant components
3. Update `DebugPanel.tsx` to show new state

### **New Types:**
1. Add to `types.ts`
2. Import in components that need it
3. Update interfaces accordingly

## StyleSheet vs Tailwind

### **Current: StyleSheet (Recommended for debugging)**
- ✅ Easy to debug specific styles
- ✅ Clear component-specific styling
- ✅ Better TypeScript support
- ✅ Easier to modify individual components

### **Future: Tailwind (Faster development)**
- ⚡ Rapid UI development
- 🎨 Consistent design system
- 📱 Responsive utilities
- 🔧 Easy theme changes

## Migration to Tailwind

When ready to migrate:
1. Install `nativewind` package
2. Convert StyleSheet to className
3. Keep component structure for easy debugging
4. Use Tailwind utilities for rapid styling

## Testing Components

```typescript
// Test individual component
import { CameraPreview } from '@/components/vision';

// Mock props
const mockProps = {
  hasPermission: true,
  onRequestPermission: () => console.log('Permission requested')
};

// Render in isolation
<CameraPreview {...mockProps} />
```
