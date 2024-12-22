// routes/tollRoutes.js
import express from 'express';
import { getTolls, addToll, getTollsByTruck } from '../controllers/tollController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, authorize('admin'), getTolls).post(protect, authorize('admin'), addToll);
router.route('/truck/:truckId').get(protect, authorize('admin'), getTollsByTruck);

export default router;
