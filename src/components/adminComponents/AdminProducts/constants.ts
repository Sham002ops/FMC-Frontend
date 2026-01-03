// src/components/admin/products/constants.ts

export const PACKAGE_COLORS: { [key: string]: { bg: string; text: string; badge: string } } = {
  'Infa': { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-500' },
  'Gold': { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-500' },
  'Gold+': { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-500' },
  'Elite': { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-500' },
  'Supreme': { bg: 'bg-pink-50', text: 'text-pink-700', badge: 'bg-pink-500' },
  'Silver': { bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-500' },
  'Platinum': { bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-600' },
  'Diamond': { bg: 'bg-cyan-50', text: 'text-cyan-700', badge: 'bg-cyan-500' },
  'Titanium': { bg: 'bg-zinc-50', text: 'text-zinc-700', badge: 'bg-zinc-600' },
};

export const getPackageColors = (packageName: string) => {
  return PACKAGE_COLORS[packageName] || {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    badge: 'bg-indigo-500'
  };
};

export const getStatusColor = (status: string) => {
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
