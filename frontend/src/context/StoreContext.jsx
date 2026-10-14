import React, { createContext, useState, useEffect } from 'react';
import { DataService } from '../data/dataService';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pms_cart')) || [];
    } catch {
      return [];
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pms_session')) || null;
    } catch {
      return null;
    }
  });
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem('pms_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (producto, cantidad = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === producto.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }
      return [...prevCart, { ...producto, cantidad }];
    });
  };

  const updateQuantity = (id, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, cantidad } : item)));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('pms_session', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pms_session');
    setCurrentView('home');
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedCategoria,
        setSelectedCategoria,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        currentUser,
        login,
        logout,
        lastOrder,
        setLastOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
