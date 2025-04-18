// src/screens/home/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  TextInput 
} from 'react-native';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Card } from '../../components/common/Card';
import { Header } from '../../components/common/Header';
import { ImageCarousel } from '../../components/common/ImageCarousel';
import { Tag } from '../../components/common/Tag';
import { EmptyState } from '../../components/common/EmptyState';
import { Loader } from '../../components/common/Loader';
import { useTheme } from '../../context/ThemeContext';
import { useProductStore } from '../../store/productStore';
import { Feather } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { 
    loading,
    error,
    products,
    featuredProducts,
    categories,
    fetchProducts,
    fetchFeaturedProducts,
    fetchCategories
  } = useProductStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchFeaturedProducts(),
        fetchProducts(),
        fetchCategories()
      ]);
    };
    
    loadData();
  }, []);
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery.trim() === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Banner images for carousel
  const bannerImages = [
    'https://images.unsplash.com/photo-1542838132-92c53300491e',
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58',
    'https://images.unsplash.com/photo-1564844536308-60bc2b4f68e4'
  ];
  
  const handleSearch = () => {
    fetchProducts({ search: searchQuery, category: selectedCategory });
  };
  
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && {
          backgroundColor: theme.primary + '20', // 20% opacity
          borderColor: theme.primary,
        },
      ]}
      onPress={() => {
        setSelectedCategory(selectedCategory === item ? null : item);
      }}
    >
      <Text
        style={[
          styles.categoryText,
          { color: selectedCategory === item ? theme.primary : theme.text },
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
  
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Card style={styles.productCardInner}>
        <Image source={{ uri: item.images[0] }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.productPrice, { color: theme.primary }]}>
            ${item.price.toFixed(2)}
          </Text>
          <View style={styles.productRating}>
            <Feather name="star" size={14} color={theme.warning} />
            <Text style={[styles.ratingText, { color: theme.gray }]}>
              {item.rating ? item.rating.toFixed(1) : '0.0'} ({item.reviews_count || 0})
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
  
  if (loading && products.length === 0) {
    return <Loader />;
  }
  
  return (
    <SafeAreaWrapper>
      <Header 
        title="EcoShop"
        rightComponent={
          <TouchableOpacity style={styles.cartButton}>
            <Feather name="bell" size={24} color={theme.text} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.searchInputContainer, { backgroundColor: theme.card }]}>
            <Feather name="search" size={20} color={theme.gray} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search products..."
              placeholderTextColor={theme.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Feather name="x" size={20} color={theme.gray} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <ImageCarousel
            images={bannerImages}
            imageHeight={180}
            showPagination
            autoPlay
          />
        </View>
        
        {/* Categories */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        
        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Products</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredProducts}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </View>
        )}
        
        {/* All Products */}
        <View style={[styles.sectionContainer, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>All Products</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>Sort</Text>
            </TouchableOpacity>
          </View>
          
          {filteredProducts.length > 0 ? (
            <View style={styles.productsGrid}>
              {filteredProducts.map(product => (
                <View key={product.id} style={styles.productGridItem}>
                  {renderProductItem({ item: product })}
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon={<Feather name="shopping-bag" size={64} color={theme.gray} />}
              title="No Products Found"
              message="We couldn't find any products matching your criteria."
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingTop: 0,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  bannerContainer: {
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  lastSection: {
    paddingBottom: 100, // Add space for the tab bar
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
    borderColor: '#E5E5EA',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  featuredList: {
    paddingHorizontal: 16,
  },
  productCard: {
    width: 160,
    marginRight: 16,
  },
  productCardInner: {
    padding: 0,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  productGridItem: {
    width: '50%',
    padding: 8,
  },
  cartButton: {
    padding: 8,
  },
});

export default HomeScreen;