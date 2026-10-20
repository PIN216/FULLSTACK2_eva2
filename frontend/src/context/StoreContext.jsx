import React, { createContext, useState, useEffect, useMemo } from 'react';
import { calcularTotales } from '../services/descuentoService';

export const StoreContext = createContext();

// Nunca se guarda la contraseña en la sesión.
const sinPassword = (user) => {
  if (!user) return null;
  const { password, ...seguro } = user;
  return seguro;
};

export const StoreProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pms_cart')) || []; } catch { return []; }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try { return sinPassword(JSON.parse(localStorage.getItem('pms_session'))); } catch { return null; }
  });
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem('pms_cart', JSON.stringify(cart));
  }, [cart]);

  // No se puede agregar más unidades que el stock disponible.
  const tope = (producto) => (Number.isFinite(Number(producto.stock)) ? Number(producto.stock) : Infinity);

  const addToCart = (producto, cantidad = 1) => {
    if (tope(producto) <= 0) return;
    setCart((prev) => {
      const exists = prev.find((i) => i.id === producto.id);
      if (exists) {
        return prev.map((i) => (i.id === producto.id ? { ...i, cantidad: Math.min(i.cantidad + cantidad, tope(i)) } : i));
      }
      return [...prev, { ...producto, cantidad: Math.min(cantidad, tope(producto)) }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id, cantidad) => {
    if (cantidad <= 0) { removeFromCart(id); return; }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad: Math.min(cantidad, tope(i)) } : i)));
  };

  const clearCart = () => setCart([]);

  const login = (user) => {
    const seguro = sinPassword(user);
    setCurrentUser(seguro);
    localStorage.setItem('pms_session', JSON.stringify(seguro));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pms_session');
    setCurrentView('home');
  };

  // Totales con ofertas por producto y descuento de cliente (mayor de 50 / FELICES50)
  const cartResumen = useMemo(() => calcularTotales(cart, currentUser), [cart, currentUser]);
  const cartTotal = cartResumen.total;

  return (
    <StoreContext.Provider value={{
      currentView, setCurrentView,
      selectedProductId, setSelectedProductId,
      selectedBlogId, setSelectedBlogId,
      cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartResumen,
      currentUser, login, logout,
      lastOrder, setLastOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
};
