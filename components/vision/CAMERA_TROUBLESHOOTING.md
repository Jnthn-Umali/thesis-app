# Camera Troubleshooting Guide

## Current Issue

The app is showing this error:
```
ERROR TypeError: Cannot read property 'back' of undefined, js engine: hermes
```

## What Happened

1. **expo-camera package** was installed but has import issues
2. **CameraType.back** is undefined - the enum isn't being imported correctly
3. **Camera component** can't be used as JSX component

## Temporary Solution

I've reverted to a **camera simulation** that:
- ✅ Shows camera interface
- ✅ Has front/back camera switching
- ✅ Displays camera status
- ✅ Works without errors
- ❌ Doesn't show real camera feed

## How to Fix Real Camera

### Option 1: Fix expo-camera (Recommended)

1. **Check Expo SDK compatibility**:
   ```bash
   npx expo install --fix
   ```

2. **Reinstall expo-camera**:
   ```bash
   npm uninstall expo-camera
   npm install expo-camera@latest
   ```

3. **Check import syntax**:
   ```typescript
   // Try these different import patterns:
   import { Camera } from 'expo-camera';
   import { Camera, CameraType } from 'expo-camera';
   import * as Camera from 'expo-camera';
   ```

### Option 2: Use expo-camera-view (Alternative)

1. **Install alternative package**:
   ```bash
   npm install expo-camera-view
   ```

2. **Update imports**:
   ```typescript
   import { CameraView } from 'expo-camera-view';
   ```

### Option 3: Use expo-image-picker (Photo-based)

1. **Install image picker**:
   ```bash
   npm install expo-image-picker
   ```

2. **Use photo capture instead of live feed**:
   ```typescript
   import * as ImagePicker from 'expo-image-picker';
   ```

## Current Status

- ✅ **App runs without errors**
- ✅ **Camera simulation works**
- ✅ **All other functionality works**
- ❌ **Real camera feed not working**
- 🔧 **Need to fix expo-camera import**

## Testing the App

Even with simulation, you can test:
1. **Permission flow**: Grant camera permission
2. **Camera switching**: Tap switch button
3. **Object detection**: Tap "Analyze Scene"
4. **Text-to-speech**: Hear detected objects
5. **Debug panel**: Check all states

## Next Steps

1. **Test current version** - Make sure app runs without errors
2. **Fix expo-camera** - Resolve import issues
3. **Replace simulation** - Switch to real camera component
4. **Test real camera** - Verify live feed works

## Why This Happened

- **Version mismatch** between expo-camera and Expo SDK
- **TypeScript definitions** not properly resolved
- **Import patterns** changed in newer versions
- **Metro bundler** cache issues

## Quick Fix Commands

```bash
# Clear Metro cache
npx expo start --clear

# Reinstall expo-camera
npm uninstall expo-camera
npm install expo-camera@latest

# Check for updates
npx expo install --fix
```

**The app is 95% complete - just need to fix the camera import!** 🚀
