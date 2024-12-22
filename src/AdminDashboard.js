
// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Truck, User, MapPin, Package, Battery, Calendar, AlertTriangle, PlusCircle, DollarSign, Fuel } from 'lucide-react';
import { Card, CardHeader, CardContent } from './components/ui/Card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { Alert, AlertDescription } from './components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { DashboardLayout } from './DashboardLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const initialTrucks = [
  { 
    id: 1, 
    driver: 'Ravi Kumar', 
    route: 'Mumbai to Delhi', 
    status: 'In Transit',
    parcels: ['P001', 'P002', 'P003'],
    location: 'Ahmedabad, Gujarat',
    fuelLevel: 75,
    nextStop: 'Jaipur, Rajasthan',
    estimatedArrival: '2024-10-08T14:30:00',
    temperature: 23,
    humidity: 45,
    tollsPaid: 12500,
    fuelEfficiency: 8.5,
    totalDistance: 1200,
    fuelConsumed: 141,
    tollHistory: [
      { date: '2024-10-01', location: 'Vadodara', amount: 500 },
      { date: '2024-10-02', location: 'Udaipur', amount: 450 },
    ]
  },
  { 
    id: 2, 
    driver: 'Amit Sharma', 
    route: 'Kolkata to Bengaluru', 
    status: 'Loading',
    parcels: ['P004', 'P005'],
    location: 'Kolkata, West Bengal',
    fuelLevel: 90,
    nextStop: 'Bhubaneswar, Odisha',
    estimatedArrival: '2024-10-09T10:00:00',
    temperature: 25,
    humidity: 60,
    tollsPaid: 8900,
    fuelEfficiency: 9.2,
    totalDistance: 800,
    fuelConsumed: 87,
    tollHistory: [
      { date: '2024-10-01', location: 'Kharagpur', amount: 350 },
      { date: '2024-10-02', location: 'Bhubaneswar', amount: 400 },
    ]
  }
];

const AdminDashboard = () => {
  const [trucks, setTrucks] = useState(initialTrucks);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showAddTruck, setShowAddTruck] = useState(false);
  const [viewMode, setViewMode] = useState('fleet');
  const [newTruck, setNewTruck] = useState({
    driver: '',
    route: '',
    fuelLevel: 100,
    location: '',
    nextStop: '',
    status: 'Ready'
  });

  // For adding new toll entry
  const [newTollEntry, setNewTollEntry] = useState({
    truckId: '',
    date: '',
    location: '',
    amount: ''
  });
  const [showAddToll, setShowAddToll] = useState(false);

  useEffect(() => {
    const lowFuelTruck = trucks.find(truck => truck.fuelLevel < 20);
    if (lowFuelTruck) {
      setShowAlert(true);
    }
  }, [trucks]);

  const handleAddTruck = () => {
    const truckId = trucks.length + 1;
    const newTruckEntry = {
      ...newTruck,
      id: truckId,
      parcels: [],
      tollsPaid: 0,
      fuelEfficiency: 0,
      totalDistance: 0,
      fuelConsumed: 0,
      tollHistory: [],
      temperature: 25,
      humidity: 50
    };
    setTrucks([...trucks, newTruckEntry]);
    setShowAddTruck(false);
    setNewTruck({
      driver: '',
      route: '',
      fuelLevel: 100,
      location: '',
      nextStop: '',
      status: 'Ready'
    });
  };

  const handleAddToll = () => {
    const updatedTrucks = trucks.map(truck => {
      if (truck.id === parseInt(newTollEntry.truckId)) {
        return {
          ...truck,
          tollsPaid: truck.tollsPaid + parseInt(newTollEntry.amount),
          tollHistory: [...truck.tollHistory, {
            date: newTollEntry.date,
            location: newTollEntry.location,
            amount: parseInt(newTollEntry.amount)
          }]
        };
      }
      return truck;
    });
    
    setTrucks(updatedTrucks);
    setShowAddToll(false);
    setNewTollEntry({
      truckId: '',
      date: '',
      location: '',
      amount: ''
    });
  };

  const TollsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Toll Payments Overview</h2>
        <Button onClick={() => setShowAddToll(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Toll Entry
        </Button>
      </div>
      
      <Card>
        <CardContent className="space-y-6 pt-6">
          {trucks.map(truck => (
            <div key={truck.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Truck #{truck.id} - {truck.driver}</h3>
              <p className="text-lg text-blue-600 font-semibold mb-4">
                Total Tolls Paid: ₹{truck.tollsPaid}
              </p>
              <div className="max-h-40 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Location</th>
                      <th className="pb-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {truck.tollHistory.map((toll, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2">{toll.date}</td>
                        <td>{toll.location}</td>
                        <td>₹{toll.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={showAddToll} onOpenChange={setShowAddToll}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Toll Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="truckId">Select Truck</Label>
              <Select 
                onValueChange={(value) => setNewTollEntry({...newTollEntry, truckId: value})}
                value={newTollEntry.truckId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a truck" />
                </SelectTrigger>
                <SelectContent>
                  {trucks.map(truck => (
                    <SelectItem key={truck.id} value={truck.id.toString()}>
                      Truck #{truck.id} - {truck.driver}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newTollEntry.date}
                onChange={(e) => setNewTollEntry({...newTollEntry, date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newTollEntry.location}
                onChange={(e) => setNewTollEntry({...newTollEntry, location: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={newTollEntry.amount}
                onChange={(e) => setNewTollEntry({...newTollEntry, amount: e.target.value})}
              />
            </div>
            <Button onClick={handleAddToll}>Add Toll Entry</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const EfficiencyView = () => (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold flex items-center">
          <Fuel className="mr-2" />
          Fuel Efficiency Analytics
        </h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {trucks.map(truck => (
            <div key={truck.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Truck #{truck.id} - {truck.driver}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Fuel Efficiency</p>
                  <p className="text-lg font-semibold">{truck.fuelEfficiency} km/L</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Distance</p>
                  <p className="text-lg font-semibold">{truck.totalDistance} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fuel Consumed</p>
                  <p className="text-lg font-semibold">{truck.fuelConsumed} L</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Fuel Level</p>
                  <p className="text-lg font-semibold">{truck.fuelLevel}%</p>
                </div>
              </div>
              <Progress value={truck.fuelEfficiency * 10} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const FleetView = () => (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold flex items-center">
          <Truck className="mr-2" />
          Fleet Management
        </h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {trucks.map(truck => (
            <div 
              key={truck.id} 
              className="border p-6 rounded-lg hover:shadow-lg transition duration-300 cursor-pointer"
              onClick={() => setSelectedTruck(truck)}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Truck #{truck.id}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  truck.status === 'In Transit' ? 'bg-green-100 text-green-800' :
                  truck.status === 'Loading' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {truck.status}
                </span>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {truck.driver}
                </p>
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {truck.location}
                </p>
                <p className="flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  {truck.parcels.length} parcels
                </p>
                <div className="mt-4">
                  <label className="text-xs text-gray-500 mb-1 block">Fuel Level</label>
                  <Progress value={truck.fuelLevel} className="h-2" />
                  <p className="text-right text-xs mt-1">{truck.fuelLevel}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {showAlert && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              One or more trucks have low fuel levels. Please address this issue immediately.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <Button 
              variant={viewMode === 'fleet' ? 'default' : 'outline'}
              onClick={() => setViewMode('fleet')}
            >
              <Truck className="mr-2 h-4 w-4" />
              Fleet View
            </Button>
            <Button 
              variant={viewMode === 'tolls' ? 'default' : 'outline'}
              onClick={() => setViewMode('tolls')}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Toll Payments
            </Button>
            <Button 
              variant={viewMode === 'efficiency' ? 'default' : 'outline'}
              onClick={() => setViewMode('efficiency')}
            >
              <Fuel className="mr-2 h-4 w-4" />
              Fuel Efficiency
            </Button>
          </div>
          
          <Dialog open={showAddTruck} onOpenChange={setShowAddTruck}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Truck
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Truck</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="driver">Driver Name</Label>
                  <Input
                    id="driver"
                    value={newTruck.driver}
                    onChange={(e) => setNewTruck({...newTruck, driver: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="route">Route</Label>
                  <Input
                    id="route"
                    value={newTruck.route}
                    onChange={(e) => setNewTruck({...newTruck, route: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Current Location</Label>
                  <Input
                    id="location"
                    value={newTruck.location}
                    onChange={(e) => setNewTruck({...newTruck, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="nextStop">Next Stop</Label>
                  <Input
                    id="nextStop"
                    value={newTruck.nextStop}
                    onChange={(e) => setNewTruck({...newTruck, nextStop: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    onValueChange={(value) => setNewTruck({...newTruck, status: value})}
                    value={newTruck.status}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ready">Ready</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Loading">Loading</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddTruck}>Add Truck</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {viewMode === 'fleet' && <FleetView />}
        {viewMode === 'tolls' && <TollsView />}
        {viewMode === 'efficiency' && <EfficiencyView />}

        {selectedTruck && (
          <Dialog open={!!selectedTruck} onOpenChange={() => setSelectedTruck(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Truck #{selectedTruck.id} Details</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <Label className="font-semibold">Driver</Label>
                    <p>{selectedTruck.driver}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Route</Label>
                    <p>{selectedTruck.route}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Status</Label>
                    <p>{selectedTruck.status}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Location</Label>
                    <p>{selectedTruck.location}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Next Stop</Label>
                    <p>{selectedTruck.nextStop}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label className="font-semibold">Fuel Level</Label>
                    <p>{selectedTruck.fuelLevel}%</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Parcels</Label>
                    <p>{selectedTruck.parcels.join(', ') || 'No parcels'}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Estimated Arrival</Label>
                    <p>{selectedTruck.estimatedArrival}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Temperature</Label>
                    <p>{selectedTruck.temperature}°C</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Humidity</Label>
                    <p>{selectedTruck.humidity}%</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Distance</p>
                    <p className="font-semibold">{selectedTruck.totalDistance} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fuel Efficiency</p>
                    <p className="font-semibold">{selectedTruck.fuelEfficiency} km/L</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Tolls Paid</p>
                    <p className="font-semibold">₹{selectedTruck.tollsPaid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fuel Consumed</p>
                    <p className="font-semibold">{selectedTruck.fuelConsumed} L</p>
                  </div>
                </div>
              </div>
              <Button onClick={() => setSelectedTruck(null)}>Close</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
