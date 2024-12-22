import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage'; // Import HomePage
import Login from './Login';
import CustomerDashboard from './CustomerDashboard';
import AdminDashboard from './AdminDashboard';
import DriverDashboard from './DriverDashboard';
import { AuthProvider, ProtectedRoute } from './AuthProvider';

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
        <Routes>
          {/* HomePage is set as the default route */}
          <Route path="/" element={<HomePage />} />

          {/* Login page
          <Route path="/login" element={<Login />} /> */}

          {/* Customer dashboard with protected route */}
          <Route 
            path="/customer/*" 
            element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin dashboard with protected route */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Driver dashboard with protected route */}
          <Route 
            path="/driver/*" 
            element={
              <ProtectedRoute role="driver">
                <DriverDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Redirect any unknown route to homepage */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
