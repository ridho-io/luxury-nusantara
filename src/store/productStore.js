// src/store/productStore.js
import { create } from 'zustand';
import { supabase } from '../services/supabase';

export const useProductStore = create((set, get) => ({
  products: [],
  featuredProducts: [],
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  
  // Fetch products with optional filters
  fetchProducts: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      let query = supabase
        .from('products')
        .select('*');
        
      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      // Apply sorting
      if (filters.sort) {
        const [field, direction] = filters.sort.split(':');
        query = query.order(field, { ascending: direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      set({ products: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      return [];
    }
  },
  
  // Fetch featured products
  fetchFeaturedProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(5);
        
      if (error) throw error;
      set({ featuredProducts: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      return [];
    }
  },
  
  // Fetch a single product by ID
  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles:seller_id (username, avatar_url),
          reviews (*)
        `)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      set({ currentProduct: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      return null;
    }
  },
  
  // Fetch all categories
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .order('category');
        
      if (error) throw error;
      
      // Get unique categories
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      set({ categories: uniqueCategories, loading: false });
      return uniqueCategories;
    } catch (error) {
      set({ error: error.message, loading: false });
      return [];
    }
  },
  
  // Add a new product (for admin)
  addProduct: async (productData, images) => {
    set({ loading: true, error: null });
    try {
      // Upload images first
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, image);
            
          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
            
          return publicUrl;
        })
      );
      
      // Create product with image URLs
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          images: imageUrls
        }])
        .select();
        
      if (error) throw error;
      
      // Refresh products list
      await get().fetchProducts();
      set({ loading: false });
      return { success: true, data: data[0] };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Update product (for admin)
  updateProduct: async (id, updates, newImages = []) => {
    set({ loading: true, error: null });
    try {
      // Get current product
      const { data: currentProduct } = await supabase
        .from('products')
        .select('images')
        .eq('id', id)
        .single();
        
      let imageUrls = currentProduct.images || [];
      
      // Upload new images if any
      if (newImages.length > 0) {
        const newImageUrls = await Promise.all(
          newImages.map(async (image) => {
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
            const { data, error } = await supabase.storage
              .from('product-images')
              .upload(fileName, image);
              
            if (error) throw error;
            
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(fileName);
              
            return publicUrl;
          })
        );
        
        imageUrls = [...imageUrls, ...newImageUrls];
      }
      
      // Update product
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          images: imageUrls,
          updated_at: new Date()
        })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      
      // Refresh products and current product
      await get().fetchProducts();
      if (get().currentProduct?.id === id) {
        await get().fetchProductById(id);
      }
      
      set({ loading: false });
      return { success: true, data: data[0] };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Delete product (for admin)
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Refresh products list
      await get().fetchProducts();
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Add a product review
  addReview: async (userId, productId, rating, comment) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          user_id: userId,
          product_id: productId,
          rating,
          comment
        }])
        .select();
        
      if (error) throw error;
      
      // Refresh current product to update reviews
      if (get().currentProduct?.id === productId) {
        await get().fetchProductById(productId);
      }
      
      set({ loading: false });
      return { success: true, data: data[0] };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  }
}));