// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category: string | null;
  created_at: string;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  added_at: string;
  product: Product;
}

// ─── Orders ──────────────────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

// ─── Product Forms ───────────────────────────────────────────────────────────
export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
}

// ─── Order Forms ─────────────────────────────────────────────────────────────
export interface OrderStatusUpdate {
  status: string;
}