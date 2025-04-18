// src/components/common/Tag.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Tag = ({ label, variant = 'default', size = 'medium', style }) => {
  const { theme } = useTheme();
  
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
          textColor: '#FFFFFF',
        };
      case 'secondary':
        return {
          backgroundColor: theme.secondary,
          borderColor: theme.secondary,
          textColor: '#FFFFFF',
        };
      case 'success':
        return {
          backgroundColor: theme.success,
          borderColor: theme.success,
          textColor: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: theme.warning,
          borderColor: theme.warning,
          textColor: '#000000',
        };
      case 'error':
        return {
          backgroundColor: theme.error,
          borderColor: theme.error,
          textColor: '#FFFFFF',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.border,
          textColor: theme.text,
        };
      default:
        return {
          backgroundColor: 'rgba(142, 142, 147, 0.2)',
          borderColor: 'transparent',
          textColor: theme.text,
        };
    }
  };
  
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          fontSize: 12,
          borderRadius: 8,
        };
      case 'large':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 16,
          borderRadius: 16,
        };
      default:
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 14,
          borderRadius: 12,
        };
    }
  };
  
  const variantStyle = getVariantStyle();
  const sizeStyle = getSizeStyle();
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          borderRadius: sizeStyle.borderRadius,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: variantStyle.textColor,
            fontSize: sizeStyle.fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
  },
});
