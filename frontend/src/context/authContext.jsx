import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // Initialize currentUser state from local storage or set to null
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Define login function
  const login = async (inputs) => {
      const res = await axios.post('https://stem-blog.onrender.com/api/auth/login', inputs);
      setCurrentUser(res.data);
  };
  // Define logout function
  const logout = async () => {
    try {
      await axios.post('https://stem-blog.onrender.com/api/auth/logout');
      setCurrentUser(null);
    } catch (error) {
      // Handle logout error here
      console.error('Error logging out:', error);
    }
  };

  // Save currentUser to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Provide context value to children components
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
