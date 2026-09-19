import { Menu, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export function MobileTopBar({ onOpenSidebar }) {
  const { cartCount, openCart } = useCart();

  return (
    <header className="mobile-top-bar">
      <button className="mobile-menu-trigger" onClick={onOpenSidebar} aria-label="Abrir menú de navegación">
        <Menu size={22} />
      </button>

      <Link to="/" className="mobile-brand">
        <div className="brand-badge-mini">⚡</div>
        <span className="brand-title">Quick<span>Order</span></span>
      </Link>

      <button className="mobile-cart-trigger" onClick={openCart} aria-label="Ver carrito">
        <ShoppingCart size={20} />
        {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
      </button>
    </header>
  );
}
