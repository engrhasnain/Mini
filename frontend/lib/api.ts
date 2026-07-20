import axios from "axios";
import Cookies from "js-cookie";
import {
  User,
  Product,
  CartItem,
  Order,
  AuthResponse,
  LoginInput,
  RegisterInput,
  ProductInput,
  OrderStatusUpdate,
} from "@/types";

// ─── Axios Instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor: Attach JWT Token ───────────────────────────────────
api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor: Handle 401 (Token Expired) ────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("access_token");
      Cookies.remove("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth API ────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", email); // Backend expects 'username' = email
    formData.append("password", password);
    return api.post<AuthResponse>("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },

  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>("/auth/register", { name, email, password }),

  me: () => api.get<User>("/auth/me"),
};

// ─── Products API ────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: (params?: { category?: string; search?: string }) =>
    api.get<Product[]>("/products", { params }),

  getOne: (id: string) => api.get<Product>(`/products/${id}`),
};

// // ─── Cart API ────────────────────────────────────────────────────────────────
// export const cartApi = {
//   get: () => api.get<CartItem[]>("/cart"),

//   addItem: (product_id: string, quantity: number) =>
//     api.post<CartItem>("/cart", { product_id, quantity }),

//   updateItem: (item_id: string, quantity: number) =>
//     api.patch<CartItem>(`/cart/${item_id}`, { quantity }),

//   removeItem: (item_id: string) => api.delete(`/cart/${item_id}`),

//   clear: () => api.delete("/cart"),
// };

// ─── Cart API ────────────────────────────────────────────────────────────────
export const cartApi = {
  get: () => api.get<CartItem[]>("/cart"),

  addItem: (product_id: string, quantity: number) =>
    api.post<CartItem>("/cart", { 
      product_id, 
      quantity: Number(quantity)  // ← Ensure it's a number, not string
    }),

  updateItem: (item_id: string, quantity: number) =>
    api.patch<CartItem>(`/cart/${item_id}`, { 
      quantity: Number(quantity)  // ← Also fix here
    }),

  removeItem: (item_id: string) => api.delete(`/cart/${item_id}`),
  clear: () => api.delete("/cart"),
};
// ─── Orders API ──────────────────────────────────────────────────────────────
export const ordersApi = {
  placeOrder: () => api.post<Order>("/orders"),

  getMyOrders: () => api.get<Order[]>("/orders"),

  getOne: (id: string) => api.get<Order>(`/orders/${id}`),
};

// ─── Admin API ───────────────────────────────────────────────────────────────
export const adminApi = {
  // Products
  createProduct: (data: ProductInput) =>
    api.post<Product>("/admin/products", data),

  updateProduct: (id: string, data: Partial<ProductInput>) =>
    api.patch<Product>(`/admin/products/${id}`, data),

  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),

  // Orders
  getAllOrders: () => api.get<Order[]>("/admin/orders"),

  updateOrderStatus: (id: string, status: string) =>
    api.patch<Order>(`/admin/orders/${id}`, { status } as OrderStatusUpdate),

  // Users
  getAllUsers: () => api.get<User[]>("/admin/users"),
};