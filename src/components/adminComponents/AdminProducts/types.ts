// src/components/admin/products/types.ts

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
  availableForPackages: string[];
  restrictionType: 'ALL' | 'SPECIFIC' | 'NONE';
}

export interface User {
  id: string;
  name: string;
  email: string;
  coins: number;
  packageName?: string;
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
  user: User;
  product: Product;
}

export interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalRequests: number;
  pendingRequests: number;
  totalRevenue: number;
}

export type TabType = 'products' | 'requests' | 'stats';
