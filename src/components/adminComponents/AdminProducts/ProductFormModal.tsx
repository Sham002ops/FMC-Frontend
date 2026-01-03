// src/components/admin/products/ProductFormModal.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Shield, Tag, XCircle } from 'lucide-react';
import { BackendUrl } from '@/Config';
import { Product } from './types';
import { PACKAGE_COLORS } from './constants';

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose, onSuccess }) => {
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
    restrictionType: product?.restrictionType || 'ALL' as 'ALL' | 'SPECIFIC' | 'NONE',
    availableForPackages: product?.availableForPackages || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch packages dynamically
  const [availablePackages, setAvailablePackages] = useState<string[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BackendUrl}/package/admin/allpackages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const packageNames = response.data.packages.map((pkg: any) => pkg.name);
        setAvailablePackages(packageNames);
      } catch (err: any) {
        console.error('Failed to fetch packages:', err);
        setAvailablePackages([]);
      } finally {
        setLoadingPackages(false);
      }
    };

    fetchPackages();
  }, []);

  const handlePackageToggle = (pkg: string) => {
    setFormData(prev => ({
      ...prev,
      availableForPackages: prev.availableForPackages.includes(pkg)
        ? prev.availableForPackages.filter(p => p !== pkg)
        : [...prev.availableForPackages, pkg]
    }));
  };

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
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Create Product'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
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
                  onChange={(e) => setFormData({ ...formData, priceInCoins: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                placeholder="e.g., Electronics, Clothing, Books"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Package Restriction Section */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Package Access Control *
              </label>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="restrictionType"
                    value="ALL"
                    checked={formData.restrictionType === 'ALL'}
                    onChange={(e) => setFormData({ ...formData, restrictionType: 'ALL', availableForPackages: [] })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-gray-900">All Packages</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Available to all users regardless of package</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="restrictionType"
                    value="SPECIFIC"
                    checked={formData.restrictionType === 'SPECIFIC'}
                    onChange={(e) => setFormData({ ...formData, restrictionType: 'SPECIFIC' })}
                    className="w-4 h-4 text-blue-600 mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-gray-900">Specific Packages</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 mb-3">Restrict to selected package tiers</p>
                    
                    {formData.restrictionType === 'SPECIFIC' && (
                      <>
                        {loadingPackages ? (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            <div className="inline-block w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                            Loading packages...
                          </div>
                        ) : availablePackages.length === 0 ? (
                          <div className="text-center py-4 text-red-500 text-sm">
                            ⚠️ No packages available. Please create packages first.
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                            {availablePackages.map((pkg) => {
                              const colors = PACKAGE_COLORS[pkg] || {
                                bg: 'bg-gray-50',
                                text: 'text-gray-700',
                                badge: 'bg-gray-500'
                              };
                              const isSelected = formData.availableForPackages.includes(pkg);
                              
                              return (
                                <button
                                  key={pkg}
                                  type="button"
                                  onClick={() => handlePackageToggle(pkg)}
                                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                                    isSelected
                                      ? `${colors.badge} text-white border-transparent shadow-md`
                                      : `${colors.bg} ${colors.text} border-gray-300 hover:border-gray-400`
                                  }`}
                                >
                                  {isSelected && '✓ '}{pkg}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                    
                    {formData.restrictionType === 'SPECIFIC' && formData.availableForPackages.length === 0 && !loadingPackages && (
                      <p className="text-xs text-red-600 mt-2">⚠️ Please select at least one package</p>
                    )}
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="restrictionType"
                    value="NONE"
                    checked={formData.restrictionType === 'NONE'}
                    onChange={(e) => setFormData({ ...formData, restrictionType: 'NONE', availableForPackages: [] })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-gray-900">No Access</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Not available for any package (admin only)</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Status Checkboxes */}
            <div className="flex flex-wrap gap-4 pt-4 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 font-medium">⭐ Featured Product</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 font-medium">✓ Active</span>
              </label>
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
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || loadingPackages || (formData.restrictionType === 'SPECIFIC' && formData.availableForPackages.length === 0)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  product ? 'Update Product' : 'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
