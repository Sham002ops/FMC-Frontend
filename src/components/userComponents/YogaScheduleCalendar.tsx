import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  List
} from 'lucide-react';
import gsap from 'gsap';

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

interface YogaScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const YogaScheduleModal: React.FC<YogaScheduleModalProps> = ({ isOpen, onClose, isAdmin = false }) => {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<YogaClass | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('All Classes');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedClass, setSelectedClass] = useState<YogaClass | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // GSAP Refs for Main Modal
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
  });

  useEffect(() => {
    if (isOpen) {
      fetchClasses();
    }
  }, [isOpen]);

  // GSAP Animation for Main Modal
  useEffect(() => {
    if (!modalRef.current || !backdropRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    if (isOpen) {
      gsap.set(modalRef.current, { display: 'flex' });
      
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      )
      .fromTo(
        contentRef.current,
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
          ease: 'back.out(1.4)'
        },
        '-=0.2'
      );
    } else {
      tl.to(
        contentRef.current,
        { 
          scale: 0.9,
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: 'power2.in'
        }
      )
      .to(
        backdropRef.current,
        { 
          opacity: 0,
          duration: 0.2
        },
        '-=0.1'
      )
      .set(modalRef.current, { display: 'none' });
    }

    return () => {
      tl.kill();
    };
  }, [isOpen]);

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
      const endpoint = isAdmin ? '/yoga-schedule' : '/yoga-schedule/active';
      const token = localStorage.getItem('token');
      const headers = isAdmin ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await axios.get(`${BackendUrl}${endpoint}`, { headers });
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
    const dayName = DAYS[targetDate.getDay() === 0 ? 6 : targetDate.getDay() - 1];

    return classes.filter(cls => {
      const { category } = getCategoryColor(cls.title);
      if (selectedFilter !== 'All Classes' && category !== selectedFilter) return false;
      
      if (cls.dayOfWeek !== dayName) return false;

      // **BUG FIX: For non-recurring classes, check exact date**
      if (!cls.isRecurring) {
        const classDate = new Date(cls.startTime);
        return (
          classDate.getDate() === targetDate.getDate() &&
          classDate.getMonth() === targetDate.getMonth() &&
          classDate.getFullYear() === targetDate.getFullYear()
        );
      }

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

  const getFilteredClasses = () => {
    return classes.filter((cls) => {
      const { category } = getCategoryColor(cls.title);
      if (selectedFilter !== 'All Classes' && category !== selectedFilter) return false;
      return true;
    }).sort((a, b) => {
      const dayOrder = DAYS.indexOf(a.dayOfWeek) - DAYS.indexOf(b.dayOfWeek);
      if (dayOrder !== 0) return dayOrder;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
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
    });
    setShowModal(true);
    setShowDetailModal(false);
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Delete this class?')) return;
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
    });
    setEditingClass(null);
    setShowModal(false);
  };

  const activeCategories = Array.from(
    new Set(classes.map((cls) => getCategoryColor(cls.title).category))
  );

  const handleClose = () => {
    onClose();
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 sm:h-24 bg-gray-50 border border-gray-200"></div>
      );
    }

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
          className={`h-20 sm:h-24 border border-gray-200 p-1.5 sm:p-2 cursor-pointer transition-all hover:bg-teal-50 ${
            isToday ? 'bg-teal-100 border-teal-500 ring-2 ring-teal-300' : 'bg-white'
          } ${dayClasses.length > 0 ? 'hover:shadow-lg' : ''}`}
        >
          <div className={`text-xs sm:text-sm font-semibold mb-1 ${isToday ? 'text-teal-700' : 'text-gray-700'}`}>
            {day}
          </div>
          {dayClasses.length > 0 && (
            <div className="space-y-0.5">
              {dayClasses.slice(0, 2).map((cls) => {
                const { color } = getCategoryColor(cls.title);
                return (
                  <div
                    key={cls.id}
                    className="text-[10px] p-0.5 sm:p-1 rounded text-white"
                    style={{ backgroundColor: color }}
                  >
                    <div className="font-medium truncate flex items-center justify-between">
                      <span className="truncate">{cls.title}</span>
                      {!cls.isRecurring && (
                        <span className="text-[8px] bg-purple-600 px-1 rounded ml-1">1x</span>
                      )}
                    </div>
                    <div className="text-[9px] flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTime(cls.startTime)}
                    </div>
                  </div>
                );
              })}
              {dayClasses.length > 2 && (
                <div className="text-[9px] text-gray-500 text-center">
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

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 hidden items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div 
        ref={contentRef}
        className="relative bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[95vh] p-4 sm:p-6">
          {/* Compact Hero Header */}
          <div className="relative bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 rounded-xl overflow-hidden mb-4">
            <div className="relative z-10 flex flex-col items-center justify-center py-4 sm:py-6 text-white px-4">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-center flex items-center gap-2">
                <CalendarIcon className="w-7 h-7" />
                CLASS <span className="text-teal-200">SCHEDULE</span>
              </h1>
              <p className="text-xs sm:text-sm text-cyan-100 text-center">
                Choose your perfect class timing
              </p>
            </div>
          </div>

          {/* Admin Add Button */}
          {isAdmin && (
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 sm:px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Class</span>
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="mb-4 overflow-x-auto pb-2">
            <div className="flex gap-2 justify-start sm:justify-center min-w-max sm:min-w-0 sm:flex-wrap">
              <button
                onClick={() => setSelectedFilter('All Classes')}
                className={`px-4 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm ${
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
                  className={`px-4 py-2 rounded-full font-semibold transition-all whitespace-nowrap text-sm ${
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

          {/* Calendar Controls & View Toggle */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-teal-50 rounded-lg transition"
                >
                  <ChevronLeft className="w-5 h-5 text-teal-600" />
                </button>

                <h2 className="text-lg sm:text-xl font-bold text-gray-800 min-w-[180px] text-center">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>

                <button
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-teal-50 rounded-lg transition"
                >
                  <ChevronRight className="w-5 h-5 text-teal-600" />
                </button>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={goToToday}
                  className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition text-sm"
                >
                  Today
                </button>

                {/* View Toggle */}
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                      viewMode === 'calendar' ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-white'
                    }`}
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Calendar</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                      viewMode === 'list' ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
            </div>
          ) : (
            <>
              {/* CALENDAR VIEW */}
              <div className={`${viewMode === 'calendar' ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Week days header */}
                  <div className="grid grid-cols-7 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="p-2 sm:p-3 text-center font-semibold text-white text-xs sm:text-sm border-r border-teal-500 last:border-r-0"
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
                <div className="mt-4 bg-white rounded-lg shadow p-3">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm">Legend</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-teal-100 border-2 border-teal-500"></div>
                      <span className="text-xs text-gray-600">Today</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs bg-purple-600 text-white px-1.5 py-0.5 rounded">1x</span>
                      <span className="text-xs text-gray-600">One-time class</span>
                    </div>
                    {activeCategories.slice(0, 3).map((cat) => {
                      const color = getCategoryColor(cat).color;
                      return (
                        <div key={cat} className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: color }}></div>
                          <span className="text-xs text-gray-600">{cat}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* LIST VIEW */}
              <div className={`space-y-3 ${viewMode === 'list' ? 'block' : 'hidden'}`}>
                {getFilteredClasses().map((cls) => {
                  const { category, color } = getCategoryColor(cls.title);
                  return (
                    <div
                      key={cls.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 cursor-pointer"
                      style={{ borderLeft: `4px solid ${color}` }}
                      onClick={() => {
                        setSelectedClass(cls);
                        setShowDetailModal(true);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: color }}
                            >
                              {category}
                            </div>
                            {!cls.isRecurring && (
                              <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                                One-time
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-gray-900 mb-1">
                            {cls.title}
                          </h3>
                          <p className="text-sm text-gray-600">with {cls.instructor}</p>
                        </div>
                        
                        {isAdmin && (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClass(cls);
                              }}
                              className="p-2 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-cyan-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClass(cls.id);
                              }}
                              className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <CalendarIcon className="w-4 h-4 text-teal-600" />
                          <span className="font-medium">
                            {cls.isRecurring ? `Every ${cls.dayOfWeek}` : new Date(cls.startTime).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-teal-600" />
                          <span className="font-semibold">
                            {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                          </span>
                        </div>
                        {cls.location && (
                          <div className="col-span-2 flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{cls.location}</span>
                          </div>
                        )}
                        {cls.maxCapacity && (
                          <div className="col-span-2 flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>Max: {cls.maxCapacity} people</span>
                          </div>
                        )}
                      </div>

                      {cls.description && (
                        <p className="mt-3 text-sm text-gray-600 border-t pt-2">
                          {cls.description}
                        </p>
                      )}
                    </div>
                  );
                })}

                {getFilteredClasses().length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <p className="text-gray-500">No classes found.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <div 
        ref={detailModalRef}
        className="fixed inset-0 hidden items-center justify-center z-[60] p-4"
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
                    {!selectedClass.isRecurring && (
                      <span className="text-xs bg-purple-600 px-2 py-1 rounded-full font-bold">
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

            <div className="bg-gray-50 p-4 rounded-b-2xl border-t flex gap-3">
              {isAdmin && (
                <>
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
                </>
              )}
              {!isAdmin && (
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition font-medium"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isAdmin && (
        <div 
          ref={createModalRef}
          className="fixed inset-0 hidden items-center justify-center z-[70] p-4"
        >
          <div 
            ref={createModalBackdropRef}
            className="absolute inset-0 bg-black/50"
            onClick={resetForm}
          />
          
          <div 
            ref={createModalContentRef}
            className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingClass ? 'Edit Class' : 'Create New Class'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateClass} className="space-y-4">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="e.g., Morning Vinyasa Flow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructor *</label>
                    <input
                      type="text"
                      required
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week *</label>
                    <select
                      required
                      value={formData.dayOfWeek}
                      onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                      {DAYS.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Capacity</label>
                    <input
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

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

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingClass ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YogaScheduleModal;
