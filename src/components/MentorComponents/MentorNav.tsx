import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import MentorProfileMenu from './MentorProfileMenu';
import FMC from '../../assets/FMC2.png'


interface MentorNavProps {
  username?: string | null;
  user?: {
    role?: string;
  } | null;
}

const MentorNav: React.FC<MentorNavProps> = ({ username, user }) => {
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
    <header className="bg-gradient-to-r from-blue-700 to-green-400 text-white shadow-lg  w-full">
      <div className="mx-auto py-3 sm:py-4 px-3 sm:px-6">
        <div className="flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className='flex justify-between gap-4 items-center'>
                <img src={FMC} alt="Logo" className='w-10 h-10 rounded-full' />
                <div className='block lg:hidden'>
                  <div className="text-lg font-bold">FMC</div>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-bold">FINITE MARSHALL CLUB</div>
                <div className="text-xs text-blue-200">Professional Learning Platform</div>
              </div>
            </div>
          
          <div>
            <MentorProfileMenu onSignout={handleSignout} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MentorNav;