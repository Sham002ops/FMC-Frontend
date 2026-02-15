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
import { Trash2, Edit, Plus, Link as LinkIcon } from 'lucide-react';

interface Package {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  shareableLink?: string;
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shareableLink: '',
    type: 'NORMAL' as 'NORMAL' | 'YOGA',
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
      shareableLink: '',
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
          shareableLink: formData.shareableLink || undefined,
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
          shareableLink: formData.shareableLink || undefined,
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
      shareableLink: task.shareableLink || '',
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
    <div className="min-h-screen flex bg-gray-50">
      {/* ✅ Sidebar - Fixed positioning */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-30">
        <Sidebar />
      </div>
      <div className="lg:hidden">
        <MobileSidebar />
      </div>

      {/* ✅ Main Content Area - Adjusted for sidebar */}
      <div className="flex-1 flex flex-col lg:ml-16 w-full">
        {/* ✅ Fixed Header */}
        <header className="fixed top-0 right-0 left-0 lg:left-16 bg-white shadow-sm z-40 h-16">
          <Header1 />
        </header>

        {/* ✅ Main Content - Properly padded */}
        <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 pb-8 overflow-auto">
          {/* ✅ Page Header - Always visible */}
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Task & Yoga Task Management
              </h1>
              
              {/* ✅ Desktop/Tablet Button - Always visible */}
              <Button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 shrink-0"
              >
                <Plus size={18} />
                <span>New Task</span>
              </Button>
            </div>

            {/* ✅ Content Area */}
            {tasks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No tasks found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Get started by creating your first task
                  </p>
                  <Button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700">
                    <Plus size={18} className="mr-2" />
                    Create Task
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* ✅ Desktop Table - Optimized for large screens */}
                <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Package
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Link
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Completed
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map((task) => (
                          <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="max-w-xs">
                                <p className="font-medium text-gray-900 truncate">
                                  {task.title}
                                </p>
                                {task.description && (
                                  <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  task.type === 'YOGA'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {task.type === 'YOGA' ? 'Yoga Task' : 'General'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {getPackageName(task)}
                            </td>
                            <td className="px-4 py-3">
                              {task.shareableLink ? (
                                <a
                                  href={task.shareableLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  <LinkIcon size={14} />
                                  <span>View Link</span>
                                </a>
                              ) : (
                                <span className="text-gray-400 text-sm">No link</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {task._count?.completions ?? 0}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  task.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {task.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  onClick={() => openEditModal(task)}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-3"
                                >
                                  <Edit size={14} className="mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => openDeleteModal(task)}
                                  size="sm"
                                  variant="destructive"
                                  className="h-8 px-3"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ✅ Tablet View (md-lg) - Compact table */}
                <div className="hidden md:block lg:hidden bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Task Details
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Package
                          </th>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                            Completed
                          </th>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                            Status
                          </th>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tasks.map((task) => (
                          <tr key={task.id} className="hover:bg-gray-50">
                            <td className="px-3 py-3">
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {task.title}
                                </p>
                                <span
                                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                                    task.type === 'YOGA'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}
                                >
                                  {task.type === 'YOGA' ? 'Yoga' : 'General'}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-sm text-gray-900">
                              {getPackageName(task)}
                            </td>
                            <td className="px-3 py-3 text-center text-sm text-gray-900">
                              {task._count?.completions ?? 0}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                  task.isActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {task.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex justify-center gap-1">
                                <Button
                                  onClick={() => openEditModal(task)}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit size={14} />
                                </Button>
                                <Button
                                  onClick={() => openDeleteModal(task)}
                                  size="sm"
                                  variant="destructive"
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ✅ Mobile Cards (sm and below) */}
                <div className="md:hidden space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {task.title}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                task.type === 'YOGA'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {task.type === 'YOGA' ? 'Yoga' : 'General'}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                task.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {task.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {task.description}
                        </p>
                      )}

                      <div className="space-y-1 mb-3 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Package:</span>{' '}
                          {getPackageName(task)}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Completed:</span>{' '}
                          {task._count?.completions ?? 0} users
                        </p>
                        {task.shareableLink && (
                          <a
                            href={task.shareableLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <LinkIcon size={14} />
                            <span>View Link</span>
                          </a>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => openEditModal(task)}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => openDeleteModal(task)}
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* ✅ MODALS - Unchanged but optimized */}
      
      {/* Create Task Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Create a general or yoga task and assign it to a package.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Title *</Label>
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
              <Label htmlFor="task-link">Shareable Link (Optional)</Label>
              <Input
                id="task-link"
                type="url"
                value={formData.shareableLink}
                onChange={(e) =>
                  setFormData({ ...formData, shareableLink: e.target.value })
                }
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Add a YouTube, Google Drive, or any external link for this task.
              </p>
            </div>
            <div>
              <Label htmlFor="task-type">Task Type *</Label>
              <select
                id="task-type"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              <Label htmlFor="task-package">Assign to Package *</Label>
              <select
                id="task-package"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={submitting}>
              {submitting ? <Processing /> : 'Create Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-task-title">Title *</Label>
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
              <Label htmlFor="edit-task-link">Shareable Link (Optional)</Label>
              <Input
                id="edit-task-link"
                type="url"
                value={formData.shareableLink}
                onChange={(e) =>
                  setFormData({ ...formData, shareableLink: e.target.value })
                }
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <Label htmlFor="edit-task-type">Task Type *</Label>
              <select
                id="edit-task-type"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTask} disabled={submitting}>
              {submitting ? <Processing /> : 'Update Task'}
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
              <strong className="text-gray-900">{selectedTask?.title}</strong>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTask}
              disabled={submitting}
            >
              {submitting ? <Processing /> : 'Delete Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTasksManagement;
