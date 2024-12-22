// routes/parcelRoutes.js
import express from 'express';
import {
  getParcels,
  createParcel,
  getParcelById,
  updateParcel,
  deleteParcel,
} from '../controllers/parcelController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, authorize('admin', 'customer'), getParcels).post(protect, authorize('customer'), createParcel);
router
  .route('/:id')
  .get(protect, authorize('admin', 'customer'), getParcelById)
  .put(protect, authorize('admin', 'driver'), updateParcel)
  .delete(protect, authorize('admin'), deleteParcel);

export default router;
