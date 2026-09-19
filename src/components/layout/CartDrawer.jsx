import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Send,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';

export function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { addToast } = useToast();

  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    tipoEntrega: 'domicilio', // 'domicilio' | 'mesa' | 'recoger'
    direccion: '',
    metodoPago: 'Efectivo',
    notas: '',
  });
  const [copiado, setCopiado] = useState(false);

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generarMensajePedido = () => {
    let msg = `🛒 *NUEVO PEDIDO - QUICKORDER* ⚡\n\n`;
    msg += `👤 *Cliente:* ${formData.nombre || 'No especificado'}\n`;
    msg += `📱 *Teléfono:* ${formData.telefono || 'No especificado'}\n`;
    msg += `📍 *Entrega:* ${formData.tipoEntrega.toUpperCase()}\n`;
    if (formData.direccion) {
      msg += `🏠 *Ubicación / Dirección:* ${formData.direccion}\n`;
    }
    msg += `💳 *Método de Pago:* ${formData.metodoPago}\n`;
    if (formData.notas) {
      msg += `📝 *Observaciones:* ${formData.notas}\n`;
    }
    msg += `\n*DETALLE DEL PEDIDO:*\n`;
    msg += `─────────────────────────\n`;

    cartItems.forEach((item, idx) => {
      const itemSubtotal = item.precio * item.cantidad;
      msg += `${idx + 1}. *${item.nombre}* x${item.cantidad}  →  $${itemSubtotal.toLocaleString('es-CO')}\n`;
    });

    msg += `─────────────────────────\n`;
    msg += `💰 *TOTAL A PAGAR:* $${cartTotal.toLocaleString('es-CO')}\n\n`;
    msg += `¡Muchas gracias por su atención!`;
    return msg;
  };

  const handleEnviarWhatsApp = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      addToast('Por favor escribe tu nombre', 'warning');
      return;
    }

    const mensaje = encodeURIComponent(generarMensajePedido());
    const whatsappUrl = `https://wa.me/?text=${mensaje}`;
    window.open(whatsappUrl, '_blank');
    addToast('¡Pedido generado! Abriendo WhatsApp...', 'success');
  };

  const handleCopiarPedido = () => {
    const texto = generarMensajePedido();
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    addToast('Resumen del pedido copiado al portapapeles', 'info');
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Drawer */}
        <div className="cart-drawer-header">
          <div className="drawer-title-box">
            <ShoppingBag size={22} className="title-icon" />
            <div>
              <h3>{step === 'cart' ? 'Tu Pedido' : 'Finalizar Pedido'}</h3>
              <span className="drawer-subtitle">
                {cartItems.length} {cartItems.length === 1 ? 'producto diferente' : 'productos diferentes'}
              </span>
            </div>
          </div>
          <div className="drawer-header-actions">
            {step === 'cart' && cartItems.length > 0 && (
              <button
                className="btn-text-danger"
                onClick={() => {
                  clearCart();
                  addToast('Carrito vaciado', 'info');
                }}
                title="Vaciar carrito"
              >
                <Trash2 size={16} /> Vaciar
              </button>
            )}
            <button className="drawer-close-btn" onClick={closeCart} aria-label="Cerrar carrito">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenido dinámico según el paso */}
        <div className="cart-drawer-body">
          {step === 'cart' ? (
            cartItems.length === 0 ? (
              <div className="cart-empty-state">
                <div className="empty-icon-circle">
                  <ShoppingBag size={48} />
                </div>
                <h4>Tu carrito está vacío</h4>
                <p>Explora nuestro catálogo y agrega tus platos y productos favoritos.</p>
                <button className="btn-primary" onClick={closeCart}>
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-row">
                    <div className="cart-item-image">
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.nombre} />
                      ) : (
                        <div className="image-fallback">⚡</div>
                      )}
                    </div>
                    <div className="cart-item-details">
                      <div className="item-title-row">
                        <span className="item-name">{item.nombre}</span>
                        <button
                          className="item-remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Eliminar ${item.nombre}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <span className="item-unit-price">
                        ${(item.precio || 0).toLocaleString('es-CO')} c/u
                      </span>

                      <div className="item-bottom-controls">
                        <div className="quantity-stepper">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="qty-btn"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="qty-value">{item.cantidad}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="qty-btn"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <span className="item-subtotal">
                          ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Pantalla de Checkout / Envío */
            <form id="checkout-form" onSubmit={handleEnviarWhatsApp} className="checkout-form">
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej. Juan Pérez"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono de Contacto</label>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Ej. +57 300 123 4567"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Tipo de Pedido</label>
                <div className="radio-pill-group">
                  <label className={`radio-pill ${formData.tipoEntrega === 'domicilio' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="tipoEntrega"
                      value="domicilio"
                      checked={formData.tipoEntrega === 'domicilio'}
                      onChange={handleInputChange}
                    />
                    🛵 Domicilio
                  </label>
                  <label className={`radio-pill ${formData.tipoEntrega === 'mesa' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="tipoEntrega"
                      value="mesa"
                      checked={formData.tipoEntrega === 'mesa'}
                      onChange={handleInputChange}
                    />
                    🍽️ En Mesa
                  </label>
                  <label className={`radio-pill ${formData.tipoEntrega === 'recoger' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="tipoEntrega"
                      value="recoger"
                      checked={formData.tipoEntrega === 'recoger'}
                      onChange={handleInputChange}
                    />
                    🛍️ Recoger
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>{formData.tipoEntrega === 'mesa' ? 'Número de Mesa' : 'Dirección de Entrega'}</label>
                <input
                  type="text"
                  name="direccion"
                  placeholder={formData.tipoEntrega === 'mesa' ? 'Ej. Mesa #4' : 'Ej. Calle 123 # 45 - 67'}
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Método de Pago</label>
                <select name="metodoPago" value={formData.metodoPago} onChange={handleInputChange}>
                  <option value="Efectivo">💵 Efectivo al entregar</option>
                  <option value="Transferencia (Nequi / Daviplata)">📱 Nequi / Daviplata / Bancolombia</option>
                  <option value="Tarjeta / Datáfono">💳 Tarjeta / Datáfono</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notas adicionales / Indicaciones</label>
                <textarea
                  name="notas"
                  placeholder="Ej. Sin cebolla, tocar el timbre, salsa extra..."
                  value={formData.notas}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </form>
          )}
        </div>

        {/* Pie del Drawer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-box">
              <div className="summary-line">
                <span>Subtotal</span>
                <span>${cartTotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="summary-line total">
                <span>Total a Pagar</span>
                <span className="total-highlight">${cartTotal.toLocaleString('es-CO')}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                className="btn-checkout-primary"
                onClick={() => setStep('checkout')}
              >
                <span>Proceder al Checkout</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <div className="checkout-action-buttons">
                <button
                  type="button"
                  className="btn-back-cart"
                  onClick={() => setStep('cart')}
                >
                  Volver al Carrito
                </button>
                <div className="order-final-row">
                  <button
                    type="button"
                    className="btn-copy-order"
                    onClick={handleCopiarPedido}
                    title="Copiar texto del pedido"
                  >
                    {copiado ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    className="btn-whatsapp-send"
                  >
                    <Send size={18} />
                    <span>Pedir por WhatsApp</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
