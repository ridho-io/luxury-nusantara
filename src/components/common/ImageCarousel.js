// src/components/common/ImageCarousel.js
import React, { useState, useRef } from 'react';
import { View, FlatList, Image, Dimensions, StyleSheet, Pressable } from 'react-native';
import { Button } from './Button';

const { width: windowWidth } = Dimensions.get('window');

export const ImageCarousel = ({ 
  images, 
  imageHeight = 220,
  showPagination = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  onImagePress,
  containerStyle,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  
  // Auto play effect
  React.useEffect(() => {
    let interval;
    if (autoPlay && images.length > 1) {
      interval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % images.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setActiveIndex(nextIndex);
      }, autoPlayInterval);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoPlay, autoPlayInterval, activeIndex, images.length]);
  
  const renderItem = ({ item }) => (
    <Pressable 
      style={[styles.imageContainer, { width: windowWidth }]}
      onPress={() => onImagePress && onImagePress(item)}
    >
      <Image 
        source={{ uri: item }} 
        style={[styles.image, { height: imageHeight }]}
        resizeMode="cover"
      />
    </Pressable>
  );
  
  const handleViewableItemsChanged = React.useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;
  
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(_, index) => `image-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      
      {showPagination && images.length > 1 && (
        <View style={styles.paginationContainer}>
          {images.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
