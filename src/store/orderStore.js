// src/store/orderStore.js
import { create } from 'zustand';
import { supabase } from '../services/supabase';

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  
  // Fetch orders for the current user
  fetchUserOrders: async (userId) => {
    if (!userId) return;
    
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      set({ orders: data, loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      return [];
    }
  },
  
  // Fetch a single order with items
  fetchOrderById: async (orderId) => {
    set({ loading: true, error: null });
    try {
      // Fetch order
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
        
      if (error) throw error;
      
      // Fetch order items
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            id,
            name,
            images
          )
        `)
        .eq('order_id', orderId);
        
      if (itemsError) throw itemsError;
      
      // Combine order with items
      const fullOrder = {
        ...order,
        items: items.map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.products.name,
          image: item.products.images[0],
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      set({ currentOrder: fullOrder, loading: false });
      return fullOrder;
    } catch (error) {
      set({ error: error.message, loading: false });
      return null;
    }
  },
  
  // Create a new order
  createOrder: async (userId, orderData, cartItems) => {
    set({ loading: true, error: null });
    try {
      // Insert order
      const { data: order, error } = await supabase
        .from('orders')
        .insert([{
          user_id: userId,
          total: orderData.total,
          shipping_address: orderData.shippingAddress,
          payment_method: orderData.paymentMethod,
          status: 'pending'
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      // Insert order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      // Clear cart
      const { error: cartError } = await supabase
        .from('cart_items')
        .delete()
.eq('user_id', userId);

      if (cartError) throw cartError;

      set({ loading: false });
      return order;
    } catch (error) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
.from('orders')
.update({ status })
.eq('id', orderId);

      if (error) throw error;

      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  // Clear current order
  clearCurrentOrder: () => {
    set({ currentOrder: null });
  }
}));
