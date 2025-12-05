import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, X, Save, Calendar, List } from 'lucide-react';
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
const DAYS_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const DAYS_MOBILE = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const TIME_SLOTS = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

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
  const [weekOffset, setWeekOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<YogaClass | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('All Classes');
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week');
  const [selectedClass, setSelectedClass] = useState<YogaClass | null>(null);

  // GSAP Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // GSAP Animation Effect
  useEffect(() => {
    if (!modalRef.current || !backdropRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    if (isOpen) {
      // Open animation
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
      // Close animation
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

  const fetchClasses = async () => {
    try {
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

  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
    
    return DAYS.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  };

  const weekDates = getWeekDates();
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', options)}`;
  };

  const getClassesForSlot = (day: string, timeSlot: string) => {
    return classes.filter((cls) => {
      const { category } = getCategoryColor(cls.title);
      if (selectedFilter !== 'All Classes' && category !== selectedFilter) return false;
      if (cls.dayOfWeek !== day) return false;
      
      const classStart = new Date(cls.startTime);
      const slotHour = parseInt(timeSlot.split(':')[0]);
      return classStart.getHours() === slotHour;
    });
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
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
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
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Delete this class?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BackendUrl}/yoga-schedule/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchClasses();
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

  return (
    <div 
      ref={modalRef}
      className="fixed  inset-0 z-50 hidden items-center justify-center "
    >
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        className="absolute -inset-10 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div 
        ref={contentRef}
        className="relative bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden"
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
          <div className="relative bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 rounded-xl overflow-hidden mb-3">
            <div className="relative z-10 flex flex-col items-center justify-center py-6 sm:py-4 text-white px-4 sm:px-6">
              <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-1 sm:mb-2 text-center">
                CLASS <span className="text-teal-200">SCHEDULE</span>
              </h1>
              <p className="text-xs sm:text-sm text-cyan-100 text-center">
                Choose your perfect class timing
              </p>
            </div>
          </div>

          {/* Admin Add Button */}
          {isAdmin && (
            <div className="mb-4 sm:mb-6 flex justify-end">
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add New Class</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="mb-4 sm:mb-2 overflow-x-auto ">
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

          {/* Week Navigation & View Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-3">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={() => setWeekOffset(weekOffset - 1)}
                className="flex items-center gap-1 sm:gap-2 bg-white px-3 sm:px-4 py-2 rounded-full shadow hover:shadow-lg transition-all hover:bg-cyan-50"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              </button>

              <h2 className="text-sm sm:text-xl md:text-2xl font-bold text-gray-800 text-center">
                {formatDateRange()}
              </h2>

              <button
                onClick={() => setWeekOffset(weekOffset + 1)}
                className="flex items-center gap-1 sm:gap-2 bg-white px-3 sm:px-4 py-2 rounded-full shadow hover:shadow-lg transition-all hover:bg-cyan-50"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white rounded-full p-1 shadow w-full sm:w-auto">
              <button
                onClick={() => setViewMode('week')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  viewMode === 'week' ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-teal-50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Week</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  viewMode === 'list' ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-teal-50'
                }`}
              >
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
            </div>
          ) : (
            <>
              {/* MOBILE COMPACT CALENDAR VIEW */}
              <div className={`md:hidden ${viewMode === 'week' ? 'block' : 'hidden'}`}>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="grid grid-cols-8 border-b border-gray-200 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600">
                    <div className="p-2 text-[10px] font-semibold text-white">TIME</div>
                    {DAYS.map((day, index) => (
                      <div key={day} className="p-2 text-center">
                        <div className="text-[10px] font-semibold text-white">
                          {DAYS_MOBILE[index]}
                        </div>
                        <div className="text-[9px] text-teal-100 mt-0.5">
                          {weekDates[index].getDate()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="max-h-[50vh] overflow-y-auto">
                    {TIME_SLOTS.map((timeSlot) => (
                      <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-100">
                        <div className="p-2 text-[10px] font-semibold text-gray-700 bg-gray-50 sticky left-0">
                          {timeSlot}
                        </div>
                        {DAYS.map((day) => {
                          const slotClasses = getClassesForSlot(day, timeSlot);
                          return (
                            <div key={`${day}-${timeSlot}`} className="p-1 min-h-[50px] relative">
                              {slotClasses.map((cls) => {
                                const { color } = getCategoryColor(cls.title);
                                return (
                                  <div
                                    key={cls.id}
                                    className="w-full h-full rounded cursor-pointer relative"
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedClass(cls)}
                                  >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-cyan-50 border-t">
                    <p className="text-[10px] text-gray-600 mb-2 font-semibold">Tap colored dots for details</p>
                    <div className="flex flex-wrap gap-2">
                      {activeCategories.slice(0, 4).map((cat) => {
                        const color = getCategoryColor(cat).color;
                        return (
                          <div key={cat} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                            <span className="text-[9px] text-gray-600">{cat}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* DESKTOP TABLE VIEW */}
              <div className={`hidden md:block ${viewMode === 'week' ? '' : 'md:hidden'}`}>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white">
                          <th className="py-3 px-3 text-left font-semibold text-sm">TIME</th>
                          {DAYS.map((day, index) => (
                            <th key={day} className="py-3 px-2 text-center font-semibold w-[13%]">
                              <div className="text-xs uppercase tracking-wide">
                                <span className="hidden xl:inline">{day}</span>
                                <span className="xl:hidden">{DAYS_SHORT[index]}</span>
                              </div>
                              <div className="text-[10px] opacity-90 mt-1">
                                {weekDates[index].toLocaleDateString('en-US', { 
                                  month: 'numeric', 
                                  day: 'numeric'
                                })}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {TIME_SLOTS.map((timeSlot) => (
                          <tr key={timeSlot} className="border-b border-gray-100 hover:bg-teal-50/30 transition-colors">
                            <td className="py-4 px-3 font-semibold text-gray-700 align-top text-sm">
                              {timeSlot}
                            </td>
                            {DAYS.map((day) => {
                              const slotClasses = getClassesForSlot(day, timeSlot);
                              return (
                                <td key={`${day}-${timeSlot}`} className="py-2 px-2 align-top">
                                  {slotClasses.map((cls) => {
                                    const { category, color } = getCategoryColor(cls.title);
                                    return (
                                      <div
                                        key={cls.id}
                                        className="mb-2 p-2 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
                                        style={{ backgroundColor: `${color}20`, borderLeft: `3px solid ${color}` }}
                                        onClick={() => isAdmin ? handleEditClass(cls) : setSelectedClass(cls)}
                                      >
                                        <div className="text-[10px] font-bold text-gray-800 mb-1">
                                          {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                                        </div>
                                        <div
                                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full inline-block mb-1 text-white"
                                          style={{ backgroundColor: color }}
                                        >
                                          {category}
                                        </div>
                                        <div className="text-xs font-medium text-gray-700 line-clamp-1">
                                          {cls.title}
                                        </div>
                                        <div className="text-[10px] text-gray-600 line-clamp-1">
                                          with {cls.instructor}
                                        </div>
                                        {cls.location && (
                                          <div className="text-[10px] text-gray-500 mt-1 line-clamp-1">
                                            📍 {cls.location}
                                          </div>
                                        )}

                                        {isAdmin && (
                                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClass(cls);
                                              }}
                                              className="p-1 bg-white rounded-full shadow hover:bg-cyan-50"
                                            >
                                              <Edit2 className="w-3 h-3 text-cyan-600" />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClass(cls.id);
                                              }}
                                              className="p-1 bg-white rounded-full shadow hover:bg-red-50"
                                            >
                                              <Trash2 className="w-3 h-3 text-red-600" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* LIST VIEW */}
              <div className={`space-y-3 sm:space-y-4 ${viewMode === 'list' ? 'block' : 'hidden'}`}>
                {getFilteredClasses().map((cls) => {
                  const { category, color } = getCategoryColor(cls.title);
                  return (
                    <div
                      key={cls.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-4 sm:p-5"
                      style={{ borderLeft: `4px solid ${color}` }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div
                            className="text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-2 text-white"
                            style={{ backgroundColor: color }}
                          >
                            {category}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                            {cls.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">with {cls.instructor}</p>
                        </div>
                        
                        {isAdmin && (
                          <div className="flex gap-2 ml-2">
                            <button
                              onClick={() => handleEditClass(cls)}
                              className="p-2 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-cyan-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteClass(cls.id)}
                              className="p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <span className="font-medium">{cls.dayOfWeek}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="font-semibold text-teal-600">
                            {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                          </span>
                        </div>
                        {cls.location && (
                          <div className="col-span-2 flex items-center gap-2 text-gray-600">
                            <span>📍</span>
                            <span>{cls.location}</span>
                          </div>
                        )}
                        {cls.maxCapacity && (
                          <div className="col-span-2 text-gray-600">
                            Max Capacity: {cls.maxCapacity} people
                          </div>
                        )}
                      </div>

                      {cls.description && (
                        <p className="mt-3 text-sm text-gray-600 border-t pt-3">
                          {cls.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default YogaScheduleModal;
