import { useEffect, useState } from "react";
import { fetchProducts, fetchRequests } from "@/services/productsAdminApi";

export const useProductOrderData = () => {
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, activeProducts: 0, totalRequests: 0, pendingRequests: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const [productsRes, requestsRes] = await Promise.all([
        fetchProducts(token!),
        fetchRequests(token!)
      ]);
      setProducts(productsRes.data.products);
      setRequests(requestsRes.data.requests);

      // compute stats
      const activeProducts = productsRes.data.products.filter((p) => p.isActive).length;
      const pendingRequests = requestsRes.data.requests.filter((r) => r.status === "PENDING").length;
      const totalRevenue = requestsRes.data.requests
        .filter((r) => ["APPROVED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(r.status))
        .reduce((sum: number, r) => sum + r.totalCoins, 0);

      setStats({ 
        totalProducts: productsRes.data.products.length, 
        activeProducts, 
        totalRequests: requestsRes.data.requests.length, 
        pendingRequests, 
        totalRevenue 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return { products, requests, stats, loading, fetchAll };
};
