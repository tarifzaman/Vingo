import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Added Route import
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';
export const serverUrl = "http://localhost:8000"
const App = () => {
  return (
    <Routes>
      {/* The path is the URL in the browser, element is the React UI component */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
     
    </Routes>
  );
};

export default App;