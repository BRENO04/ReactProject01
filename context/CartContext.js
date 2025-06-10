import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const CART_STORAGE_KEY = '@MyApp:cart';
const CartContext = createContext();

/**
 * @typedef {Object} CartItem
 * @property {string | number} id 
 * @property {string} nome 
 * @property {number} preco 
 * @property {number} quantidade 
 * @property {any} [imagem] 
 */

export function CartProvider({ children }) {
  const [itensSacola, setItensSacola] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (storedCart !== null) {
          setItensSacola(JSON.parse(storedCart));
        }
      } catch (e) {
        console.error("Erro ao carregar carrinho do AsyncStorage:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      if (!isLoading) { 
        try {
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itensSacola));
        } catch (e) {
          console.error("Erro ao salvar carrinho no AsyncStorage:", e);
        }
      }
    };
    saveCart();
  }, [itensSacola, isLoading]);

  /** @param {CartItem} item */
  const addToCart = useCallback((item) => {
    setItensSacola((prevItens) => {
      const existingItemIndex = prevItens.findIndex((cartItem) => cartItem.id === item.id);
      if (existingItemIndex !== -1) {

        return prevItens.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantidade: cartItem.quantidade + item.quantidade }
            : cartItem
        );
      } else {
        const newItem = { ...item, quantidade: Math.max(1, item.quantidade) }; 
        return [...prevItens, newItem];
      }
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setItensSacola((prevItens) => prevItens.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, novaQuantidade) => {
    setItensSacola((prevItens) =>
      prevItens
        .map((item) =>
          item.id === id ? { ...item, quantidade: Math.max(0, novaQuantidade) } : item 
        )
        .filter(item => item.quantidade > 0) 
    );
  }, []);

  const clearCart = useCallback(() => {
      setItensSacola([]);
  }, []);

  const calcularTotal = useCallback(() => {
    return itensSacola.reduce((total, item) => 
        total + (Number(item.preco) || 0) * (Number(item.quantidade) || 0), 0)
        .toFixed(2);
  }, [itensSacola]);

  const value = useMemo(() => ({
    itensSacola,
    addToCart,
    removeFromCart,
    updateQuantity, 
    clearCart, 
    calcularTotal,
    isLoadingCart: isLoading, 
  }), [itensSacola, addToCart, removeFromCart, updateQuantity, clearCart, calcularTotal, isLoading]);

  if (isLoading) {
      return null; 
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}

