// models/Parcel.js
import mongoose from 'mongoose';

const updateSchema = mongoose.Schema({
  time: { type: Date, required: true },
  message: { type: String, required: true },
});

const parcelSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    weight: {
      type: Number,
      required: [true, 'Please add parcel weight'],
    },
    source: {
      type: String,
      required: [true, 'Please add source location'],
    },
    destination: {
      type: String,
      required: [true, 'Please add destination location'],
    },
    type: {
      type: String,
      enum: ['regular', 'express'],
      default: 'regular',
    },
    insurance: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Processing', 'In Transit', 'Delivered'],
      default: 'Processing',
    },
    location: {
      type: String,
      required: [true, 'Please add current location'],
    },
    eta: {
      type: Date,
    },
    updates: [updateSchema],
  },
  {
    timestamps: true,
  }
);

const Parcel = mongoose.model('Parcel', parcelSchema);

export default Parcel;
