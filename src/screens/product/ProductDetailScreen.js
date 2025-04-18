// src/screens/product/ProductDetailScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert 
} from 'react-native';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { ImageCarousel } from '../../components/common/ImageCarousel';
import { Tag } from '../../components/common/Tag';
import { Card } from '../../components/common/Card';
import { Loader } from '../../components/common/Loader';
import { useTheme } from '../../context/ThemeContext';
import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';
import { Feather } from '@expo/vector-icons';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const { theme } = useTheme();
  const { user } = useAuth();
  const { fetchProductById, currentProduct, loading } = useProductStore();
  const { addItem, loading: cartLoading } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    fetchProductById(productId);
  }, [productId]);
  
  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to add items to your cart.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('Auth') }
      ]);
      return;
    }
    
    const { success, error } = await addItem(user.id, productId, quantity);
    
    if (success) {
      Alert.alert('Success', 'Product added to cart successfully.');
    } else {
      Alert.alert('Error', error || 'Failed to add product to cart. Please try again.');
    }
  };
  
  const increaseQuantity = () => {
    if (currentProduct && quantity < currentProduct.stock_count) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  if (loading || !currentProduct) {
    return <Loader />;
  }
  
  return (
    <SafeAreaWrapper>
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
        }
        rightComponent={
          <TouchableOpacity>
            <Feather name="heart" size={24} color={theme.text} />
          </TouchableOpacity>
        }
        transparent
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <ImageCarousel
          images={currentProduct.images}
          imageHeight={300}
          showPagination
        />
        
        {/* Product Info */}
        <View style={styles.infoContainer}>
          <View style={styles.nameContainer}>
            <Text style={[styles.productName, { color: theme.text }]}>
              {currentProduct.name}
            </Text>
            <Text style={[styles.productPrice, { color: theme.primary }]}>
              ${currentProduct.price.toFixed(2)}
            </Text>
          </View>
          
          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Feather
                  key={star}
                  name="star"
                  size={18}
                  color={star <= (currentProduct.rating || 0) ? theme.warning : theme.border}
                  style={{ marginRight: 4 }}
                />
              ))}
            </View>
            <Text style={[styles.ratingText, { color: theme.gray }]}>
              ({currentProduct.reviews?.length || 0} reviews)
            </Text>
          </View>
          
          {/* Tags */}
          <View style={styles.tagsContainer}>
            <Tag label={currentProduct.category} variant="primary" size="small" />
            {currentProduct.stock_count > 0 ? (
              <Tag label="In Stock" variant="success" size="small" style={styles.stockTag} />
            ) : (
              <Tag label="Out of Stock" variant="error" size="small" style={styles.stockTag} />
            )}
          </View>
          
          {/* Description */}
          <Card style={styles.descriptionCard}>
            <Text style={[styles.descriptionTitle, { color: theme.text }]}>Description</Text>
            <Text style={[styles.descriptionText, { color: theme.gray }]}>
              {currentProduct.description}
            </Text>
          </Card>
          
          {/* Seller Info */}
          {currentProduct.profiles && (
            <Card style={styles.sellerCard}>
              <View style={styles.sellerHeader}>
                <Text style={[styles.sellerTitle, { color: theme.text }]}>Seller