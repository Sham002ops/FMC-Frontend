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

interface SuperAdminHeaderProps {
  user: any;
  onSignout: () => void;
}

const SuperAdminHeader = ({ user, onSignout }: SuperAdminHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 fixed text-white shadow-2xl z-40 w-full border-b-4 border-purple-500">
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

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 sm:gap-3 bg-white/10 hover:bg-white/20 rounded-full px-3 sm:px-4 py-2 transition-all duration-200 backdrop-blur-sm">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-sm sm:text-base shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold">{user?.name}</div>
                <div className="text-xs text-purple-200">Super Administrator</div>
              </div>
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold">{user?.name}</span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignout} className="text-red-600 focus:text-red-700">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default SuperAdminHeader;
