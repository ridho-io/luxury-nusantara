import { create } from 'zustand';
import { supabase } from '../services/supabase';

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,
  
  // Fetch cart items for logged in user
  fetchCartItems: async (userId) => {
    if (!userId) return;
    
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          products (
            id,
            name,
            price,
            images,
            stock_count
          )
        `)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Transform the data to a more usable format
      const cartItems = data.map(item => ({
        id: item.id,
        productId: item.products.id,
        name: item.products.name,
        price: item.products.price,
        image: item.products.images[0],
        quantity: item.quantity,
        stockCount: item.products.stock_count
      }));
      
      set({ items: cartItems, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // Add item to cart
  addItem: async (userId, productId, quantity = 1) => {
    if (!userId) return { success: false, error: 'User not authenticated' };
    
    set({ loading: true, error: null });
    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();
      
      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
          
        if (error) throw error;
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert([
            {
              user_id: userId,
              product_id: productId,
              quantity
            }
          ]);
          
        if (error) throw error;
      }
      
      // Refresh cart
      await get().fetchCartItems(userId);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Update item quantity
  updateQuantity: async (userId, itemId, quantity) => {
    if (!userId) return { success: false, error: 'User not authenticated' };
    if (quantity < 1) return get().removeItem(userId, itemId);
    
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Refresh cart
      await get().fetchCartItems(userId);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Remove item from cart
  removeItem: async (userId, itemId) => {
    if (!userId) return { success: false, error: 'User not authenticated' };
    
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Refresh cart
      await get().fetchCartItems(userId);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Clear cart
  clearCart: async (userId) => {
    if (!userId) return { success: false, error: 'User not authenticated' };
    
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
        
      if (error) throw error;
      
      set({ items: [], loading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Calculate cart total
  getTotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  // Get item count
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  }
}));