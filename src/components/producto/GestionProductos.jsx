import { useState } from 'react';
import { FormularioProducto } from './FormularioProducto';
import { ListaProductosAdmin } from './ListaProductosAdmin';
import { crearProducto, actualizarProducto, eliminarProducto } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

export function GestionProductos({ productos = [], categorias = [], onActualizarProductos, cargando }) {
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const { addToast, confirm } = useToast();

  // Métricas rápidas para la cabecera
  const totalActivos = productos.filter((p) => p.estado === undefined || p.estado === 1 || p.estado === '1' || p.estado === true).length;
  const sinStock = productos.filter((p) => Number(p.stock) <= 0).length;

  const handleGuardar = (formData) => {
    setGuardando(true);
    if (productoAEditar) {
      actualizarProducto(productoAEditar.id, formData)
        .then(() => {
          addToast('Producto actualizado con éxito', 'success');
          setProductoAEditar(null);
          onActualizarProductos();
        })
        .catch((err) => {
          console.error('Error al actualizar producto:', err);
          addToast('Error al actualizar el producto', 'error');
        })
        .finally(() => {
          setGuardando(false);
        });
    } else {
      crearProducto(formData)
        .then(() => {
          addToast('Producto creado con éxito en el catálogo', 'success');
          onActualizarProductos();
        })
        .catch((err) => {
          console.error('Error al crear producto:', err);
          addToast('Error al registrar el producto', 'error');
        })
        .finally(() => {
          setGuardando(false);
        });
    }
  };

  const handleEditar = (producto) => {
    setProductoAEditar(producto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEditar = () => {
    setProductoAEditar(null);
  };

  const handleEliminar = async (id) => {
    const seguro = await confirm({
      title: '¿Eliminar producto?',
      message: 'Esta acción no se puede deshacer y el producto dejará de ser visible en el catálogo.',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      isDestructive: true
    });

    if (seguro) {
      eliminarProducto(id)
        .then(() => {
          addToast('Producto eliminado exitosamente', 'info');
          if (productoAEditar && productoAEditar.id === id) {
            setProductoAEditar(null);
          }
          onActualizarProductos();
        })
        .catch((err) => {
          console.error('Error al eliminar producto:', err);
          addToast('Error al eliminar el producto', 'error');
        });
    }
  };

  return (
    <section className="gestion-productos-section">
      <div className="gestion-header-modern">
        <div>
          <h2>🛠️ Gestión de Productos</h2>
          <p>Registra, edita inventario y administra los productos visibles en QuickOrder.</p>
        </div>

        {/* Tarjetas de Métricas */}
        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <span className="stat-label">Total Productos</span>
            <span className="stat-value">{productos.length}</span>
          </div>
          <div className="admin-stat-card">
            <span className="stat-label">Activos en Menú</span>
            <span className="stat-value text-success">{totalActivos}</span>
          </div>
          <div className="admin-stat-card">
            <span className="stat-label">Sin Stock / Agotados</span>
            <span className="stat-value text-warning">{sinStock}</span>
          </div>
        </div>
      </div>

      <FormularioProducto
        productoAEditar={productoAEditar}
        categorias={categorias}
        onGuardar={handleGuardar}
        onCancelar={handleCancelarEditar}
        guardando={guardando}
      />

      <ListaProductosAdmin
        productos={productos}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        cargando={cargando}
      />
    </section>
  );
}
