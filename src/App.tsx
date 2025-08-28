import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './page/login';
import ResetPassword from './page/resetPassword';
import LuckyMap from './page/luckyMap';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { setAuthToken } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={setAuthToken} />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/lucky-map"
        element={
          <ProtectedRoute>
            <LuckyMap />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Navigate to="/lucky-map" replace />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '1rem',
              padding: '1rem',
            },
            success: {
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171',
                secondary: '#fff',
              },
            },
          }}
        />
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;