import {
  Home,
  Users,
  UserCheck,
  Box,
  Calendar,
  Bell,
  FileText,
  Settings,
  SquareArrowLeft,
  SquareArrowRight,
  LogOut,
  ShoppingCart,
  ChartNoAxesCombined,
  User2Icon,
  UsersRound,
  CheckCheck,
  Calendar1,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Control sidebar collapse
  const [collapsed, setCollapsed] = useState(true);

  // Sidebar nav items
  const navItems = [
    { label: "Overview", path: "/admin-dashboard", Icon: Home },
    { label: "Analysis", path: "/admin-analysis", Icon: ChartNoAxesCombined },
    { label: "Users", path: "/admin/all-users", Icon: Users },
    { label: "Executives", path: "/admin/executives", Icon: UserCheck },
    { label: "TasksManager", path: "/admin-tasks-management", Icon: CheckCheck },
    { label: "Mentors", path: "/admin-all-mentors", Icon: UsersRound },
    { label: "Yoga-Schedule", path: "/admin-yoga-schedule", Icon: Calendar1 },
    { label: "Orders", path: "/admin/orders", Icon: ShoppingCart },
    { label: "Packages", path: "/admin/packages", Icon: Box },
    { label: "Webinars", path: "/admin/webinars", Icon: Calendar },
  ];

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if sidebar is expanded (!collapsed)
      if (
        !collapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setCollapsed(true);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collapsed]);

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full bg-gradient-to-tr from-gray-900 to-slate-900 
                  text-white shadow-md transition-all duration-300 z-40
                  ${collapsed ? "w-20" : "w-64"} flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-24 border-b border-gray-700">
        <div
          className="text-lg font-bold cursor-pointer"
          onClick={() => navigate("/admin-dashboard")}
        >
          {!collapsed ? "Admin Panel" : "AP"}
        </div>

        {/* Collapse toggle (visible on md and above) */}
        <button
          className="text-gray-300 hover:text-white focus:outline-none hidden md:inline-block"
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
            const isActive = location.pathname.startsWith(path);
            return (
              <li
                key={label}
                className={`cursor-pointer px-4 py-3 flex items-center gap-3 
                           hover:bg-gray-700 transition-colors rounded-lg
                           ${isActive ? "bg-gray-800 font-semibold" : ""}`}
                onClick={() => navigate(path)}
                title={collapsed ? label : undefined}
              >
                <Icon size={20} />
                {!collapsed && <span>{label}</span>}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer (optional for profile + logout) */}
      {/*
      <div className="p-4 border-t border-gray-700">
        {!collapsed ? (
          <>
            <p className="text-sm truncate">{username || "Admin"}</p>
            <p className="text-xs text-gray-400">{role?.toUpperCase() || "ROLE"}</p>
            <button
              onClick={onLogout}
              className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-1 rounded text-sm"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={onLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm"
            title="Sign Out"
          >
            <div className="flex justify-center items-center">
              <LogOut size={16} />
            </div>
          </button>
        )}
      </div>
      */}
    </aside>
  );
};

export default Sidebar;
