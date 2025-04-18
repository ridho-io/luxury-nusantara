// src/components/common/Badge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Badge = ({ count, containerStyle, size = 'small' }) => {
  const { theme } = useTheme();
  
  // Don't render if count is 0 or less
  if (!count || count <= 0) return null;
  
  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return {
          size: 16,
          fontSize: 10,
          minWidth: 16,
        };
      case 'medium':
        return {
          size: 20,
          fontSize: 12,
          minWidth: 20,
        };
      case 'large':
        return {
          size: 24,
          fontSize: 14,
          minWidth: 24,
        };
      default:
        return {
          size: 16,
          fontSize: 10,
          minWidth: 16,
        };
    }
  };
  
  const badgeSize = getBadgeSize();
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.notification,
          height: badgeSize.size,
          minWidth: badgeSize.minWidth,
          borderRadius: badgeSize.size / 2,
        },
        containerStyle,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: badgeSize.fontSize,
          },
        ]}
      >
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});