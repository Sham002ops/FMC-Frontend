import {
  Home,
  Users,
  UserPlus,
  Calendar,
  TrendingUp,
  Award,
  MessageSquare,
  Settings,
  SquareArrowLeft,
  Menu,
  X,
  DollarSign,
  BarChart3,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ExecutiveMobileSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(true);

  const navItems = [
    { label: "Dashboard", path: "/exexutive-dashboard", Icon: Home },
    { label: "My Referrals", path: "/executive/referrals", Icon: Users },
    // { label: "Recruit Users", path: "/executive/recruit", Icon: UserPlus },
    // { label: "Hosted Webinars", path: "/executive/webinars", Icon: Calendar },
    // { label: "Performance", path: "/executive/performance", Icon: TrendingUp },
    // { label: "Commissions", path: "/executive/commissions", Icon: DollarSign },
    // { label: "Analytics", path: "/executive/analytics", Icon: BarChart3 },
    // { label: "Training", path: "/executive/training", Icon: Award },
    // { label: "Support", path: "/executive/support", Icon: MessageSquare },
  ];

  return (
    <div className="relative">
      {/* Floating Hamburger Button */}
      <button
        className="lg:hidden absolute top-20 left-2 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <Menu size={22} /> : <X size={22} />}
      </button>

      {/* Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-br from-slate-900  to-slate-700 
                    text-white shadow-xl transition-all duration-300 z-30
                    ${collapsed ? "w-0 overflow-hidden" : "w-72"} flex flex-col lg:hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-32 border-b border-emerald-500/50">
          <div
            className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent"
            onClick={() => {
              navigate("/exexutive-dashboard");
              setCollapsed(true);
            }}
          >
            Executive Panel
          </div>
          <div
            className="text-purple-300 hover:text-white cursor-pointer transition-colors"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
          >
            <SquareArrowLeft size={24} />
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-4">
          <ul className="flex flex-col space-y-2">
            {navItems.map(({ label, path, Icon }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <li
                  key={label}
                  className={`cursor-pointer px-4 py-4 flex items-center gap-4 text-lg rounded-xl mt-2 transition-all duration-200
                              hover:bg-emerald-800/50 hover:transform hover:scale-105
                              ${isActive ? "bg-gradient-to-r from-emerald-500 to-indigo-700 font-semibold shadow-lg" : ""}`}
                  onClick={() => {
                    navigate(path);
                    setCollapsed(true);
                  }}
                >
                  <Icon size={24} className={isActive ? "text-gray-200" : "text-purple-300"} />
                  <span className={`${isActive ? "text-white" : "text-purple-200"} font-medium`}>
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings Footer */}
        {/* <div className="p-6 border-t border-purple-700/50">
          <div
            className="flex items-center gap-4 text-lg cursor-pointer px-4 py-3 rounded-xl hover:bg-purple-800/50 transition-colors"
            onClick={() => {
              navigate("/executive/settings");
              setCollapsed(true);
            }}
          >
            <Settings size={24} className="text-purple-300" />
            <span className="text-purple-200 font-medium">Settings</span>
          </div>
        </div> */}
      </aside>
    </div>
  );
};

export default ExecutiveMobileSidebar;
