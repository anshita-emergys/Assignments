import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoutes = ({ requiredAdmin, requiredDoctor }) => {
  const { token, adminMessage, doctorMessage } = useSelector(
    (state) => state.auth
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredAdmin && adminMessage !== 1) {
    return <Navigate to="/user" replace />;
  }
  if (!requiredAdmin && adminMessage === 1) {
    return <Navigate to="/admin" replace />;
  }

  if (requiredDoctor && doctorMessage !== 1) {
    return <Navigate to="/user" replace />;
  }
  if (!requiredDoctor && doctorMessage === 1) {
    return <Navigate to="/doctor" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
