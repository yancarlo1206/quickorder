import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {
  ShoppingBag,
  Package,
  FolderTree,
  Users,
  ClipboardList,
  UserCheck,
  Info,
  ShoppingCart,
  X,
  Sparkles
} from 'lucide-react';

export function Sidebar({ isOpen, onClose, categorias = [], categoriaActiva, onSelectCategoria }) {
  const location = useLocation();
  const { cartCount, cartTotal, openCart } = useCart();
  const esCatalogo = location.pathname === '/';

  const menuItems = [
    {
      group: 'Tienda',
      items: [
        { path: '/', label: 'Catálogo', icon: ShoppingBag, badge: 'En Vivo' },
      ],
    },
    {
      group: 'Administración',
      items: [
        { path: '/productos', label: 'Productos', icon: Package },
        { path: '/categorias', label: 'Categorías', icon: FolderTree },
        { path: '/clientes', label: 'Clientes', icon: Users },
        { path: '/estados-orden', label: 'Estados Orden', icon: ClipboardList },
        { path: '/usuarios', label: 'Usuarios', icon: UserCheck },
        { path: '/informacion', label: 'Información', icon: Info },
      ],
    },
  ];

  return (
    <>
      {/* Backdrop para móviles */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        {/* Cabecera del Sidebar */}
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-brand" onClick={onClose}>
            <div className="brand-icon-wrapper">
              <span className="brand-glyph">⚡</span>
            </div>
            <div className="brand-text">
              <div className="brand-name">
                Quick<span>Order</span>
              </div>
              <span className="brand-tag">v2.0 PRO</span>
            </div>
          </NavLink>

          <button className="sidebar-close-btn" onClick={onClose} aria-label="Cerrar menú">
            <X size={20} />
          </button>
        </div>

        {/* Estado del Negocio */}
        <div className="store-status-pill">
          <span className="status-dot"></span>
          <span className="status-text">Pedidos en línea activos</span>
        </div>

        {/* Contenido de Navegación Vertical */}
        <nav className="sidebar-nav">
          {menuItems.map((section, idx) => (
            <div key={idx} className="nav-group">
              <span className="nav-group-title">{section.group}</span>
              <ul className="nav-list">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path} className="nav-item">
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                          `nav-link ${isActive ? 'active' : ''}`
                        }
                        onClick={onClose}
                      >
                        <Icon size={19} className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                        {item.badge && <span className="nav-badge">{item.badge}</span>}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Accesos Rápidos de Categorías si estamos en Catálogo */}
          {esCatalogo && categorias.length > 0 && (
            <div className="nav-group sidebar-categories-group">
              <span className="nav-group-title">Categorías Rápidas</span>
              <div className="sidebar-category-chips">
                <button
                  className={`sidebar-cat-chip ${categoriaActiva === 'Inicio' ? 'active' : ''}`}
                  onClick={() => {
                    onSelectCategoria('Inicio');
                    onClose();
                  }}
                >
                  <Sparkles size={14} /> Todos
                </button>
                {categorias.map((cat) => {
                  const nombreCat = cat.nombre || cat.label;
                  return (
                    <button
                      key={cat.id}
                      className={`sidebar-cat-chip ${categoriaActiva === nombreCat ? 'active' : ''}`}
                      onClick={() => {
                        onSelectCategoria(nombreCat);
                        onClose();
                      }}
                    >
                      {nombreCat}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Widget Inferior del Carrito */}
        <div className="sidebar-footer">
          <button className="sidebar-cart-card" onClick={openCart}>
            <div className="cart-card-icon">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </div>
            <div className="cart-card-info">
              <span className="cart-card-title">Mi Carrito</span>
              <span className="cart-card-price">
                ${cartTotal.toLocaleString('es-CO')}
              </span>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
