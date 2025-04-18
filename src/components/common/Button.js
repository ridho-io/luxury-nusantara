// src/components/common/Button.js
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../context/ThemeContext';

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style,
  ...props 
}) => {
  const { isDarkMode, theme } = useTheme();
  
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.primary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.border,
        };
      case 'glass':
        return {
          backgroundColor: 'transparent',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          overflow: 'hidden',
        };
      default:
        return {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        };
    }
  };
  
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 16,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 20,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 24,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 20,
        };
    }
  };
  
  const getTextStyle = () => {
    const baseStyle = {
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      fontWeight: '600',
      textAlign: 'center',
    };
    
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: theme.primary,
        };
      case 'outline':
      case 'glass':
        return {
          ...baseStyle,
          color: isDarkMode ? '#FFFFFF' : '#000000',
        };
      default:
        return {
          ...baseStyle,
          color: '#FFFFFF',
        };
    }
  };
  
  const buttonStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : undefined,
    ...getVariantStyle(),
    ...getSizeStyle(),
    ...style,
  };
  
  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          color={getTextStyle().color} 
          size="small" 
          style={{ marginRight: title ? 8 : 0 }} 
        />
      ) : icon ? (
        <>{icon}</>
      ) : null}
      {title && <Text style={getTextStyle()}>{title}</Text>}
    </>
  );
  
  if (variant === 'glass') {
    return (
      <TouchableOpacity
        onPress={disabled || loading ? null : onPress}
        activeOpacity={0.8}
        style={buttonStyle}
        {...props}
      >
        <BlurView
          intensity={80}
          tint={isDarkMode ? 'dark' : 'light'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          }}
        />
        {renderContent()}
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      onPress={disabled || loading ? null : onPress}
      activeOpacity={0.8}
      style={buttonStyle}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};