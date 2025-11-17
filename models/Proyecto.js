import mongoose from 'mongoose';

const proyectoSchema = mongoose.Schema({
  nombre: { type: String, required: true },
  ubicacion: { type: String },
  estado: { type: String, default: 'Activo' },
  fechaInicio: { type: Date, default: Date.now },
  cliente: { type: String },
}, { timestamps: true });

const Proyecto = mongoose.model('Proyecto', proyectoSchema);
export default Proyecto;