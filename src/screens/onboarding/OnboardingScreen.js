// src/screens/onboarding/OnboardingScreen.js
import React, { useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  
  const onboardingData = [
    {
      id: '1',
      title: 'Welcome to EcoShop',
      description: 'Find sustainable and eco-friendly products from verified sellers.',
      image: require('../../../assets/onboarding-1.png'),
    },
    {
      id: '2',
      title: 'Shop With Confidence',
      description: 'All products are vetted for quality, sustainability, and ethical production.',
      image: require('../../../assets/onboarding-2.png'),
    },
    {
      id: '3',
      title: 'Support Small Businesses',
      description: 'Connect directly with artisans and small-scale producers worldwide.',
      image: require('../../../assets/onboarding-3.png'),
    },
  ];
  
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Auth');
    }
  };
  
  const handleSkip = () => {
    navigation.navigate('Auth');
  };
  
  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <Image source={item.image} style={styles.image} />
      <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
      <Text style={[styles.description, { color: theme.gray }]}>{item.description}</Text>
    </View>
  );
  
  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.gray }]}>Skip</Text>
        </TouchableOpacity>
        
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          onMomentumScrollEnd={e => {
            const index = Math.floor(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
        />
        
        <View style={styles.paginationContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.dot,
                { backgroundColor: index === currentIndex ? theme.primary : theme.border },
              ]}
            />
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title={currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});

export default OnboardingScreen;