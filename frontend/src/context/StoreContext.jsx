import React, { createContext, useState, useEffect, useMemo } from 'react';
import { calcularTotales } from '../services/descuentoService';

/**
 * Contexto global de la aplicación (Pastelería Mil Sabores).
 * Provee estado centralizado para navegación entre vistas, gestión del carrito,
 * sesión de usuario autenticado con JWT y totales con descuentos aplicados.
 */
export const StoreContext = createContext();

/**
 * Función utilitaria para sanitizar el objeto de usuario.
 * Garantiza que la contraseña nunca se almacene en memoria del navegador ni en localStorage.
 * @param {Object|null} user - Objeto de usuario recibido.
 * @returns {Object|null} Usuario sin el campo password.
 */
const sinPassword = (user) => {
  if (!user) return null;
  const { password, ...seguro } = user;
  return seguro;
};

/**
 * Proveedor del contexto global de la tienda.
 */
export const StoreProvider = ({ children }) => {
  // Estado de la vista activa en el SPA
  const [currentView, setCurrentView] = useState('home');

  // Identificadores para vistas de detalle
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  // Carrito de compras con persistencia en localStorage
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pms_cart')) || [];
    } catch {
      return [];
    }
  });

  // Sesión del usuario actual (recuperada de localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return sinPassword(JSON.parse(localStorage.getItem('pms_session')));
    } catch {
      return null;
    }
  });

  // Última orden generada (para visualización de boleta tras compra)
  const [lastOrder, setLastOrder] = useState(null);

  // Sincroniza el carrito en localStorage ante cada cambio
  useEffect(() => {
    localStorage.setItem('pms_cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Obtiene el tope máximo de unidades disponibles en stock para no sobre-vender.
   */
  const tope = (producto) => (Number.isFinite(Number(producto.stock)) ? Number(producto.stock) : Infinity);

  /**
   * Agrega un producto al carrito respetando el stock disponible.
   * @param {Object} producto - Producto a añadir.
   * @param {number} [cantidad=1] - Cantidad a incorporar.
   */
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

  /**
   * Elimina un producto del carrito solicitando confirmación al usuario.
   * @param {number|string} id - ID del producto a eliminar.
   */
  const removeFromCart = (id) => {
    const productoAEliminar = cart.find((i) => i.id === id);
    const nombre = productoAEliminar ? productoAEliminar.nombre : 'este producto';

    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}" del carrito?`);
    if (confirmacion) {
      setCart((prev) => prev.filter((i) => i.id !== id));
    }
  };

  /**
   * Modifica la cantidad de unidades de un producto en el carrito.
   * @param {number|string} id - ID del producto.
   * @param {number} cantidad - Nueva cantidad deseada.
   */
  const updateQuantity = (id, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, cantidad: Math.min(cantidad, tope(i)) } : i)));
  };

  /**
   * Vacía la totalidad de los artículos del carrito.
   */
  const clearCart = () => setCart([]);

  /**
   * Inicia sesión del usuario, almacena el token JWT y persiste los datos seguros.
   * @param {Object} user - Datos del usuario autenticado.
   */
  const login = (user) => {
    if (user && user.token) {
      localStorage.setItem('pms_token', user.token);
    }
    const seguro = sinPassword(user);
    setCurrentUser(seguro);
    localStorage.setItem('pms_session', JSON.stringify(seguro));
  };

  /**
   * Cierra la sesión activa, revoca tokens locales y redirige al inicio de la aplicación.
   */
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pms_session');
    localStorage.removeItem('pms_token');
    setCurrentView('home');
  };

  // Cálculo memorizado de totales con ofertas por producto y descuentos de usuario
  const cartResumen = useMemo(() => calcularTotales(cart, currentUser), [cart, currentUser]);
  const cartTotal = cartResumen.total;

  // Verificación de roles normalizados según requerimientos de evaluación 3:
  const userRol = (currentUser?.rol || '').toUpperCase().trim();
  const isAdmin = userRol === 'ADMIN' || userRol === 'ADMINISTRADOR';
  const isVendedor = userRol === 'VENDEDOR';
  const isCliente = !isAdmin && !isVendedor;

  return (
    <StoreContext.Provider value={{
      currentView, setCurrentView,
      selectedProductId, setSelectedProductId,
      selectedBlogId, setSelectedBlogId,
      cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartResumen,
      currentUser, login, logout,
      lastOrder, setLastOrder,
      isAdmin, isVendedor, isCliente
    }}>
      {children}
    </StoreContext.Provider>
  );
};
