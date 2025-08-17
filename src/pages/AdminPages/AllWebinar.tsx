import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import Header1 from '@/components/Header';

interface Webinar {
  id: string;
  title: string;
  date: string;
  zoomLink: string;
  thumbnail: string;
  packageId: string;
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
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllWebinars(response.data);
      } catch (error) {
        console.error("Error fetching webinars:", error);
        setAllWebinars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllWebinars();
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
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
          <Header1 />
        </header>

        {/* Main content container with padding and top offset for header */}
        <main className="flex-1 pt-28 lg:pl-28 sm:pt-32 px-4 sm:px-6  md:px-8 overflow-auto">
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
              <div className="hidden sm:block overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">
                        Zoom Link
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">
                        Thumbnail
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide">
                        Package Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allWebinars.map(webinar => (
                      <tr key={webinar.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-gray-800">{webinar.title}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{new Date(webinar.date).toLocaleString()}</td>
                        <td className="px-4 py-2 whitespace-nowrap break-all">
                          <a href={webinar.zoomLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            {webinar.zoomLink}
                          </a>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <img src={webinar.thumbnail} alt="Webinar Thumbnail" />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{webinar.packageId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards */}
              <div className="sm:hidden space-y-4">
                {allWebinars.map(webinar => (
                  <div key={webinar.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <h2 className="font-semibold text-lg text-gray-800 mb-2">{webinar.title}</h2>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Date:</strong> {new Date(webinar.date).toLocaleString()}
                    </p>
                    <p className="text-blue-600 text-sm mb-1">
                      <strong>Zoom Link:</strong>{" "}
                     <div className=' w-[300px] h-16 overflow-scroll'>
                         <a href={webinar.zoomLink} target="_blank" rel="noreferrer" className="hover:underline">
                        {webinar.zoomLink}
                      </a>
                     </div>
                    </p>
                    <p className="text-blue-600 w-[350px]  rounded-md bg-slate-200 text-sm mb-1">
                    <img src={webinar.thumbnail} alt="Webinar Thumbnail" />
                    </p>
                    {/* <p className="text-gray-600 text-sm">
                      <strong>Package Name </strong> {webinar.}
                    </p> */}
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

export default AllWebinars;
