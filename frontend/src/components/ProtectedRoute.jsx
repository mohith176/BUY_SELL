import React from 'react';
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? (
    <>
      <Navbar /> {/* Include Navbar in all protected pages */}
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
