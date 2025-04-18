// src/components/common/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { BlurView } from 'expo-blur';

export const Header = ({
  title,
  leftComponent,
  rightComponent,
  transparent = false,
  glassmorphism = true,
  centerTitle = true,
  style,
}) => {
  const { isDarkMode, theme } = useTheme();
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: transparent
            ? 'transparent'
            : glassmorphism
            ? 'transparent'
            : theme.background,
          borderBottomColor: transparent ? 'transparent' : theme.border,
          borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
        },
        style,
      ]}
    >
      {glassmorphism && !transparent && (
        <BlurView
          intensity={80}
          tint={isDarkMode ? 'dark' : 'light'}
          style={styles.blurView}
        />
      )}
      
      <View style={styles.contentContainer}>
        <View style={styles.leftContainer}>
          {leftComponent}
        </View>
        
        <View style={[styles.titleContainer, centerTitle && styles.titleCentered]}>
          {typeof title === 'string' ? (
            <Text
              style={[styles.title, { color: theme.text }]}
              numberOfLines={1}
            >
              {title}
            </Text>
          ) : (
            title
          )}
        </View>
        
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingTop: 20, // Account for status bar
    width: '100%',
    zIndex: 10,
    position: 'relative',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 60,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  titleCentered: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  rightContainer: {
    width: 60,
    alignItems: 'flex-end',
  },
});
