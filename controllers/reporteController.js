import Acceso from '../models/Acceso.js';

// @desc    Obtener reporte de accesos (filtrado, paginado, agregado)
// @route   GET /api/reportes/accesos
// @access  Private (Admin, Analista)
const getReporteAccesos = async (req, res) => {
  try {
    // 1. Opciones de Paginación
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 2. Filtros (desde la URL query)
    const { desde, hasta, recurso } = req.query;

    // 3. Construir el objeto $match para la agregación
    const matchStage = {};
    
    // Filtro de rango de fechas
    if (desde || hasta) {
      matchStage.timestamp = {};
      if (desde) {
        matchStage.timestamp.$gte = new Date(desde); // Mayor o igual que 'desde'
      }
      if (hasta) {
        matchStage.timestamp.$lte = new Date(hasta); // Menor o igual que 'hasta'
      }
    }

    // Filtro por tipo de recurso
    if (recurso) {
      matchStage.recurso = recurso;
    }

    // 4. Pipeline de Agregación
    // Queremos estadísticas (conteo por usuario y recurso)
    const aggregationPipeline = [
      {
        // Etapa 1: Filtrar (solo documentos que coinciden)
        $match: matchStage,
      },
      {
        // Etapa 2: Agrupar por usuario y recurso, y contar
        $group: {
          _id: {
            usuarioId: '$usuario',
            recurso: '$recurso',
          },
          count: { $sum: 1 }, // Contar cuántos accesos
          lastAccess: { $max: '$timestamp' }, // Cuándo fue el último
        },
      },
      {
        // Etapa 3: (Opcional) Traer datos del usuario (Lookup)
        $lookup: {
          from: 'users', // La colección de usuarios
          localField: '_id.usuarioId',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        // Etapa 4: Descomprimir el array 'userInfo'
        $unwind: '$userInfo',
      },
      {
        // Etapa 5: Formatear la salida
        $project: {
          _id: 0, // Ocultar el _id de la agrupación
          usuarioNombre: '$userInfo.nombre',
          usuarioEmail: '$userInfo.email',
          recurso: '$_id.recurso',
          conteoAccesos: '$count',
          ultimoAcceso: '$lastAccess',
        },
      },
      {
        // Etapa 6: Ordenar (ej. por más accesos)
        $sort: { conteoAccesos: -1 },
      },
      {
        // Etapa 7: Aplicar Paginación (usando $facet)
        $facet: {
          metadata: [{ $count: 'totalDocumentos' }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    // 5. Ejecutar la agregación
    const results = await Acceso.aggregate(aggregationPipeline);

    // 6. Formatear la respuesta
    const data = results[0].data;
    const totalDocumentos = results[0].metadata[0] ? results[0].metadata[0].totalDocumentos : 0;
    const totalPages = Math.ceil(totalDocumentos / limit);

    res.json({
      data,
      page,
      limit,
      totalPages,
      totalDocumentos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar el reporte de accesos', error: error.message });
  }
};

export { getReporteAccesos };