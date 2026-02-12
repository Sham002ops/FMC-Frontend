import {
  Home,
  Users,
  UserCheck,
  Box,
  Calendar,
  SquareArrowLeft,
  Menu,
  X,
  ShoppingCart,
  UserRound,
  ChartNoAxesCombined,
  Calendar1,
  CheckCheck,
  Trash2Icon,
  FileStackIcon,
  FileDown,
  FileText, // ✅ Add this for Export Logs
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BackendUrl } from "@/Config";

const MobileSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
        console.log('✅ Mobile Sidebar - User Role:', role);
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

  // ✅ Handle Dashboard click
  const handleDashboardClick = () => {
    const targetPath = getOverviewPath();
    console.log(`🔄 Mobile: Navigating to dashboard: ${targetPath} (Role: ${userRole})`);
    navigate(targetPath);
    setCollapsed(true);
  };

  // ✅ Base nav items (available to all admins)
  const baseNavItems = [
    { label: "Analysis", path: "/admin-analysis", Icon: ChartNoAxesCombined },
    { label: "Users", path: "/admin/all-users", Icon: Users },
    { label: "Executives", path: "/admin/executives", Icon: UserCheck },
    { label: "Mentors", path: "/admin-all-mentors", Icon: UserRound },
    { label: "TasksManager", path: "/admin-tasks-management", Icon: CheckCheck },
    { label: "Orders", path: "/admin/orders", Icon: ShoppingCart },
    { label: "Packages", path: "/admin/packages", Icon: Box },
    { label: "Yoga-Schedule", path: "/admin-yoga-schedule", Icon: Calendar1 },
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

  // ✅ Show loading spinner while fetching role
  if (isLoading) {
    return (
      <button
        className="lg:hidden fixed top-16 left-2 z-50 bg-gray-900 text-white p-2 rounded-md shadow-md"
        disabled
      >
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      </button>
    );
  }

  return (
    <div>
      {/* Floating Hamburger Button */}
      <button
        className="lg:hidden fixed top-16 left-2 z-50 bg-gray-900 text-white p-2 rounded-md shadow-md hover:bg-gray-800 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <Menu size={22} /> : <X size={22} />}
      </button>

      {/* Backdrop Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-tr from-gray-900 to-slate-900 
                    text-white shadow-2xl transition-all duration-300 z-40
                    ${collapsed ? "-translate-x-full" : "translate-x-0"} 
                    w-60 flex flex-col lg:hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-32 border-b border-gray-700">
          <div className="text-2xl font-bold cursor-pointer hover:text-gray-300 transition-colors">
            {userRole === "SUPER_ADMIN" ? "Super Admin" : "Admin Panel"}
          </div>
          <button
            className="text-gray-300 hover:text-white cursor-pointer transition-colors"
            onClick={() => setCollapsed(true)}
            aria-label="Close sidebar"
          >
            <SquareArrowLeft size={24} />
          </button>
        </div>

        {/* ✅ Dashboard Button */}
        <div
          className="mx-4 mt-6 p-3 flex items-center gap-3 bg-blue-600 hover:bg-blue-700 
                     rounded-lg cursor-pointer transition-all font-semibold text-lg"
          onClick={handleDashboardClick}
        >
          <Home size={20} />
          <span>{userRole === "SUPER_ADMIN" ? "Super Dashboard" : "Admin Dashboard"}</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto no-scrollbar mt-4 px-2">
          <ul className="flex flex-col space-y-2">
            {navItems.map(({ label, path, Icon }) => {
              const isActive = location.pathname === path;
              const isSuperAdminOnly = superAdminOnlyItems.some(item => item.path === path);
              
              return (
                <li
                  key={label}
                  className={`cursor-pointer px-4 py-3 flex items-center gap-3 text-base rounded-lg
                              hover:bg-gray-700 active:bg-gray-600 transition-all
                              ${isActive ? "bg-gray-800 font-semibold shadow-inner" : ""}`}
                  onClick={() => {
                    console.log(`🔄 Mobile: Navigating to ${path}`);
                    navigate(path);
                    setCollapsed(true);
                  }}
                >
                  <Icon size={20} />
                  <span className="flex-1">{label}</span>
                  {/* ✅ Show badge for Super Admin only items */}
                  {isSuperAdminOnly && (
                    <span className="text-xs bg-yellow-500 text-gray-900 px-2 py-0.5 rounded-full font-bold">
                      SA
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - Show role */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">
                {userRole === "SUPER_ADMIN" ? "Super Administrator" : "Administrator"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Role: {userRole || "N/A"}
              </div>
            </div>
            {userRole === "SUPER_ADMIN" && (
              <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                SUPER
              </span>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MobileSidebar;
