import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function BlurTabBarBackground() {
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: 20, // Adjust as needed for desired roundness
          overflow: 'hidden', // Ensures content respects border radius
          top: 10, // Adjust to lift the tab bar
          marginHorizontal: 10, // Adjust for spacing from sides
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 10,
        },
      ]}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
