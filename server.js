import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // <-- 1. Importa tu conexión

// Cargar variables de entorno
dotenv.config();

// --- 2. Conectar a la base de datos ---
connectDB();
// -------------------------------------

const app = express();

// Middleware para aceptar JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Constructora de Movilidad corriendo...');
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Servidor corriendo en http://localhost:${PORT}`) // <-- Nueva versión
);