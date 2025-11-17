import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // El email debe ser único
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ['admin', 'analista', 'visitante'], // Solo permite estos valores
      default: 'visitante',
    },
  },
  {
    timestamps: true, // Añade las fechas createdAt y updatedAt
  }
);

// --- Middleware de Mongoose ---
// Esto se ejecuta ANTES de que un documento se guarde (pre-save)
userSchema.pre('save', async function (next) {
  // Si la contraseña no fue modificada, no la volvemos a hashear
  if (!this.isModified('password')) {
    next();
  }

  // Genera "salt" (una cadena aleatoria) para el hasheo
  const salt = await bcrypt.genSalt(10);
  // Hashea la contraseña y la reemplaza
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Método personalizado para el modelo ---
// Añadimos un método a cada usuario para comparar la contraseña
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compara la contraseña que envía el usuario (enteredPassword) 
  // con la contraseña hasheada en la BD (this.password)
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;