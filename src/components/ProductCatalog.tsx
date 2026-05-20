import React, { useState } from 'react';
import { ShoppingBag, Leaf, Flame, Droplets, Search, Filter, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  strain: string;
  type: 'flower' | 'concentrate' | 'edible' | 'cartridge';
  thc: string;
  cbd: string;
  price: number;
  image: string;
  effects: string[];
  description: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Northern Lights',
    strain: 'Indica',
    type: 'flower',
    thc: '24%',
    cbd: '0.5%',
    price: 45,
    image: '🌿',
    effects: ['Relaxing', 'Sleepy', 'Happy'],
    description: 'Classic indica with earthy, sweet aroma'
  },
  {
    id: '2',
    name: 'Sour Diesel',
    strain: 'Sativa',
    type: 'flower',
    thc: '22%',
    cbd: '0.3%',
    price: 52,
    image: '🌿',
    effects: ['Energetic', 'Creative', 'Uplifted'],
    description: 'Fast-acting sativa with diesel notes'
  },
  {
    id: '3',
    name: 'Blue Dream',
    strain: 'Hybrid',
    type: 'flower',
    thc: '21%',
    cbd: '1%',
    price: 48,
    image: '🌿',
    effects: ['Balanced', 'Euphoric', 'Relaxed'],
    description: 'Popular hybrid with berry sweetness'
  },
  {
    id: '4',
    name: 'Gorilla Glue #4',
    strain: 'Hybrid',
    type: 'concentrate',
    thc: '85%',
    cbd: '0.5%',
    price: 75,
    image: '💎',
    effects: ['Heavy', 'Relaxing', 'Euphoric'],
    description: 'Premium resin concentrate'
  },
  {
    id: '5',
    name: 'Jack Herer',
    strain: 'Sativa',
    type: 'cartridge',
    thc: '90%',
    cbd: '0.2%',
    price: 55,
    image: '� Cart',
    effects: ['Clear', 'Focused', 'Energetic'],
    description: 'Pure sativa distillate cartridge'
  },
  {
    id: '6',
    name: 'CBD Tincture',
    strain: 'CBD',
    type: 'edible',
    thc: '0%',
    cbd: '1000mg',
    price: 65,
    image: '🧴',
    effects: ['Calming', 'Pain Relief', 'Relaxing'],
    description: 'Full spectrum CBD tincture'
  },
  {
    id: '7',
    name: 'Girl Scout Cookies',
    strain: 'Hybrid',
    type: 'flower',
    thc: '26%',
    cbd: '0.4%',
    price: 50,
    image: '🌿',
    effects: ['Happy', 'Euphoric', 'Relaxed'],
    description: 'Potent hybrid with sweet mint'
  },
  {
    id: '8',
    name: 'Pineapple Express',
    strain: 'Sativa',
    type: 'edible',
    thc: '100mg',
    cbd: '0%',
    price: 25,
    image: '🍍',
    effects: ['Energetic', 'Happy', 'Creative'],
    description: 'Tropical fruit gummies'
  }
];

interface CartItem extends Product {
  quantity: number;
}

interface ProductCatalogProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ cart, onAddToCart }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.strain.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || p.type === selectedType;
    return matchesSearch && matchesType;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'flower': return <Leaf size={14} />;
      case 'concentrate': return <Flame size={14} />;
      case 'edible': return <Droplets size={14} />;
      case 'cartridge': return <ShoppingBag size={14} />;
      default: return <Leaf size={14} />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0d1510',
      color: '#e8f5e9',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(13, 21, 16, 0.95)',
        borderBottom: '1px solid #1a2f25',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #4a7c59, #2d5a3d)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Leaf size={20} color="#8fc99a" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '0.1em' }}>
              NORTHSIDE SMOKE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#1a2f25',
              padding: '8px 16px',
              borderRadius: '24px',
              border: '1px solid #2a4a3a'
            }}>
              <ShoppingCart size={18} color="#8fc99a" />
              <span style={{ fontSize: '14px' }}>
                {cartCount} items — ${cartTotal}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(180deg, #1a2f25 0%, #0d1510 100%)',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 700,
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #8fc99a, #5a9c6f)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Premium Cannabis Products
        </h1>
        <p style={{ color: '#6a8a7a', fontSize: '18px', maxWidth: '500px', margin: '0 auto' }}>
          Lab-tested, compliant, and delivered with care. Browse our selection of premium strains, concentrates, and edibles.
        </p>
      </div>

      {/* Filters */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 24px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          flex: '1',
          minWidth: '250px',
          position: 'relative'
        }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#5a7a6a' }} />
          <input
            type="text"
            placeholder="Search strains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              background: '#1a2f25',
              border: '1px solid #2a4a3a',
              borderRadius: '8px',
              color: '#e8f5e9',
              fontSize: '15px'
            }}
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{
            padding: '12px 16px',
            background: '#1a2f25',
            border: '1px solid #2a4a3a',
            borderRadius: '8px',
            color: '#e8f5e9',
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Products</option>
          <option value="flower">Flower</option>
          <option value="concentrate">Concentrates</option>
          <option value="cartridge">Cartridges</option>
          <option value="edible">Edibles</option>
        </select>
      </div>

      {/* Products Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 60px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '24px'
      }}>
        {filtered.map(product => (
          <div key={product.id} style={{
            background: '#1a2f25',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #2a4a3a',
            transition: 'all 0.2s'
          }}>
            <div style={{
              height: '140px',
              background: 'linear-gradient(135deg, #2a4a3a, #1a2f25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px'
            }}>
              {product.image}
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <span style={{
                  background: '#2d5a3d',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#8fc99a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {getTypeIcon(product.type)}
                  {product.type}
                </span>
                <span style={{
                  background: product.strain === 'Indica' ? '#3d2a5a' : 
                             product.strain === 'Sativa' ? '#5a3d2a' : '#2a4a3a',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#c9a8e8'
                }}>
                  {product.strain}
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                {product.name}
              </h3>

              <p style={{ color: '#6a8a7a', fontSize: '13px', marginBottom: '12px', lineHeight: 1.5 }}>
                {product.description}
              </p>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '13px',
                color: '#8fc99a'
              }}>
                <span>THC: <strong>{product.thc}</strong></span>
                <span>CBD: <strong>{product.cbd}</strong></span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '22px', fontWeight: 700, color: '#8fc99a' }}>
                  ${product.price}
                </span>
                <button
                  onClick={() => onAddToCart(product)}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #4a7c59, #3d6b4f)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          color: '#5a7a6a'
        }}>
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};