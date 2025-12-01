import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import Header1 from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, Edit, Plus } from 'lucide-react';

interface Package {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'NORMAL' | 'YOGA';
  isActive: boolean;
  packageId: string;
  package?: Package;
  _count?: {
    completions: number;
  };
}

const AdminTasksManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'NORMAL',
    packageId: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    await Promise.all([fetchTasks(), fetchPackages()]);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BackendUrl}/tasks/admin/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = Array.isArray(res.data?.tasks)
        ? res.data.tasks
        : Array.isArray(res.data)
        ? res.data
        : [];
      setTasks(payload);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch tasks',
        variant: 'destructive',
      });
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BackendUrl}/package/allpackages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = Array.isArray(res.data?.packages)
        ? res.data.packages
        : Array.isArray(res.data)
        ? res.data
        : [];
      const mapped = payload.map((p: any) => ({ id: p.id, name: p.name }));
      setPackages(mapped);
    } catch (error: any) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch packages',
        variant: 'destructive',
      });
      setPackages([]);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'NORMAL',
      packageId: '',
    });
    setSelectedTask(null);
  };

  const handleCreateTask = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      if (!formData.title || !formData.packageId) {
        toast({
          title: 'Validation',
          description: 'Title and package are required',
          variant: 'destructive',
        });
        setSubmitting(false);
        return;
      }

      await axios.post(
        `${BackendUrl}/tasks/admin/tasks`,
        {
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          packageId: formData.packageId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Success',
        description: 'Task created successfully',
      });

      setShowCreateModal(false);
      resetForm();
      fetchTasks();
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create task',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      await axios.patch(
        `${BackendUrl}/tasks/admin/tasks/${selectedTask.id}`,
        {
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          isActive: selectedTask.isActive,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });

      setShowEditModal(false);
      resetForm();
      fetchTasks();
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update task',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      await axios.delete(`${BackendUrl}/tasks/admin/tasks/${selectedTask.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });

      setShowDeleteModal(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete task',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      type: task.type,
      packageId: task.packageId,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const getPackageName = (task: Task) => {
    if (task.package?.name) return task.package.name;
    const p = packages.find((pkg) => pkg.id === task.packageId);
    return p?.name || '—';
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

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
          <Header1 />
        </header>

        {/* Main Content */}
        <main className="flex-1 pt-28 sm:pt-28 lg:pl-28 px-4 sm:px-6 md:px-8 overflow-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
              Task & Yoga Task Management
            </h1>
            <Button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={18} />
              Create Task
            </Button>
          </div>

          {tasks.length === 0 ? (
            <p className="text-center text-gray-600 mt-16 sm:mt-20">
              No tasks found.
            </p>
          ) : (
            <>
              {/* Desktop & Tablet Table */}
              <div className="hidden sm:flex flex-col items-center w-full">
                <div className="w-full max-w-screen-xl mx-auto bg-white shadow rounded-xl overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200 text-base">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Package
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Completed Users
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-6 py-4 text-center font-semibold text-gray-600 uppercase tracking-wide">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 whitespace-nowrap text-gray-800 font-medium">
                            {task.title}
                            {task.description && (
                              <div className="text-xs text-gray-500 mt-1 max-w-md truncate">
                                {task.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                task.type === 'YOGA'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {task.type === 'YOGA' ? 'Yoga Task' : 'General'}
                            </span>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            {getPackageName(task)}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            {task._count?.completions ?? 0}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                task.isActive
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {task.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                onClick={() => openEditModal(task)}
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Edit size={16} />
                                Edit
                              </Button>
                              <Button
                                onClick={() => openDeleteModal(task)}
                                size="sm"
                                variant="destructive"
                                className="flex items-center gap-1"
                              >
                                <Trash2 size={16} />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-4 rounded-lg shadow border border-gray-200"
                  >
                    <h2 className="font-semibold text-lg text-gray-800 mb-1">
                      {task.title}
                    </h2>
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-2">
                        {task.description}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Type:</strong>{' '}
                      {task.type === 'YOGA' ? 'Yoga Task' : 'General Task'}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Package:</strong> {getPackageName(task)}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Completed Users:</strong>{' '}
                      {task._count?.completions ?? 0}
                    </p>
                    <p className="text-gray-600 text-sm mb-3">
                      <strong>Status:</strong>{' '}
                      {task.isActive ? 'Active' : 'Inactive'}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openEditModal(task)}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => openDeleteModal(task)}
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Create Task Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Create a general or yoga task and assign it to a package.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Morning Yoga Practice"
              />
            </div>
            <div>
              <Label htmlFor="task-description">Description</Label>
              <Input
                id="task-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Short description of the task"
              />
            </div>
            <div>
              <Label htmlFor="task-type">Task Type</Label>
              <select
                id="task-type"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'NORMAL' | 'YOGA',
                  })
                }
              >
                <option value="NORMAL">General Task</option>
                <option value="YOGA">Yoga Task</option>
              </select>
            </div>
            <div>
              <Label htmlFor="task-package">Assign to Package</Label>
              <select
                id="task-package"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                value={formData.packageId}
                onChange={(e) =>
                  setFormData({ ...formData, packageId: e.target.value })
                }
              >
                <option value="">Select package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={submitting}>
              {submitting ? <Processing /> : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-task-title">Title</Label>
              <Input
                id="edit-task-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-task-description">Description</Label>
              <Input
                id="edit-task-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-task-type">Task Type</Label>
              <select
                id="edit-task-type"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'NORMAL' | 'YOGA',
                  })
                }
              >
                <option value="NORMAL">General Task</option>
                <option value="YOGA">Yoga Task</option>
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <p className="text-sm text-gray-600 mt-1">
                Status can be toggled from a separate control later if you want
                (currently using existing isActive value).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTask} disabled={submitting}>
              {submitting ? <Processing /> : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong>{selectedTask?.title}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTask}
              disabled={submitting}
            >
              {submitting ? <Processing /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTasksManagement;
