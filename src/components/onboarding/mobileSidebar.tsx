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
  LogOut,
  Menu,
  X,
  Settings2,
  ShoppingCart,
  UserRound,
  ChartNoAxesCombined,
  Calendar1,
  CheckCheck,
  Delete,
  Trash2Icon,
  FileStackIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const MobileSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(true);

  const navItems = [
    { label: "Overview", path: "/admin-dashboard", Icon: Home },
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
    // { label: "Notifications", path: "/admin/notifications", Icon: Bell },
    // { label: "Audit Log", path: "/admin/audit-log", Icon: FileText },
    // { label: "Settings", path: "/admin/settings", Icon: Settings },
  ];

  return (
    <div className=" ">
              {/* Floating Hamburger Button */}
      <button
        className="lg:hidden  fixed  lg:left-0  top-16 left-2 z-50 bg-gray-900 text-white p-2 rounded-md shadow-md"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <Menu size={22} /> : <X size={22} />}
      </button>


      {/* Sidebar */}
      <aside
        className={`fixed  top-0 left-0 h-full bg-gradient-to-tr from-gray-900 to-slate-900 
                    text-white shadow-md transition-all duration-300 z-40
                    ${collapsed ? "w-0 overflow-hidden" : "w-60"} flex flex-col lg:hidden`}
      >
        {/* Header */}
        
        <div className="flex items-center justify-between p-4 pt-32  border-b border-gray-700">
          <div
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/admin/overview")}
          >
            {!collapsed ? "Admin Panel" : ""}
          </div>
          <div
            className="text-gray-300 hover:text-white cursor-pointer"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
          >
            {!collapsed && <SquareArrowLeft  />}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto no-scrollbar mt-6 px-2">
          <ul className="flex flex-col space-y-6">
            {navItems.map(({ label, path, Icon }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <li
                  key={label}
                  className={`cursor-pointer px-4 py-3 flex items-center gap-3 text-2xl rounded-md
                              hover:bg-gray-700 transition-colors
                              ${isActive ? "bg-gray-800 font-semibold" : ""}`}
                  onClick={() => navigate(path)}
                >
                  <Icon  />
                  {!collapsed && <span>{label}</span>}
                </li>
              );
            })}
          </ul>
        </nav>
       
      </aside>
    </div>
  );
};

export default MobileSidebar;
