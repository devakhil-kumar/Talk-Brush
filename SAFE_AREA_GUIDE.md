# Safe Area Setup Guide

This app has been configured to handle safe areas globally for both iOS and Android (including Android 35 edge-to-edge).

## What Was Done

### 1. App-Level Setup (App.jsx)
- Wrapped the entire app with `SafeAreaProvider`
- This provides safe area context to all child components

### 2. Created Reusable SafeView Component
**Location:** `src/components/SafeView.js`

**Usage:**
```javascript
import SafeView from '../components/SafeView';

// Basic usage (handles top and bottom by default)
<SafeView>
  <YourContent />
</SafeView>

// Custom edges
<SafeView edges={['top']}>
  <YourContent />
</SafeView>

// With custom background
<SafeView backgroundColor="#f5f5f5">
  <YourContent />
</SafeView>

// With additional styles
<SafeView style={{ paddingHorizontal: 20 }}>
  <YourContent />
</SafeView>
```

### 3. Navigation Components Updated

#### Bottom Tabs (CarOwnerBottomTabs.js)
- Automatically adjusts tab bar height for device safe areas
- Handles Android gesture navigation and iOS home indicator

#### Custom Header (CustomHeader.js)
- Automatically adds padding for status bar
- Works on both iOS and Android notched devices

## How to Use in Your Screens

### Option 1: Use SafeAreaView (Already in most screens)
```javascript
import { SafeAreaView } from 'react-native-safe-area-context';

const YourScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Your content */}
    </SafeAreaView>
  );
};
```

### Option 2: Use the Custom SafeView Component
```javascript
import SafeView from '../components/SafeView';

const YourScreen = () => {
  return (
    <SafeView>
      {/* Your content */}
    </SafeView>
  );
};
```

### Option 3: Use useSafeAreaInsets Hook (For Custom Layouts)
```javascript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const YourScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }}>
      {/* Your content */}
    </View>
  );
};
```

## Examples

### Full Screen with Safe Areas
```javascript
<SafeView edges={['top', 'bottom', 'left', 'right']}>
  <Text>This content is safe from all edges</Text>
</SafeView>
```

### Only Bottom Safe Area (For Screens with Custom Headers)
```javascript
<SafeView edges={['bottom']}>
  <YourCustomHeader />
  <YourContent />
</SafeView>
```

### No Safe Areas (For Full Screen Images/Videos)
```javascript
<View style={{ flex: 1 }}>
  <Image source={...} style={{ width: '100%', height: '100%' }} />
</View>
```

## What's Already Configured

✅ App wrapped with SafeAreaProvider
✅ Bottom tab bar adjusts for safe areas
✅ Custom header adjusts for status bar
✅ SafeView component available globally
✅ Works on iOS (notch, dynamic island, home indicator)
✅ Works on Android 35 (edge-to-edge, gesture navigation)

## Testing

Test on:
- iOS devices with notch/dynamic island
- Android devices with gesture navigation
- Different Android versions (especially Android 35+)
- Different screen sizes

The content should never go under:
- Status bar (top)
- Bottom navigation buttons (Android)
- Home indicator (iOS)
- Screen notches or cutouts
