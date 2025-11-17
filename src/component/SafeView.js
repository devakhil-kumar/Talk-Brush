import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * SafeView Component
 *
 * A reusable wrapper component that handles safe area insets for both iOS and Android.
 * Prevents content from going under status bar and bottom navigation/home indicator.
 *
 * Props:
 * - children: Content to render inside safe area
 * - style: Additional styles to apply
 * - edges: Array of edges to apply insets ['top', 'bottom', 'left', 'right'] (default: ['top', 'bottom'])
 * - backgroundColor: Background color (default: '#fff')
 */
const SafeView = ({
  children,
  style,
  edges = ['top', 'bottom'],
  backgroundColor = '#fff'
}) => {
  const insets = useSafeAreaInsets();

  const paddingStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return (
    <View style={[styles.container, { backgroundColor }, paddingStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeView;
