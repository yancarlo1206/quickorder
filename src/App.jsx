import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';

// Layout & Common Components
import { Sidebar } from './components/layout/Sidebar';
import { MobileTopBar } from './components/layout/MobileTopBar';
import { CartDrawer } from './components/layout/CartDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { Footer } from './components/layout/Footer';

// Pages
import { CatalogoPage } from './pages/CatalogoPage';
import { PedidosPage } from './pages/PedidosPage';
import { ProductosPage } from './pages/ProductosPage';
import { CategoriasPage } from './pages/CategoriasPage';
import { ClientesPage } from './pages/ClientesPage';
import { EstadosOrdenPage } from './pages/EstadosOrdenPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { InformacionPage } from './pages/InformacionPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Services
import { obtenerProductos } from './services/productService';
import { obtenerCategorias } from './services/categoryService';
import { obtenerClientes } from './services/clientService';
import { obtenerEstadosOrden } from './services/orderStatusService';
import { obtenerUsuarios } from './services/userService';
import { obtenerInformacion } from './services/informationService';

function AppContent() {
  const [categoriaActiva, setCategoriaActiva] = useState('Inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        setProductos(Array.isArray(data) ? data : []);
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
        setCategorias(Array.isArray(data) ? data : []);
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
        setClientes(Array.isArray(data) ? data : []);
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
        setEstadosOrden(Array.isArray(data) ? data : []);
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
        setUsuarios(Array.isArray(data) ? data : []);
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
        setInformacion(Array.isArray(data) ? data : []);
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

  const handleSeleccionarCategoriaFooter = (cat) => {
    setCategoriaActiva(cat);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      {/* Barra superior visible en móviles */}
      <MobileTopBar onOpenSidebar={() => setIsSidebarOpen(true)} />

      {/* Menú Vertical Lateral Izquierdo */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSelectCategoria={(cat) => {
          setCategoriaActiva(cat);
          navigate('/');
        }}
      />

      {/* Panel Deslizante de Carrito & Checkout */}
      <CartDrawer />

      {/* Notificaciones Toasts y Modales de Confirmación */}
      <ToastContainer />

      {/* Área Principal de Contenido */}
      <div className="app-main-viewport">
        <main className="main-content-area">
          <Routes>
            {/* Ruta del Catálogo Principal */}
            <Route
              path="/"
              element={
                <CatalogoPage
                  productos={productos}
                  categoriaActiva={categoriaActiva}
                  cargando={cargandoProductos}
                />
              }
            />

            {/* Ruta de Gestión de Pedidos (Nueva) */}
            <Route path="/pedidos" element={<PedidosPage />} />

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

            {/* Ruta 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Footer Integrado */}
        <Footer
          categorias={categorias}
          setCategoriaActiva={handleSeleccionarCategoriaFooter}
        />
      </div>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ToastProvider>
  );
}

export default App;