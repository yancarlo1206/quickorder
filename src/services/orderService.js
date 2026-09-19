const API_URL = '/api/pedidos';

export const obtenerPedidos = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener pedidos del servidor');
    return await response.json();
  } catch (error) {
    console.warn('Backend no disponible, usando pedidos locales de respaldo:', error);
    try {
      const locales = localStorage.getItem('quickorder_pedidos_local');
      return locales ? JSON.parse(locales) : [];
    } catch {
      return [];
    }
  }
};

export const crearPedido = async (pedido) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });
    if (!response.ok) throw new Error('Error en el servidor al registrar el pedido');
    return await response.json();
  } catch (error) {
    console.warn('Guardando pedido localmente como respaldo:', error);
    const nuevo = {
      ...pedido,
      id: `ORD-${Date.now().toString().slice(-4)}`,
      fechaCreacion: new Date().toISOString(),
      estado: 'pendiente'
    };
    try {
      const actuales = JSON.parse(localStorage.getItem('quickorder_pedidos_local') || '[]');
      actuales.unshift(nuevo);
      localStorage.setItem('quickorder_pedidos_local', JSON.stringify(actuales));
    } catch (e) {
      console.error(e);
    }
    return nuevo;
  }
};

export const actualizarEstadoPedido = async (id, nuevoEstado) => {
  try {
    const response = await fetch(`${API_URL}/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    if (!response.ok) throw new Error('Error al actualizar estado del pedido');
    return await response.json();
  } catch (error) {
    console.warn('Actualizando estado localmente:', error);
    try {
      const actuales = JSON.parse(localStorage.getItem('quickorder_pedidos_local') || '[]');
      const item = actuales.find((p) => String(p.id) === String(id));
      if (item) {
        item.estado = nuevoEstado;
        localStorage.setItem('quickorder_pedidos_local', JSON.stringify(actuales));
      }
      return item;
    } catch {
      return null;
    }
  }
};

export const eliminarPedido = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Error al eliminar pedido');
    return await response.json();
  } catch (error) {
    console.warn('Eliminando pedido localmente:', error);
    try {
      const actuales = JSON.parse(localStorage.getItem('quickorder_pedidos_local') || '[]');
      const filtrados = actuales.filter((p) => String(p.id) !== String(id));
      localStorage.setItem('quickorder_pedidos_local', JSON.stringify(filtrados));
      return { id };
    } catch {
      return { id };
    }
  }
};
