import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import LoadingScreen from "./components/LoadingScreen.tsx/LoadingScreen";
import Dashboard from "./pages/UserPages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Login1 from "./pages/Login";
import AdminLogin from "./pages/AdminPages/AdminLogin";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./pages/ProtectedRoute";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import Psudopage from "./pages/Psudopage";
import AllUsers from "./pages/AdminPages/AllUsers";
import ExexutiveDashboard from "./pages/ExecutivePages/exeDashboard";
import AllExecutive from "./pages/AdminPages/AllExecutive";
import AllPackages from "./pages/AdminPages/AllPackages";
import AllWebinars from "./pages/AdminPages/AllWebinar";
import AdminSettings from "./pages/AdminPages/Settings";
import Audit from "./pages/AdminPages/Audit";
import Notifications from "./pages/AdminPages/Notification";
import AllRefUsers from "./pages/ExecutivePages/AllRefUsers";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  // Initial loader duration
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* Routes render immediately but are covered by loader */}
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={isLoggedIn ? <Dashboard /> : <LandingPage />}
            />
            
            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/all-users" element={<ProtectedRoute><AllUsers /></ProtectedRoute>} />
            <Route path="/admin/executives" element={<ProtectedRoute><AllExecutive /></ProtectedRoute>} />
            <Route path="/admin/packages" element={<ProtectedRoute><AllPackages /></ProtectedRoute>} />
            <Route path="/admin/webinars" element={<ProtectedRoute><AllWebinars /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/audit-log" element={<ProtectedRoute><Audit /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            
            {/* Executive Routes */}
            <Route path="/exexutive-dashboard" element={<ProtectedRoute><ExexutiveDashboard /></ProtectedRoute>} />
            <Route path="/executive/referrals" element={<ProtectedRoute><AllRefUsers /></ProtectedRoute>} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* General Routes */}
            <Route path="/login" element={<Login1 />} />
            <Route path="/landing-page" element={<LandingPage />} />
            <Route path="/Psudopage" element={<Psudopage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        {/* LoadingScreen sits on top and unmounts when done */}
        {showLoader && (
          <LoadingScreen
            isLoading={loading}
            onFinish={() => setShowLoader(false)}
          />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;