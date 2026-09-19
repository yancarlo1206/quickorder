import express from 'express';
import cors from 'cors';
import { readDB, writeDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check & Stats
app.get('/api/health', (req, res) => {
  const db = readDB();
  res.json({
    status: 'online',
    version: '2.0.0',
    totalProductos: db.productos.length,
    totalPedidos: db.pedidos.length,
    totalCategorias: db.categorias.length,
    uptime: process.uptime()
  });
});

// ==========================================
// 1. PRODUCTOS
// ==========================================
app.get('/api/productos', (req, res) => {
  const db = readDB();
  res.json(db.productos);
});

app.post('/api/productos', (req, res) => {
  const db = readDB();
  const nuevoProducto = {
    id: String(Date.now()),
    nombre: req.body.nombre,
    descripcion: req.body.descripcion || '',
    precio: Number(req.body.precio) || 0,
    categoria: req.body.categoria || 'Varios',
    imagen: req.body.imagen || '',
    tag: req.body.tag || '',
    stock: Number(req.body.stock) || 0,
    estado: req.body.estado !== undefined ? Boolean(req.body.estado) : true
  };
  db.productos.unshift(nuevoProducto);
  writeDB(db);
  res.status(201).json(nuevoProducto);
});

app.put('/api/productos/:id', (req, res) => {
  const db = readDB();
  const index = db.productos.findIndex((p) => String(p.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  db.productos[index] = { ...db.productos[index], ...req.body, id: db.productos[index].id };
  writeDB(db);
  res.json(db.productos[index]);
});

app.delete('/api/productos/:id', (req, res) => {
  const db = readDB();
  const index = db.productos.findIndex((p) => String(p.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  const eliminado = db.productos.splice(index, 1);
  writeDB(db);
  res.json(eliminado[0]);
});

// ==========================================
// 2. PEDIDOS (SISTEMA DE ÓRDENES EN TIEMPO REAL)
// ==========================================
app.get('/api/pedidos', (req, res) => {
  const db = readDB();
  res.json(db.pedidos || []);
});

app.post('/api/pedidos', (req, res) => {
  const db = readDB();
  const count = (db.pedidos || []).length + 1;
  const nuevoPedido = {
    id: `ORD-${1000 + count}`,
    cliente: req.body.cliente || 'Cliente General',
    telefono: req.body.telefono || '',
    tipoEntrega: req.body.tipoEntrega || 'domicilio',
    ubicacion: req.body.ubicacion || req.body.direccion || '',
    metodoPago: req.body.metodoPago || 'Efectivo',
    items: req.body.items || [],
    total: Number(req.body.total) || 0,
    notas: req.body.notas || '',
    estado: req.body.estado || 'pendiente',
    fechaCreacion: new Date().toISOString()
  };

  if (!db.pedidos) db.pedidos = [];
  db.pedidos.unshift(nuevoPedido);
  writeDB(db);
  res.status(201).json(nuevoPedido);
});

app.patch('/api/pedidos/:id/estado', (req, res) => {
  const db = readDB();
  const pedido = (db.pedidos || []).find((p) => String(p.id) === String(req.params.id));
  if (!pedido) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }
  pedido.estado = req.body.estado;
  pedido.fechaActualizacion = new Date().toISOString();
  writeDB(db);
  res.json(pedido);
});

app.delete('/api/pedidos/:id', (req, res) => {
  const db = readDB();
  const index = (db.pedidos || []).findIndex((p) => String(p.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }
  const eliminado = db.pedidos.splice(index, 1);
  writeDB(db);
  res.json(eliminado[0]);
});

// ==========================================
// 3. CATEGORÍAS
// ==========================================
app.get('/api/categorias', (req, res) => {
  const db = readDB();
  res.json(db.categorias);
});

app.post('/api/categorias', (req, res) => {
  const db = readDB();
  const nuevaCat = {
    id: String(Date.now()),
    nombre: req.body.nombre,
    icono: req.body.icono || '🍽️',
    estado: req.body.estado !== undefined ? req.body.estado : 1
  };
  db.categorias.push(nuevaCat);
  writeDB(db);
  res.status(201).json(nuevaCat);
});

app.delete('/api/categorias/:id', (req, res) => {
  const db = readDB();
  const index = db.categorias.findIndex((c) => String(c.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Categoría no encontrada' });
  const eliminado = db.categorias.splice(index, 1);
  writeDB(db);
  res.json(eliminado[0]);
});

// ==========================================
// 4. CLIENTES, ESTADOS, USUARIOS, INFORMACIÓN
// ==========================================
app.get('/api/clientes', (req, res) => {
  const db = readDB();
  res.json(db.clientes || []);
});

app.get('/api/estados-orden', (req, res) => {
  const db = readDB();
  res.json(db.estadosOrden || []);
});

app.get('/api/usuarios', (req, res) => {
  const db = readDB();
  res.json(db.usuarios || []);
});

app.get('/api/informacion', (req, res) => {
  const db = readDB();
  res.json(db.informacion || []);
});

app.listen(PORT, () => {
  console.log(`⚡ Servidor Backend de QuickOrder corriendo en http://localhost:${PORT}`);
  console.log(`📦 Endpoints listos: /api/productos, /api/pedidos, /api/categorias, /api/health`);
});
