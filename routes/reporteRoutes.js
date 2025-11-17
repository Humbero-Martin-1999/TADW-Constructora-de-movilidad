import express from 'express';
import { getReporteAccesos } from '../controllers/reporteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authorizeMiddleware.js';

const router = express.Router();

// GET /api/reportes/accesos
router
  .route('/accesos')
  .get(protect, authorize('admin', 'analista'), getReporteAccesos);

export default router;