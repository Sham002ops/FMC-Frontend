import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BackendUrl } from '@/Config';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';

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
const TIME_SLOTS = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// Category mapping based on title keywords
const getCategoryColor = (title: string): { category: string; color: string } => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('vinyasa') || titleLower.includes('flow')) {
    return { category: 'Vinyasa Flow', color: '#60A5FA' };
  } else if (titleLower.includes('core') || titleLower.includes('strength')) {
    return { category: 'Core Strength Yoga', color: '#F87171' };
  } else if (titleLower.includes('yin')) {
    return { category: 'Yin Yoga', color: '#A78BFA' };
  } else if (titleLower.includes('foundation') || titleLower.includes('basic')) {
    return { category: 'Foundation Yoga', color: '#FB923C' };
  } else if (titleLower.includes('community')) {
    return { category: 'Community Class', color: '#34D399' };
  } else if (titleLower.includes('advanced')) {
    return { category: 'Advanced Session', color: '#10B981' };
  }
  
  return { category: 'General Class', color: '#8B5CF6' };
};

const AdminYogaSchedule: React.FC = () => {
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<YogaClass | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('All Classes');
  const [showInactive, setShowInactive] = useState(true);

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

  const fetchClasses = async () => {
    try {
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
      // Filter by active status
      if (!showInactive && !cls.isActive) return false;
      
      const { category } = getCategoryColor(cls.title);
      if (selectedFilter !== 'All Classes' && category !== selectedFilter) return false;
      if (cls.dayOfWeek !== day) return false;
      
      const classStart = new Date(cls.startTime);
      const slotHour = parseInt(timeSlot.split(':')[0]);
      return classStart.getHours() === slotHour;
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
      isActive: cls.isActive,
    });
    setShowModal(true);
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) return;
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

  const handleToggleActive = async (cls: YogaClass) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${BackendUrl}/yoga-schedule/${cls.id}`,
        { isActive: !cls.isActive },
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

  // Get unique categories from current classes
  const activeCategories = Array.from(
    new Set(classes.map((cls) => getCategoryColor(cls.title).category))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Hero Header */}
        <div
          className="relative bg-cover bg-center rounded-3xl overflow-hidden mb-8"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200)',
            height: '280px',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-800/70" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-3">
              ADMIN <span className="text-pink-300">SCHEDULE</span>
            </h1>
            <p className="text-lg text-gray-200">Manage yoga class schedules and timings</p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span>Admin</span>
              <span>›</span>
              <span className="text-pink-300">Yoga Schedule Management</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Controls */}
        <div className="flex flex-wrap gap-3 mb-6 justify-between items-center">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedFilter('All Classes')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedFilter === 'All Classes'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Classes ⬥
            </button>
            {activeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedFilter === cat
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowInactive(!showInactive)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow hover:shadow-lg transition-all"
          >
            {showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {showInactive ? 'Hide Inactive' : 'Show Inactive'}
            </span>
          </button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow hover:shadow-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold text-gray-800">{formatDateRange()}</h2>

          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow hover:shadow-lg transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Add Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Class
          </button>
        </div>

        {/* Schedule Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                    <th className="py-4 px-4 text-left font-semibold">TIME</th>
                    {DAYS.map((day, index) => (
                      <th key={day} className="py-4 px-4 text-center font-semibold">
                        <div className="text-sm uppercase tracking-wide">{day}</div>
                        <div className="text-xs opacity-90 mt-1">
                          {weekDates[index].toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((timeSlot) => (
                    <tr key={timeSlot} className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors">
                      <td className="py-6 px-4 font-semibold text-gray-700 align-top">{timeSlot}</td>
                      {DAYS.map((day) => {
                        const slotClasses = getClassesForSlot(day, timeSlot);
                        return (
                          <td key={`${day}-${timeSlot}`} className="py-3 px-2 align-top">
                            {slotClasses.map((cls) => {
                              const { category, color } = getCategoryColor(cls.title);
                              return (
                                <div
                                  key={cls.id}
                                  className={`mb-2 p-3 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer relative group ${
                                    !cls.isActive ? 'opacity-50' : ''
                                  }`}
                                  style={{ backgroundColor: `${color}20`, borderLeft: `4px solid ${color}` }}
                                  onClick={() => handleEditClass(cls)}
                                >
                                  {/* Inactive Badge */}
                                  {!cls.isActive && (
                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                      INACTIVE
                                    </div>
                                  )}

                                  <div className="text-xs font-bold text-gray-800 mb-1">
                                    {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                                  </div>
                                  <div
                                    className="text-xs font-semibold px-2 py-1 rounded-full inline-block mb-1 text-white"
                                    style={{ backgroundColor: color }}
                                  >
                                    {category}
                                  </div>
                                  <div className="text-sm font-medium text-gray-700">{cls.title}</div>
                                  <div className="text-xs text-gray-600">with {cls.instructor}</div>
                                  {cls.location && (
                                    <div className="text-xs text-gray-500 mt-1">📍 {cls.location}</div>
                                  )}
                                  {cls.maxCapacity && (
                                    <div className="text-xs text-gray-500">👥 Max: {cls.maxCapacity}</div>
                                  )}

                                  {/* Admin Actions */}
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleActive(cls);
                                      }}
                                      className={`p-1 bg-white rounded-full shadow ${
                                        cls.isActive ? 'hover:bg-yellow-50' : 'hover:bg-green-50'
                                      }`}
                                      title={cls.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                      {cls.isActive ? (
                                        <EyeOff className="w-3 h-3 text-yellow-600" />
                                      ) : (
                                        <Eye className="w-3 h-3 text-green-600" />
                                      )}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClass(cls);
                                      }}
                                      className="p-1 bg-white rounded-full shadow hover:bg-blue-50"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-3 h-3 text-blue-600" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClass(cls.id);
                                      }}
                                      className="p-1 bg-white rounded-full shadow hover:bg-red-50"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3 h-3 text-red-600" />
                                    </button>
                                  </div>
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
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                      <span className="text-xs text-gray-500 ml-2">
                        (Include keywords: Vinyasa, Core, Yin, Foundation, Community, Advanced)
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="e.g., Morning Vinyasa Flow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="Brief description of the class..."
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Instructor name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week *</label>
                      <select
                        required
                        value={formData.dayOfWeek}
                        onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                      <input
                        type="datetime-local"
                        required
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Studio A, Main Hall, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Capacity</label>
                      <input
                        type="number"
                        value={formData.maxCapacity}
                        onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        checked={formData.isRecurring}
                        onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
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
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Active (Visible to users)
                      </label>
                    </div>
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
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {editingClass ? 'Update Class' : 'Create Class'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminYogaSchedule;
