import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header1 from '@/components/Header';
import MobileSidebar from '@/components/onboarding/mobileSidebar';
import Sidebar from '@/components/Sidebar';
import { Processing } from '@/components/ui/icons/Processing';
import { BackendUrl } from '@/Config';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Package, 
  Truck, 
  Eye,
  Search,
  Filter,
  X,
  ClockAlert
} from 'lucide-react';

// Types
interface Product {
  id: string;
  name: string;
  heading: string;
  description: string;
  images: string[];
  priceInCoins: number;
  stock: number;
  category: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  coins: number;
}

interface ProductRequest {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  totalCoins: number;
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'REJECTED' | 'CANCELLED';
  requestedAt: string;
  processedAt: string | null;
  deliveryAddress: string;
  phoneNumber: string;
  notes: string | null;
  adminNotes: string | null;
  user: User;
  product: Product;
}

type TabType = 'products' | 'requests' | 'stats';

const ProductOrderManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [stats, setStats] = useState({
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-purple-100 text-purple-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
      <header className="w-full fixed top-0 left-0 bg-white shadow-sm z-30">
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
          {/* Stats Dashboard */}
          {activeTab === 'stats' && (
            <StatsView stats={stats} requests={requests} />
          )}

          {/* Products Tab */}
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

          {/* Requests Tab */}
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

      {/* Product Modal */}
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

      {/* Request Modal */}
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

// Stats View Component
interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalRequests: number;
  pendingRequests: number;
  totalRevenue: number;
}

const StatsView: React.FC<{ stats: Stats; requests: ProductRequest[] }> = ({ stats, requests }) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          subtitle={`${stats.activeProducts} active`}
          icon={<Package className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          subtitle={`${stats.pendingRequests} pending`}
          icon={<Truck className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          subtitle="Needs attention"
          icon={< ClockAlert className='w-6 h-6'/>}
          color="yellow"
        />
        <StatCard
          title="Total Revenue"
          value={`${stats.totalRevenue}`}
          subtitle="coins earned"
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Requests</h2>
        <div className="space-y-3">
          {requests.slice(0, 5).map(request => (
            <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <img
                  src={request.product.images[0]}
                  alt={request.product.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">{request.product.name}</p>
                  <p className="text-xs text-gray-600">{request.user.name}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {request.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'yellow' | 'green';
}> = ({ title, value, subtitle, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
};

// Products View Component
const ProductsView: React.FC<{
  products: Product[];
  productSearch: string;
  setProductSearch: (value: string) => void;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}> = ({ products, productSearch, setProductSearch, onAddProduct, onEditProduct, onDeleteProduct }) => {
  return (
    <div className="space-y-4">
      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {productSearch && (
            <button
              onClick={() => setProductSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>
        <button
          onClick={onAddProduct}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Desktop / Tablet View (Table) */}
      <div className="hidden sm:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Product","Price","Stock","Category","Status","Actions"].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
                {/* Product Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.heading}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.priceInCoins} coins</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.category || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {product.isFeatured && (
                    <span className="ml-2 px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button onClick={() => onEditProduct(product)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => onDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Cards) */}
      <div className="sm:hidden space-y-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="flex items-center">
              <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="ml-4">
                <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                <div className="text-xs text-gray-500">{product.heading}</div>
              </div>
            </div>
            <div className="text-sm text-gray-700"><span className="font-medium">Price:</span> {product.priceInCoins} coins</div>
            <div className="text-sm text-gray-700"><span className="font-medium">Stock:</span> {product.stock}</div>
            <div className="text-sm text-gray-700"><span className="font-medium">Category:</span> {product.category || 'N/A'}</div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                  product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
              {product.isFeatured && (
                <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Featured
                </span>
              )}
            </div>
            <div className="flex gap-4">
              <button onClick={() => onEditProduct(product)} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => onDeleteProduct(product.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// Requests View Component  
const RequestsView: React.FC<{
  requests: ProductRequest[];
  requestStatusFilter: string;
  setRequestStatusFilter: (value: string) => void;
  onProcessRequest: (request: ProductRequest) => void;
  getStatusColor: (status: string) => string;
}> = ({ requests, requestStatusFilter, setRequestStatusFilter, onProcessRequest, getStatusColor }) => {
  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <select
          value={requestStatusFilter}
          onChange={(e) => setRequestStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map(request => (
          <div key={request.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <img
                src={request.product.images[0]}
                alt={request.product.name}
                className="w-full lg:w-32 h-32 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{request.product.name}</h3>
                    <p className="text-sm text-gray-600">{request.product.heading}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">User</p>
                    <p className="text-sm font-semibold">{request.user.name}</p>
                    <p className="text-xs text-gray-600">{request.user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="text-sm font-semibold">{request.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Coins</p>
                    <p className="text-sm font-semibold text-emerald-600">{request.totalCoins}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">User Balance</p>
                    <p className="text-sm font-semibold">{request.user.coins} coins</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Delivery Address:</p>
                  <p className="text-sm text-gray-900">{request.deliveryAddress}</p>
                  <p className="text-sm text-gray-900 mt-1">Phone: {request.phoneNumber}</p>
                </div>

                {request.adminNotes && (
                  <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-xs text-blue-700 mb-1">Admin Notes:</p>
                    <p className="text-sm text-blue-900">{request.adminNotes}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  {request.status === 'PENDING' && (
                    <button
                      onClick={() => onProcessRequest(request)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Process
                    </button>
                  )}
                  {['APPROVED', 'PROCESSING', 'SHIPPED'].includes(request.status) && (
                    <button
                      onClick={() => onProcessRequest(request)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Truck className="w-4 h-4" />
                      Update Status
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Product Form Modal
const ProductFormModal: React.FC<{
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    heading: product?.heading || '',
    description: product?.description || '',
    images: product?.images.join('\n') || '',
    priceInCoins: product?.priceInCoins || 0,
    stock: product?.stock || 0,
    category: product?.category || '',
    isFeatured: product?.isFeatured || false,
    isActive: product?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const data = {
        ...formData,
        images: formData.images.split('\n').filter(url => url.trim()),
      };

      if (product) {
        await axios.patch(`${BackendUrl}/goods/admin/products/${product.id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${BackendUrl}/goods/admin/products`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {product ? 'Edit Product' : 'Create Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heading *
              </label>
              <input
                type="text"
                value={formData.heading}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URLs (one per line) *
              </label>
              <textarea
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                required
                rows={3}
                placeholder="https://example.com/image1.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (Coins) *
                </label>
                <input
                  type="number"
                  value={formData.priceInCoins}
                  onChange={(e) => setFormData({ ...formData, priceInCoins: parseInt(e.target.value) })}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Featured Product</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : product ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Process Request Modal
const ProcessRequestModal: React.FC<{
  request: ProductRequest;
  onClose: () => void;
  onProcess: (requestId: string, action: 'APPROVED' | 'REJECTED', adminNotes: string) => void;
}> = ({ request, onClose, onProcess }) => {
  const [action, setAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!adminNotes.trim()) {
      alert('Please enter admin notes');
      return;
    }

    setLoading(true);
    await onProcess(request.id, action, adminNotes);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Process Request</h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex gap-4">
              <img
                src={request.product.images[0]}
                alt={request.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <p className="font-semibold text-gray-900">{request.product.name}</p>
                <p className="text-sm text-gray-600">Quantity: {request.quantity}</p>
                <p className="text-sm text-emerald-600 font-semibold">
                  Total: {request.totalCoins} coins
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>User:</strong> {request.user.name} ({request.user.email})
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Current Balance:</strong> {request.user.coins} coins
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Product Stock:</strong> {request.product.stock} available
            </p>
          </div>

          {request.user.coins < request.totalCoins && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">
                ⚠️ Warning: User has insufficient coins!
              </p>
            </div>
          )}

          {request.product.stock < request.quantity && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700 text-sm">
                ⚠️ Warning: Insufficient stock available!
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="APPROVED"
                  checked={action === 'APPROVED'}
                  onChange={(e) => setAction(e.target.value as 'APPROVED')}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-sm">Approve</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="REJECTED"
                  checked={action === 'REJECTED'}
                  onChange={(e) => setAction(e.target.value as 'REJECTED')}
                  className="w-4 h-4 text-red-600"
                />
                <span className="text-sm">Reject</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes *
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              required
              placeholder={
                action === 'APPROVED'
                  ? 'e.g., Approved for processing. Will ship within 2 days.'
                  : 'e.g., Rejected due to insufficient stock.'
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white ${
                action === 'APPROVED'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } disabled:bg-gray-400`}
            >
              {loading ? 'Processing...' : action === 'APPROVED' ? 'Approve' : 'Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update Status Modal
const UpdateStatusModal: React.FC<{
  request: ProductRequest;
  onClose: () => void;
  onUpdate: (
    requestId: string,
    status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED',
    adminNotes: string
  ) => void;
}> = ({ request, onClose, onUpdate }) => {
  const [status, setStatus] = useState<'PROCESSING' | 'SHIPPED' | 'DELIVERED'>(
    request.status === 'APPROVED' ? 'PROCESSING' : (request.status as 'PROCESSING' | 'SHIPPED' | 'DELIVERED')
  );
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!adminNotes.trim()) {
      alert('Please enter admin notes');
      return;
    }

    setLoading(true);
    await onUpdate(request.id, status, adminNotes);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Request Status</h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex gap-4">
              <img
                src={request.product.images[0]}
                alt={request.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <p className="font-semibold text-gray-900">{request.product.name}</p>
                <p className="text-sm text-gray-600">
                  {request.user.name} - {request.deliveryAddress}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Current Status: <strong>{request.status}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'PROCESSING' | 'SHIPPED' | 'DELIVERED')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Notes *
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              required
              placeholder={
                status === 'PROCESSING'
                  ? 'e.g., Order is being prepared for shipment.'
                  : status === 'SHIPPED'
                  ? 'e.g., Shipped via FedEx. Tracking: 123456789'
                  : 'e.g., Delivered successfully on [date]'
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOrderManagement;