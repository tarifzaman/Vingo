import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Added Route import
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
export const serverUrl = "http://localhost:8000"
const App = () => {
  return (
    <Routes>
      {/* The path is the URL in the browser, element is the React UI component */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
     
    </Routes>
  );
};

export default App;