import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BackendUrl } from '@/Config';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  number?: string;
  address?: string;
  pinCode?: string;
  coins: number;
  dateOfBirth?: string;
  packageName: string | null;
  executiveRefode: string | null;
  role: string;
  joinedAt?: string;
  isBanned?: boolean;
}

type SortField = 'name' | 'email' | 'coins';
type SortOrder = 'asc' | 'desc';

export const useUserManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [executiveName, setExecutiveName] = useState<string | null>(null);
  const [loadingExecutive, setLoadingExecutive] = useState(false);
  
  const [deleteModalUser, setDeleteModalUser] = useState<User | null>(null);
  const [deletionReason, setDeletionReason] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedUserName, setDeletedUserName] = useState('');
  
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  const token = localStorage.getItem('token');

  const fetchExecutiveName = async (refCode: string) => {
    if (!refCode) return null;
    setLoadingExecutive(true);
    try {
      const response = await axios.get(`${BackendUrl}/admin/executive/${refCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExecutiveName(response.data.executiveName || 'Unknown');
    } catch (err) {
      setExecutiveName('Not found');
    } finally {
      setLoadingExecutive(false);
    }
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BackendUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const users = response.data.users || [];
      setAllUsers(users);
      applyFiltersAndSort(users, searchQuery, filterRole, filterStatus, sortField, sortOrder);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Could not fetch users';
      setError(errorMsg);
      toast.error(errorMsg);
      setAllUsers([]);
      setFilteredUsers([]);
    }
    setLoading(false);
  };

  const applyFiltersAndSort = (
    users: User[],
    search: string,
    role: string,
    status: string,
    field: SortField,
    order: SortOrder
  ) => {
    let filtered = [...users];

    if (search.trim()) {
      const lowercaseQuery = search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery) ||
        user.packageName?.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (role !== 'ALL') {
      filtered = filtered.filter(user => user.role === role);
    }

    if (status === 'ACTIVE') {
      filtered = filtered.filter(user => !user.isBanned);
    } else if (status === 'BANNED') {
      filtered = filtered.filter(user => user.isBanned);
    }

    filtered.sort((a, b) => {
      let aVal: any = a[field];
      let bVal: any = b[field];

      if (field === 'coins') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSort(allUsers, query, filterRole, filterStatus, sortField, sortOrder);
  };

  const handleFilterChange = (type: 'role' | 'status', value: string) => {
    if (type === 'role') {
      setFilterRole(value);
      applyFiltersAndSort(allUsers, searchQuery, value, filterStatus, sortField, sortOrder);
    } else {
      setFilterStatus(value);
      applyFiltersAndSort(allUsers, searchQuery, filterRole, value, sortField, sortOrder);
    }
  };

  const handleSort = (field: SortField) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    applyFiltersAndSort(allUsers, searchQuery, filterRole, filterStatus, field, newOrder);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterRole('ALL');
    setFilterStatus('ALL');
    setSortField('name');
    setSortOrder('asc');
    applyFiltersAndSort(allUsers, '', 'ALL', 'ALL', 'name', 'asc');
  };

  const exportToCSV = async () => {
    if (filteredUsers.length === 0) {
      toast.warning('No users to export');
      return;
    }

    try {
      const csvHeaders = ['Name', 'Email', 'Phone', 'Date of Birth', 'Address', 'PIN Code', 'Role', 'Coins', 'Package', 'Executive Ref', 'Status', 'Joined At'];
      const csvRows = filteredUsers.map(user => [
        user.name,
        user.email,
        user.number || '-',
        user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-',
        user.address || '-',
        user.pinCode || '-',
        user.role,
        user.coins,
        user.packageName || '-',
        user.executiveRefode || '-',
        user.isBanned ? 'Banned' : 'Active',
        user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '-'
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const fileName = `users_${new Date().toISOString().split('T')[0]}.csv`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const fileSize = blob.size;

      axios.post(
        `${BackendUrl}/export-logs/log`,
        {
          entity: 'Users',
          fileName,
          recordCount: filteredUsers.length,
          fileSize,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(err => {
        console.error('Failed to log export:', err);
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      toast.success(`Exported ${filteredUsers.length} users to CSV`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export users');
    }
  };

  const handleBanToggle = async (user: User) => {
    // ✅ SUPER_ADMIN protection check
    if (user.role === 'SUPER_ADMIN') {
      toast.error('Cannot ban/unban SuperAdmin accounts');
      return;
    }

    const action = user.isBanned ? 'unban' : 'ban';
    if (!window.confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    setActionLoading(user.id);
    setError(null);
    try {
      await axios.patch(
        `${BackendUrl}/admin/user/${user.id}/ban`,
        { isBanned: !user.isBanned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`User ${action}ned successfully`);
      fetchAllUsers();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to update ban status';
      setError(errorMsg);
      toast.error(errorMsg);
    }
    setActionLoading(null);
  };

  const openDeleteModal = (user: User) => {
    // ✅ SUPER_ADMIN protection check
    if (user.role === 'SUPER_ADMIN') {
      toast.error('Cannot delete SuperAdmin accounts');
      return;
    }

    setDeleteModalUser(user);
    setDeletionReason('');
  };

  const closeDeleteModal = () => {
    setDeleteModalUser(null);
    setDeletionReason('');
  };

  const handleDelete = async () => {
    if (!deleteModalUser) return;

    if (!deletionReason.trim()) {
      toast.error('Please provide a reason for deletion');
      return;
    }

    setActionLoading(deleteModalUser.id);
    setError(null);

    try {
      await axios.delete(`${BackendUrl}/admin/users/${deleteModalUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { reason: deletionReason }
      });

      closeDeleteModal();
      setDeletedUserName(deleteModalUser.name);
      setShowSuccessModal(true);
      fetchAllUsers();

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete user';
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setExecutiveName(null);
    if (user.executiveRefode) {
      fetchExecutiveName(user.executiveRefode);
    }
  };

  return {
    loading,
    allUsers,
    filteredUsers,
    searchQuery,
    filterRole,
    filterStatus,
    sortField,
    sortOrder,
    selectedUser,
    deleteModalUser,
    deletionReason,
    showSuccessModal,
    deletedUserName,
    actionLoading,
    error,
    executiveName,
    loadingExecutive,
    fetchAllUsers,
    handleSearch,
    handleFilterChange,
    handleSort,
    clearAllFilters,
    exportToCSV,
    handleBanToggle,
    handleViewUser,
    openDeleteModal,
    closeDeleteModal,
    setDeletionReason,
    handleDelete,
    setSelectedUser,
    setShowSuccessModal,
    navigate,
  };
};
