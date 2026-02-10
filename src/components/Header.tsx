import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import AdminProfileMenu from './adminComponents/AdminProfileMenu';
import FMC from '@/assets/FMC2.png'


interface Header1Props {
  username?: string | null;
  user?: {
    role?: string;
  } | null;
}

const Header1: React.FC<Header1Props> = ({ username, user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignout = async () => {
    // Clear authentication data
    localStorage.removeItem('token');
    // Navigate to login page
    navigate("/login");
  };

  const handleMenuItemClick = (item: string) => {
    setMenuOpen(false);
    
    switch (item) {
      case 'dashboard':
        navigate('/admin-dashboard');
        break;
      case 'webinars':
        navigate('/admin/webinars');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      default:
        break;
    }
  };

  return (
    <header className="bg-gradient-to-r z-50 from-blue-700 to-green-400 fixed text-white shadow-lg w-full">
      <div className="mx-auto py-3 sm:py-4 px-3 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center sm:text-xl gap-4 lg:text-2xl font-bold">
            <img src={FMC} alt="Logo" className='w-10 h-10 rounded-full' />
            <div className=' flex flex-col'>
            <span className="hidden sm:inline">FINITE MARSHALL CLUB</span>
            <span className="hidden text-xs font-extralight sm:inline">Next Level Wellness Today</span>
            </div>
            <span className="sm:hidden text-lg">FMC</span>
          </div>
          
          <div>
            <AdminProfileMenu onSignout={handleSignout} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header1;