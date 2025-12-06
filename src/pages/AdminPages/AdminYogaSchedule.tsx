import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import gsap from 'gsap';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Eye, 
  EyeOff, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import Header1 from '@/components/Header';

interface YogaClass {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  location?: string;
  maxCapacity?: number;
  imageUrl?: string;
  isActive: boolean;
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

// Category mapping with teal/cyan colors
const getCategoryColor = (title: string): { category: string; color: string } => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('vinyasa') || titleLower.includes('flow')) {
    return { category: 'Vinyasa Flow', color: '#0891B2' };
  } else if (titleLower.includes('core') || titleLower.includes('strength')) {
    return { category: 'Core Strength Yoga', color: '#059669' };
  } else if (titleLower.includes('yin')) {
    return { category: 'Yin Yoga', color: '#06B6D4' };
  } else if (titleLower.includes('foundation') || titleLower.includes('basic')) {
    return { category: 'Foundation Yoga', color: '#10B981' };
  } else if (titleLower.includes('community')) {
    return { category: 'Community Class', color: '#14B8A6' };
  } else if (titleLower.includes('advanced')) {
    return { category: 'Advanced Session', color: '#0D9488' };
  }
  
  return { category: 'General Class', color: '#2DD4BF' };
};

const AdminYogaSchedule: React.FC = () => {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<YogaClass | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('All Classes');
  const [showInactive, setShowInactive] = useState(true);
  const [selectedClass, setSelectedClass] = useState<YogaClass | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // GSAP Refs for Create/Edit Modal
  const createModalRef = useRef<HTMLDivElement>(null);
  const createModalBackdropRef = useRef<HTMLDivElement>(null);
  const createModalContentRef = useRef<HTMLDivElement>(null);

  // GSAP Refs for Detail Modal
  const detailModalRef = useRef<HTMLDivElement>(null);
  const detailModalBackdropRef = useRef<HTMLDivElement>(null);
  const detailModalContentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    startTime: '',
    endTime: '',
    dayOfWeek: 'MONDAY',
    isRecurring: false,
    recurrencePattern: 'WEEKLY',
    location: '',
    maxCapacity: '',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  // GSAP Animation for Create/Edit Modal
  useEffect(() => {
    if (!createModalRef.current || !createModalBackdropRef.current || !createModalContentRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    if (showModal) {
      gsap.set(createModalRef.current, { display: 'flex' });
      
      tl.fromTo(
        createModalBackdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      )
      .fromTo(
        createModalContentRef.current,
        { 
          scale: 0.8,
          opacity: 0,
          y: 50
        },
        { 
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        },
        '-=0.2'
      );
    } else {
      tl.to(
        createModalContentRef.current,
        { 
          scale: 0.9,
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: 'power2.in'
        }
      )
      .to(
        createModalBackdropRef.current,
        { 
          opacity: 0,
          duration: 0.2
        },
        '-=0.1'
      )
      .set(createModalRef.current, { display: 'none' });
    }

    return () => {
      tl.kill();
    };
  }, [showModal]);

  // GSAP Animation for Detail Modal
  useEffect(() => {
    if (!detailModalRef.current || !detailModalBackdropRef.current || !detailModalContentRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    if (showDetailModal) {
      gsap.set(detailModalRef.current, { display: 'flex' });
      
      tl.fromTo(
        detailModalBackdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      )
      .fromTo(
        detailModalContentRef.current,
        { 
          scale: 0.8,
          opacity: 0,
          rotationX: -15
        },
        { 
          scale: 1,
          opacity: 1,
          rotationX: 0,
          duration: 0.5,
          ease: 'back.out(1.5)'
        },
        '-=0.2'
      );
    } else {
      tl.to(
        detailModalContentRef.current,
        { 
          scale: 0.9,
          opacity: 0,
          rotationX: 10,
          duration: 0.3,
          ease: 'power2.in'
        }
      )
      .to(
        detailModalBackdropRef.current,
        { 
          opacity: 0,
          duration: 0.2
        },
        '-=0.1'
      )
      .set(detailModalRef.current, { display: 'none' });
    }

    return () => {
      tl.kill();
    };
  }, [showDetailModal]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BackendUrl}/yoga-schedule/get-all-schedules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.schedules);
    } catch (err) {
      console.error('Failed to fetch classes', err);
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

  // **FIXED: Get classes for a specific date**
  const getClassesForDate = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayName = DAYS[targetDate.getDay() === 0 ? 6 : targetDate.getDay() - 1]; // Adjust for Sunday=0

    return classes.filter(cls => {
      if (!showInactive && !cls.isActive) return false;
      
      const { category } = getCategoryColor(cls.title);
      if (selectedFilter !== 'All Classes' && category !== selectedFilter) return false;
      
      // Check if class is on the same day of week
      if (cls.dayOfWeek !== dayName) return false;

      // **BUG FIX: For non-recurring classes, check if it's the exact date**
      if (!cls.isRecurring) {
        const classDate = new Date(cls.startTime);
        return (
          classDate.getDate() === targetDate.getDate() &&
          classDate.getMonth() === targetDate.getMonth() &&
          classDate.getFullYear() === targetDate.getFullYear()
        );
      }

      // For recurring classes, show on every matching day of week
      return true;
    });
  };

  const handleDayClick = (day: number) => {
    const dayClasses = getClassesForDate(day);
    if (dayClasses.length > 0) {
      setSelectedClass(dayClasses[0]);
      setShowDetailModal(true);
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

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        ...formData,
        maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : null,
      };

      if (editingClass) {
        await axios.put(`${BackendUrl}/yoga-schedule/${editingClass.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${BackendUrl}/yoga-schedule`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchClasses();
      resetForm();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save class');
    }
  };

  const handleEditClass = (cls: YogaClass) => {
    setEditingClass(cls);
    setFormData({
      title: cls.title,
      description: cls.description || '',
      instructor: cls.instructor,
      startTime: new Date(cls.startTime).toISOString().slice(0, 16),
      endTime: new Date(cls.endTime).toISOString().slice(0, 16),
      dayOfWeek: cls.dayOfWeek,
      isRecurring: cls.isRecurring,
      recurrencePattern: cls.recurrencePattern || 'WEEKLY',
      location: cls.location || '',
      maxCapacity: cls.maxCapacity?.toString() || '',
      imageUrl: cls.imageUrl || '',
      isActive: cls.isActive,
    });
    setShowModal(true);
    setShowDetailModal(false);
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BackendUrl}/yoga-schedule/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClasses();
      setShowDetailModal(false);
    } catch (err) {
      alert('Failed to delete class');
    }
  };

  const handleToggleActive = async (cls: YogaClass) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BackendUrl}/yoga-schedule/${cls.id}`,
        { ...cls, isActive: !cls.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchClasses();
    } catch (err) {
      alert('Failed to update class status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      startTime: '',
      endTime: '',
      dayOfWeek: 'MONDAY',
      isRecurring: false,
      recurrencePattern: 'WEEKLY',
      location: '',
      maxCapacity: '',
      imageUrl: '',
      isActive: true,
    });
    setEditingClass(null);
    setShowModal(false);
  };

  const activeCategories = Array.from(
    new Set(classes.map((cls) => getCategoryColor(cls.title).category))
  );

  // Render calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 sm:h-28 bg-gray-50 border border-gray-200"></div>
      );
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayClasses = getClassesForDate(day);
      const isToday =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`h-24 sm:h-28 border border-gray-200 p-2 cursor-pointer transition-all hover:bg-teal-50 ${
            isToday ? 'bg-teal-100 border-teal-500 ring-2 ring-teal-300' : 'bg-white'
          } ${dayClasses.length > 0 ? 'hover:shadow-lg' : ''}`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-teal-700' : 'text-gray-700'}`}>
            {day}
          </div>
          {dayClasses.length > 0 && (
            <div className="space-y-1">
              {dayClasses.slice(0, 2).map((cls) => {
                const { color } = getCategoryColor(cls.title);
                return (
                  <div
                    key={cls.id}
                    className={`text-xs p-1 rounded text-white ${!cls.isActive ? 'opacity-50' : ''}`}
                    style={{ backgroundColor: color }}
                  >
                    <div className="font-medium truncate flex items-center justify-between">
                      <span>{cls.title}</span>
                      {!cls.isActive && (
                        <span className="text-[8px] bg-red-500 px-1 rounded">OFF</span>
                      )}
                    </div>
                    <div className="text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(cls.startTime)}
                    </div>
                  </div>
                );
              })}
              {dayClasses.length > 2 && (
                <div className="text-[10px] text-gray-500 text-center">
                  +{dayClasses.length - 2} more
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="transition-transform duration-300">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="block lg:hidden">
          <MobileSidebar />
        </div>
      </div>

      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
        <Header1 />
      </header>
    <div className="min-h-screen bg-gradient-to-br mt-20  md:ml-0 lg:ml-20 from-cyan-50 via-teal-50 to-emerald-50 py-4 px-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Compact Hero Header */}
        <div className="relative bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 rounded-xl overflow-hidden mb-6">
          <div className="relative z-10 flex flex-col items-center justify-center py-6 sm:py-8 text-white px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 text-center flex items-center gap-2">
              <CalendarIcon className="w-8 h-8" />
              YOGA <span className="text-teal-200">SCHEDULE</span>
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100 text-center">
              Manage yoga class schedules in calendar view
            </p>
          </div>
        </div>

        {/* Admin Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6 justify-between">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add New Class</span>
          </button>

          <button
            onClick={() => setShowInactive(!showInactive)}
            className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-full shadow hover:shadow-lg transition-all text-sm sm:text-base"
          >
            {showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="font-medium">
              {showInactive ? 'Hide Inactive' : 'Show Inactive'}
            </span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="mb-4 sm:mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 sm:gap-3 justify-start sm:justify-center min-w-max sm:min-w-0 sm:flex-wrap">
            <button
              onClick={() => setSelectedFilter('All Classes')}
              className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
                selectedFilter === 'All Classes'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-teal-50'
              }`}
            >
              All Classes ⬥
            </button>
            {activeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${
                  selectedFilter === cat
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-teal-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-teal-50 rounded-lg transition"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-6 h-6 text-teal-600" />
              </button>

              <h2 className="text-xl font-bold text-gray-800 min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-teal-50 rounded-lg transition"
                aria-label="Next month"
              >
                <ChevronRight className="w-6 h-6 text-teal-600" />
              </button>
            </div>

            <button
              onClick={goToToday}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition shadow-sm"
            >
              Today
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-teal-500">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-teal-500" />
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-800">{classes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-emerald-500">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-800">
                  {classes.filter(c => c.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-cyan-500">
            <div className="flex items-center gap-3">
              <EyeOff className="w-8 h-8 text-cyan-500" />
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-800">
                  {classes.filter(c => !c.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Week days header */}
          <div className="grid grid-cols-7 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-3 text-center font-semibold text-white text-sm border-r border-teal-500 last:border-r-0"
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
              <div className="w-4 h-4 rounded bg-teal-100 border-2 border-teal-500"></div>
              <span className="text-sm text-gray-600">Today</span>
            </div>
            {activeCategories.slice(0, 4).map((cat) => {
              const color = getCategoryColor(cat).color;
              return (
                <div key={cat} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
                  <span className="text-sm text-gray-600">{cat}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Modal with GSAP */}
      <div 
        ref={detailModalRef}
        className="fixed inset-0 hidden items-center justify-center z-50 p-4"
      >
        <div 
          ref={detailModalBackdropRef}
          className="absolute inset-0 bg-black/50"
          onClick={() => setShowDetailModal(false)}
        />
        
        {selectedClass && (
          <div 
            ref={detailModalContentRef}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div 
              className="text-white p-6 rounded-t-2xl"
              style={{ 
                background: `linear-gradient(135deg, ${getCategoryColor(selectedClass.title).color} 0%, ${getCategoryColor(selectedClass.title).color}dd 100%)` 
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-white/30 px-2 py-1 rounded-full">
                      {getCategoryColor(selectedClass.title).category}
                    </span>
                    {!selectedClass.isActive && (
                      <span className="text-xs bg-red-500 px-2 py-1 rounded-full font-bold">
                        INACTIVE
                      </span>
                    )}
                    {!selectedClass.isRecurring && (
                      <span className="text-xs bg-purple-500 px-2 py-1 rounded-full font-bold">
                        ONE-TIME
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{selectedClass.title}</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    {formatTime(selectedClass.startTime)} - {formatTime(selectedClass.endTime)}
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <CalendarIcon className="w-4 h-4" />
                    {selectedClass.isRecurring ? `Every ${selectedClass.dayOfWeek}` : new Date(selectedClass.startTime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {selectedClass.description && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm">{selectedClass.description}</p>
                </div>
              )}

              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-gray-800">Instructor</span>
                </div>
                <p className="text-teal-700 font-medium">{selectedClass.instructor}</p>
              </div>

              {selectedClass.location && (
                <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-5 h-5 text-cyan-600" />
                    <span className="font-semibold text-gray-800">Location</span>
                  </div>
                  <p className="text-cyan-700 font-medium">{selectedClass.location}</p>
                </div>
              )}

              {selectedClass.maxCapacity && (
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-gray-800">Max Capacity</span>
                  </div>
                  <p className="text-emerald-700 font-medium">{selectedClass.maxCapacity} students</p>
                </div>
              )}
            </div>

            {/* Modal Footer - Admin Actions */}
            <div className="bg-gray-50 p-4 rounded-b-2xl border-t flex gap-3">
              <button
                onClick={() => handleToggleActive(selectedClass)}
                className={`flex-1 py-3 rounded-lg transition font-medium flex items-center justify-center gap-2 ${
                  selectedClass.isActive 
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {selectedClass.isActive ? (
                  <>
                    <EyeOff className="w-5 h-5" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    Activate
                  </>
                )}
              </button>
              <button
                onClick={() => handleEditClass(selectedClass)}
                className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition font-medium flex items-center justify-center gap-2"
              >
                <Edit2 className="w-5 h-5" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteClass(selectedClass.id)}
                className="flex-1 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal with GSAP */}
      <div 
        ref={createModalRef}
        className="fixed inset-0 hidden items-center justify-center z-50 p-3 sm:p-4"
      >
        <div 
          ref={createModalBackdropRef}
          className="absolute inset-0 bg-black/50"
          onClick={resetForm}
        />
        
        <div 
          ref={createModalContentRef}
          className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        >
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {editingClass ? 'Edit Class' : 'Create New Class'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Title *
                  <span className="text-xs text-gray-500 ml-2 block sm:inline mt-1 sm:mt-0">
                    (Include keywords: Vinyasa, Core, Yin, Foundation, Community, Advanced)
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base"
                  placeholder="e.g., Morning Vinyasa Flow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base"
                  placeholder="Brief description of the class..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructor *</label>
                  <input
                    type="text"
                    required
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base"
                    placeholder="Instructor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week *</label>
                  <select
                    required
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base"
                  >
                    {DAYS.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base"
                    placeholder="Studio A, Main Hall, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Capacity</label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base"
                    placeholder="e.g., 20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm sm:text-base"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                    Recurring Weekly
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Active (Visible to users)
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  {editingClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminYogaSchedule;
