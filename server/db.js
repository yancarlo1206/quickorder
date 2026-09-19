import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_DATA = {
  productos: [
    {
      id: '1',
      nombre: 'Hamburguesa Doble Smash',
      descripcion: 'Doble carne de res de 120g con queso cheddar fundido, tocineta crocante y salsa especial de la casa.',
      precio: 28000,
      categoria: 'Hamburguesas',
      imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      tag: 'Más Vendida',
      stock: 25,
      estado: true
    },
    {
      id: '2',
      nombre: 'Pizza Artesanal Cuatro Quesos',
      descripcion: 'Masa madre crujiente con mozzarella fresca, queso azul, gouda y parmesano curado con orégano.',
      precio: 36000,
      categoria: 'Pizzas',
      imagen: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      tag: 'Chef Especial',
      stock: 15,
      estado: true
    },
    {
      id: '3',
      nombre: 'Papas Rústicas con Queso & Bacon',
      descripcion: 'Papas en cascos doradas sazonadas con páprika, bañadas en salsa de queso cheddar y trozos de tocineta.',
      precio: 16000,
      categoria: 'Acompañamientos',
      imagen: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
      tag: 'Popular',
      stock: 30,
      estado: true
    },
    {
      id: '4',
      nombre: 'Limonada de Coco Frappé',
      descripcion: 'Refrescante limonada natural cremada con leche de coco artesanal y hielo picado.',
      precio: 12000,
      categoria: 'Bebidas',
      imagen: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      tag: 'Refrescante',
      stock: 40,
      estado: true
    }
  ],
  categorias: [
    { id: '1', nombre: 'Hamburguesas', icono: '🍔', estado: 1 },
    { id: '2', nombre: 'Pizzas', icono: '🍕', estado: 1 },
    { id: '3', nombre: 'Acompañamientos', icono: '🍟', estado: 1 },
    { id: '4', nombre: 'Bebidas', icono: '🥤', estado: 1 },
    { id: '5', nombre: 'Postres', icono: '🍰', estado: 1 }
  ],
  pedidos: [
    {
      id: 'ORD-1001',
      cliente: 'Carlos Mendoza',
      telefono: '3104567890',
      tipoEntrega: 'mesa',
      ubicacion: 'Mesa 3',
      metodoPago: 'Transferencia (Nequi / Daviplata)',
      items: [
        { id: '1', nombre: 'Hamburguesa Doble Smash', precio: 28000, cantidad: 2 },
        { id: '4', nombre: 'Limonada de Coco Frappé', precio: 12000, cantidad: 2 }
      ],
      total: 80000,
      notas: 'Las hamburguesas sin cebolla por favor.',
      estado: 'en_preparacion',
      fechaCreacion: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: 'ORD-1002',
      cliente: 'Laura Gómez',
      telefono: '3157891234',
      tipoEntrega: 'domicilio',
      ubicacion: 'Calle 45 # 12 - 34 Apto 302',
      metodoPago: 'Efectivo',
      items: [
        { id: '2', nombre: 'Pizza Artesanal Cuatro Quesos', precio: 36000, cantidad: 1 },
        { id: '3', nombre: 'Papas Rústicas con Queso & Bacon', precio: 16000, cantidad: 1 }
      ],
      total: 52000,
      notas: 'Tocar el timbre del 302.',
      estado: 'pendiente',
      fechaCreacion: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    }
  ],
  clientes: [
    { id: '1', nombre: 'Carlos Mendoza', telefono: '3104567890', email: 'carlos@ejemplo.com', estado: true },
    { id: '2', nombre: 'Laura Gómez', telefono: '3157891234', email: 'laura@ejemplo.com', estado: true }
  ],
  estadosOrden: [
    { id: '1', nombre: 'pendiente', label: 'Pendiente', color: '#f59e0b' },
    { id: '2', nombre: 'en_preparacion', label: 'En Preparación', color: '#3b82f6' },
    { id: '3', nombre: 'listo', label: 'Listo para Entrega', color: '#10b981' },
    { id: '4', nombre: 'entregado', label: 'Entregado', color: '#64748b' },
    { id: '5', nombre: 'cancelado', label: 'Cancelado', color: '#ef4444' }
  ],
  usuarios: [
    { id: '1', nombre: 'Administrador General', email: 'admin@quickorder.com', rol: 'admin', estado: true }
  ],
  informacion: [
    {
      id: '1',
      nombreRestaurante: 'QuickOrder GastroBar',
      telefono: '+57 300 123 4567',
      direccion: 'Av. Gastronómica #45 - 20',
      horario: 'Lunes a Domingo: 11:30 AM - 10:30 PM'
    }
  ]
};

function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
  }
}

export function readDB() {
  initDB();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return INITIAL_DATA;
  }
}

export function writeDB(data) {
  initDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  return data;
}
