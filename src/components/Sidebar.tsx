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
  Trash2Icon,
  FileStackIcon,
  FileDown, // ✅ Add this icon for Export Logs
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BackendUrl } from "@/Config";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [collapsed, setCollapsed] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch user role on mount
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${BackendUrl}/auth/verifyToken`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const role = response.data?.user?.role;
        setUserRole(role);
        console.log('✅ Sidebar - User Role:', role);
      } catch (error) {
        console.error('❌ Error fetching user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // ✅ Dynamic Overview path based on role
  const getOverviewPath = () => {
    if (userRole === "SUPER_ADMIN") {
      return "/superadmin-dashboard";
    }
    return "/admin-dashboard";
  };

  // ✅ Handle Overview/Dashboard click
  const handleDashboardClick = () => {
    const targetPath = getOverviewPath();
    console.log(`🔄 Navigating to dashboard: ${targetPath} (Role: ${userRole})`);
    navigate(targetPath);
  };

  // ✅ Base nav items (available to all admins)
  const baseNavItems = [
    { label: "Analysis", path: "/admin-analysis", Icon: ChartNoAxesCombined },
    { label: "Users", path: "/admin/all-users", Icon: Users },
    { label: "Executives", path: "/admin/executives", Icon: UserCheck },
    { label: "TasksManager", path: "/admin-tasks-management", Icon: CheckCheck },
    { label: "Mentors", path: "/admin-all-mentors", Icon: UsersRound },
    { label: "Yoga-Schedule", path: "/admin-yoga-schedule", Icon: Calendar1 },
    { label: "Orders", path: "/admin/orders", Icon: ShoppingCart },
    { label: "Packages", path: "/admin/packages", Icon: Box },
    { label: "Webinars", path: "/admin/webinars", Icon: Calendar },
    { label: "Deleted Users", path: "/admin/deleted-users", Icon: Trash2Icon },
    { label: "Audit Logs", path: "/admin/audit-logs", Icon: FileStackIcon },
    { label: "Pending Registrations", path: "/admin/pending-registrations", Icon: FileText },
  ];

  // ✅ Super Admin only items
  const superAdminOnlyItems = [
    { label: "Export Logs", path: "/superadmin/export-logs", Icon: FileDown },
  ];

  // ✅ Combine nav items based on role
  const navItems = userRole === "SUPER_ADMIN" 
    ? [...baseNavItems, ...superAdminOnlyItems]
    : baseNavItems;

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !collapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collapsed]);

  // ✅ Show loading state
  if (isLoading) {
    return (
      <aside className="fixed top-0 left-0 h-full w-20 bg-gradient-to-tr from-gray-900 to-slate-900 text-white shadow-md z-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </aside>
    );
  }

  return (
    <aside
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full bg-gradient-to-tr from-gray-900 to-slate-900 
                  text-white shadow-md transition-all duration-300 z-40
                  ${collapsed ? "w-20" : "w-64"} flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-24 border-b border-gray-700">
        <div className="text-lg font-bold cursor-pointer hover:text-gray-300 transition-colors">
          {!collapsed ? (userRole === "SUPER_ADMIN" ? "Super Admin" : "Admin Panel") : "AP"}
        </div>

        {/* Collapse toggle */}
        <button
          className="text-gray-300 hover:text-white focus:outline-none hidden md:inline-block"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <SquareArrowRight /> : <SquareArrowLeft />}
        </button>
      </div>

      {/* ✅ Dashboard/Overview Button */}
      <div
        className="text-lg font-bold flex justify-center items-center mt-4 mx-2 p-3 cursor-pointer 
                   hover:bg-gray-700 transition-colors rounded-lg bg-gray-800/50"
        onClick={handleDashboardClick}
      >
        {!collapsed ? (
          <span>{userRole === "SUPER_ADMIN" ? "Super Dashboard" : "Admin Dashboard"}</span>
        ) : (
          <Home size={20} />
        )}
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto pl-2 mt-2 no-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <ul>
          {navItems.map(({ label, path, Icon }) => {
            const isActive = location.pathname === path;
            
            return (
              <li
                key={label}
                className={`cursor-pointer px-4 py-3 flex items-center mt-0.5 gap-3 
                           hover:bg-gray-700 transition-colors rounded-lg
                           ${isActive ? "bg-gray-800 font-semibold" : ""}`}
                onClick={() => {
                  console.log(`🔄 Navigating to: ${path}`);
                  navigate(path);
                }}
                title={collapsed ? label : undefined}
              >
                <Icon size={20} />
                {!collapsed && <span>{label}</span>}
                {/* ✅ Show badge for Super Admin only items */}
                {!collapsed && superAdminOnlyItems.some(item => item.path === path) && (
                  <span className="ml-auto text-xs bg-yellow-500 text-gray-900 px-2 py-0.5 rounded-full font-semibold">
                    SA
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Show role for debugging */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 flex items-center justify-between">
            <span>Role: {userRole || "Loading..."}</span>
            {userRole === "SUPER_ADMIN" && (
              <span className="bg-yellow-500 text-gray-900 px-2 py-0.5 rounded text-xs font-bold">
                SUPER
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
