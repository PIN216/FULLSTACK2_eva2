import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pms_cart')) || []; } catch { return []; }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pms_session')) || null; } catch { return null; }
  });
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem('pms_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (producto, cantidad = 1) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === producto.id);
      if (exists) {
        return prev.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i));
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const updateQuantity = (id, cantidad) => {
    if (cantidad <= 0) { removeFromCart(id); return; }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad } : i)));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
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

  const cartTotal = cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  return (
    <StoreContext.Provider value={{
      currentView, setCurrentView,
      selectedProductId, setSelectedProductId,
      selectedBlogId, setSelectedBlogId,
      cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal,
      currentUser, login, logout,
      lastOrder, setLastOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
};
