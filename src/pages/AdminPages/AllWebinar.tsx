import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import Header1 from '@/components/Header';
import WebinarCard from '@/components/adminComponents/WebinarCard';

interface Webinar {
  id: string;
  title: string;
  date: string;
  zoomLink: string;
  thumbnail: string;
  packageId: string;
  package?: { id: string; name: string };
}

const AllWebinars: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allWebinars, setAllWebinars] = useState<Webinar[]>([]);
  const [error, setError] = useState<string>("");
  
  // ✅ Prevent duplicate fetches
  const hasFetched = useRef(false);

  useEffect(() => {
    // ✅ Only fetch once
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAllWebinars = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Authentication required");
          return;
        }

        const response = await axios.get(`${BackendUrl}/webinar`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        
        console.log('✅ Webinars fetched:', response.data?.length || 0);
        setAllWebinars(response.data || []);
      } catch (error: any) {
        console.error("❌ Error fetching webinars:", error);
        setError(error.response?.data?.message || "Failed to load webinars");
        setAllWebinars([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllWebinars();
  }, []); // ✅ Empty dependency array - runs once

  const fullThumb = (path: string) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${BackendUrl}${path.startsWith('/') ? path : `/${path}`}`;
  };

  // ✅ Memoize update/delete handlers to prevent re-renders
  const handleUpdated = React.useCallback((updated: Webinar) => {
    setAllWebinars(prev => prev.map(x => x.id === updated.id ? { ...x, ...updated } : x));
  }, []);

  const handleDeleted = React.useCallback((id: string) => {
    setAllWebinars(prev => prev.filter(x => x.id !== id));
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
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="block lg:hidden">
          <MobileSidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
          <Header1 />
        </header>

        <main className="flex-1 pt-28 lg:pl-28 sm:pt-32 px-4 sm:px-6 md:px-8 overflow-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
            All Webinars
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {allWebinars.length === 0 ? (
            <p className="text-center text-gray-600 mt-16 sm:mt-20">
              No webinars found.
            </p>
          ) : (
            <>
              {/* Desktop & Tablet Cards */}
              <div className="hidden sm:block">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allWebinars.map((w) => (
                    <WebinarCard
                      key={w.id}
                      webinar={w}
                      onUpdated={handleUpdated}
                      onDeleted={handleDeleted}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-4">
                {allWebinars.map(w => (
                  <WebinarCard
                    key={w.id}
                    webinar={w}
                    onUpdated={handleUpdated}
                    onDeleted={handleDeleted}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllWebinars;
