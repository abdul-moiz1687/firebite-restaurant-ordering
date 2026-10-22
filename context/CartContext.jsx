"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // Load saved cart once in the browser.
 useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    let restoredItems = [];

    try {
      const savedCart = localStorage.getItem("firebite-cart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          restoredItems = parsedCart.filter(
            (item) =>
              item &&
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              Number.isFinite(item.price) &&
              item.price >= 0 &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0
          );
        }
      }
    } catch {
      restoredItems = [];
    }

    setItems(restoredItems);
    setIsReady(true);
  }, 0);

  return () => window.clearTimeout(timeoutId);
}, []);

  // Save cart changes after the initial load.
  useEffect(() => {
    if (!isReady) return;

    try {
      localStorage.setItem("firebite-cart", JSON.stringify(items));
    } catch {
      // Cart still works for the current session.
    }
  }, [items, isReady]);

  function addToCart(product) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }

  function updateQuantity(productId, quantity) {
    if (!Number.isInteger(quantity)) return;

    setItems((currentItems) =>
      quantity < 1
        ? currentItems.filter((item) => item.id !== productId)
        : currentItems.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          )
    );
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isReady,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}