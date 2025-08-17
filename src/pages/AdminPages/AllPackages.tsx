import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import Header1 from '@/components/Header';

interface Package {
  id: string;
  name: string;
  priceInCoins: number;
  features: string[] | string; // Array or comma-separated string
  validityDays: number;
}

const AllPackages: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchAllPackages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BackendUrl}/package/allpackages`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAllPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
        setAllPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPackages();
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
                <Sidebar />
                </div>

                {/* Mobile Sidebar */}
                <div className="block lg:hidden">
                <MobileSidebar />
                </div>
            </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
          <Header1 />
        </header>

        {/* Main Content */}
        <main className="flex-1 pt-28 sm:pt-28 lg:pl-28 px-4 sm:px-6 md:px-8 overflow-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-8 text-gray-800  sm:text-left">
            All Packages
          </h1>

          {allPackages.length === 0 ? (
            <p className="text-center text-gray-600 mt-16 sm:mt-20">No packages found.</p>
          ) : (
            <>
              {/* Desktop & Tablet Table */}
              <div className="hidden sm:flex flex-col items-center w-full">
                <div className="w-full max-w-screen-lg mx-auto bg-white shadow rounded-xl overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200 text-base">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Package Name
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Price (Coins)
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Features
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Validity (Days)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allPackages.map(pkg => (
                        <tr key={pkg.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 whitespace-nowrap text-gray-800">{pkg.name}</td>
                          <td className="px-6 py-3 whitespace-nowrap">{pkg.priceInCoins}</td>
                          <td className="px-6 py-3 whitespace-normal max-w-xs break-words">
                            {Array.isArray(pkg.features) ? pkg.features.join(", ") : pkg.features}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">{pkg.validityDays}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile stacked cards */}
              <div className="sm:hidden space-y-4">
                {allPackages.map(pkg => (
                  <div key={pkg.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <h2 className="font-semibold text-lg text-gray-800 mb-2">{pkg.name}</h2>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Price (Coins):</strong> {pkg.priceInCoins}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Features:</strong> {Array.isArray(pkg.features) ? pkg.features.join(", ") : pkg.features}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <strong>Validity (Days):</strong> {pkg.validityDays}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllPackages;
