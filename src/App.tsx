
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/testLogin";
import AdminLogin from "./pages/AdminPages/AdminLogin";
import Register from "./pages/Register";
import Dashboard from "./pages/UserPages/Dashboard";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Login1 from "./pages/Login";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
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


const queryClient = new QueryClient();
const isLoggedIn = localStorage.getItem("loggedIn");
     

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isLoggedIn == "true" ? <Dashboard  />: <LandingPage/>}/>
          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/all-users" element={<AllUsers />} />
          <Route path="/admin/executives" element={<AllExecutive />} />
          <Route path="/admin/packages" element={<AllPackages />} />
          <Route path="/admin/webinars" element={<AllWebinars />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Executive Routes */}
          <Route path="/exexutive-dashboard" element={<ExexutiveDashboard />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Genral Routes */}
          <Route path="/login" element={<Login1/>} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/Psudopage" element={<Psudopage/>} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/audit-log" element={<Audit/>} />
          <Route path="/admin/notifications" element={<Notifications />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
