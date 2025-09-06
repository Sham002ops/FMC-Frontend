import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import ExeSidebar from '@/components/ExeSideBar';
import ExecutiveMobileSidebar from '@/components/MobExeSidebar';

interface User {
  id: string;
  name: string;
  email: string;
  coins: number;
  packageId: string | null;
  executiveRefode: string | null;
  role: string;
}

const AllRefUsers: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allRefUsers, setAllRefUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchAllRefUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BackendUrl}/executive/get-ref-users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
            console.log("Fetched Users: ", response.data);
        setAllRefUsers(response.data.AllRefUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setAllRefUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllRefUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Processing />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="transition-transform duration-300">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ExeSidebar />
        </div>

        {/* Mobile Sidebar */}
        <div className="block lg:hidden">
          <ExecutiveMobileSidebar />
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
        <Header1 />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col pt-28 lg:pl-24 sm:pt-24  px-4 sm:px-6 md:px-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
          All Referred Users
        </h1>

        {allRefUsers.length === 0 ? (
          <p className="text-center text-gray-600 mt-16 sm:mt-20">
            No users found.
          </p>
        ) : (
          <>
            {/* Desktop/Tablet Table */}
            <div className="hidden sm:block overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide">Coins</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Package ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Executive Refcode</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allRefUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-gray-800">{user.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-gray-600 break-words">{user.email}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{user.coins}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{user.packageId ?? "-"}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{user.executiveRefode ?? "-"}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="sm:hidden space-y-4">
              {allRefUsers.map(user => (
                <div key={user.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                  <h2 className="font-semibold text-gray-800 mb-2">{user.name}</h2>
                  <p className="text-gray-600 text-sm mb-1"><strong>Email:</strong> {user.email}</p>
                  <p className="text-gray-600 text-sm mb-1 "><strong>Coins:</strong> {user.coins}</p>
                  <p className="text-gray-600 text-sm mb-1"><strong>Package ID:</strong> {user.packageId ?? "-"}</p>
                  <p className="text-gray-600 text-sm mb-1"><strong>Executive Refcode:</strong> {user.executiveRefode ?? "-"}</p>
                  <p className="text-gray-600 text-sm"><strong>Role:</strong> {user.role}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AllRefUsers;
