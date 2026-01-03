// src/components/admin/products/ProductsView.tsx

import React from 'react';
import { Plus, Edit, Trash2, Search, X, Shield } from 'lucide-react';
import { Product } from './types';
import { getPackageColors, PACKAGE_COLORS } from './constants';

interface ProductsViewProps {
  products: Product[];
  productSearch: string;
  setProductSearch: (value: string) => void;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  productSearch,
  setProductSearch,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}) => {
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Product","Price","Stock","Packages","Status","Actions"].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id}>
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
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {product.restrictionType === 'ALL' ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        <Shield className="w-3 h-3" />
                        All
                      </span>
                    ) : product.restrictionType === 'SPECIFIC' ? (
                      product.availableForPackages.slice(0, 2).map((pkg) => (
                        <span
                          key={pkg}
                          className={`inline-flex text-xs px-2 py-0.5 rounded-full font-semibold ${PACKAGE_COLORS[pkg]?.bg} ${PACKAGE_COLORS[pkg]?.text}`}
                        >
                          {pkg}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        None
                      </span>
                    )}
                    {product.availableForPackages.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{product.availableForPackages.length - 2}
                      </span>
                    )}
                  </div>
                </td>
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

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4 space-y-3">
            <div className="flex items-center">
              <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="ml-4 flex-1">
                <div className="text-sm font-semibold text-gray-900">{product.name}</div>
                <div className="text-xs text-gray-500">{product.heading}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {product.restrictionType === 'ALL' ? (
                <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                  <Shield className="w-3 h-3" />
                  All Packages
                </span>
              ) : (
                product.availableForPackages.map((pkg) => {
                  const colors = getPackageColors(pkg);
                  return (
                    <span
                      key={pkg}
                      className={`inline-flex text-xs px-2 py-0.5 rounded-full font-semibold ${colors?.bg} ${colors?.text}`}
                    >
                      {pkg}
                    </span>
                  );
                })
              )}
            </div>

            <div className="text-sm text-gray-700"><span className="font-medium">Price:</span> {product.priceInCoins} coins</div>
            <div className="text-sm text-gray-700"><span className="font-medium">Stock:</span> {product.stock}</div>
            
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

export default ProductsView;
