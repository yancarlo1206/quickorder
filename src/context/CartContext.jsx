import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('quickorder_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('quickorder_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error guardando carrito:', e);
    }
  }, [cartItems]);

  const addToCart = (producto, cantidad = 1) => {
    setCartItems((prevItems) => {
      const index = prevItems.findIndex((item) => String(item.id) === String(producto.id));
      if (index > -1) {
        const updated = [...prevItems];
        updated[index] = {
          ...updated[index],
          cantidad: updated[index].cantidad + cantidad
        };
        return updated;
      } else {
        // Parse numerical price if it's a string like "$ 15.000" or number
        let numericPrice = producto.precio;
        if (typeof numericPrice === 'string') {
          numericPrice = parseFloat(numericPrice.replace(/[^0-9.-]+/g, '')) || 0;
        }

        return [
          ...prevItems,
          {
            id: producto.id || Date.now(),
            nombre: producto.nombre,
            precio: numericPrice,
            precioOriginal: producto.precio,
            imagen: producto.imagen,
            tag: producto.tag,
            cantidad: cantidad
          }
        ];
      }
    });
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (String(item.id) === String(id)) {
            const newQty = item.cantidad + delta;
            return newQty > 0 ? { ...item, cantidad: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => String(item.id) !== String(id)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

  const cartTotal = cartItems.reduce((acc, item) => {
    const price = typeof item.precio === 'number' ? item.precio : (parseFloat(item.precio) || 0);
    return acc + price * item.cantidad;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
