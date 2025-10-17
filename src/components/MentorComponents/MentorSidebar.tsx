import {
  Home,
  Calendar,
  Video,
  Clock,
  Users,
  TrendingUp,
  Settings,
  SquareArrowLeft,
  SquareArrowRight,
  LogOut,
  Archive,
  Plus,
  BarChart3,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MentorSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Control sidebar collapse
  const [collapsed, setCollapsed] = useState(true);

  // Sidebar nav items for Webinar Manager
  const navItems = [
    { label: "Dashboard", path: "/Mentor-dashboard", Icon: Home },
    { label: "My Webinars", path: "/Mentor/my-webinars", Icon: Video },
    { label: "Calendar", path: "/Mentor/Calendar", Icon: Calendar },
    // { label: "Reports", path: "/Mentor/reports", Icon: TrendingUp },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 
                  text-white shadow-lg transition-all duration-300
                  ${collapsed ? "w-20" : "w-64"} flex flex-col z-30`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-24 border-b border-purple-600">
        <div
          className="text-lg font-bold cursor-pointer truncate"
          onClick={() => navigate("/WMdashboard")}
        >
          {!collapsed ? "Webinar Manager" : "WM"}
        </div>

        {/* Collapse toggle (visible on md and above) */}
        <button
          className="text-purple-200 hover:text-white focus:outline-none hidden md:inline-block"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <SquareArrowRight /> : <SquareArrowLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto pl-2 mt-4 no-scrollbar"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE
        }}
      >
        <ul>
          {navItems.map(({ label, path, Icon }) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path);
            return (
              <li
                key={label}
                className={`cursor-pointer px-4 py-3 flex items-center gap-3 rounded-l-lg
                           hover:bg-gradient-to-br hover:from-slate-700 hover:to-slate-600 transition-all duration-200
                           ${isActive ? "bg-gradient-to-br from-slate-700 to-slate-600 font-semibold shadow-md" : ""}`}
                onClick={() => navigate(path)}
                title={collapsed ? label : undefined}
              >
                <Icon size={20} />
                {!collapsed && <span className="truncate">{label}</span>}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Optional Logout/Profile */}
      <div className="p-4 border-t border-purple-600">
        {!collapsed ? (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition flex items-center justify-center"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default MentorSidebar;
