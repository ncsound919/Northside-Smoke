import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  strain: string;
  type: string;
  thc: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export const StorefrontCart: React.FC<CartProps> = ({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Cart Panel */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '420px',
        background: '#0d1510',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #1a2f25',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShoppingBag size={24} color="#8fc99a" />
            <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>
              Your Cart
            </h2>
            <span style={{
              background: '#2d5a3d',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#8fc99a'
            }}>
              {itemCount} items
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#5a7a6a',
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px'
        }}>
          {items.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#5a7a6a'
            }}>
              <ShoppingBag size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '16px' }}>Your cart is empty</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Browse our products to find what you're looking for.
              </p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                gap: '16px',
                padding: '16px 0',
                borderBottom: '1px solid #1a2f25'
              }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#1a2f25',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px'
                }}>
                  {item.image}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#8fc99a' }}>
                      ${item.price * item.quantity}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#5a7a6a', margin: '0 0 12px' }}>
                    {item.strain} • {item.type}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#1a2f25',
                      borderRadius: '8px',
                      padding: '4px'
                    }}>
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        disabled={item.quantity <= 1}
                        style={{
                          width: '28px',
                          height: '28px',
                          background: item.quantity <= 1 ? '#2a3a2a' : '#2d5a3d',
                          border: 'none',
                          borderRadius: '6px',
                          color: item.quantity <= 1 ? '#4a5a4a' : '#8fc99a',
                          cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '14px' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          background: '#2d5a3d',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#8fc99a',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemove(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#5a7a6a',
                        cursor: 'pointer',
                        padding: '8px'
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid #1a2f25',
            background: '#0d1510'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <span style={{ color: '#6a8a7a', fontSize: '15px' }}>Subtotal</span>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#8fc99a' }}>
                ${total}
              </span>
            </div>

            <p style={{
              fontSize: '12px',
              color: '#4a5a4a',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              Taxes and shipping calculated at checkout
            </p>

            <button
              onClick={onCheckout}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #4a7c59, #3d6b4f)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Checkout
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};