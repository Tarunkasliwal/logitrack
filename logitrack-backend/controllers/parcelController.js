// controllers/parcelController.js
import asyncHandler from 'express-async-handler';
import Parcel from '../models/Parcel.js';
import Truck from '../models/Truck.js';

// @desc    Get all parcels for a user
// @route   GET /api/parcels
// @access  Private (Customers can view their parcels, Admins can view all)
const getParcels = asyncHandler(async (req, res) => {
  if (req.user.role === 'admin') {
    const parcels = await Parcel.find().populate('customer');
    res.json(parcels);
  } else if (req.user.role === 'customer') {
    const parcels = await Parcel.find({ customer: req.user._id });
    res.json(parcels);
  } else if (req.user.role === 'driver') {
    // Assuming driver can see parcels related to their trucks
    // Implement logic based on your application's requirements
    res.status(403);
    throw new Error('Not authorized to view parcels');
  } else {
    res.status(403);
    throw new Error('Not authorized');
  }
});

// @desc    Create a new parcel
// @route   POST /api/parcels
// @access  Private (Customers)
const createParcel = asyncHandler(async (req, res) => {
  const {
    weight,
    source,
    destination,
    type,
    insurance,
    priority,
    description,
  } = req.body;

  const parcel = new Parcel({
    customer: req.user._id,
    weight,
    source,
    destination,
    type,
    insurance,
    priority,
    description,
    location: source,
    updates: [
      {
        time: new Date(),
        message: 'Order placed successfully',
      },
    ],
  });

  const createdParcel = await parcel.save();
  res.status(201).json(createdParcel);
});

// @desc    Get single parcel
// @route   GET /api/parcels/:id
// @access  Private (Customers can view their parcels, Admins can view all)
const getParcelById = asyncHandler(async (req, res) => {
  const parcel = await Parcel.findById(req.params.id).populate('customer');

  if (parcel) {
    if (
      req.user.role === 'admin' ||
      (req.user.role === 'customer' && parcel.customer._id.equals(req.user._id))
    ) {
      res.json(parcel);
    } else {
      res.status(403);
      throw new Error('Not authorized to view this parcel');
    }
  } else {
    res.status(404);
    throw new Error('Parcel not found');
  }
});

// @desc    Update parcel status and location
// @route   PUT /api/parcels/:id
// @access  Private (Admins and Drivers)
const updateParcel = asyncHandler(async (req, res) => {
  const parcel = await Parcel.findById(req.params.id);

  if (parcel) {
    if (req.user.role === 'admin' || req.user.role === 'driver') {
      parcel.status = req.body.status || parcel.status;
      parcel.location = req.body.location || parcel.location;
      parcel.eta = req.body.eta || parcel.eta;
      if (req.body.updateMessage) {
        parcel.updates.push({
          time: new Date(),
          message: req.body.updateMessage,
        });
      }

      const updatedParcel = await parcel.save();
      res.json(updatedParcel);
    } else {
      res.status(403);
      throw new Error('Not authorized to update this parcel');
    }
  } else {
    res.status(404);
    throw new Error('Parcel not found');
  }
});

// @desc    Delete a parcel
// @route   DELETE /api/parcels/:id
// @access  Private (Admins)
const deleteParcel = asyncHandler(async (req, res) => {
  const parcel = await Parcel.findById(req.params.id);

  if (parcel) {
    if (req.user.role === 'admin') {
      await parcel.remove();
      res.json({ message: 'Parcel removed' });
    } else {
      res.status(403);
      throw new Error('Not authorized to delete this parcel');
    }
  } else {
    res.status(404);
    throw new Error('Parcel not found');
  }
});

export { getParcels, createParcel, getParcelById, updateParcel, deleteParcel };
