// controllers/truckController.js
import asyncHandler from 'express-async-handler';
import Truck from '../models/Truck.js';

// @desc    Get all trucks
// @route   GET /api/trucks
// @access  Private/Admin
const getTrucks = asyncHandler(async (req, res) => {
  const trucks = await Truck.find().populate('parcels');
  res.json(trucks);
});

// @desc    Add a new truck
// @route   POST /api/trucks
// @access  Private/Admin
const addTruck = asyncHandler(async (req, res) => {
  const {
    driver,
    route,
    fuelLevel,
    location,
    nextStop,
    status,
  } = req.body;

  const truck = new Truck({
    driver,
    route,
    fuelLevel,
    location,
    nextStop,
    status,
  });

  const createdTruck = await truck.save();
  res.status(201).json(createdTruck);
});

// @desc    Get single truck
// @route   GET /api/trucks/:id
// @access  Private/Admin
const getTruckById = asyncHandler(async (req, res) => {
  const truck = await Truck.findById(req.params.id).populate('parcels');

  if (truck) {
    res.json(truck);
  } else {
    res.status(404);
    throw new Error('Truck not found');
  }
});

// @desc    Update a truck
// @route   PUT /api/trucks/:id
// @access  Private/Admin
const updateTruck = asyncHandler(async (req, res) => {
  const truck = await Truck.findById(req.params.id);

  if (truck) {
    truck.driver = req.body.driver || truck.driver;
    truck.route = req.body.route || truck.route;
    truck.fuelLevel = req.body.fuelLevel !== undefined ? req.body.fuelLevel : truck.fuelLevel;
    truck.location = req.body.location || truck.location;
    truck.nextStop = req.body.nextStop || truck.nextStop;
    truck.status = req.body.status || truck.status;
    truck.estimatedArrival = req.body.estimatedArrival || truck.estimatedArrival;
    truck.temperature = req.body.temperature !== undefined ? req.body.temperature : truck.temperature;
    truck.humidity = req.body.humidity !== undefined ? req.body.humidity : truck.humidity;
    truck.tollsPaid = req.body.tollsPaid !== undefined ? req.body.tollsPaid : truck.tollsPaid;
    truck.fuelEfficiency = req.body.fuelEfficiency !== undefined ? req.body.fuelEfficiency : truck.fuelEfficiency;
    truck.totalDistance = req.body.totalDistance !== undefined ? req.body.totalDistance : truck.totalDistance;
    truck.fuelConsumed = req.body.fuelConsumed !== undefined ? req.body.fuelConsumed : truck.fuelConsumed;

    const updatedTruck = await truck.save();
    res.json(updatedTruck);
  } else {
    res.status(404);
    throw new Error('Truck not found');
  }
});

// @desc    Delete a truck
// @route   DELETE /api/trucks/:id
// @access  Private/Admin
const deleteTruck = asyncHandler(async (req, res) => {
  const truck = await Truck.findById(req.params.id);

  if (truck) {
    await truck.remove();
    res.json({ message: 'Truck removed' });
  } else {
    res.status(404);
    throw new Error('Truck not found');
  }
});

export { getTrucks, addTruck, getTruckById, updateTruck, deleteTruck };
