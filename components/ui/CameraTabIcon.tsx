import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { IconSymbol } from './IconSymbol';

export function CameraTabIcon({ color, focused }: { color: string; focused?: boolean }) {
  const colorScheme = useColorScheme();
  
  // Animation values
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Glow animation when focused
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Subtle rotation animation
    const rotate = Animated.loop(
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    pulse.start();
    if (focused) {
      glow.start();
    }
    rotate.start();

    return () => {
      pulse.stop();
      glow.stop();
      rotate.stop();
    };
  }, [focused, glowAnimation, pulseAnimation, rotateAnimation]);

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      {/* Outer glow ring - only visible when focused */}
      {focused && (
        <Animated.View
          style={[
            styles.glowRing,
            {
              opacity: glowOpacity,
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        >
          <LinearGradient
            colors={isDark ? ['#667eea', '#764ba2', '#f093fb'] : ['#667eea', '#764ba2', '#4facfe']}
            style={styles.glowGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
      )}

      {/* Main button container with pulse animation */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: pulseAnimation }],
          },
        ]}
      >
        {/* Outer ring */}
        <View style={[styles.outerRing, { borderColor: isDark ? '#333' : '#fff' }]}>
          {/* Inner gradient circle */}
          <LinearGradient
            colors={
              focused
                ? ['#ff6b6b', '#ee5a52', '#ff4757']
                : isDark
                ? ['#667eea', '#764ba2']
                : ['#667eea', '#764ba2']
            }
            style={styles.gradientCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Inner white circle for contrast */}
            <View style={styles.innerCircle}>
              <IconSymbol 
                size={focused ? 32 : 28} 
                name="camera.fill" 
                color={focused ? '#ff6b6b' : (isDark ? '#667eea' : '#667eea')} 
              />
            </View>
          </LinearGradient>
        </View>

        {/* Shimmer effect overlay */}
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              opacity: glowAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.3, 0],
              }),
            },
          ]}
        />
      </Animated.View>

      {/* Bottom highlight */}
      <View style={[styles.bottomHighlight, { backgroundColor: isDark ? '#444' : '#f0f0f0' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -25, // Elevated position
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    opacity: 0.3,
  },
  buttonContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  outerRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  gradientCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  innerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  bottomHighlight: {
    position: 'absolute',
    bottom: -8,
    width: 30,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
});