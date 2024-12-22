import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Shield, 
  Fuel, 
  User, 
  Bell, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { Card, CardHeader, CardContent } from './components/ui/Card';
import { Alert, AlertDescription } from './components/ui/alert';
import { Badge } from './components/ui/Badge';
import { Progress } from './components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/Tabs';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DashboardLayout } from './DashboardLayout';
import ReactTooltip from 'react-tooltip';

// Fix the icon issue by importing marker assets manually
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Set default marker options to fix the icon issue
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Memoized FleetCard Component
const FleetCard = React.memo(({ truck, onClick }) => (
  <Card 
    className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Truck className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold">Truck #{truck.id}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          truck.status === 'In Transit' ? 'bg-green-100 text-green-800' :
          truck.status === 'Loading' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {truck.status}
        </span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center text-gray-600">
          <User className="h-4 w-4 mr-3 text-blue-500" />
          <span className="font-medium">{truck.driver}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-3 text-blue-500" />
          <span>{truck.location}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Package className="h-4 w-4 mr-3 text-blue-500" />
          <span>{truck.parcels.length} parcels</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Fuel Level</span>
            <span>{truck.fuelLevel}%</span>
          </div>
          <Progress 
            value={truck.fuelLevel} 
            className="h-2"
            indicatorClassName={`${
              truck.fuelLevel < 20 ? 'bg-red-500' :
              truck.fuelLevel < 50 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
          />
        </div>
      </div>
    </CardContent>
  </Card>
));

// Memoized TollCard Component
const TollCard = React.memo(({ truck }) => (
  <Card className="overflow-hidden">
    <CardContent className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-green-500 mr-2" />
          <h3 className="text-lg font-semibold">Tolls for Truck #{truck.id}</h3>
        </div>
        <span className="text-lg font-semibold text-green-600">
          ₹{truck.tollsPaid}
        </span>
      </div>
      
      <div className="max-h-48 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="py-2 px-4">Location</th>
              <th className="py-2 px-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {truck.tolls.map((toll, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4">{toll.location}</td>
                <td className="py-2 px-4">₹{toll.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
));

const DriverDashboard = () => {
  // Driver Information
  const [driverInfo, setDriverInfo] = useState({
    name: "Rajesh Kumar",
    id: "DR001",
    vehicleNumber: "MH 01 AB 1234",
    status: "On Duty",
    lastBreak: "2 hours ago",
    hoursWorked: "6:30",
    avatar: "https://via.placeholder.com/48" // Replaced with a valid placeholder image
  });

  // Route Information
  const [route, setRoute] = useState({
    source: 'Mumbai',
    destination: 'New Delhi',
    currentLocation: 'Nashik',
    stops: [
      { location: 'Mumbai', status: 'completed', eta: null, parcels: 50, coords: [19.0760, 72.8777], weather: { temp: 32, condition: 'Clear' } },
      { location: 'Nashik', status: 'current', eta: null, parcels: 30, coords: [20.0059, 73.7897], weather: { temp: 30, condition: 'Cloudy' } },
      { location: 'Indore', status: 'pending', eta: '2024-10-07 14:30', parcels: 40, coords: [22.7196, 75.8577], weather: { temp: 35, condition: 'Sunny' } },
      { location: 'Agra', status: 'pending', eta: '2024-10-08 16:45', parcels: 25, coords: [27.1767, 78.0081], weather: { temp: 33, condition: 'Partly Cloudy' } },
      { location: 'New Delhi', status: 'pending', eta: '2024-10-09 10:00', parcels: 0, coords: [28.6139, 77.2090], weather: { temp: 31, condition: 'Clear' } }
    ],
    totalDistance: 1420, // km
    distanceCovered: 680, // km
    estimatedFuel: 180, // liters
    fuelEfficiency: '8.5 km/l'
  });

  // Alerts
  const [alerts, setAlerts] = useState([
    { type: 'warning', message: 'Heavy traffic expected on NH44' },
    { type: 'info', message: 'Scheduled maintenance in 500km' }
  ]);

  // Directions for Polyline
  const directions = useMemo(() => [
    [19.0760, 72.8777], // Mumbai
    [20.0059, 73.7897], // Nashik
    [22.7196, 75.8577], // Indore
    [27.1767, 78.0081], // Agra
    [28.6139, 77.2090]  // New Delhi
  ], []);

  // Tolls Information
  const [tolls, setTolls] = useState([
    { location: 'Nashik Toll Plaza', amount: 200 },
    { location: 'Indore Toll Plaza', amount: 150 },
    { location: 'Agra Toll Plaza', amount: 175 }
  ]);
  
  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map Center
  const [mapCenter, setMapCenter] = useState([22.5937, 78.9629]); // Center of India

  // Fuel Tracking
  const [fuelLevel, setFuelLevel] = useState(100); // Percentage
  const [fuelConsumedToday, setFuelConsumedToday] = useState(0); // Liters

  // Define map bounds for India
  const indianBounds = [
    [8.4, 68.7], // Southwest coordinates
    [37.6, 97.25] // Northeast coordinates
  ];

  // Function to get color based on stop status
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }, []);

  // Initialize data (can be replaced with API calls)
  const initializeData = useCallback(() => {
    // Simulate data fetching delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Simulate real-time updates (e.g., driver moving to next stop)
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoute(prevRoute => {
        const currentIndex = prevRoute.stops.findIndex(stop => stop.status === 'current');
        if (currentIndex < prevRoute.stops.length - 1) {
          const updatedStops = prevRoute.stops.map((stop, index) => {
            if (index === currentIndex) return { ...stop, status: 'completed' };
            if (index === currentIndex + 1) return { ...stop, status: 'current' };
            return stop;
          });

          // Update distance covered (Assuming distance between stops is 100km for simulation)
          const distanceCovered = (currentIndex + 1) * 100;
          
          // Update fuel consumed
          const fuelConsumed = parseFloat((distanceCovered / parseFloat(prevRoute.fuelEfficiency)).toFixed(2));
          setFuelConsumedToday(fuelConsumed);
          setFuelLevel(prevFuel => Math.max(prevFuel - (fuelConsumed / 100) * 100, 0));

          // Update map center
          const newCurrentStop = updatedStops.find(stop => stop.status === 'current');
          if (newCurrentStop) {
            setMapCenter(newCurrentStop.coords);
          }

          return { ...prevRoute, stops: updatedStops, distanceCovered: distanceCovered };
        }
        return prevRoute;
      });
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, [route.fuelEfficiency]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={driverInfo.avatar} alt="Driver" className="rounded-full w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold">{driverInfo.name}</h1>
            <div className="flex space-x-2 text-sm text-gray-600">
              <Badge variant="secondary">{driverInfo.id}</Badge>
              <Badge variant="secondary">{driverInfo.vehicleNumber}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="success" className="px-3 py-1">
            {driverInfo.status}
          </Badge>
          <Clock className="text-gray-500" />
          <span>{driverInfo.hoursWorked} hrs</span>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="mb-6 space-y-2">
        {alerts.map((alert, index) => (
          <Alert key={index} variant={alert.type === 'warning' ? 'destructive' : 'default'}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="route">Route</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Journey Progress Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Truck className="mr-2" /> Journey Progress
              </h2>
            </CardHeader>
            <CardContent>
              <Progress value={(route.distanceCovered / route.totalDistance) * 100} className="mb-4" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-500">Distance Covered</div>
                  <div className="text-xl font-bold">{route.distanceCovered} km</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Remaining</div>
                  <div className="text-xl font-bold">{route.totalDistance - route.distanceCovered} km</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fuel Efficiency</div>
                  <div className="text-xl font-bold">{route.fuelEfficiency}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fuel Tracking Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Fuel className="mr-2" /> Fuel Tracking
              </h2>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-sm text-gray-500">Fuel Level</div>
                <Progress value={fuelLevel} className="h-4" />
                <div className="text-right text-sm text-gray-600">{fuelLevel}% Remaining</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Fuel Consumed Today</div>
                <div className="text-xl font-bold">{fuelConsumedToday} L</div>
              </div>
            </CardContent>
          </Card>

          {/* Stops Timeline Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <MapPin className="mr-2" /> Stops Timeline
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {route.stops.map((stop, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(stop.status)}`} />
                    <div className="flex-1">
                      <div className="font-semibold">{stop.location}</div>
                      {stop.eta && <div className="text-sm text-gray-500">ETA: {stop.eta}</div>}
                      <div className="text-sm text-gray-500">Parcels: {stop.parcels}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{stop.weather.temp}°C</div>
                      <div className="text-sm text-gray-500">{stop.weather.condition}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="route" className="space-y-6">
          {/* Route Map Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <MapPin className="mr-2" /> Route Map
              </h2>
            </CardHeader>
            <CardContent>
              <MapContainer 
                center={mapCenter} 
                zoom={6} 
                className="h-96 w-full"
                maxBounds={indianBounds}
                minZoom={4}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                  bounds={indianBounds}
                />
                {directions.length > 0 && <Polyline positions={directions} color="blue" />}
                {route.stops.map((stop, index) => (
                  <Marker key={index} position={stop.coords}>
                    <Popup>
                      <strong>{stop.location}</strong>
                      <br />
                      {stop.weather.temp}°C, {stop.weather.condition}
                      {stop.parcels > 0 && <div>Parcels to deliver: {stop.parcels}</div>}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </CardContent>
          </Card>

          {/* Tolls Information Card */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center">
                <Shield className="mr-2" /> Tolls Information
              </h2>
            </CardHeader>
            <CardContent>
              <div>
                <div className="mb-4 text-lg font-bold flex justify-between items-center">
                  <span>Total Toll Cost:</span>
                  <span>₹{tolls.reduce((acc, toll) => acc + toll.amount, 0)}</span>
                </div>
                <ul className="space-y-2">
                  {tolls.map((toll, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{toll.location}</span>
                      <span>₹{toll.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default DriverDashboard;




