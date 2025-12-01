import {
  Home,
  Calendar,
  Video,
  Clock,
  Users,
  TrendingUp,
  Settings,
  Menu,
  X,
  SquareArrowLeft,
  Archive,
  LogOut,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MentorMobileSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(true);

  const navItems = [
    { label: "Dashboard", path: "/mentor-dashboard", Icon: Home },
    { label: "My Webinars", path: "/mentor/my-webinars", Icon: Video },
    { label: "Calendar View", path: "/mentor/calendar", Icon: Calendar },
    // { label: "Reports", path: "/mentor/reports", Icon: TrendingUp },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* Floating Hamburger Button */}
      <button
        className="lg:hidden fixed top-16 left-2 z-50 mt-1 bg-gradient-to-br from-slate-700 to-slate-800 text-white p-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <Menu size={22} /> : <X size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-br from-slate-900  to-slate-800
                    text-white shadow-md transition-all duration-300 z-40
                    ${collapsed ? "w-0 overflow-hidden" : "w-60"} flex flex-col lg:hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-32 border-b border-green-600">
          <div
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/mentor-dashboard")}
          >
            {!collapsed ? "Mentor Panel" : ""}
          </div>
          <div
            className="text-gray-300 hover:text-white cursor-pointer"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
          >
            {!collapsed && <SquareArrowLeft />}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar mt-6 px-2">
          <ul className="flex flex-col space-y-6">
            {navItems.map(({ label, path, Icon }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <li
                  key={label}
                  className={`cursor-pointer px-4 py-3 flex items-center gap-3 text-2xl rounded-md
                              hover:bg-gradient-to-br hover:from-slate-700 hover:to-slate-600 transition-all
                              ${isActive ? "bg-gradient-to-br from-slate-700 to-slate-600 font-semibold shadow-md" : ""}`}
                  onClick={() => {
                    navigate(path);
                    setCollapsed(true); // Auto-close on mobile after navigation
                  }}
                >
                  <Icon />
                  {!collapsed && <span>{label}</span>}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings & Logout Section */}
        <div className="border-t border-green-600">
          

          <div
            className="flex p-6 gap-4 pl-6 text-2xl cursor-pointer hover:bg-red-900 transition-colors text-red-400 hover:text-red-300"
            onClick={handleLogout}
          >
            <span className="pt-1">
              <LogOut size={30} />
            </span>
            Sign Out
          </div>
        </div>
      </aside>

      {/* Overlay - Close sidebar when clicking outside */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        ></div>
      )}
    </div>
  );
};

export default MentorMobileSidebar;
