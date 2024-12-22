// seeder/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors'; // Optional: For colored console logs
import User from '../models/User.js';
import Truck from '../models/Truck.js';
import Parcel from '../models/Parcel.js';
import connectDB from '../config/db.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Truck.deleteMany();
    await Parcel.deleteMany();

    // Create users
    const adminUser = await User.create({
      email: 'admin@logitrack.com',
      password: 'password123', // In production, use strong passwords
      role: 'admin',
    });

    const driverUser = await User.create({
      email: 'driver@logitrack.com',
      password: 'password123',
      role: 'driver',
    });

    const customerUser = await User.create({
      email: 'customer@logitrack.com',
      password: 'password123',
      role: 'customer',
    });

    // Create trucks
    const trucks = await Truck.insertMany([
      {
        driver: 'Ravi Kumar',
        route: 'Mumbai to Delhi',
        status: 'In Transit',
        parcels: [],
        location: 'Ahmedabad, Gujarat',
        fuelLevel: 75,
        nextStop: 'Jaipur, Rajasthan',
        estimatedArrival: new Date('2024-10-08T14:30:00'),
        temperature: 23,
        humidity: 45,
        tollsPaid: 12500,
        fuelEfficiency: 8.5,
        totalDistance: 1200,
        fuelConsumed: 141,
        tollHistory: [
          { date: new Date('2024-10-01'), location: 'Vadodara', amount: 500 },
          { date: new Date('2024-10-02'), location: 'Udaipur', amount: 450 },
        ],
      },
      {
        driver: 'Amit Sharma',
        route: 'Kolkata to Bengaluru',
        status: 'Loading',
        parcels: [],
        location: 'Kolkata, West Bengal',
        fuelLevel: 90,
        nextStop: 'Bhubaneswar, Odisha',
        estimatedArrival: new Date('2024-10-09T10:00:00'),
        temperature: 25,
        humidity: 60,
        tollsPaid: 8900,
        fuelEfficiency: 9.2,
        totalDistance: 800,
        fuelConsumed: 87,
        tollHistory: [
          { date: new Date('2024-10-01'), location: 'Kharagpur', amount: 350 },
          { date: new Date('2024-10-02'), location: 'Bhubaneswar', amount: 400 },
        ],
      },
    ]);

    // Create parcels
    const parcels = await Parcel.insertMany([
      {
        customer: customerUser._id,
        weight: 5,
        source: 'Mumbai',
        destination: 'Delhi',
        type: 'regular',
        insurance: true,
        priority: false,
        description: 'Books and stationary',
        status: 'In Transit',
        location: 'Mumbai',
        eta: new Date('2024-10-08'),
        updates: [
          { time: new Date('2024-10-06T09:00:00'), message: 'Package picked up' },
          { time: new Date('2024-10-07T14:30:00'), message: 'In transit to sorting facility' },
        ],
      },
      {
        customer: customerUser._id,
        weight: 2,
        source: 'Mumbai',
        destination: 'Delhi',
        type: 'express',
        insurance: false,
        priority: true,
        description: 'Electronic gadgets',
        status: 'Delivered',
        location: 'Delhi',
        eta: new Date('2024-10-05'),
        updates: [
          { time: new Date('2024-10-04T10:00:00'), message: 'Out for delivery' },
          { time: new Date('2024-10-05T15:45:00'), message: 'Delivered successfully' },
        ],
      },
    ]);

    // Assign parcels to trucks
    trucks[0].parcels.push(parcels[0]._id);
    trucks[1].parcels.push(parcels[1]._id);
    await trucks[0].save();
    await trucks[1].save();

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    // Clear data
    await User.deleteMany();
    await Truck.deleteMany();
    await Parcel.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Run seeder
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
