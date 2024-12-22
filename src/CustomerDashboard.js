import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Package, DollarSign, Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardContent } from './components/ui/Card';
import { Alert, AlertDescription } from './components/ui/alert';
import { DashboardLayout } from './DashboardLayout';
import { useAuth } from './AuthProvider'; // Ensure AuthProvider is correctly set up

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const CustomerDashboard = () => {
  const { user } = useAuth(); // Access user and token from AuthProvider
  const [parcelDetails, setParcelDetails] = useState({
    weight: '',
    source: '',
    destination: '',
    type: 'regular',
    insurance: false,
    priority: false,
    description: ''
  });

  const [parcels, setParcels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch parcels from backend on component mount
  useEffect(() => {
    const fetchParcels = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/parcels`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`, // Include JWT token
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch parcels');
        }

        // Ensure data is an array
        if (!Array.isArray(data)) {
          setParcels([]);
        } else {
          setParcels(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParcels();
  }, [user.token]);

  // Calculate estimated price based on parcel details
  const calculatePrice = () => {
    const basePrice = 100;
    const weightPrice = parcelDetails.weight * 10;
    const insurancePrice = parcelDetails.insurance ? 50 : 0;
    const priorityPrice = parcelDetails.priority ? 100 : 0;
    return basePrice + weightPrice + insurancePrice + priorityPrice;
  };

  // Handle form submission to create a new parcel
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic Frontend Validation
    if (!parcelDetails.weight || !parcelDetails.source || !parcelDetails.destination) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/parcels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`, // Include JWT token
        },
        body: JSON.stringify(parcelDetails),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create parcel');
      }

      // Update parcels list with the newly created parcel
      setParcels([data, ...parcels]);

      // Reset form fields
      setParcelDetails({ 
        weight: '', 
        source: '', 
        destination: '', 
        type: 'regular', 
        insurance: false,
        priority: false,
        description: ''
      });

      // Show success alert
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter parcels based on search query
  const query = (searchQuery || '').toLowerCase();

  const filteredParcels = parcels.filter(parcel => {
    const id = parcel.id ? parcel.id.toString().toLowerCase() : '';
    const status = parcel.status ? parcel.status.toLowerCase() : '';
    const location = parcel.location ? parcel.location.toLowerCase() : '';

    return id.includes(query) || status.includes(query) || location.includes(query);
  });

  // Determine status color for UI
  const getStatusColor = (status) => {
    const statusString = status ? status.toLowerCase() : '';
    switch (statusString) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in transit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Success Alert */}
        {showSuccessAlert && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              Parcel created successfully! Track it in the parcels list below.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Send New Parcel Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 className="text-xl font-semibold flex items-center text-blue-800">
                <Package className="mr-2" />
                Send New Parcel
              </h2>
            </CardHeader>
            <CardContent className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Parcel Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight (kg) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={parcelDetails.weight}
                      onChange={(e) => setParcelDetails({ ...parcelDetails, weight: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Source <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={parcelDetails.source}
                      onChange={(e) => setParcelDetails({ ...parcelDetails, source: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Destination <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={parcelDetails.destination}
                    onChange={(e) => setParcelDetails({ ...parcelDetails, destination: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={parcelDetails.description}
                    onChange={(e) => setParcelDetails({ ...parcelDetails, description: e.target.value })}
                    rows={3}
                    placeholder="Describe your parcel contents..."
                  />
                </div>

                {/* Additional Options */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="insurance"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={parcelDetails.insurance}
                      onChange={(e) => setParcelDetails({ ...parcelDetails, insurance: e.target.checked })}
                    />
                    <label htmlFor="insurance" className="ml-2 block text-sm text-gray-700">
                      Add Insurance (+₹50)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="priority"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={parcelDetails.priority}
                      onChange={(e) => setParcelDetails({ ...parcelDetails, priority: e.target.checked })}
                    />
                    <label htmlFor="priority" className="ml-2 block text-sm text-gray-700">
                      Priority Delivery (+₹100)
                    </label>
                  </div>
                </div>

                {/* Estimated Price */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-md">
                  <p className="text-lg font-semibold flex items-center text-blue-800">
                    <DollarSign className="mr-2" />
                    Estimated Price: ₹{calculatePrice()}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-blue-800 transition duration-200 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Parcel'
                  )}
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Track Your Parcels Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 className="text-xl font-semibold flex items-center text-blue-800">
                <Truck className="mr-2" />
                Track Your Parcels
              </h2>
              {/* Search Bar */}
              <div className="mt-4 relative">
                <input
                  type="text"
                  placeholder="Search parcels..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              {/* Parcels List */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {filteredParcels.map(parcel => (
                  <div 
                    key={parcel._id} 
                    className="border p-4 rounded-lg hover:shadow-md transition duration-200 cursor-pointer"
                    onClick={() => setSelectedParcel(selectedParcel?.id === parcel._id ? null : parcel)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Parcel #{parcel.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(parcel.status)}`}>
                        {parcel.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Current Location: {parcel.location || 'Unknown'}
                      </p>
                      <p className="mt-1 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Expected Delivery: {parcel.eta ? new Date(parcel.eta).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    
                    {/* Tracking Updates */}
                    {selectedParcel?.id === parcel._id && parcel.updates && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium mb-2">Tracking Updates</h4>
                        <div className="space-y-2">
                          {parcel.updates.map((update, index) => (
                            <div key={index} className="flex items-start space-x-2 text-sm">
                              <div className="min-w-[140px] text-gray-500">{new Date(update.time).toLocaleString()}</div>
                              <div>{update.message}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* No Parcels Found */}
                {filteredParcels.length === 0 && !isLoading && (
                  <div className="text-center py-6">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No parcels found matching your search.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
