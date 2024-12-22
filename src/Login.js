import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { PackageIcon, Loader2, Mail, Lock, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { motion } from 'framer-motion';

const LoginRegister = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth(); // Assume there's a register function
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false); // New state to toggle between login and signup

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call

      if (isRegistering) {
        // Call the register function for new users
        await register({ ...credentials, id: Math.random().toString(36).substr(2, 9) });
        navigate(`/welcome`);
      } else {
        // Call the login function for existing users
        login({ ...credentials, id: Math.random().toString(36).substr(2, 9) });
        navigate(`/${credentials.role}`);
      }
    } catch (err) {
      setError(isRegistering ? 'Registration failed. Please try again.' : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    setCredentials({ ...credentials, role: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-2xl"
      >
        <div>
          <motion.div 
            className="flex justify-center"
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <PackageIcon className="h-16 w-16 text-white" />
            </div>
          </motion.div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isRegistering ? 'Sign up for LogiTrack' : 'Welcome to LogiTrack'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isRegistering ? 'Create a new account' : 'Sign in to access your account'}
          </p>
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
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
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
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
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
            <div className="relative">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
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
          </div>

          <div>
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
          </div>
        </form>
        <div className="text-center">
          {isRegistering ? (
            <p>
              Already have an account?{' '}
              <a
                href="#"
                onClick={() => setIsRegistering(false)}
                className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
              >
                Sign in
              </a>
            </p>
          ) : (
            <p>
              New to LogiTrack?{' '}
              <a
                href="#"
                onClick={() => setIsRegistering(true)}
                className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
              >
                Sign up
              </a>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginRegister;
