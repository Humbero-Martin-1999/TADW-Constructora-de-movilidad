import mongoose from 'mongoose';

const accesoSchema = mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Referencia al modelo User
  },
  recurso: {
    type: String,
    required: true,
    enum: ['proyecto', 'vehiculo', 'reporte'], // O los nombres de las colecciones
  },
  recursoId: {
    type: mongoose.Schema.Types.ObjectId,
    // No usamos 'ref' aquí porque puede referirse a distintas colecciones
  },
  accion: {
    type: String,
    required: true,
    enum: ['leer', 'crear', 'actualizar', 'eliminar'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Acceso = mongoose.model('Acceso', accesoSchema);
export default Acceso;