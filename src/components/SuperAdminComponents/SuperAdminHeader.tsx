// components/superadmin/SuperAdminHeader.tsx
import { useState } from 'react';
import FMC from '@/assets/FMC2.png';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SuperAdminProfileMenu from './SuperAdminProfileMenu';

interface SuperAdminHeaderProps {
  user: any;
  onSignout: () => void;
}

const SuperAdminHeader = ({ user, onSignout }: SuperAdminHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-500 fixed text-white shadow-2xl z-40 w-full border-b-4 border-green-500">
      <div className="mx-auto py-3 sm:py-4 px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className='flex justify-between gap-3 items-center'>
              <img src={FMC} alt="Logo" className='w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-lg' />
              <div className='block lg:hidden'>
                <div className="text-base sm:text-lg font-bold">FMC</div>
                <div className="text-[10px] text-purple-200">SuperAdmin</div>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg sm:text-xl font-bold tracking-wide">FINITE MARSHALL CLUB</div>
              <div className="text-xs text-purple-200 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                SuperAdmin Control Panel
              </div>
            </div>
          </div>

          <SuperAdminProfileMenu onSignout={onSignout} />
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
