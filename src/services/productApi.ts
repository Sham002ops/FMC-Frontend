// ==================== API SERVICE ====================
// src/services/productApi.ts

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface Product {
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

export interface ProductRequest {
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
  product: Product;
}

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('userToken') || '';
};

// Get all active products
export const getAllProducts = async (filters?: {
  category?: string;
  featured?: boolean;
}) => {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.featured) params.append('featured', 'true');

  const response = await axios.get(`${API_BASE_URL}/goods/products?${params.toString()}`);
  return response.data.products as Product[];
};

// Get single product
export const getProduct = async (productId: string) => {
  const response = await axios.get(`${API_BASE_URL}/goods/products/${productId}`);
  return response.data.product as Product;
};

// Request a product
export const requestProduct = async (data: {
  productId: string;
  quantity: number;
  deliveryAddress: string;
  phoneNumber: string;
  notes?: string;
}) => {
  const response = await axios.post(
    `${API_BASE_URL}/goods/products/request`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.productRequest as ProductRequest;
};

// Get user's product requests
export const getUserProductRequests = async () => {
  const response = await axios.get(`${API_BASE_URL}/goods/my-requests`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data.requests as ProductRequest[];
};

// Cancel product request
export const cancelProductRequest = async (requestId: string) => {
  const response = await axios.patch(
    `${API_BASE_URL}/goods/requests/${requestId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    }
  );
  return response.data.request as ProductRequest;
};
