import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// --- 1. IMPORTA TUS RUTAS ---
import authRoutes from './routes/authRoutes.js';
import reporteRoutes from './routes/reporteRoutes.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();

// Middleware para aceptar JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Constructora de Movilidad corriendo...');
});

// --- 2. MONTA LAS RUTAS ---
// (Aquí es donde estaba el error probablemente)
app.use('/api/auth', authRoutes);
app.use('/api/reportes', reporteRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
 () => console.log(`Servidor corriendo en http://localhost:${PORT}`)
);