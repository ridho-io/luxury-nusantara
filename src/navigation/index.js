// src/navigation/index.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Badge } from '../components/common/Badge';
import { useCartStore } from '../store/cartStore';

// Onboarding Screens
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

// Auth Screens
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

// Main App Screens
import HomeScreen from '../screens/home/HomeScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import OrderHistoryScreen from '../screens/profile/OrderHistoryScreen';
import OrderDetailScreen from '../screens/profile/OrderDetailScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminProductFormScreen from '../screens/admin/AdminProductFormScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminOrderDetailScreen from '../screens/admin/AdminOrderDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

// Home Stack Navigator
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
};

// Cart Stack Navigator
const CartStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CartMain" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
};

// Admin Stack Navigator
const AdminStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminProductForm" component={AdminProductFormScreen} />
      <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
      <Stack.Screen name="AdminOrderDetail" component={AdminOrderDetailScreen} />
    </Stack.Navigator>
  );
};

// Custom Tab Bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { isDarkMode, theme } = useTheme();
  const { getItemCount } = useCartStore();
  const cartItemCount = getItemCount();
  
  return (
    <View style={[styles.tabBarContainer, { borderTopColor: theme.border }]}>
      <BlurView
        intensity={80}
        tint={isDarkMode ? 'dark' : 'light'}
        style={styles.blurView}
      />
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
              
          const isFocused = state.index === index;
          
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          
          // Icon based on route name
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Cart':
              iconName = 'shopping-cart';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            case 'Admin':
              iconName = 'settings';
              break;
            default:
              iconName = 'circle';
          }
          
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <View style={styles.tabIconContainer}>
                <Feather
                  name={iconName}
                  size={24}
                  color={isFocused ? theme.primary : theme.gray}
                />
                
                {route.name === 'Cart' && cartItemCount > 0 && (
                  <Badge count={cartItemCount} containerStyle={styles.badge} />
                )}
              </View>
              
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused ? theme.primary : theme.gray,
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Main Tab Navigator
const TabNavigator = () => {
  const { userProfile } = useAuth();
  
  // Check if user is admin
  const isAdmin = userProfile?.role === 'admin';
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Cart" component={CartStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
      {isAdmin && <Tab.Screen name="Admin" component={AdminStackNavigator} />}
    </Tab.Navigator>
  );
};

// Main App Navigator
export const AppNavigator = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  
  // Show loading screen while checking auth status
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* User not logged in */}
        {!user ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        ) : (
          // User logged in
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    height: 80,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabBar: {
    flexDirection: 'row',
    height: '100%',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabIconContainer: {
    position: 'relative',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
  },
});

export default AppNavigator;