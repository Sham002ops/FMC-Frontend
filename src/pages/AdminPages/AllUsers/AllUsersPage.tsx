import React, { useEffect } from 'react';
import Header1 from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import { Processing } from '@/components/ui/icons/Processing';
import UserStatsCards from './UserStatsCards';
import UserSearchAndFilters from './UserSearchAndFilters';
import UserTableDesktop from './UserTableDesktop';
import UserCardMobile from './UserCardMobile';
import UserDetailsModal from './UserDetailsModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import DeleteSuccessModal from './DeleteSuccessModal';
import { useUserManagement } from './useUserManagement';

const AllUsersPage: React.FC = () => {
  const {
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
    // Actions
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
  } = useUserManagement();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Processing />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-20 bg-slate-900 z-30">
        <Sidebar />
      </div>
      <div className="lg:hidden">
        <MobileSidebar />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 lg:left-20 right-0 bg-white shadow-sm z-40 h-16">
        <Header1 />
      </header>

      {/* Main Content */}
      <main className="pt-16 lg:pl-20 min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Users</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and monitor all registered users</p>
            </div>
          </div>

          {/* Stats */}
          <UserStatsCards
            totalUsers={allUsers.length}
            activeUsers={allUsers.filter(u => !u.isBanned).length}
            bannedUsers={allUsers.filter(u => u.isBanned).length}
            filteredCount={filteredUsers.length}
          />

          {/* Search & Filters */}
          <UserSearchAndFilters
            searchQuery={searchQuery}
            filterRole={filterRole}
            filterStatus={filterStatus}
            filteredCount={filteredUsers.length}
            totalCount={allUsers.length}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            onExport={exportToCSV}
            onRefresh={fetchAllUsers}
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Empty State or User List */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
              <p className="text-gray-600 text-lg font-medium">No users found</p>
              {(searchQuery || filterRole !== 'ALL' || filterStatus !== 'ALL') && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <UserTableDesktop
                users={filteredUsers}
                sortField={sortField}
                sortOrder={sortOrder}
                actionLoading={actionLoading}
                onSort={handleSort}
                onView={handleViewUser}
                onBanToggle={handleBanToggle}
                onDelete={openDeleteModal}
              />

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredUsers.map((user) => (
                  <UserCardMobile
                    key={user.id}
                    user={user}
                    actionLoading={actionLoading}
                    onView={handleViewUser}
                    onBanToggle={handleBanToggle}
                    onDelete={openDeleteModal}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <UserDetailsModal
        user={selectedUser}
        executiveName={executiveName}
        loadingExecutive={loadingExecutive}
        onClose={() => setSelectedUser(null)}
        onDelete={(user) => {
          openDeleteModal(user);
          setSelectedUser(null);
        }}
        onBanToggle={(user) => {
          handleBanToggle(user);
          setSelectedUser(null);
        }}
      />

      <DeleteConfirmModal
        user={deleteModalUser}
        deletionReason={deletionReason}
        actionLoading={actionLoading}
        onReasonChange={setDeletionReason}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />

      <DeleteSuccessModal
        show={showSuccessModal}
        deletedUserName={deletedUserName}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default AllUsersPage;
