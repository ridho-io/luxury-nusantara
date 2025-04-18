// src/screens/cart/CartScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert 
} from 'react-native';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { useTheme } from '../../context/ThemeContext';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';
import { Feather } from '@expo/vector-icons';

const CartScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { 
    items, 
    fetchCartItems, 
    updateQuantity, 
    removeItem, 
    getTotal, 
    loading 
  } = useCartStore();
  
  useEffect(() => {
    if (user) {
      fetchCartItems(user.id);
    }
  }, [user]);
  
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (user) {
      await updateQuantity(user.id, itemId, newQuantity);
    }
  };
  
  const handleRemoveItem = async (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive', 
          onPress: async () => {
            if (user) {
              await removeItem(user.id, itemId);
            }
          }
        }
      ]
    );
  };
  
  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout.');
      return;
    }
    
    navigation.navigate('Checkout');
  };
  
  const renderCartItem = ({ item }) => (
    <Card style={styles.cartItemCard}>
      <View style={styles.cartItemContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.productImage} 
          resizeMode="cover"
        />
        
        <View style={styles.productDetails}>
          <Text style={[styles.productName, { color: theme.text }]} numberOfLines={2}>
            {item.name}
          </Text>
          
          <Text style={[styles.productPrice, { color: theme.primary }]}>
            ${item.price.toFixed(2)}
          </Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
              style={[styles.quantityButton, { borderColor: theme.border }]}
            >
              <Feather name="minus" size={16} color={theme.text} />
            </TouchableOpacity>
            
            <Text style={[styles.quantityText, { color: theme.text }]}>
              {item.quantity}
            </Text>
            
            <TouchableOpacity
              onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
              style={[styles.quantityButton, { borderColor: theme.border }]}
              disabled={item.quantity >= item.stockCount}
            >
              <Feather name="plus" size={16} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => handleRemoveItem(item.id)}
          style={styles.removeButton}
        >
          <Feather name="trash-2" size={20} color={theme.error} />
        </TouchableOpacity>
      </View>
    </Card>
  );
  
  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Feather name="shopping-cart" size={80} color={theme.gray} />
      <Text style={[styles.emptyText, { color: theme.text }]}>
        Your cart is empty
      </Text>
      <Button
        title="Start Shopping"
        onPress={() => navigation.navigate('Home')}
        style={styles.startShoppingButton}
      />
    </View>
  );
  
  if (loading && items.length === 0) {
    return <Loader />;
  }
  
  return (
    <SafeAreaWrapper>
      <Header
        title="Shopping Cart"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyCart}
          showsVerticalScrollIndicator={false}
        />
        
        {items.length > 0 && (
          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.text }]}>
                Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                ${getTotal().toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.text }]}>
                Shipping
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                $5.00
              </Text>
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: theme.text }]}>
                Total
              </Text>
              <Text style={[styles.totalValue, { color: theme.primary }]}>
                ${(getTotal() + 5).toFixed(2)}
              </Text>
            </View>
            
            <Button
              title="Proceed to Checkout"
              onPress={handleCheckout}
              style={styles.checkoutButton}
              icon={<Feather name="shopping-bag" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />}
            />
          </Card>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 220, // Space for summary card
  },
  cartItemCard: {
    marginBottom: 12,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 24,
  },
  startShoppingButton: {
    width: 200,
  },
  summaryCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  checkoutButton: {
    marginTop: 16,
  },
});

export default CartScreen;