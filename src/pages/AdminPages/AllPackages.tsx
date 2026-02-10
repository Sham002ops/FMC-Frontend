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
import { 
  Trash2, 
  Edit, 
  Plus, 
  Package as PackageIcon, 
  Calendar, 
  Coins, 
  Eye,
  Search,
  X,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  priceInCoins: number;
  userCoins: number;
  features: string[] | string;
  validityDays: number;
}

const AdminPackagesManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    priceInCoins: '',
    userCoins: '',
    validityDays: '',
    features: '',
  });

  useEffect(() => {
    fetchAllPackages();
  }, []);

  useEffect(() => {
    // Filter packages based on search query
    if (searchQuery.trim() === '') {
      setFilteredPackages(allPackages);
    } else {
      const filtered = allPackages.filter((pkg) =>
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.priceInCoins.toString().includes(searchQuery) ||
        (Array.isArray(pkg.features) 
          ? pkg.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
          : pkg.features.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredPackages(filtered);
    }
  }, [searchQuery, allPackages]);

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
      setFilteredPackages(payload);
    } catch (error: any) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to fetch packages',
        variant: 'destructive',
      });
      setAllPackages([]);
      setFilteredPackages([]);
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
          userCoins: parseInt(formData.userCoins),
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
          userCoins: parseInt(formData.userCoins),
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

  const openDetailsModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowDetailsModal(true);
  };

  const openEditModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name,
      priceInCoins: pkg.priceInCoins.toString(),
      userCoins: pkg.userCoins?.toString() || '0',
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
      userCoins: '',
      validityDays: '',
      features: '',
    });
    setSelectedPackage(null);
  };

  const toYears = (days: number) => {
    if (!Number.isFinite(days)) return '—';
    const years = (days / 365.25).toFixed(1);
    return `${years} ${parseFloat(years) === 1 ? 'Year' : 'Years'}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Processing />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-50">
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
        <main className="flex-1 pt-28 sm:pt-28 lg:pl-28 px-4 sm:px-6 md:px-8 overflow-auto pb-20">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl shadow-lg">
                <PackageIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Package Management
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage your membership packages and pricing
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <PackageIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Total Packages</p>
                  <p className="text-2xl font-bold text-gray-900">{allPackages.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Active Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{allPackages.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-cyan-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Coins className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{allPackages.reduce((sum, pkg) => sum + pkg.priceInCoins, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-teal-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Avg. Validity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {allPackages.length > 0
                      ? Math.round(
                          allPackages.reduce((sum, pkg) => sum + pkg.validityDays, 0) /
                            allPackages.length /
                            365
                        )
                      : 0}{' '}
                    Years
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Create Section */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search packages by name, price, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Create Button */}
              <Button
                onClick={() => setShowCreateModal(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Package
              </Button>
            </div>

            {searchQuery && (
              <p className="text-sm text-gray-600 mt-3">
                Found <span className="font-semibold text-blue-600">{filteredPackages.length}</span>{' '}
                package{filteredPackages.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Package List */}
          {filteredPackages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-md">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
                <PackageIcon className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No Packages Found' : 'No Packages Yet'}
              </h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Create your first package to get started with your membership plans'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Package
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden group"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left: Package Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl shadow-lg flex-shrink-0">
                            <PackageIcon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                              {pkg.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-1.5 text-blue-600">
                                <Coins className="w-4 h-4" />
                                <span className="font-semibold">₹{pkg.priceInCoins.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-emerald-600">
                                <TrendingUp className="w-4 h-4" />
                                <span className="font-semibold">{pkg.userCoins?.toLocaleString() || 0} User Coins</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-cyan-600">
                                <Calendar className="w-4 h-4" />
                                <span className="font-semibold">{toYears(pkg.validityDays)}</span>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs text-gray-500 font-medium">Features:</span>
                              <span className="text-xs text-gray-600 line-clamp-1">
                                {Array.isArray(pkg.features)
                                  ? pkg.features.slice(0, 2).join(', ') +
                                    (pkg.features.length > 2 ? ` +${pkg.features.length - 2} more` : '')
                                  : pkg.features}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap sm:flex-nowrap gap-2 lg:flex-col lg:w-auto">
                        <Button
                          onClick={() => openDetailsModal(pkg)}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-initial border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          onClick={() => openEditModal(pkg)}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-initial border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => openDeleteModal(pkg)}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-initial border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg">
                <PackageIcon className="w-6 h-6 text-white" />
              </div>
              {selectedPackage?.name}
            </DialogTitle>
            <DialogDescription>Complete package details and specifications</DialogDescription>
          </DialogHeader>

          {selectedPackage && (
            <div className="space-y-6">
              {/* Pricing Section */}
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-blue-600" />
                  Pricing Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Package Price</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{selectedPackage.priceInCoins.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-emerald-200">
                    <p className="text-sm text-gray-600 mb-1">User Coins</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {selectedPackage.userCoins?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Validity Section */}
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6 border border-cyan-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-600" />
                  Validity Period
                </h3>
                <div className="bg-white rounded-lg p-4 border border-cyan-200">
                  <p className="text-sm text-gray-600 mb-1">Duration</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {selectedPackage.validityDays} Days ({toYears(selectedPackage.validityDays)})
                  </p>
                </div>
              </div>

              {/* Features Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Package Features
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <ul className="space-y-3">
                    {(Array.isArray(selectedPackage.features)
                      ? selectedPackage.features
                      : [selectedPackage.features]
                    ).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailsModal(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setShowDetailsModal(false);
                if (selectedPackage) openEditModal(selectedPackage);
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Package Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Create New Package
            </DialogTitle>
            <DialogDescription>Fill in the package details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="create-name">Package Name *</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premium"
                className="focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="create-price">Price (Coins) *</Label>
              <Input
                id="create-price"
                type="number"
                value={formData.priceInCoins}
                onChange={(e) => setFormData({ ...formData, priceInCoins: e.target.value })}
                placeholder="e.g., 1000"
                className="focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="create-userCoins">User Coins *</Label>
              <Input
                id="create-userCoins"
                type="number"
                value={formData.userCoins}
                onChange={(e) => setFormData({ ...formData, userCoins: e.target.value })}
                placeholder="e.g., 500"
                className="focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div>
              <Label htmlFor="create-validity">Validity (Days) *</Label>
              <Input
                id="create-validity"
                type="number"
                value={formData.validityDays}
                onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })}
                placeholder="e.g., 365"
                className="focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <Label htmlFor="create-features">Features (comma-separated) *</Label>
              <Input
                id="create-features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="e.g., Access to all webinars, Priority support"
                className="focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePackage}
              disabled={submitting}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
            >
              {submitting ? <Processing /> : 'Create Package'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Package Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-emerald-600" />
              Edit Package
            </DialogTitle>
            <DialogDescription>Update the package details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Package Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price (Coins) *</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.priceInCoins}
                onChange={(e) => setFormData({ ...formData, priceInCoins: e.target.value })}
                className="focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="edit-userCoins">User Coins *</Label>
              <Input
                id="edit-userCoins"
                type="number"
                value={formData.userCoins}
                onChange={(e) => setFormData({ ...formData, userCoins: e.target.value })}
                className="focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div>
              <Label htmlFor="edit-validity">Validity (Days) *</Label>
              <Input
                id="edit-validity"
                type="number"
                value={formData.validityDays}
                onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })}
                className="focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <Label htmlFor="edit-features">Features (comma-separated) *</Label>
              <Input
                id="edit-features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePackage}
              disabled={submitting}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
            >
              {submitting ? <Processing /> : 'Update Package'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete Package
            </DialogTitle>
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
              {submitting ? <Processing /> : 'Delete Package'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPackagesManagement;
