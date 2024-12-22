// routes/truckRoutes.js
import express from 'express';
import {
  getTrucks,
  addTruck,
  getTruckById,
  updateTruck,
  deleteTruck,
} from '../controllers/truckController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, authorize('admin'), getTrucks).post(protect, authorize('admin'), addTruck);
router
  .route('/:id')
  .get(protect, authorize('admin'), getTruckById)
  .put(protect, authorize('admin'), updateTruck)
  .delete(protect, authorize('admin'), deleteTruck);

export default router;
