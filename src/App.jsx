// import React from 'react';
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from 'react-router-dom';
// import { AuthProvider, useAuth } from './Context/AuthContext';
// import SignUp from './components/SignUp';
// import Dashboard from './components/Dashborad';
// import SignIn from './components/LogIn';
// import ElectionsDashboard from './components/ElectionsDashboard';

// // Protected Route component
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();

//   if (!isAuthenticated) {
//     return <Navigate to='/signin' />;
//   }

//   return children;
// };

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path='/signin' element={<SignIn />} />
//       <Route path='/signup' element={<SignUp />} />
//       <Route
//         path='/dashboard'
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path='/electionsDashboard'
//         element={
//           <ProtectedRoute>
//             <ElectionsDashboard />
//           </ProtectedRoute>
//         }
//       />
//       {/* Redirect root to signin */}
//       <Route path='/' element={<Navigate to='/signin' />} />
//       {/* Catch all route - redirect to signin */}
//       <Route path='*' element={<Navigate to='/signin' />} />
//     </Routes>
//   );
// };

// const App = () => {
//   return (
//     <Router>
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </Router>
//   );
// };

// export default App;

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
import SignIn from './components/LogIn';
import ElectionsDashboard from './components/ElectionsDashboard';
import CategorizedDataViewer from './components/VIsiliazeData'; // Import the new component

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

      <Route
        path='/electionsDashboard'
        element={
          <ProtectedRoute>
            <ElectionsDashboard />
          </ProtectedRoute>
        }
      />

      {/* Add the new route for CategorizedDataViewer */}
      <Route
        path='/data-viewer'
        element={
          <ProtectedRoute>
            <CategorizedDataViewer />
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
