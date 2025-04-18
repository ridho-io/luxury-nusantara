// src/components/common/SafeAreaWrapper.js
import React from 'react';
import { View, StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const SafeAreaWrapper = ({ children, style }) => {
  const { isDarkMode, theme } = useTheme();
  
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
        style,
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});