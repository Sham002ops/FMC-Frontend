import Header1 from '@/components/Header';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import Sidebar from '@/components/Sidebar';
import React from 'react';

const Audit: React.FC = () => {
  return (
     <div>
         <div className=' z-50'>
                <Header1/>
         </div>
         {/* Sidebar */}
            <div className="transition-transform  duration-300">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block">
                <Sidebar />
                </div>

                {/* Mobile Sidebar */}
                <div className="block lg:hidden">
                <MobileSidebar />
                </div>
            </div>

        <div>    
            <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4"> 
            <div className="text-center max-w-md">
                <svg
                className="mx-auto mb-6 w-20 h-20 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                </svg>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Under Development</h1>
                <p className="text-gray-600 text-base sm:text-lg">
                We're working hard to bring you this feature. Please check back soon!
                </p>
            </div>
        </main>
    </div>
    </div>
  );
};

export default Audit;
