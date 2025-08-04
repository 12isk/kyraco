// app/CartContext.jsx
"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect
} from "react";

// shape: { id, name, price, variant, image, quantity }
const CartContext = createContext();

const ACTIONS = {
  INIT:   "init",
  ADD:    "add",
  REMOVE: "remove",
  UPDATE: "update",
  CLEAR:  "clear",
};

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT:
      return action.payload ?? [];

    case ACTIONS.ADD: {
      const item = action.payload;
      const exists = state.find(i => i.id === item.id);
      if (exists) {
        return state.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...state, item];
    }

    case ACTIONS.REMOVE:
      // payload is the id to remove
      return state.filter(i => i.id !== action.payload);

    case ACTIONS.UPDATE: {
      const { id, quantity } = action.payload;
      return state.map(i =>
        i.id === id ? { ...i, quantity } : i
      );
    }

    case ACTIONS.CLEAR:
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  // 1. Start with an empty array
  const [cart, dispatch] = useReducer(cartReducer, []);

  // 2. On mount, load from localStorage once
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        dispatch({ type: ACTIONS.INIT, payload: JSON.parse(stored) });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // 3. Whenever cart changes, persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // ignore write errors
    }
  }, [cart]);

  // 4. Action dispatchers
  const addItem    = item         => dispatch({ type: ACTIONS.ADD,    payload: item });
  const removeItem = id           => dispatch({ type: ACTIONS.REMOVE, payload: id });
  const updateQty  = (id, qty)    => dispatch({ type: ACTIONS.UPDATE, payload: { id, quantity: qty } });
  const clearCart  = ()           => dispatch({ type: ACTIONS.CLEAR });

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
