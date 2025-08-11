import {  Home, Users, UserCheck, Box, Calendar, Bell, FileText, Settings, SquareArrowLeft, SquareArrowRight, LogOut } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';



const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Control sidebar collapse on small screens
  const [collapsed, setCollapsed] = useState(true);

  // Sidebar nav items with path and label
 const navItems = [
  { label: 'Overview', path: '/admin/overview', Icon: Home },
  { label: 'Users', path: '/admin/all-users', Icon: Users },
  { label: 'Executives', path: '/admin/executives', Icon: UserCheck },
  { label: 'Packages', path: '/admin/packages', Icon: Box },
  { label: 'Webinars', path: '/admin/webinars', Icon: Calendar },
  { label: 'Notifications', path: '/admin/notifications', Icon: Bell },
  { label: 'Audit Log', path: '/admin/audit-log', Icon: FileText },
  { label: 'Settings', path: '/admin/settings', Icon: Settings },
  
  
];

  // Render sidebar links
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gradient-to-tr from-gray-900 to-slate-900 text-white shadow-md transition-width duration-300
         ${collapsed ? 'w-20' : 'w-64'} flex flex-col`}>
    
      <div className="flex items-center pl-2 justify-between p-4 pt-24 border-b border-gray-700">
        <div className="text-lg font-bold cursor-pointer " onClick={() => navigate('/admin/overview')}>
          {!collapsed ? 'Admin Panel' : 'AP'}
        </div>
        {/* Collapse toggle button, visible on medium+ screens */}
        <button
          className="text-gray-300 pl-1 hover:text-white focus:outline-none hidden md:inline-block"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <SquareArrowRight /> : <SquareArrowLeft />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto  pl-2 mt-4"  style={{
                scrollbarWidth: 'none',             /* Firefox */
                msOverflowStyle: 'none',            /* Internet Explorer 10+ */
              }}>
        <ul>
          {navItems.map(({ label, path,Icon }) => {
            const isActive = location.pathname.startsWith(path); // highlight if path matches
            return (
             <li
                key={label}
                className={`cursor-pointer px-4 py-3 hover:bg-gray-700 flex items-center gap-3 ${
                  isActive ? 'bg-gray-800 font-semibold' : ''
                }`}
                onClick={() => navigate(path)}
                title={collapsed ? label : undefined}
              >
                <Icon size={20} />
                {!collapsed && label}
              </li>

            );
          })}
        </ul>
      </nav>

      {/* <div className="p-4 border-t border-gray-700">
        {!collapsed ? (
          <>
            <p className="text-sm truncate">{username || 'Admin'}</p>
            <p className="text-xs text-gray-400">{role?.toUpperCase() || 'ROLE'}</p>
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
          <div className=' flex justify-center items-center'><LogOut size={16} /></div>
          </button>
        )}
      </div> */}
    </aside>
  );
};

export default Sidebar;
