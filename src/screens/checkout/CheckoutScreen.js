// src/screens/checkout/CheckoutScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCartStore } from '../../store/cartStore';
import { useOrderStore } from '../../store/orderStore';
import { Feather } from '@expo/vector-icons';

const CheckoutScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, userProfile } = useAuth();
  const { items, getTotal, clearCart, loading: cartLoading } = useCartStore();
  const { createOrder, loading: orderLoading } = useOrderStore();
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: userProfile?.full_name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [orderNotes, setOrderNotes] = useState('');
  
  // Handle input changes
  const handleChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSubmit = async () => {
    // Validate form
    const requiredFields = ['fullName', 'addressLine1', 'city', 'state', 'zipCode', 'country', 'phoneNumber'];
    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    // Prepare order data
    const orderData = {
      shippingAddress,
      paymentMethod,
      notes: orderNotes,
      total: getTotal() + 5, // Subtotal + shipping
    };
    
    try {
      const order = await createOrder(user.id, orderData, items);
      
      if (order) {
        // Clear cart after successful order
        await clearCart(user.id);
        
        // Show success and navigate to order confirmation
        Alert.alert(
          'Order Placed',
          'Your order has been placed successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'HomeMain' }],
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to place your order. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
    }
  };
  
  if (cartLoading || orderLoading) {
    return <Loader message="Processing your order..." />;
  }
  
  return (
    <SafeAreaWrapper>
      <Header
        title="Checkout"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.text }]}>
              {items.reduce((total, item) => total + item.quantity, 0)} items
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              ${getTotal().toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.text }]}>Shipping</Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>$5.00</Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: theme.primary }]}>
              ${(getTotal() + 5).toFixed(2)}
            </Text>
          </View>
        </Card>
        
        {/* Shipping Address */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Shipping Address</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Full Name *</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              value={shippingAddress.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
              placeholder="Enter your full name"
              placeholderTextColor={theme.gray}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Address Line 1 *</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              value={shippingAddress.addressLine1}
              onChangeText={(text) => handleChange('addressLine1', text)}
              placeholder="Street address, P.O. box, company name"
              placeholderTextColor={theme.gray}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Address Line 2</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              value={shippingAddress.addressLine2}
              onChangeText={(text) => handleChange('addressLine2', text)}
              placeholder="Apartment, suite, unit, building, floor, etc."
              placeholderTextColor={theme.gray}
            />
          </View>
          
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>City *</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                value={shippingAddress.city}
                onChangeText={(text) => handleChange('city', text)}
                placeholder="City"
                placeholderTextColor={theme.gray}
              />
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>State *</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                value={shippingAddress.state}
                onChangeText={(text) => handleChange('state', text)}
                placeholder="State/Province"
                placeholderTextColor={theme.gray}
              />
            </View>
          </View>
          
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Zip Code *</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                value={shippingAddress.zipCode}
                // src/screens/checkout/CheckoutScreen.js (continued)
                placeholder="Zip/Postal Code"
                placeholderTextColor={theme.gray}
              />
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Country *</Text>
              <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                value={shippingAddress.country}
                onChangeText={(text) => handleChange('country', text)}
                placeholder="Country"
                placeholderTextColor={theme.gray}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Phone Number *</Text>
            <TextInput
              style={[styles.input, { color: theme.text, borderColor: theme.border }]}
              value={shippingAddress.phoneNumber}
              onChangeText={(text) => handleChange('phoneNumber', text)}
              placeholder="Phone Number"
              placeholderTextColor={theme.gray}
              keyboardType="phone-pad"
            />
          </View>
        </Card>
        
        {/* Payment Method */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'creditCard' && {
                borderColor: theme.primary,
                backgroundColor: `${theme.primary}10`, // 10% opacity
              },
              { borderColor: theme.border }
            ]}
            onPress={() => setPaymentMethod('creditCard')}
          >
            <View style={styles.paymentOptionContent}>
              <Feather
                name="credit-card"
                size={24}
                color={paymentMethod === 'creditCard' ? theme.primary : theme.text}
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  { color: paymentMethod === 'creditCard' ? theme.primary : theme.text },
                ]}
              >
                Credit Card
              </Text>
            </View>
            
            {paymentMethod === 'creditCard' && (
              <Feather name="check" size={20} color={theme.primary} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'paypal' && {
                borderColor: theme.primary,
                backgroundColor: `${theme.primary}10`, // 10% opacity
              },
              { borderColor: theme.border }
            ]}
            onPress={() => setPaymentMethod('paypal')}
          >
            <View style={styles.paymentOptionContent}>
              <Feather
                name="dollar-sign"
                size={24}
                color={paymentMethod === 'paypal' ? theme.primary : theme.text}
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  { color: paymentMethod === 'paypal' ? theme.primary : theme.text },
                ]}
              >
                PayPal
              </Text>
            </View>
            
            {paymentMethod === 'paypal' && (
              <Feather name="check" size={20} color={theme.primary} />
            )}
          </TouchableOpacity>
        </Card>
        
        {/* Order Notes */}
        <Card style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Order Notes</Text>
          <TextInput
            style={[
              styles.input,
              styles.textarea,
              { color: theme.text, borderColor: theme.border, height: 100 },
            ]}
            value={orderNotes}
            onChangeText={setOrderNotes}
            placeholder="Add any special instructions or notes about your order"
            placeholderTextColor={theme.gray}
            multiline
            textAlignVertical="top"
          />
        </Card>
        
        {/* Place Order Button */}
        <Button
          title="Place Order"
          onPress={handleSubmit}
          size="large"
          fullWidth
          style={styles.placeOrderButton}
        />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textarea: {
    paddingVertical: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  placeOrderButton: {
    marginBottom: 100, // Extra margin to avoid the bottom tab bar
  },
});

export default CheckoutScreen;