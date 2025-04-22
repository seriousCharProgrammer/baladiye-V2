import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashborad';
import SignIn from './components/signin';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/signin' />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/signin' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Redirect root to signin */}
      <Route path='/' element={<Navigate to='/signin' />} />
      {/* Catch all route - redirect to signin */}
      <Route path='*' element={<Navigate to='/signin' />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
