// src/components/admin/products/ProductOrderManagement.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '@/components/Header';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import Sidebar from '@/components/Sidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';

// Import modular components
import StatsView from '../../components/adminComponents/AdminProducts/StatsView';
import ProductsView from '../../components/adminComponents/AdminProducts/ProductsView';
import RequestsView from '../../components/adminComponents/AdminProducts/RequestsView';
import ProductFormModal from '../../components/adminComponents/AdminProducts/ProductFormModal';
import ProcessRequestModal from '../../components/adminComponents/AdminProducts/ProcessRequestModal';
import UpdateStatusModal from '../../components/adminComponents/AdminProducts/UpdateStatusModal';

// Import types
import { Product, ProductRequest, Stats, TabType } from '../../components/adminComponents/AdminProducts/types';
import { getStatusColor } from '../../components/adminComponents/AdminProducts/constants';

const ProductOrderManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    activeProducts: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalRevenue: 0,
  });

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ProductRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Filter states
  const [productSearch, setProductSearch] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [productsRes, requestsRes] = await Promise.all([
        axios.get(`${BackendUrl}/goods/admin/products`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BackendUrl}/goods/admin/requests`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setProducts(productsRes.data.products);
      setRequests(requestsRes.data.requests);

      // Calculate stats
      const activeProducts = productsRes.data.products.filter((p: Product) => p.isActive).length;
      const pendingRequests = requestsRes.data.requests.filter((r: ProductRequest) => r.status === 'PENDING').length;
      const totalRevenue = requestsRes.data.requests
        .filter((r: ProductRequest) => ['APPROVED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(r.status))
        .reduce((sum: number, r: ProductRequest) => sum + r.totalCoins, 0);

      setStats({
        totalProducts: productsRes.data.products.length,
        activeProducts,
        totalRequests: requestsRes.data.requests.length,
        pendingRequests,
        totalRevenue,
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BackendUrl}/goods/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleProcessRequest = async (requestId: string, action: 'APPROVED' | 'REJECTED', adminNotes: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${BackendUrl}/goods/admin/requests/${requestId}/process`,
        { action, adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAllData();
      setShowRequestModal(false);
      setSelectedRequest(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to process request');
    }
  };

  const handleUpdateStatus = async (requestId: string, status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED', adminNotes: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${BackendUrl}/goods/admin/requests/${requestId}/status`,
        { status, adminNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAllData();
      setShowRequestModal(false);
      setSelectedRequest(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.heading.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredRequests = requests.filter(r => 
    requestStatusFilter === 'all' || r.status === requestStatusFilter
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Processing />
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="transition-transform duration-300">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="block lg:hidden">
          <MobileSidebar />
        </div>
      </div>

      {/* Header */}
      <header className="w-full fixed top-0 left-0 bg-white shadow-sm z-40">
        <Header1 />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-28 lg:pl-20 sm:pt-24">
        {/* Page Title & Tabs */}
        <div className="px-3 sm:px-6 md:px-8 py-4 bg-white border-b">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Product Order Management
          </h1>
          
          {/* Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'products'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Requests ({stats.pendingRequests} pending)
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <main className="flex-1 overflow-auto p-2 sm:p-4 md:p-8">
          {activeTab === 'stats' && <StatsView stats={stats} requests={requests} />}

          {activeTab === 'products' && (
            <ProductsView
              products={filteredProducts}
              productSearch={productSearch}
              setProductSearch={setProductSearch}
              onAddProduct={() => {
                setEditingProduct(null);
                setShowProductModal(true);
              }}
              onEditProduct={(product) => {
                setEditingProduct(product);
                setShowProductModal(true);
              }}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'requests' && (
            <RequestsView
              requests={filteredRequests}
              requestStatusFilter={requestStatusFilter}
              setRequestStatusFilter={setRequestStatusFilter}
              onProcessRequest={(request) => {
                setSelectedRequest(request);
                setShowRequestModal(true);
              }}
              getStatusColor={getStatusColor}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {showProductModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setShowProductModal(false);
            setEditingProduct(null);
            fetchAllData();
          }}
        />
      )}

      {showRequestModal && selectedRequest && (
        selectedRequest.status === 'PENDING' ? (
          <ProcessRequestModal
            request={selectedRequest}
            onClose={() => {
              setShowRequestModal(false);
              setSelectedRequest(null);
            }}
            onProcess={handleProcessRequest}
          />
        ) : (
          <UpdateStatusModal
            request={selectedRequest}
            onClose={() => {
              setShowRequestModal(false);
              setSelectedRequest(null);
            }}
            onUpdate={handleUpdateStatus}
          />
        )
      )}
    </div>
  );
};

export default ProductOrderManagement;
