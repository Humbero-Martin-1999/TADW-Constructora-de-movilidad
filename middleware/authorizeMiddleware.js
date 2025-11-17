// Recibe una lista de roles permitidos (ej. 'admin', 'analista')
const authorize = (...roles) => {
  return (req, res, next) => {
    // Comprueba si el rol del usuario (req.user.rol) está en la lista de roles permitidos
    if (!roles.includes(req.user.rol)) {
      // 403 Forbidden: El usuario está autenticado pero no tiene permisos
      return res.status(403).json({
        message: `Acceso denegado. Rol '${req.user.rol}' no tiene permiso para este recurso.`,
      });
    }
    next(); // El usuario tiene el rol correcto, continuar
  };
};

export { authorize };