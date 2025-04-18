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
                <Text style={[styles.sellerTitle, { color: theme.text }]}>Seller</Text>
                <TouchableOpacity>
                  <Text style={[styles.viewProfileText, { color: theme.primary }]}>
                    View Profile
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.sellerInfo}>
                <Image
                  source={
                    currentProduct.profiles.avatar_url
                      ? { uri: currentProduct.profiles.avatar_url }
                      : require('../../../assets/default-avatar.png')
                  }
                  style={styles.sellerAvatar}
                />
                <Text style={[styles.sellerName, { color: theme.text }]}>
                  {currentProduct.profiles.username}
                </Text>
              </View>
            </Card>
          )}
          
          {/* Quantity Selector */}
          <Card style={styles.quantityCard}>
            <Text style={[styles.quantityTitle, { color: theme.text }]}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                onPress={decreaseQuantity}
                style={[
                  styles.quantityButton,
                  { borderColor: theme.border, opacity: quantity === 1 ? 0.5 : 1 }
                ]}
                disabled={quantity === 1}
              >
                <Feather name="minus" size={20} color={theme.text} />
              </TouchableOpacity>
              
              <View style={[styles.quantityDisplay, { borderColor: theme.border }]}>
                <Text style={[styles.quantityText, { color: theme.text }]}>
                  {quantity}
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={increaseQuantity}
                style={[
                  styles.quantityButton,
                  {
                    borderColor: theme.border,
                    opacity: currentProduct.stock_count <= quantity ? 0.5 : 1
                  }
                ]}
                disabled={currentProduct.stock_count <= quantity}
              >
                <Feather name="plus" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>
      
      {/* Add to Cart Button */}
      <View style={[styles.bottomBar, { borderTopColor: theme.border }]}>
        <View style={styles.priceContainer}>
          <Text style={[styles.totalText, { color: theme.gray }]}>Total:</Text>
          <Text style={[styles.totalPrice, { color: theme.text }]}>
            ${(currentProduct.price * quantity).toFixed(2)}
          </Text>
        </View>
        
        <Button
          title="Add to Cart"
          onPress={handleAddToCart}
          loading={cartLoading}
          disabled={currentProduct.stock_count <= 0}
          size="medium"
          style={styles.addButton}
          icon={<Feather name="shopping-cart" size={20} color="#FFFFFF" style={styles.buttonIcon} />}
        />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100, // Add extra space for bottom bar
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '700',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stockTag: {
    marginLeft: 8,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  sellerCard: {
    marginBottom: 16,
  },
  sellerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sellerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  quantityCard: {
    marginBottom: 16,
  },
  quantityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  priceContainer: {
    flex: 1,
  },
  totalText: {
    fontSize: 14,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
  },
  addButton: {
    width: 200,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default ProductDetailScreen;