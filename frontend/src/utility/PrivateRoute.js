import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const authenticated = false;
  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
