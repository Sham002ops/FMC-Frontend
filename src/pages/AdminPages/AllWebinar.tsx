import React, { useEffect, useState } from 'react';
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
  thumbnail: string;   // server path like /uploads/webinars/xxx.jpg
  packageId: string;
  package?: { id: string; name: string }; // if backend includes it
}

const AllWebinars: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allWebinars, setAllWebinars] = useState<Webinar[]>([]);

  useEffect(() => {
    const fetchAllWebinars = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BackendUrl}/webinar`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setAllWebinars(response.data || []);
      } catch (error) {
        console.error("Error fetching webinars:", error);
        setAllWebinars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllWebinars();
  }, []);

  const fullThumb = (path: string) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${BackendUrl}${path.startsWith('/') ? path : `/${path}`}`;
  };

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
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
          <Header1 />
        </header>

        <main className="flex-1 pt-28 lg:pl-28 sm:pt-32 px-4 sm:px-6 md:px-8 overflow-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
            All Webinars
          </h1>

          {allWebinars.length === 0 ? (
            <p className="text-center text-gray-600 mt-16 sm:mt-20">
              No webinars found.
            </p>
          ) : (
            <>
              {/* Desktop & Tablet Table */}
              {/* <div className="hidden sm:block overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Zoom Link</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Thumbnail</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">Package Name</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allWebinars.map(w => (
                      <tr key={w.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-gray-800">{w.title}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{new Date(w.date).toLocaleString()}</td>
                        <td className="px-4 py-2 whitespace-nowrap break-all">
                          <a href={w.zoomLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            {w.zoomLink}
                          </a>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {w.thumbnail ? (
                            <img
                              src={fullThumb(w.thumbnail)}
                              alt={`${w.title} thumbnail`}
                              className="w-24 h-16 object-cover rounded border"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/placeholder-image.png';
                              }}
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {w.package?.name || w.packageId}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}

              {/* Desktop & Tablet Cards (sm and up) */}
                <div className="hidden sm:block">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allWebinars.map((w) => (
                      <WebinarCard
                          key={w.id}
                          webinar={w}
                          onUpdated={(updated) =>
                            setAllWebinars((prev) => prev.map(x => x.id === updated.id ? { ...x, ...updated } : x))
                          }
                          onDeleted={(id) =>
                            setAllWebinars((prev) => prev.filter(x => x.id !== id))
                          }
                        />

                    ))}
                  </div>
                </div>


              {/* Mobile stacked cards */}
              {/* <div className="sm:hidden space-y-4">
                {allWebinars.map(w => (
                  <div key={w.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <h2 className="font-semibold text-lg text-gray-800 mb-2">{w.title}</h2>
                    {w.thumbnail && (
                      <img
                        src={fullThumb(w.thumbnail)}
                        alt={`${w.title} thumbnail`}
                        className="w-full h-40 object-cover rounded mb-2"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                    )}
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Date:</strong> {new Date(w.date).toLocaleString()}
                    </p>
                    <div className="text-blue-600 text-sm mb-1 break-all">
                      <strong>Zoom Link:</strong>{" "}
                      <a href={w.zoomLink} target="_blank" rel="noreferrer" className="hover:underline">
                        {w.zoomLink}
                      </a>
                    </div>
                    <p className="text-gray-600 text-sm">
                      <strong>Package:</strong> {w.package?.name || w.packageId}
                    </p>
                  </div>
                ))}
              </div> */}

              {/* Mobile stacked cards */}
                <div className="sm:hidden space-y-4">
                  {allWebinars.map(w => (
                    <WebinarCard
                      key={w.id}
                      webinar={w}
                      onUpdated={(updated) =>
                        setAllWebinars(prev => prev.map(x => x.id === updated.id ? { ...x, ...updated } : x))
                      }
                      onDeleted={(id) =>
                        setAllWebinars(prev => prev.filter(x => x.id !== id))
                      }
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
