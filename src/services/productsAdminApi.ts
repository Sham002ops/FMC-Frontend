import axios from "axios";
import { BackendUrl } from "@/Config";

export const fetchProducts = (token: string) =>
  axios.get(`${BackendUrl}/goods/admin/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const fetchRequests = (token: string) =>
  axios.get(`${BackendUrl}/goods/admin/requests`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteProduct = (token: string, productId: string) =>
  axios.delete(`${BackendUrl}/goods/admin/products/${productId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
