// DisplayAllProducts.tsx - FIXED VERSION (Deduplication)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, ShoppingCart, Filter, Search, X, Lock, Tag, Sparkles } from 'lucide-react';
import { BackendUrl } from '@/Config';

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
  availableForPackages: string[];
  restrictionType: 'ALL' | 'SPECIFIC' | 'NONE';
  canRequest?: boolean;
  userPackage?: string;
}

interface UserStatsResponse {
  package: string;
  joinedAt?: string | null;
}

const PACKAGE_COLORS: { [key: string]: { bg: string; text: string; badge: string; border: string } } = {
  'Infa': { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-500', border: 'border-blue-300' },
  'Gold': { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-500', border: 'border-yellow-300' },
  'Gold+': { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-500', border: 'border-orange-300' },
  'Elite': { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-500', border: 'border-purple-300' },
  'Supreme': { bg: 'bg-pink-50', text: 'text-pink-700', badge: 'bg-pink-500', border: 'border-pink-300' },
  'Silver': { bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-500', border: 'border-gray-300' },
};

const DisplayAllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPackageFilter, setSelectedPackageFilter] = useState<string>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [userPackage, setUserPackage] = useState<string | null>(null);
  const [availablePackages, setAvailablePackages] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get<UserStatsResponse>(`${BackendUrl}/auth/user-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserPackage(res.data.package || null);
      } catch (err) {
        console.error('Failed to fetch user stats', err);
      }
    };

    fetchUserStats();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, showFeaturedOnly, selectedPackageFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view products');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (showFeaturedOnly) {
        params.append('featured', 'true');
      }
      if (selectedPackageFilter !== 'all') {
        params.append('packageFilter', selectedPackageFilter);
      }

      const response = await axios.get(
        `${BackendUrl}/goods/products?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts(response.data.products || []);

      // Extract available packages
      const packages = new Set<string>();
      (response.data.products || []).forEach((product: Product) => {
        if (product.restrictionType === 'ALL') {
          packages.add('All Packages');
        } else if (product.restrictionType === 'SPECIFIC') {
          product.availableForPackages.forEach(pkg => packages.add(pkg));
        }
      });
      setAvailablePackages(Array.from(packages).sort());

    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) newFavorites.delete(productId);
      else newFavorites.add(productId);
      return newFavorites;
    });
  };

  const handleRequestProduct = (product: Product) => {
    if (!product.canRequest) {
      alert(`This product is not available for your ${userPackage || 'current'} package.\n\nAvailable for: ${product.availableForPackages.join(', ')}`);
      return;
    }

    setSelectedProduct(product);
    setShowRequestModal(true);
  };

  // ✅ FIXED: Group products by package WITHOUT duplication
  const groupedProducts = () => {
    const grouped: { [key: string]: Product[] } = {};
    
    filteredProducts.forEach(product => {
      if (product.restrictionType === 'ALL') {
        if (!grouped['All Packages']) grouped['All Packages'] = [];
        // ✅ Only add if not already present
        if (!grouped['All Packages'].some(p => p.id === product.id)) {
          grouped['All Packages'].push(product);
        }
      } else if (product.restrictionType === 'SPECIFIC') {
        // ✅ NEW: Add product to the FIRST package only (or user's package if available)
        const targetPackage = product.availableForPackages.includes(userPackage || '') 
          ? userPackage 
          : product.availableForPackages[0];
        
        if (targetPackage) {
          if (!grouped[targetPackage]) grouped[targetPackage] = [];
          // ✅ Only add if not already present
          if (!grouped[targetPackage].some(p => p.id === product.id)) {
            grouped[targetPackage].push(product);
          }
        }
      }
    });

    // Sort package names
    const sortedGrouped: { [key: string]: Product[] } = {};
    Object.keys(grouped).sort().forEach(key => {
      sortedGrouped[key] = grouped[key];
    });

    return sortedGrouped;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br border-2 p-2 border-slate-300 rounded-lg from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-tr from-slate-200 to-slate-300 shadow-sm sticky rounded-lg top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 font-urbanist italic font-extrabold">
                  Supreme Store
                </h1>
                <h3 className="text-base sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900 font-urbanist italic font-semibold mt-1">
                  Shop by Your Package
                </h3>
              </div>
              
              {userPackage && (
                <div className={`px-4 py-2 rounded-full ${PACKAGE_COLORS[userPackage]?.badge || 'bg-gray-500'} text-white font-bold flex items-center gap-2 shadow-lg`}>
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">{userPackage} Member</span>
                  <span className="sm:hidden">{userPackage}</span>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-full p-1 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>

              <select
                value={selectedPackageFilter}
                onChange={(e) => setSelectedPackageFilter(e.target.value)}
                className="px-4 py-2 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white text-sm transition-all hover:border-purple-400"
              >
                <option value="all">All Packages</option>
                {availablePackages.map((pkg) => (
                  <option key={pkg} value={pkg}>
                    {pkg}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-sm transition-all hover:border-emerald-400"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 font-medium">Featured Only</span>
              </label>

              <div className="ml-auto text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-emerald-500"></div>
            <p className="text-gray-600 text-sm">Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-500 text-5xl mb-3">⚠️</div>
            <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Products</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-300 text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-xl font-semibold mb-2">No products found</p>
            <p className="text-gray-400 text-sm">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            {/* Grouped by Package Display */}
            {Object.entries(groupedProducts()).map(([packageName, pkgProducts]) => (
              <div key={packageName} className="mb-12 last:mb-0">
                <div className={`flex items-center gap-3 mb-6 pb-3 border-b-4 ${PACKAGE_COLORS[packageName]?.border || 'border-gray-300'}`}>
                  <div className={`px-4 py-2 rounded-full ${PACKAGE_COLORS[packageName]?.badge || 'bg-gray-500'} text-white font-bold flex items-center gap-2 shadow-lg`}>
                    <Tag className="w-5 h-5" />
                    <span>{packageName}</span>
                  </div>
                  <span className="text-gray-600 text-sm font-medium">
                    {pkgProducts.length} product{pkgProducts.length !== 1 ? 's' : ''}
                  </span>
                  
                  {userPackage === packageName && (
                    <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                      ✓ You can request these
                    </span>
                  )}
                  {userPackage && userPackage !== packageName && packageName !== 'All Packages' && (
                    <span className="ml-auto bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" />
                      Not available for your package
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {pkgProducts.map((product) => (
                    <ProductCardMini
                      key={product.id}
                      product={product}
                      isFavorite={favorites.has(product.id)}
                      onToggleFavorite={() => toggleFavorite(product.id)}
                      onRequest={() => handleRequestProduct(product)}
                      userPackage={userPackage}
                    />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {showRequestModal && selectedProduct && (
        <RequestProductModal
          product={selectedProduct}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

// ✅ FIXED: Compact Product Card (smaller size)
interface ProductCardMiniProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRequest: () => void;
  userPackage: string | null;
}

const ProductCardMini: React.FC<ProductCardMiniProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onRequest,
  userPackage,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const canUserRequest = product.canRequest ?? false;

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      !canUserRequest ? 'opacity-70' : ''
    }`}>
      {/* ✅ REDUCED: Image height from h-64 to h-48 */}
      <div className="relative h-48 bg-gray-100">
        <img
          src={product.images[currentImageIndex] || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
          }}
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md">
              ⭐ Featured
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md">
              ⚡ Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md">
              ❌ Out of Stock
            </span>
          )}
          {!canUserRequest && product.stock > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <Lock className="w-2.5 h-2.5" />
              Locked
            </span>
          )}
        </div>

        <button
          onClick={onToggleFavorite}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform active:scale-95"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
            }`}
          />
        </button>

        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  currentImageIndex === index ? 'bg-white w-4' : 'bg-white/60 w-1.5 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ REDUCED: Padding from p-4 to p-3 */}
      <div className="p-3">
        {/* Package Badges */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.restrictionType === 'ALL' ? (
            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
              🌍 All
            </span>
          ) : (
            product.availableForPackages.map((pkg) => {
              const colors = PACKAGE_COLORS[pkg];
              return (
                <span
                  key={pkg}
                  className={`text-[10px] ${colors?.bg || 'bg-gray-100'} ${colors?.text || 'text-gray-700'} px-1.5 py-0.5 rounded-full font-semibold`}
                >
                  {pkg}
                </span>
              );
            })
          )}
        </div>

        {product.category && (
          <p className="text-[10px] text-emerald-600 font-semibold mb-1 uppercase tracking-wide">
            {product.category}
          </p>
        )}

        {/* ✅ REDUCED: Font sizes */}
        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1" title={product.name}>
          {product.name}
        </h3>

        <p className="text-xs text-gray-600 mb-2 line-clamp-2" title={product.heading}>
          {product.heading}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Price</p>
            <p className="text-lg font-bold text-emerald-600">
              {product.priceInCoins} <span className="text-xs font-normal">coins</span>
            </p>
          </div>

          <button
            onClick={onRequest}
            disabled={product.stock === 0 || !canUserRequest}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-xs transition-all ${
              product.stock === 0 || !canUserRequest
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg active:scale-95'
            }`}
          >
            {!canUserRequest && product.stock > 0 ? (
              <>
                <Lock className="w-3 h-3" />
                <span className="hidden sm:inline">Locked</span>
              </>
            ) : product.stock === 0 ? (
              <span>Out</span>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" />
                <span className="hidden sm:inline">Request</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Keep RequestProductModal component the same as before...
// (Paste your existing RequestProductModal component here)

interface RequestProductModalProps {
  product: Product;
  onClose: () => void;
}

const RequestProductModal: React.FC<RequestProductModalProps> = ({
  product,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalCoins = product.priceInCoins * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to request products');
        setLoading(false);
        return;
      }

      await axios.post(
        `${BackendUrl}/goods/products/request`,
        {
          productId: product.id,
          quantity,
          deliveryAddress,
          phoneNumber,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Request error:', err);
      setError(err?.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="rounded-2xl bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide shadow-2xl"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Request Product</h2>
              <p className="text-gray-600 mt-1">{product.name}</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {success ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">
                Request Submitted!
              </h3>
              <p className="text-green-700 text-lg">
                Your request is pending admin approval
              </p>
              <p className="text-green-600 text-sm mt-2">
                You'll be notified once processed
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex gap-4">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/100'}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{product.heading}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.priceInCoins} coins each
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Stock: {product.stock} available
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Cost:</span>
                  <span className="text-3xl font-bold text-emerald-600">
                    {totalCoins} <span className="text-lg">coins</span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                  placeholder="Enter your complete delivery address with landmark"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                  placeholder="Any special instructions for delivery"
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayAllProducts;
