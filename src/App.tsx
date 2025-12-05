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
import ProductOrderManagement from "./pages/AdminPages/AllOrders";
import AnalyticsPage from "./pages/AdminPages/AnalyticsPage";
import AllWebinarsWm from "./pages/WebinarManegerPages/MyWebinars";
import MentorDashboard from "./pages/WebinarManegerPages/MentorDashboard";
import MyWebinars from "./pages/WebinarManegerPages/MyWebinars";
import MentorCalendar from "./pages/WebinarManegerPages/MentorCalendar";
import AllMentors from "./pages/AdminPages/Mentors";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsAndConditions from "./pages/terms";
import About from "./pages/about";
import Terms from "./pages/terms";
import AdminPackagesManagement from "./pages/AdminPages/AllPackages";
import AdminTasksManagement from "./pages/AdminPages/TaskManeger";
import AdminYogaSchedule from "./pages/AdminPages/AdminYogaSchedule";
import YogaScheduleCalendar from "./components/userComponents/YogaScheduleCalendar";


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
            <Route path="/admin/packages" element={<ProtectedRoute><AdminPackagesManagement /></ProtectedRoute>} />
            <Route path="/admin/webinars" element={<ProtectedRoute><AllWebinars /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/audit-log" element={<ProtectedRoute><Audit /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProductOrderManagement />} />
            <Route path="/admin-analysis" element={<AnalyticsPage />} />
            <Route path="/admin-all-mentors" element={<AllMentors />} />
            <Route path="/admin-tasks-management" element={<AdminTasksManagement />} />
            <Route path="/admin-yoga-schedule" element={<AdminYogaSchedule/>} />
            
            {/* Executive Routes */}
            <Route path="/exexutive-dashboard" element={<ProtectedRoute><ExexutiveDashboard /></ProtectedRoute>} />
            <Route path="/executive/referrals" element={<ProtectedRoute><AllRefUsers /></ProtectedRoute>} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Webinar Manager Routes */}
            <Route path="/Mentor-dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
            <Route path="/Mentor/my-webinars" element={<ProtectedRoute><MyWebinars /></ProtectedRoute>} />
            <Route path="/Mentor/Calendar" element={<ProtectedRoute><MentorCalendar /></ProtectedRoute>} />
            
            {/* General Routes */}
            <Route path="/login" element={<Login1 />} />
            <Route path="/landing-page" element={<LandingPage />} />
            <Route path="/Psudopage" element={<Psudopage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about" element={<About />} />
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