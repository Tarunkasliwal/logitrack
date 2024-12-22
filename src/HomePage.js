import React, { useState } from 'react';
import { Card } from './components/ui/Card';
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

import { 
  Mail, 
  Lock, 
  Truck, 
  Package, 
  BarChart3, 
  Clock, 
  X, 
  UserCircle,
  Loader2,
  BoxIcon
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const HomePage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '', 
    password: '', 
    role: 'customer' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic Frontend Validation
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare the request body
      const body = isRegistering
        ? {
            email: credentials.email,
            password: credentials.password,
            role: credentials.role,
          }
        : {
            email: credentials.email,
            password: credentials.password,
          };

      // Make the API request
      const response = await fetch(
        isRegistering ? `${API_BASE_URL}/api/auth/register` : `${API_BASE_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Handle successful registration or login
      if (isRegistering) {
        register(data); // Stores user and token
        navigate(`/welcome`);
      } else {
        login(data); // Stores user and token
        navigate(`/${credentials.role}`);
      }
    } catch (err) {
      setError(
        isRegistering
          ? err.message || 'Registration failed. Please try again.'
          : err.message || 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    setCredentials({ ...credentials, role: e.target.value });
  };

  const features = [
    {
      icon: <Truck className="w-12 h-12 text-blue-500" />,
      title: "Real-time Fleet Tracking",
      description: "Monitor your entire fleet in real-time with precision GPS tracking"
    },
    {
      icon: <Package className="w-12 h-12 text-purple-500" />,
      title: "Package Management",
      description: "Streamline package handling with smart inventory management"
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-pink-500" />,
      title: "Analytics Dashboard",
      description: "Gain valuable insights with comprehensive analytics"
    },
    {
      icon: <Clock className="w-12 h-12 text-indigo-500" />,
      title: "Delivery Optimization",
      description: "AI-powered route optimization for faster deliveries"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
            style={{
              width: Math.random() * 400 + 100 + 'px',
              height: Math.random() * 400 + 100 + 'px',
              background: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255, 0.3)`,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 bg-white/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-white p-2 rounded-lg">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Logi<span className="text-blue-300">Track</span>
            </h1>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => {
                setIsRegistering(false);
                setIsModalOpen(true);
              }}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-lg transition-all duration-300"
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsRegistering(true);
                setIsModalOpen(true);
              }}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          <h2 className="text-6xl font-bold text-white mb-6 tracking-tight">
            Next-Gen Logistics Management
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Transform your logistics operations with AI-powered tracking, real-time analytics, and intelligent route optimization.
          </p>
          <button
            onClick={() => {
              setIsRegistering(true);
              setIsModalOpen(true);
            }}
            className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold shadow-xl hover:transform hover:scale-105 transition-all duration-300"
          >
            Start
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-white/10 backdrop-blur-lg border-none text-white hover:transform hover:scale-105 transition-all duration-300">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="mt-24 grid grid-cols-3 gap-8 text-center">
          {[
            { value: "10M+", label: "Deliveries Tracked" },
            { value: "99.9%", label: "Delivery Success Rate" },
            { value: "50K+", label: "Active Users" }
          ].map((stat, index) => (
            <div key={index} className="p-6 rounded-lg bg-white/5 backdrop-blur-lg">
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="max-w-md w-full space-y-8 bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                    <Package className="h-16 w-16 text-white" />
                  </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  {isRegistering ? 'Sign up for LogiTrack' : 'Welcome to LogiTrack'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  {isRegistering ? 'Create a new account' : 'Sign in to access your account'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                <div className="relative">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email address
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="you@example.com"
                      value={credentials.email}
                      onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="relative">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                  </div>
                </div>

                {isRegistering && (
                  <div className="relative">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                      Role
                    </Label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="role"
                        value={credentials.role}
                        onChange={handleRoleChange}
                        className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md appearance-none"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="driver">Driver</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  isRegistering ? 'Sign up' : 'Sign in'
                )}
              </Button>
            </form>

            <div className="text-center">
              {isRegistering ? (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsRegistering(false)}
                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p>
                  New to LogiTrack?{' '}
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
