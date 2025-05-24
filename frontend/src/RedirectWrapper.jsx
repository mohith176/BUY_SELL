// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const RedirectWrapper = ({ children }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/profile");
//     }
//   }, [navigate]);

//   return children;
// };

// export default RedirectWrapper;
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