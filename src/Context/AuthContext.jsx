import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the constant user object with the specified details
const defaultUser = {
  id: '1',
  email: 'bourjmoulouk@gmail.com',
  password: 'bourjmoulouk$$$',
  name: 'Charbel Alhajj',
  phonenumber: '+96171328893',
};

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

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Login user - only checks against the default user
  const signin = (email, password) => {
    if (email === defaultUser.email && password === defaultUser.password) {
      // Don't store password in currentUser state for security
      const { password, ...userWithoutPassword } = defaultUser;
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
    signin,
    signout,
    isAuthenticated: !!currentUser,
    // Including defaultUser (without password) to be used in components
    defaultUser: {
      id: defaultUser.id,
      email: defaultUser.email,
      name: defaultUser.name,
      phonenumber: defaultUser.phonenumber,
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
