// models/Truck.js
import mongoose from 'mongoose';

const tollSchema = mongoose.Schema({
  date: { type: Date, required: true },
  location: { type: String, required: true },
  amount: { type: Number, required: true },
});

const truckSchema = mongoose.Schema(
  {
    driver: {
      type: String,
      required: [true, 'Please add a driver name'],
    },
    route: {
      type: String,
      required: [true, 'Please add a route'],
    },
    status: {
      type: String,
      enum: ['Ready', 'In Transit', 'Loading', 'Maintenance'],
      default: 'Ready',
    },
    parcels: [{ type: String }], // Array of Parcel IDs
    location: {
      type: String,
      required: [true, 'Please add current location'],
    },
    fuelLevel: {
      type: Number,
      required: [true, 'Please add fuel level'],
      min: 0,
      max: 100,
      default: 100,
    },
    nextStop: {
      type: String,
      required: [true, 'Please add next stop'],
    },
    estimatedArrival: {
      type: Date,
    },
    temperature: {
      type: Number, // Celsius
    },
    humidity: {
      type: Number, // Percentage
    },
    tollsPaid: {
      type: Number,
      default: 0,
    },
    fuelEfficiency: {
      type: Number, // km/l
    },
    totalDistance: {
      type: Number, // km
    },
    fuelConsumed: {
      type: Number, // liters
    },
    tollHistory: [tollSchema],
  },
  {
    timestamps: true,
  }
);

const Truck = mongoose.model('Truck', truckSchema);

export default Truck;
