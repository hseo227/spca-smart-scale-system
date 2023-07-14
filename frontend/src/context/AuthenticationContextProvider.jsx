/* eslint-disable react/prop-types */
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthenticationContext from './AuthenticationContext';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * This is a Context Provider made with the React Context API
 * AuthenticationContext grants access to functions and variables related to Firebase login
 */
export default function AuthenticationContextProvider({ children }) {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  async function getUserIdToken() {
    if (user) {
      const token = await user.getIdToken(true);
      return token;
    }

    return null;
  }

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
    }
  };
  const signup = async (email, password, fullName, centre, role) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const response = await axios.post('http://localhost:5001/api/user/', {
        name: fullName,
        email: email,
        role: role,
        centre: centre,
      });
      const userID = response.data._id;
      await axios.put(`http://localhost:5001/api/centre/people/:${centre}`, {
        id: userID,
      });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  function logout() {
    navigate('/login');
    auth.signOut();
    console.log('logged out');
  }

  // creating user object with role property
  const contextValue = {
    user,
    login,
    logout,
    signup,
    getUserIdToken,
    error,
  };

  return (
    <AuthenticationContext.Provider value={contextValue}>
      {!loading && children}
    </AuthenticationContext.Provider>
  );
}
