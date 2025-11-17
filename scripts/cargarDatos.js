import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Proyecto from '../models/Proyecto.js';
import Vehiculo from '../models/Vehiculo.js';
import Acceso from '../models/Acceso.js';

// --- INICIO DE LA CORRECCIÓN DE RUTA ---
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
// --- FIN DE LA CORRECCIÓN DE RUTA ---

// Conectar a BD
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definida en tu archivo .env');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Conectado para Seeder de Datos');
  } catch (error) {
    console.error(`Error en Seeder: ${error.message}`);
    process.exit(1);
  }
};

const importarDatos = async () => {
  await connectDB();
  try {
    // 1. Limpiar colecciones (excepto usuarios)
    await Proyecto.deleteMany();
    await Vehiculo.deleteMany();
    await Acceso.deleteMany();
    console.log('Datos antiguos (Proyectos, Vehículos, Accesos) eliminados...');

    // 2. Buscar usuarios (necesitamos sus IDs)
    const adminUser = await User.findOne({ email: 'admin@ejemplo.com' });
    const analistaUser = await User.findOne({ email: 'analista@ejemplo.com' });

    if (!adminUser || !analistaUser) {
      console.error('Error: No se encontraron los usuarios de ejemplo (admin/analista).');
      console.log('Asegúrate de haber ejecutado "npm run import:users" primero.');
      process.exit(1);
    }

    // 3. Crear Proyectos de ejemplo
    const proyectos = [
      {
        nombre: 'Proyecto Torre Central',
        ubicacion: 'Centro Ciudad',
        cliente: 'Constructora Principal',
      },
      {
        nombre: 'Proyecto Puente Norte',
        ubicacion: 'Zona Norte',
        cliente: 'Gobierno Local',
      },
    ];
    const proyectosCreados = await Proyecto.insertMany(proyectos);
    const proyecto1 = proyectosCreados[0];
    const proyecto2 = proyectosCreados[1];
    console.log('Proyectos creados...');

    // 4. Crear Vehículos de ejemplo
    const vehiculos = [
      {
        placa: 'ABC-123',
        tipo: 'Excavadora',
        asignadoAProyecto: proyecto1._id,
      },
      {
        placa: 'DEF-456',
        tipo: 'Camión Volteo',
        estado: 'En Mantenimiento',
      },
      {
        placa: 'GHI-789',
        tipo: 'Grúa',
        asignadoAProyecto: proyecto1._id,
      },
    ];
    await Vehiculo.insertMany(vehiculos);
    console.log('Vehículos creados...');

    // 5. Crear Registros de Acceso de ejemplo (¡Para los reportes!)
    const accesos = [
      {
        usuario: adminUser._id,
        recurso: 'proyecto',
        recursoId: proyecto1._id,
        accion: 'leer',
        timestamp: new Date('2025-11-10T10:00:00Z'),
      },
      {
        usuario: analistaUser._id,
        recurso: 'proyecto',
        recursoId: proyecto2._id,
        accion: 'leer',
        timestamp: new Date('2025-11-11T11:30:00Z'),
      },
      {
        usuario: adminUser._id,
        recurso: 'vehiculo',
        accion: 'crear',
        timestamp: new Date('2025-11-12T15:00:00Z'),
      },
      {
        usuario: analistaUser._id,
        recurso: 'reporte',
        accion: 'leer',
        timestamp: new Date('2025-11-13T09:00:00Z'),
      },
      {
        usuario: analistaUser._id,
        recurso: 'proyecto',
        recursoId: proyecto1._id,
        accion: 'leer',
        timestamp: new Date('2025-11-14T14:20:00Z'),
      },
    ];
    await Acceso.insertMany(accesos);
    console.log('Registros de acceso creados...');

    console.log('¡Datos de ejemplo importados exitosamente!');
    process.exit();
  } catch (error) {
    console.error(`Error al importar datos: ${error.message}`);
    process.exit(1);
  }
};

// Revisa si se pasó un argumento -d (para destruir)
if (process.argv[2] === '-d') {
  // Lógica de destruir (opcional, no la usamos por ahora)
  console.log('Opción -d detectada, pero destruirDatos no está implementado en este script.');
  process.exit();
} else {
  importarDatos();
}