// src/components/common/Card.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../context/ThemeContext';

export const Card = ({ children, style, glassmorphism = true, intensity = 60, ...props }) => {
  const { isDarkMode, theme } = useTheme();
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: glassmorphism ? 'transparent' : theme.card,
          borderColor: theme.border,
          shadowColor: isDarkMode ? '#000000' : '#000000',
        },
        style,
      ]}
      {...props}
    >
      {glassmorphism && (
        <BlurView
          intensity={intensity}
          tint={isDarkMode ? 'dark' : 'light'}
          style={styles.blurView}
        />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  content: {
    padding: 16,
  },
});