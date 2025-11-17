import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// --- INICIO DE LA CORRECCIÓN DE RUTA ---
import path from 'path';
import { fileURLToPath } from 'url';

// Esto obtiene la ruta absoluta al directorio actual (la carpeta /scripts)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carga .env usando una ruta absoluta (sube un nivel desde /scripts a la raíz)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// --- FIN DE LA CORRECCIÓN DE RUTA ---

// Conectar a BD
const connectDB = async () => {
  try {
    // Verificamos si MONGO_URI existe ANTES de conectar
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definida en tu archivo .env');
    }

    // Opciones obsoletas eliminadas
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('MongoDB Conectado para Seeder');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const usuariosParaCargar = [
  {
    nombre: 'Admin User',
    email: 'admin@ejemplo.com',
    password: 'password123',
    rol: 'admin',
  },
  {
    nombre: 'Analista User',
    email: 'analista@ejemplo.com',
    password: 'password123',
    rol: 'analista',
  },
  {
    nombre: 'Visitante User',
    email: 'visitante@ejemplo.com',
    password: 'password123',
    rol: 'visitante',
  },
];

const importarDatos = async () => {
  await connectDB();
  try {
    // Limpiar usuarios existentes
    await User.deleteMany();

    // Insertar nuevos usuarios.
    // El 'pre-save' hook de User.js se disparará para hashear la contraseña.
    await User.create(usuariosParaCargar);

    console.log('Usuarios importados exitosamente!');
    process.exit();
  } catch (error) {
    console.error(`Error al importar datos: ${error.message}`);
    process.exit(1);
  }
};

// Ejecutar la importación
importarDatos();