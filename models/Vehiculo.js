import mongoose from 'mongoose';

const vehiculoSchema = mongoose.Schema({
  placa: { type: String, required: true, unique: true },
  tipo: { type: String, required: true },
  estado: { type: String, default: 'Disponible' },
  asignadoAProyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proyecto', // Referencia al modelo Proyecto
    required: false,
  },
}, { timestamps: true });

const Vehiculo = mongoose.model('Vehiculo', vehiculoSchema);
export default Vehiculo;