export function CarritoDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  // Extraer valor numérico del precio
  const parsePrecio = (precio) => {
    if (typeof precio === 'number') return precio;
    if (!precio) return 0;
    const cleanStr = String(precio).replace(/[^0-9.-]+/g, '');
    const num = Number(cleanStr);
    return isNaN(num) ? 0 : num;
  };

  // Formatear precio para mostrar
  const formatPrecio = (valor) => {
    const num = parsePrecio(valor);
    return `$ ${num.toLocaleString('es-CO')}`;
  };

  const totalItems = cartItems.reduce((acc, item) => acc + (item.cantidad || 1), 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (parsePrecio(item.precio) * (item.cantidad || 1)), 0);

  return (
    <div 
      className={`cart-drawer-overlay ${isOpen ? 'open' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cart-drawer">
        {/* Cabecera del Carrito */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            <h3 className="cart-drawer-title">🛒 Mi Pedido</h3>
            <span className="cart-drawer-badge">{totalItems} producto(s)</span>
          </div>
          <button 
            type="button" 
            className="cart-drawer-close" 
            onClick={onClose}
            aria-label="Cerrar pedido"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del Carrito */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">🛍️</div>
              <h4 className="cart-empty-title">Tu pedido está vacío</h4>
              <p className="cart-empty-text">
                Agrega tus platillos favoritos desde el catálogo para armar tu orden.
              </p>
              <button 
                type="button" 
                className="btn-save" 
                style={{ marginTop: '12px' }}
                onClick={onClose}
              >
                Explorar Menú
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemPrice = parsePrecio(item.precio);
              const itemSubtotal = itemPrice * (item.cantidad || 1);
              const maxStock = item.stock !== undefined ? Number(item.stock) : 999;

              return (
                <div key={item.id} className="cart-item-card">
                  {/* Miniatura */}
                  {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} className="cart-item-img" />
                  ) : (
                    <div className="cart-item-placeholder">🍔</div>
                  )}

                  {/* Detalles */}
                  <div className="cart-item-details">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h5 className="cart-item-name">{item.nombre}</h5>
                      <button 
                        type="button"
                        className="btn-item-delete"
                        onClick={() => onRemoveItem(item.id)}
                        title="Eliminar producto"
                      >
                        🗑️
                      </button>
                    </div>

                    <span className="cart-item-price">{formatPrecio(item.precio)} c/u</span>

                    {/* Controles de cantidad y subtotal */}
                    <div className="cart-item-actions">
                      <div className="cart-qty-control">
                        <button
                          type="button"
                          className="btn-qty"
                          onClick={() => onUpdateQuantity(item.id, (item.cantidad || 1) - 1)}
                          title="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span className="cart-qty-value">{item.cantidad || 1}</span>
                        <button
                          type="button"
                          className="btn-qty"
                          onClick={() => onUpdateQuantity(item.id, (item.cantidad || 1) + 1)}
                          disabled={(item.cantidad || 1) >= maxStock}
                          title={(item.cantidad || 1) >= maxStock ? 'Máximo stock alcanzado' : 'Aumentar cantidad'}
                        >
                          +
                        </button>
                      </div>

                      <span className="cart-item-subtotal">
                        $ {itemSubtotal.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pie del Carrito con Totales y Checkout */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>$ {subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div className="cart-summary-row">
              <span>Envío / Servicio</span>
              <span style={{ color: '#16a34a', fontWeight: 600 }}>Gratis</span>
            </div>
            <div className="cart-summary-total">
              <span>Total a Pagar</span>
              <span>$ {subtotal.toLocaleString('es-CO')}</span>
            </div>

            <button 
              type="button" 
              className="cart-checkout-btn"
              onClick={() => {
                alert(`¡Excelente! Tu pedido de ${totalItems} producto(s) por un total de $ ${subtotal.toLocaleString('es-CO')} está en proceso.`);
              }}
            >
              <span>✅</span> Confirmar Pedido
            </button>

            <button 
              type="button" 
              className="cart-clear-btn" 
              onClick={onClearCart}
            >
              Vaciar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
