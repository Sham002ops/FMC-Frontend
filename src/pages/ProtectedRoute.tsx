import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // match your loader
    return () => clearTimeout(timer);
  }, []);

  if (loading) return null; // block rendering while loader runs

  return isLoggedIn ? children : <Navigate to="/landing-page" replace />;
};

export default ProtectedRoute;
