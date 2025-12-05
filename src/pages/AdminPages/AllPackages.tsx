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
  priceInCoins: number;
  features: string[] | string;
  validityDays: number;
}

const AdminPackagesManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    priceInCoins: '',
    validityDays: '',
    features: '',
  });

  useEffect(() => {
    fetchAllPackages();
  }, []);

  const fetchAllPackages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BackendUrl}/package/allpackages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = Array.isArray(response.data?.packages)
        ? response.data.packages
        : Array.isArray(response.data)
        ? response.data
        : [];
      setAllPackages(payload);
    } catch (error: any) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch packages',
        variant: 'destructive',
      });
      setAllPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      const featuresArray = formData.features
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f);

      await axios.post(
        `${BackendUrl}/package/create-package`,
        {
          name: formData.name,
          priceInCoins: parseInt(formData.priceInCoins),
          validityDays: parseInt(formData.validityDays),
          features: featuresArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: 'Success',
        description: 'Package created successfully',
      });

      setShowCreateModal(false);
      resetForm();
      fetchAllPackages();
    } catch (error: any) {
      console.error('Error creating package:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create package',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePackage = async () => {
    if (!selectedPackage) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      const featuresArray = formData.features
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f);

      await axios.patch(
        `${BackendUrl}/package/update-package/${selectedPackage.id}`,
        {
          name: formData.name,
          priceInCoins: parseInt(formData.priceInCoins),
          validityDays: parseInt(formData.validityDays),
          features: featuresArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: 'Success',
        description: 'Package updated successfully',
      });

      setShowEditModal(false);
      resetForm();
      fetchAllPackages();
    } catch (error: any) {
      console.error('Error updating package:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update package',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePackage = async () => {
    if (!selectedPackage) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      await axios.delete(`${BackendUrl}/package/delete-package/${selectedPackage.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: 'Success',
        description: 'Package deleted successfully',
      });

      setShowDeleteModal(false);
      setSelectedPackage(null);
      fetchAllPackages();
    } catch (error: any) {
      console.error('Error deleting package:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete package',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name,
      priceInCoins: pkg.priceInCoins.toString(),
      validityDays: pkg.validityDays.toString(),
      features: Array.isArray(pkg.features) ? pkg.features.join(', ') : pkg.features,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      priceInCoins: '',
      validityDays: '',
      features: '',
    });
    setSelectedPackage(null);
  };

  const toYears = (days: number, precision = 2) => {
    if (!Number.isFinite(days)) return '—';
    const years = days / 365.25;
    return years.toFixed(precision);
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
              Package Management
            </h1>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={18} />
              Create Package
            </Button>
          </div>

          {allPackages.length === 0 ? (
            <p className="text-center text-gray-600 mt-16 sm:mt-20">No packages found.</p>
          ) : (
            <>
              {/* Desktop & Tablet Table */}
              <div className="hidden sm:flex flex-col items-center w-full">
                <div className="w-full max-w-screen-xl mx-auto bg-white shadow rounded-xl overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200 text-base">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Package Name
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Price (Coins)
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Features
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wide">
                          Validity (Years)
                        </th>
                        <th className="px-6 py-4 text-center font-semibold text-gray-600 uppercase tracking-wide">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allPackages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 whitespace-nowrap text-gray-800 font-medium">
                            {pkg.name}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">{pkg.priceInCoins}</td>
                          <td className="px-6 py-3 whitespace-normal max-w-xs break-words">
                            {Array.isArray(pkg.features) ? pkg.features.join(', ') : pkg.features}
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">{toYears(pkg.validityDays)}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                onClick={() => openEditModal(pkg)}
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Edit size={16} />
                                Edit
                              </Button>
                              <Button
                                onClick={() => openDeleteModal(pkg)}
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
                {allPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <h2 className="font-semibold text-lg text-gray-800 mb-2">{pkg.name}</h2>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Price:</strong> {pkg.priceInCoins} Coins
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <strong>Features:</strong>{' '}
                      {Array.isArray(pkg.features) ? pkg.features.join(', ') : pkg.features}
                    </p>
                    <p className="text-gray-600 text-sm mb-3">
                      <strong>Validity:</strong> {toYears(pkg.validityDays)} Years
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openEditModal(pkg)}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => openDeleteModal(pkg)}
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

      {/* Create Package Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Package</DialogTitle>
            <DialogDescription>Fill in the package details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-name">Package Name</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premium"
              />
            </div>
            <div>
              <Label htmlFor="create-price">Price (Coins)</Label>
              <Input
                id="create-price"
                type="number"
                value={formData.priceInCoins}
                onChange={(e) => setFormData({ ...formData, priceInCoins: e.target.value })}
                placeholder="e.g., 1000"
              />
            </div>
            <div>
              <Label htmlFor="create-validity">Validity (Days)</Label>
              <Input
                id="create-validity"
                type="number"
                value={formData.validityDays}
                onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })}
                placeholder="e.g., 365"
              />
            </div>
            <div>
              <Label htmlFor="create-features">Features (comma-separated)</Label>
              <Input
                id="create-features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="e.g., Access to all webinars, Priority support"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePackage} disabled={submitting}>
              {submitting ? <Processing /> : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Package Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Package</DialogTitle>
            <DialogDescription>Update the package details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Package Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price (Coins)</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.priceInCoins}
                onChange={(e) => setFormData({ ...formData, priceInCoins: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-validity">Validity (Days)</Label>
              <Input
                id="edit-validity"
                type="number"
                value={formData.validityDays}
                onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-features">Features (comma-separated)</Label>
              <Input
                id="edit-features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePackage} disabled={submitting}>
              {submitting ? <Processing /> : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedPackage?.name}</strong>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePackage} disabled={submitting}>
              {submitting ? <Processing /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPackagesManagement;
