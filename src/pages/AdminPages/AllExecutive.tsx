import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '@/components/Header';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import Sidebar from '@/components/Sidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import ExecutivesTable from '@/components/adminComponents/ExecutivesTable';

const AllExecutive: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allExecutives, setAllExecutives] = useState<[]>([]);

  useEffect(() => {
    const fetchExecutives = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BackendUrl}/executive/get-executives`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAllExecutives(data);
      } catch (err) {
        console.error('Error fetching executives:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExecutives();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Processing />
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen flex bg-gray-100">
      {/* Sidebar */}
        {/* Sidebar */}
          <div className="transition-transform duration-300">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            <div className="block lg:hidden">
              <MobileSidebar />
            </div>
          </div>

      {/* Header */}
      <header className="w-full fixed top-0 left-0 bg-white shadow-sm z-30">
        <Header1 />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-28 lg:pl-20 sm:pt-24">
        {/* Page Title */}
        <div className="px-3 sm:px-6 md:px-8 py-4 bg-white border-b">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-800">
            All Executives
          </h1>
        </div>

        {/* Table */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-8">
          <ExecutivesTable allExecutives={allExecutives} />
        </main>
      </div>
    </div>
  );
};

export default AllExecutive;
