import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  // 1. Leer el token del header 'Authorization'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Obtener solo el token (ej. "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar el token con el secreto
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Obtener el usuario desde la BD (sin la contraseña)
      //    y adjuntarlo al objeto 'req' para usarlo en rutas protegidas
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
         return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      next(); // Pasa al siguiente middleware o controlador
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'No autorizado, token falló' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

export { protect };