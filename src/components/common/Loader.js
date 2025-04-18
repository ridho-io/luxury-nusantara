// src/components/common/Loader.js
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Loader = ({ message = 'Loading...' }) => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.primary} />
      {message && (
        <Text style={[styles.text, { color: theme.text }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
  },
});