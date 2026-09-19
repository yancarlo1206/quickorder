import { useState, useEffect } from 'react';
import { obtenerPedidos, actualizarEstadoPedido, eliminarPedido } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import {
  ClipboardList,
  Clock,
  ChefHat,
  CheckCircle2,
  AlertCircle,
  Trash2,
  DollarSign,
  Phone,
  MapPin,
  UtensilsCrossed,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const { addToast, confirm } = useToast();

  const cargar = () => {
    setCargando(true);
    obtenerPedidos()
      .then((data) => {
        setPedidos(Array.isArray(data) ? data : []);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      addToast(`Pedido ${id} actualizado a "${nuevoEstado.replace('_', ' ')}"`, 'success');
      cargar();
    } catch (e) {
      console.error(e);
      addToast('Error al actualizar pedido', 'error');
    }
  };

  const handleEliminar = async (id) => {
    const seguro = await confirm({
      title: '¿Eliminar orden?',
      message: `¿Deseas eliminar permanentemente el pedido ${id}?`,
      confirmText: 'Sí, eliminar',
      isDestructive: true
    });

    if (seguro) {
      await eliminarPedido(id);
      addToast(`Pedido ${id} eliminado`, 'info');
      cargar();
    }
  };

  // Métricas
  const totalFacturado = pedidos.reduce((acc, p) => acc + (Number(p.total) || 0), 0);
  const pendientes = pedidos.filter((p) => p.estado === 'pendiente').length;
  const enCocina = pedidos.filter((p) => p.estado === 'en_preparacion').length;
  const listos = pedidos.filter((p) => p.estado === 'listo').length;
  const entregados = pedidos.filter((p) => p.estado === 'entregado').length;

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtroEstado === 'todos') return true;
    return p.estado === filtroEstado;
  });

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <span className="order-badge badge-pending"><Clock size={13} /> Pendiente</span>;
      case 'en_preparacion':
        return <span className="order-badge badge-kitchen"><ChefHat size={13} /> En Cocina</span>;
      case 'listo':
        return <span className="order-badge badge-ready"><CheckCircle2 size={13} /> Listo</span>;
      case 'entregado':
        return <span className="order-badge badge-delivered">Entregado</span>;
      default:
        return <span className="order-badge badge-default">{estado}</span>;
    }
  };

  return (
    <section className="pedidos-dashboard-section">
      {/* Cabecera */}
      <div className="gestion-header-modern">
        <div>
          <h2>📋 Panel de Pedidos en Vivo</h2>
          <p>Supervisa órdenes entrantes desde WhatsApp o la web y gestiona los estados en cocina.</p>
        </div>

        <button className="btn-refresh-orders" onClick={cargar} title="Recargar órdenes">
          <RefreshCw size={16} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="order-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-title">Facturación Total</span>
          <span className="kpi-number text-primary">${totalFacturado.toLocaleString('es-CO')}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Pendientes</span>
          <span className="kpi-number text-warning">{pendientes}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">En Cocina</span>
          <span className="kpi-number text-blue">{enCocina}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-title">Listos para Entrega</span>
          <span className="kpi-number text-success">{listos}</span>
        </div>
      </div>

      {/* Tabs de Filtro de Estado */}
      <div className="order-status-tabs">
        <button
          className={`status-tab-btn ${filtroEstado === 'todos' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('todos')}
        >
          Todos ({pedidos.length})
        </button>
        <button
          className={`status-tab-btn ${filtroEstado === 'pendiente' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('pendiente')}
        >
          ⏳ Pendientes ({pendientes})
        </button>
        <button
          className={`status-tab-btn ${filtroEstado === 'en_preparacion' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('en_preparacion')}
        >
          👨‍🍳 En Cocina ({enCocina})
        </button>
        <button
          className={`status-tab-btn ${filtroEstado === 'listo' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('listo')}
        >
          ✅ Listos ({listos})
        </button>
        <button
          className={`status-tab-btn ${filtroEstado === 'entregado' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('entregado')}
        >
          📦 Entregados ({entregados})
        </button>
      </div>

      {/* Lista / Grid de Órdenes */}
      {cargando ? (
        <div className="catalog-loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando pedidos en tiempo real...</p>
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="empty-admin-list">
          <ClipboardList size={40} style={{ color: '#94a3b8', margin: '0 auto 10px auto' }} />
          <p>No hay órdenes registradas en este estado.</p>
        </div>
      ) : (
        <div className="orders-cards-grid">
          {pedidosFiltrados.map((orden) => (
            <div key={orden.id} className="order-card-modern">
              <div className="order-card-top">
                <div className="order-id-group">
                  <span className="order-id-tag">{orden.id}</span>
                  <span className="order-time-tag">
                    {orden.fechaCreacion ? new Date(orden.fechaCreacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                  </span>
                </div>
                {getEstadoBadge(orden.estado)}
              </div>

              <div className="order-customer-info">
                <h4 className="customer-name">{orden.cliente}</h4>
                {orden.telefono && (
                  <span className="customer-meta">
                    <Phone size={13} /> {orden.telefono}
                  </span>
                )}
                <span className="customer-meta">
                  <MapPin size={13} /> {orden.tipoEntrega === 'mesa' ? `🍽️ ${orden.ubicacion || 'En Mesa'}` : `🛵 ${orden.ubicacion || 'Domicilio'}`}
                </span>
                <span className="customer-meta payment-badge">
                  💳 {orden.metodoPago || 'Efectivo'}
                </span>
              </div>

              {orden.notas && (
                <div className="order-note-alert">
                  <strong>Nota:</strong> {orden.notas}
                </div>
              )}

              {/* Items desglosados */}
              <div className="order-items-breakdown">
                <span className="items-heading">Detalle del Pedido:</span>
                <ul>
                  {(orden.items || []).map((it, idx) => (
                    <li key={idx}>
                      <span>{it.cantidad}x {it.nombre}</span>
                      <span>${((it.precio || 0) * (it.cantidad || 1)).toLocaleString('es-CO')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-card-footer">
                <div className="order-total-amount">
                  <span>Total</span>
                  <strong>${(orden.total || 0).toLocaleString('es-CO')}</strong>
                </div>

                {/* Acciones según el estado del pedido */}
                <div className="order-action-buttons">
                  {orden.estado === 'pendiente' && (
                    <button
                      className="btn-order-advance kitchen"
                      onClick={() => handleCambiarEstado(orden.id, 'en_preparacion')}
                    >
                      <ChefHat size={15} /> A Cocina
                    </button>
                  )}

                  {orden.estado === 'en_preparacion' && (
                    <button
                      className="btn-order-advance ready"
                      onClick={() => handleCambiarEstado(orden.id, 'listo')}
                    >
                      <CheckCircle2 size={15} /> Marcar Listo
                    </button>
                  )}

                  {orden.estado === 'listo' && (
                    <button
                      className="btn-order-advance delivered"
                      onClick={() => handleCambiarEstado(orden.id, 'entregado')}
                    >
                      Entregar <ArrowRight size={15} />
                    </button>
                  )}

                  <button
                    className="btn-delete-order"
                    onClick={() => handleEliminar(orden.id)}
                    title="Eliminar pedido"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
