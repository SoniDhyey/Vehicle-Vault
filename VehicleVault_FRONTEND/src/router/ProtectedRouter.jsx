import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!user) return <Navigate to="/login" />;

  // Wrong role
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;