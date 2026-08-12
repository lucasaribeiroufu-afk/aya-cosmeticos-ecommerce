import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);
const initialState = { items: [], isOpen: false };

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items };
    case 'ADD': {
      const { product, quantity = 1 } = action;
      if (!product || !product.id) return state;

      const existing = state.items.find((i) => i.product_id === product.id);
      let items;
      if (existing) {
        items = state.items.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        items = [...state.items, {
          product_id: product.id,
          name: product.name || 'Produto sem nome',
          price: Number(product.price) || 0,
          image_url: product.image_url || '',
          quantity,
        }];
      }
      return { ...state, items, isOpen: true };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.product_id !== action.id) };
    case 'SET_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.product_id === action.id ? { ...i, quantity: Math.max(1, action.quantity) } : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('aya_cart');
      if (raw) dispatch({ type: 'HYDRATE', items: JSON.parse(raw) });
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('aya_cart', JSON.stringify(state.items));
  }, [state.items]);

  const value = {
    items: state.items,
    isOpen: state.isOpen,
    add: (product, quantity) => dispatch({ type: 'ADD', product, quantity }),
    remove: (id) => dispatch({ type: 'REMOVE', id }),
    setQty: (id, quantity) => dispatch({ type: 'SET_QTY', id, quantity }),
    clear: () => dispatch({ type: 'CLEAR' }),
    openCart: () => dispatch({ type: 'OPEN' }),
    closeCart: () => dispatch({ type: 'CLOSE' }),
    count: state.items.reduce((s, i) => s + i.quantity, 0),
    subtotal: state.items.reduce((s, i) => s + i.price * i.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
