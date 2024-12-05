import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a Context for the Cart
const CartContext = createContext();

// Create a Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error('Error parsing cart data:', err);
        setCartItems([]);
      }
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const existingItem = cartItems.find((i) => i.id === item.id);
    
    if (existingItem) {
      setCartItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCartItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
    return true;
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    return true;
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return false;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
    return true;
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    return true;
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart,
      loading,
      error 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the Cart context
export const useCart = () => {
  return useContext(CartContext);
};
