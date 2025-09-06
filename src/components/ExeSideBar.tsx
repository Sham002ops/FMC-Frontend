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
  SquareArrowRight,
  DollarSign,
  BarChart3,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ExeSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Control sidebar collapse
  const [collapsed, setCollapsed] = useState(true);

  // Executive-specific nav items
  const navItems = [
    { label: "Dashboard", path: "/exexutive-dashboard", Icon: Home },
    { label: "My Referrals", path: "/executive/referrals", Icon: Users },
  //   { label: "Recruit Users", path: "/executive/recruit", Icon: UserPlus },
  //   { label: "Hosted Webinars", path: "/executive/webinars", Icon: Calendar },
  //   { label: "Performance", path: "/executive/performance", Icon: TrendingUp },
  //   { label: "Commissions", path: "/executive/commissions", Icon: DollarSign },
  //   { label: "Analytics", path: "/executive/analytics", Icon: BarChart3 },
  //   { label: "Training", path: "/executive/training", Icon: Award },
  //   { label: "Support", path: "/executive/support", Icon: MessageSquare },
  //   { label: "Settings", path: "/executive/settings", Icon: Settings },
   ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gradient-to-tr from-slate-900  to-slate-700 
                  text-white shadow-xl transition-all duration-300
                  ${collapsed ? "w-20" : "w-64"} flex flex-col z-30`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-24 border-b border-purple-700/50">
        <div
          className="text-lg font-bold cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
          onClick={() => navigate("/exexutive-dashboard")}
        >
          {!collapsed ? "Executive Panel" : "EP"}
        </div>

        {/* Collapse toggle (visible on md and above) */}
        <button
          className="text-purple-300 hover:text-white focus:outline-none hidden md:inline-block transition-colors"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <SquareArrowRight size={20} /> : <SquareArrowLeft size={20} />}
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
        <ul className="space-y-1">
          {navItems.map(({ label, path, Icon }) => {
            const isActive = location.pathname.startsWith(path);
            return (
              <li
                key={label}
                className={`cursor-pointer px-4 py-3 flex items-center gap-3 rounded-lg mx-2 transition-all duration-200
                           hover:bg-emerald-800/50 hover:transform hover:scale-105
                           ${isActive ? "bg-gradient-to-r from-emerald-600 to-indigo-700 font-semibold shadow-lg" : ""}`}
                onClick={() => navigate(path)}
                title={collapsed ? label : undefined}
              >
                <Icon size={20} className={isActive ? "text-yellow-400" : "text-purple-300"} />
                {!collapsed && (
                  <span className={`${isActive ? "text-white" : "text-purple-200"} text-sm font-medium`}>
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Performance Badge */}
      <div className={`p-4 border-t border-purple-700/50 ${collapsed ? "px-2" : ""}`}>
        {!collapsed ? (
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg text-center">
            <div className="text-xs font-medium text-white opacity-90">This Month</div>
            <div className="text-lg font-bold text-white">★ Top Performer</div>
            <div className="text-xs text-green-100">15% above target</div>
          </div>
        ) : (
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white text-lg">★</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default ExeSidebar;
