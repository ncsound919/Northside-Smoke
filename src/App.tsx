import React, { useState, useEffect } from 'react';
import { AgeGate } from './components/AgeGate';
import { ProductCatalog } from './components/ProductCatalog';
import { StorefrontCart } from './components/StorefrontCart';

interface Product {
  id: string;
  name: string;
  strain: string;
  type: string;
  thc: string;
  cbd: string;
  price: number;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function App() {
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('northside-age-verified');
    if (verified) {
      setIsAgeVerified(true);
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    alert('Checkout integration coming soon! Contact us to place your order.');
  };

  if (!isAgeVerified) {
    return <AgeGate onVerified={() => setIsAgeVerified(true)} />;
  }

  return (
    <>
      <ProductCatalog cart={cart} onAddToCart={handleAddToCart} />
      <StorefrontCart
        items={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
      />
    </>
  );
}