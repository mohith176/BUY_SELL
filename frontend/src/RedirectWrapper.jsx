import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RedirectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && (location.pathname === "/login" || location.pathname === "/create")) {
      navigate("/profile");
    }
  }, [navigate, location]);

  return children;
};

export default RedirectWrapper;