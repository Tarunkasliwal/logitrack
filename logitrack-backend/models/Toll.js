// models/Toll.js
import mongoose from 'mongoose';

const tollSchema = mongoose.Schema(
  {
    truck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Truck',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    location: {
      type: String,
      required: [true, 'Please add location'],
    },
    amount: {
      type: Number,
      required: [true, 'Please add amount'],
    },
  },
  {
    timestamps: true,
  }
);

const Toll = mongoose.model('Toll', tollSchema);

export default Toll;
