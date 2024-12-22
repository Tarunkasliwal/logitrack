// controllers/tollController.js
import asyncHandler from 'express-async-handler';
import Toll from '../models/Toll.js';
import Truck from '../models/Truck.js';

// @desc    Get all tolls (Admins)
// @route   GET /api/tolls
// @access  Private/Admin
const getTolls = asyncHandler(async (req, res) => {
  const tolls = await Toll.find().populate('truck');
  res.json(tolls);
});

// @desc    Add a new toll entry
// @route   POST /api/tolls
// @access  Private/Admin
const addToll = asyncHandler(async (req, res) => {
  const { truckId, date, location, amount } = req.body;

  const truck = await Truck.findById(truckId);
  if (!truck) {
    res.status(404);
    throw new Error('Truck not found');
  }

  const toll = new Toll({
    truck: truckId,
    date,
    location,
    amount,
  });

  const createdToll = await toll.save();

  // Update truck's tollsPaid and tollHistory
  truck.tollsPaid += amount;
  truck.tollHistory.push({
    date,
    location,
    amount,
  });
  await truck.save();

  res.status(201).json(createdToll);
});

// @desc    Get tolls for a specific truck
// @route   GET /api/tolls/truck/:truckId
// @access  Private/Admin
const getTollsByTruck = asyncHandler(async (req, res) => {
  const tolls = await Toll.find({ truck: req.params.truckId });
  res.json(tolls);
});

export { getTolls, addToll, getTollsByTruck };
