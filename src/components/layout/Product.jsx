import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Plus, Minus, Check, ShoppingCart, Sparkles, AlertCircle } from 'lucide-react';

export function Product({ indice, id, nombre, descripcion, precio, imagen, tag, stock, onAddToCart }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [cantidad, setCantidad] = useState(1);
  const [agregadoAnim, setAgregadoAnim] = useState(false);

  const numStock = stock !== undefined && stock !== null ? Number(stock) : 99;
  const agotado = numStock <= 0;
  const stockBajo = numStock > 0 && numStock <= 3;

  const handleAgregar = () => {
    if (agotado) return;

    const productoObj = {
      id: id || indice,
      nombre,
      descripcion,
      precio,
      imagen,
      tag,
      stock: numStock
    };

    addToCart(productoObj, cantidad);
    if (onAddToCart) onAddToCart(nombre);

    addToast(`¡${cantidad}x ${nombre} añadido al pedido!`, 'success', 2500);
    setAgregadoAnim(true);
    setCantidad(1);
    setTimeout(() => setAgregadoAnim(false), 1200);
  };

  const handleRestar = (e) => {
    e.stopPropagation();
    if (cantidad > 1) setCantidad((prev) => prev - 1);
  };

  const handleSumar = (e) => {
    e.stopPropagation();
    if (cantidad < numStock) setCantidad((prev) => prev + 1);
  };

  const formatPrice = (p) => {
    if (typeof p === 'number') return `$ ${p.toLocaleString('es-CO')}`;
    const clean = parseFloat(String(p).replace(/[^0-9.-]+/g, ''));
    if (!isNaN(clean) && clean > 0) return `$ ${clean.toLocaleString('es-CO')}`;
    return String(p || '$ 0');
  };

  return (
    <article className={`product-card-modern ${agotado ? 'is-out-of-stock' : ''}`}>
      {/* Contenedor de Imagen */}
      <div className="card-image-wrap">
        {tag && (
          <span className="card-badge tag-highlight">
            <Sparkles size={12} /> {tag}
          </span>
        )}

        {agotado ? (
          <span className="card-badge tag-out-of-stock">Agotado</span>
        ) : stockBajo ? (
          <span className="card-badge tag-low-stock">
            <AlertCircle size={12} /> ¡Últimas {numStock} unid!
          </span>
        ) : null}

        {imagen ? (
          <img src={imagen} alt={nombre} className="card-img" loading="lazy" />
        ) : (
          <div className="card-img-placeholder">
            <span className="placeholder-emoji">🍔</span>
          </div>
        )}
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="card-details">
        <div className="card-header-info">
          <h3 className="card-title" title={nombre}>{nombre}</h3>
          <p className="card-desc" title={descripcion}>{descripcion || 'Delicioso platillo preparado al momento con los mejores ingredientes.'}</p>
        </div>

        <div className="card-bottom">
          <div className="card-price-block">
            <span className="price-caption">Precio</span>
            <span className="price-value">{formatPrice(precio)}</span>
          </div>

          {!agotado && (
            <div className="card-controls">
              <div className="mini-stepper">
                <button
                  type="button"
                  onClick={handleRestar}
                  disabled={cantidad <= 1}
                  className="mini-step-btn"
                  aria-label="Restar una unidad"
                >
                  <Minus size={13} />
                </button>
                <span className="mini-step-num">{cantidad}</span>
                <button
                  type="button"
                  onClick={handleSumar}
                  disabled={cantidad >= numStock}
                  className="mini-step-btn"
                  aria-label="Sumar una unidad"
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                type="button"
                className={`btn-add-cart ${agregadoAnim ? 'added' : ''}`}
                onClick={handleAgregar}
                aria-label={`Añadir ${nombre} al pedido`}
              >
                {agregadoAnim ? (
                  <>
                    <Check size={16} />
                    <span>Listo</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    <span>Agregar</span>
                  </>
                )}
              </button>
            </div>
          )}

          {agotado && (
            <button disabled className="btn-add-cart disabled">
              No disponible
            </button>
          )}
        </div>
      </div>
    </article>
  );
}