import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CarritoDrawer } from './components/pedido/CarritoDrawer';
import { CatalogoPage } from './pages/CatalogoPage';
import { ProductosPage } from './pages/ProductosPage';
import { CategoriasPage } from './pages/CategoriasPage';
import { ClientesPage } from './pages/ClientesPage';
import { EstadosOrdenPage } from './pages/EstadosOrdenPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { InformacionPage } from './pages/InformacionPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { obtenerProductos } from './services/productService';
import { obtenerCategorias } from './services/categoryService';
import { obtenerClientes } from './services/clientService';
import { obtenerEstadosOrden } from './services/orderStatusService';
import { obtenerUsuarios } from './services/userService';
import { obtenerInformacion } from './services/informationService';

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  
  // Estado del Carrito / Pedido
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [estadosOrden, setEstadosOrden] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [informacion, setInformacion] = useState([]);

  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [cargandoClientes, setCargandoClientes] = useState(true);
  const [cargandoEstadosOrden, setCargandoEstadosOrden] = useState(true);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
  const [cargandoInformacion, setCargandoInformacion] = useState(true);

  const navigate = useNavigate();

  const cargarProductos = () => {
    setCargandoProductos(true);
    obtenerProductos()
      .then((data) => {
        setProductos(data);
        setCargandoProductos(false);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        setCargandoProductos(false);
      });
  };

  const cargarCategorias = () => {
    setCargandoCategorias(true);
    obtenerCategorias()
      .then((data) => {
        setCategorias(data);
        setCargandoCategorias(false);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
        setCargandoCategorias(false);
      });
  };

  const cargarClientes = () => {
    setCargandoClientes(true);
    obtenerClientes()
      .then((data) => {
        setClientes(data);
        setCargandoClientes(false);
      })
      .catch((error) => {
        console.error('Error al obtener los clientes:', error);
        setCargandoClientes(false);
      });
  };

  const cargarEstadosOrden = () => {
    setCargandoEstadosOrden(true);
    obtenerEstadosOrden()
      .then((data) => {
        setEstadosOrden(data);
        setCargandoEstadosOrden(false);
      })
      .catch((error) => {
        console.error('Error al obtener los estados de orden:', error);
        setCargandoEstadosOrden(false);
      });
  };

  const cargarUsuarios = () => {
    setCargandoUsuarios(true);
    obtenerUsuarios()
      .then((data) => {
        setUsuarios(data);
        setCargandoUsuarios(false);
      })
      .catch((error) => {
        console.error('Error al obtener los usuarios:', error);
        setCargandoUsuarios(false);
      });
  };

  const cargarInformacion = () => {
    setCargandoInformacion(true);
    obtenerInformacion()
      .then((data) => {
        setInformacion(data);
        setCargandoInformacion(false);
      })
      .catch((error) => {
        console.error('Error al obtener la información:', error);
        setCargandoInformacion(false);
      });
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarClientes();
    cargarEstadosOrden();
    cargarUsuarios();
    cargarInformacion();
  }, []);

  // Agregar un producto al carrito
  const handleAddToCart = (producto) => {
    setCartItems((prevItems) => {
      const existe = prevItems.find((item) => item.id === producto.id);
      if (existe) {
        const maxStock = producto.stock !== undefined ? Number(producto.stock) : 999;
        if (existe.cantidad >= maxStock) {
          alert(`Has alcanzado el límite de stock disponible (${maxStock} unidades) para este producto.`);
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === producto.id ? { ...item, cantidad: (item.cantidad || 1) + 1 } : item
        );
      }
      return [...prevItems, { ...producto, cantidad: 1 }];
    });
    // Abrir el carrito para feedback visual inmediato
    setIsCartOpen(true);
  };

  // Modificar cantidad de un producto
  const handleUpdateQuantity = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      handleRemoveFromCart(productoId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  // Eliminar un producto del carrito
  const handleRemoveFromCart = (productoId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productoId));
  };

  // Vaciar carrito completo
  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar tu pedido?')) {
      setCartItems([]);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.cantidad || 1), 0);

  const handleSeleccionarCategoriaFooter = (cat) => {
    setCategoriaActiva(cat);
    navigate('/');
  };

  return (
    <div className="app-layout">
      <Header 
        categorias={categorias}
        categoriaActiva={categoriaActiva} 
        onSelectCategoria={setCategoriaActiva}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />
      
      <main className="app-container">
        <Routes>
          {/* Ruta del Catálogo Principal */}
          <Route 
            path="/" 
            element={
              <CatalogoPage 
                productos={productos}
                categoriaActiva={categoriaActiva}
                onAddToCart={handleAddToCart}
                cargando={cargandoProductos}
              />
            } 
          />

          {/* Ruta de Gestión de Productos */}
          <Route 
            path="/productos" 
            element={
              <ProductosPage 
                productos={productos}
                categorias={categorias}
                onActualizarProductos={cargarProductos}
                cargando={cargandoProductos}
              />
            } 
          />

          {/* Ruta de Gestión de Categorías */}
          <Route 
            path="/categorias" 
            element={
              <CategoriasPage 
                categorias={categorias}
                onActualizarCategorias={cargarCategorias}
                cargando={cargandoCategorias}
              />
            } 
          />

          {/* Ruta de Gestión de Clientes */}
          <Route 
            path="/clientes" 
            element={
              <ClientesPage 
                clientes={clientes}
                onActualizarClientes={cargarClientes}
                cargando={cargandoClientes}
              />
            } 
          />

          {/* Ruta de Gestión de Estados de Orden */}
          <Route 
            path="/estados-orden" 
            element={
              <EstadosOrdenPage 
                estadosOrden={estadosOrden}
                onActualizarEstadosOrden={cargarEstadosOrden}
                cargando={cargandoEstadosOrden}
              />
            } 
          />

          {/* Ruta de Gestión de Usuarios */}
          <Route 
            path="/usuarios" 
            element={
              <UsuariosPage 
                usuarios={usuarios}
                onActualizarUsuarios={cargarUsuarios}
                cargando={cargandoUsuarios}
              />
            } 
          />

          {/* Ruta de Configuración de Información */}
          <Route 
            path="/informacion" 
            element={
              <InformacionPage 
                informacion={informacion}
                onActualizarInformacion={cargarInformacion}
                cargando={cargandoInformacion}
              />
            } 
          />

          {/* Ruta 404 para cualquier otra URL */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Drawer / Modal lateral del Carrito */}
      <CarritoDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Footer integrado */}
      <Footer 
        categorias={categorias}
        setCategoriaActiva={handleSeleccionarCategoriaFooter}
      />
    </div>
  );
}

export default App;