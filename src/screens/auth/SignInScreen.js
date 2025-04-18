// src/screens/auth/SignInScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Feather } from '@expo/vector-icons';

const SignInScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    const { success, error } = await signIn({ email, password });
    setLoading(false);
    
    if (!success) {
      Alert.alert('Sign In Failed', error || 'Please check your credentials and try again.');
    }
  };
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { success, error } = await signInWithGoogle();
    setLoading(false);
    
    if (!success) {
      Alert.alert('Google Sign In Failed', error || 'An error occurred. Please try again.');
    }
  };
  
  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: theme.text }]}>EcoShop</Text>
        </View>
        
        <Card style={styles.card}>
          <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>
          
          <Input
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            icon={<Feather name="mail" size={20} color={theme.gray} />}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            icon={<Feather name="lock" size={20} color={theme.gray} />}
            inputStyle={{ paddingRight: 50 }}
            containerStyle={{ marginBottom: 24 }}
          />
          
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={theme.gray}
            />
          </TouchableOpacity>
          
          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={loading}
            fullWidth
          />
          
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.gray }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>
          
          <Button
            title="Sign In with Google"
            onPress={handleGoogleSignIn}
            variant="outline"
            icon={<Image source={require('../../../assets/google-icon.png')} style={styles.googleIcon} />}
            fullWidth
          />
        </Card>
        
        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomText, { color: theme.gray }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={[styles.signUpText, { color: theme.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  card: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  passwordToggle: {
    position: 'absolute',
    right: 40,
    top: 150,
    zIndex: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontWeight: '500',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  bottomText: {
    fontSize: 16,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignInScreen;