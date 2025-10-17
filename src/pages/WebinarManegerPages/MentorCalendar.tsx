import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import Header1 from '@/components/Header';
import MentorSidebar from '@/components/MentorComponents/MentorSidebar';
import MentorMobileSidebar from '@/components/MentorComponents/MobMentorSideBar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Video,
  X,
  Package as PackageIcon,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Webinar {
  id: string;
  title: string;
  description?: string;
  date: string;
  zoomLink: string;
  thumbnail: string;
  packageId: string;
  createdBy: string;
  package?: {
    id: string;
    name: string;
  };
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

const MentorCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Verify user
      const userRes = await axios.get(`${BackendUrl}/auth/verifyToken`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCurrentUser(userRes.data.user);

      if (userRes.data.user.role !== 'MENTOR' && userRes.data.user.role !== 'ADMIN') {
        navigate('/unauthorized');
        return;
      }

      // Fetch mentor's webinars (already filtered by backend)
      const response = await axios.get(`${BackendUrl}/mentor/webinars`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setWebinars(response.data || []);
    } catch (err) {
      console.error('Error fetching webinars:', err);
      setWebinars([]);
    } finally {
      setLoading(false);
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get webinars for a specific date
  const getWebinarsForDate = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return webinars.filter(webinar => {
      const webinarDate = new Date(webinar.date);
      return (
        webinarDate.getDate() === targetDate.getDate() &&
        webinarDate.getMonth() === targetDate.getMonth() &&
        webinarDate.getFullYear() === targetDate.getFullYear()
      );
    });
  };

  const handleDayClick = (day: number) => {
    const dayWebinars = getWebinarsForDate(day);
    if (dayWebinars.length > 0) {
      setSelectedWebinar(dayWebinars[0]); // Show first webinar if multiple
      setShowModal(true);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-200"></div>
      );
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayWebinars = getWebinarsForDate(day);
      const isToday =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`h-24 border border-gray-200 p-2 cursor-pointer transition-all hover:bg-blue-50 ${
            isToday ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300' : 'bg-white'
          } ${dayWebinars.length > 0 ? 'hover:shadow-lg' : ''}`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>
            {day}
          </div>
          {dayWebinars.length > 0 && (
            <div className="space-y-1">
              {dayWebinars.slice(0, 2).map((webinar) => (
                <div
                  key={webinar.id}
                  className="text-xs p-1 rounded bg-gradient-to-r from-indigo-500 to-green-500 text-white"
                >
                  <div className="font-medium truncate">{webinar.title}</div>
                  <div className="text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(webinar.date)}
                  </div>
                </div>
              ))}
              {dayWebinars.length > 2 && (
                <div className="text-[10px] text-gray-500 text-center">
                  +{dayWebinars.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Processing />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <MentorSidebar />
      </div>
      <div className="block lg:hidden">
        <MentorMobileSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-30">
          <Header1 />
        </header>

        <main className="flex-1 pt-28 lg:pl-28 sm:pt-32 px-4 sm:px-6 md:px-8 overflow-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <CalendarIcon className="w-8 h-8 text-indigo-600" />
              My Webinar Schedule
            </h1>
            <p className="text-gray-600 text-sm">
              View all your scheduled webinars in a calendar view
            </p>
          </div>

          {/* Calendar Controls */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>

                <h2 className="text-xl font-bold text-gray-800 min-w-[200px] text-center">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>

                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <button
                onClick={goToToday}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-green-600 text-white rounded-lg hover:from-indigo-700 hover:to-green-700 transition shadow-sm"
              >
                Today
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-indigo-500">
              <div className="flex items-center gap-3">
                <Video className="w-8 h-8 text-indigo-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Webinars</p>
                  <p className="text-2xl font-bold text-gray-800">{webinars.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {webinars.filter(w => new Date(w.date) >= new Date()).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {webinars.filter(w => {
                      const d = new Date(w.date);
                      return d.getMonth() === currentDate.getMonth() && 
                             d.getFullYear() === currentDate.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Week days header */}
            <div className="grid grid-cols-7 bg-gray-100">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center font-semibold text-gray-700 text-sm border-r border-gray-200 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Legend</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-500"></div>
                <span className="text-sm text-gray-600">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-indigo-500 to-green-500"></div>
                <span className="text-sm text-gray-600">Scheduled webinar</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Webinar Details */}
      {showModal && selectedWebinar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-green-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedWebinar.title}</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    {new Date(selectedWebinar.date).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Description */}
              {selectedWebinar.description && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm">{selectedWebinar.description}</p>
                </div>
              )}

              {/* Package Info */}
              {selectedWebinar.package && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <PackageIcon className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-800">Package</span>
                  </div>
                  <p className="text-purple-700 font-medium">{selectedWebinar.package.name}</p>
                </div>
              )}

              {/* Zoom Link */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">Zoom Meeting Link</span>
                </div>
                <a
                  href={selectedWebinar.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm break-all underline"
                >
                  {selectedWebinar.zoomLink}
                </a>
              </div>

              {/* Creator Info */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-800">Created by</span>
                </div>
                <p className="text-green-700 font-medium">{currentUser?.name || 'You'}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 rounded-b-2xl border-t flex gap-3">
              <button
                onClick={() => {
                  window.open(selectedWebinar.zoomLink, '_blank');
                }}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-green-600 text-white rounded-lg hover:from-indigo-700 hover:to-green-700 transition font-medium flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                Join Meeting
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorCalendar;
