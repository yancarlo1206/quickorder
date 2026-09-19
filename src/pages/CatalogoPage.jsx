import { useState, useMemo } from 'react';
import { Banner } from '../components/layout/Banner';
import { Product } from '../components/layout/Product';
import { Search, X, SlidersHorizontal, PackageX, Sparkles } from 'lucide-react';

export function CatalogoPage({ productos = [], categoriaActiva, onAddToCart, cargando }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [criterioOrden, setCriterioOrden] = useState('destacados');

  const productosVisibles = useMemo(() => {
    return productos.filter(
      (p) => p.estado === undefined || p.estado === true || p.estado === 'true' || p.estado === 1 || p.estado === '1'
    );
  }, [productos]);

  // Filtrado por categoría y término de búsqueda
  const productosFiltrados = useMemo(() => {
    let result = productosVisibles;

    if (categoriaActiva && categoriaActiva !== 'Inicio') {
      result = result.filter(
        (p) => p.categoria && p.categoria.toLowerCase() === categoriaActiva.toLowerCase()
      );
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          (p.nombre && p.nombre.toLowerCase().includes(q)) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(q)) ||
          (p.tag && p.tag.toLowerCase().includes(q))
      );
    }

    // Ordenamiento
    return [...result].sort((a, b) => {
      const parsePrice = (val) => {
        if (typeof val === 'number') return val;
        return parseFloat(String(val).replace(/[^0-9.-]+/g, '')) || 0;
      };

      if (criterioOrden === 'menor_precio') {
        return parsePrice(a.precio) - parsePrice(b.precio);
      }
      if (criterioOrden === 'mayor_precio') {
        return parsePrice(b.precio) - parsePrice(a.precio);
      }
      if (criterioOrden === 'nombre') {
        return (a.nombre || '').localeCompare(b.nombre || '');
      }
      return 0; // Destacados por defecto
    });
  }, [productosVisibles, categoriaActiva, searchTerm, criterioOrden]);

  return (
    <div className="catalogo-view-wrapper">
      {/* Hero Banner Moderno */}
      <Banner />

      {/* Barra de Filtros, Búsqueda y Ordenamiento */}
      <div className="catalog-toolbar">
        <div className="toolbar-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, ingrediente o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Borrar búsqueda"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="toolbar-right">
          <div className="sort-box">
            <SlidersHorizontal size={15} />
            <select
              value={criterioOrden}
              onChange={(e) => setCriterioOrden(e.target.value)}
              className="sort-select"
            >
              <option value="destacados">Relevancia / Destacados</option>
              <option value="menor_precio">Precio: Más económico</option>
              <option value="mayor_precio">Precio: Más alto</option>
              <option value="nombre">Alfabético: A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Encabezado del Catálogo */}
      <div className="catalog-info-row">
        <div>
          <h2 className="catalog-section-heading">
            {categoriaActiva === 'Inicio' ? 'Todos los Productos' : categoriaActiva}
          </h2>
          <p className="catalog-count-pill">
            Mostrando <strong>{productosFiltrados.length}</strong> de {productosVisibles.length} producto(s)
          </p>
        </div>

        {searchTerm && (
          <span className="search-filter-tag">
            Filtrado por: "{searchTerm}"
            <button onClick={() => setSearchTerm('')}><X size={12} /></button>
          </span>
        )}
      </div>

      {/* Product Grid */}
      <section className="product-grid-modern">
        {cargando ? (
          <div className="catalog-loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando el menú en tiempo real...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="catalog-empty-card">
            <PackageX size={48} className="empty-icon" />
            <h3>No encontramos productos</h3>
            <p>
              {searchTerm
                ? `No hay resultados para "${searchTerm}". Intenta buscar con otra palabra.`
                : 'No hay productos disponibles en esta sección.'}
            </p>
            {searchTerm && (
              <button className="btn-primary" onClick={() => setSearchTerm('')}>
                Ver todos los productos
              </button>
            )}
          </div>
        ) : (
          productosFiltrados.map((producto) => (
            <Product
              key={producto.id}
              id={producto.id}
              indice={producto.id}
              nombre={producto.nombre}
              descripcion={producto.descripcion}
              precio={producto.precio}
              imagen={producto.imagen}
              tag={producto.tag}
              stock={producto.stock}
              onAddToCart={onAddToCart}
            />
          ))
        )}
      </section>
    </div>
  );
}
