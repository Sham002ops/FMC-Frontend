import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, ShoppingCart, Filter, Search, X } from 'lucide-react';

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
}

const API_BASE_URL = 'http://localhost:4000';

const DisplayAllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, showFeaturedOnly]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (showFeaturedOnly) {
        params.append('featured', 'true');
      }

      const response = await axios.get(`${API_BASE_URL}/goods/products?${params.toString()}`);
      setProducts(response.data.products);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products by search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleRequestProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowRequestModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-tr from-slate-200 to-slate-300 shadow-sm sticky rounded-lg  top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4">
            <h1 className="text-4xl  bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 font-urbanist italic font-extrabold"> Loyalty Product Catalog</h1>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
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

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              {/* Featured Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">Featured Only</span>
              </label>

              <div className="ml-auto text-sm text-gray-600">
                {filteredProducts.length} products found
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCardMini
                key={product.id}
                product={product}
                isFavorite={favorites.has(product.id)}
                onToggleFavorite={() => toggleFavorite(product.id)}
                onRequest={() => handleRequestProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Request Modal */}
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

// Mini Product Card Component
interface ProductCardMiniProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRequest: () => void;
}

const ProductCardMini: React.FC<ProductCardMiniProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onRequest,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105">
      {/* Image */}
      <div className="relative h-64 bg-gray-100">
        <img
          src={product.images[currentImageIndex] || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Featured
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>

        {/* Image Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentImageIndex === index
                    ? 'bg-white w-4'
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {product.category && (
          <p className="text-xs text-emerald-600 font-semibold mb-1">
            {product.category}
          </p>
        )}
        
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.heading}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="text-2xl font-bold text-emerald-600">
              {product.priceInCoins} <span className="text-sm">coins</span>
            </p>
          </div>
          
          <button
            onClick={onRequest}
            disabled={product.stock === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg active:scale-95'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Request
          </button>
        </div>
      </div>
    </div>
  );
};

// Request Product Modal
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
      const token = localStorage.getItem('userToken');
      if (!token) {
        setError('Please login to request products');
        setLoading(false);
        return;
      }

      await axios.post(
        `${API_BASE_URL}/goods/products/request`,
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
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="rounded-2xl bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Request Product</h2>
              <p className="text-gray-600 mt-1">{product.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-green-900 mb-2">
                Request Submitted Successfully!
              </h3>
              <p className="text-green-700">
                Your request is pending admin approval
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex gap-4">
                  <img
                    src={product.images[0]}
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

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Total */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Cost:</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {totalCoins} coins
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter your complete delivery address"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Any special instructions for delivery"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Buttons */}
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
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
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