import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Register a new user
  const signup = (userData) => {
    // Check if email already exists
    const emailExists = users.some((user) => user.email === userData.email);
    if (emailExists) {
      throw new Error('البريد الإلكتروني مسجل بالفعل');
    }

    // Add new user to the users array
    const newUser = {
      id: Date.now().toString(),
      ...userData,
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    return { success: true };
  };

  // Login user
  const signin = (email, password) => {
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Don't store password in currentUser state for security
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      return { success: true };
    } else {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  // Logout user
  const signout = () => {
    setCurrentUser(null);
  };

  // Context value
  const value = {
    currentUser,
    users,
    signup,
    signin,
    signout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
