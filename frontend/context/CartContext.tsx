"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CartItem } from "@/types";
import { cartApi } from "@/lib/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product_id: string, quantity?: number) => Promise<void>;
  updateQuantity: (item_id: string, quantity: number) => Promise<void>;
  removeFromCart: (item_id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | undefined>(undefined);

// ─── Helper: Extract error message from API response ─────────────────────────
function getErrorMessage(err: any): string {
  if (err?.response?.data?.detail) {
    const detail = err.response.data.detail;
    
    // Pydantic validation errors (array format)
    if (Array.isArray(detail)) {
      return detail[0]?.msg || "Validation failed";
    }
    
    // Simple string error
    if (typeof detail === "string") {
      return detail;
    }
    
    // Object with message property
    if (detail?.msg) {
      return detail.msg;
    }
  }
  
  return err?.message || "An error occurred";
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // ─── Fetch cart when authenticated ─────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const res = await cartApi.get();
      setItems(res.data || []);
    } catch (err: any) {
      console.error("Failed to fetch cart:", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ─── Add to Cart ────────────────────────────────────────────────────────────
  const addToCart = async (product_id: string, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    // Ensure product_id is a valid string UUID
    if (!product_id || typeof product_id !== "string" || product_id.length < 36) {
      toast.error("Invalid product ID");
      return;
    }

    setLoading(true);
    try {
      await cartApi.addItem(product_id, quantity);
      await refreshCart();
      toast.success("Added to cart!");
    } catch (err: any) {
      const msg = getErrorMessage(err);
      console.error("Add to cart failed:", msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Update Quantity ────────────────────────────────────────────────────────
  const updateQuantity = async (item_id: string, quantity: number) => {
    setLoading(true);
    try {
      await cartApi.updateItem(item_id, quantity);
      await refreshCart();
      toast.success("Cart updated!");
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ─── Remove from Cart ───────────────────────────────────────────────────────
  const removeFromCart = async (item_id: string) => {
    setLoading(true);
    try {
      await cartApi.removeItem(item_id);
      await refreshCart();
      toast.success("Item removed");
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ─── Clear Cart ─────────────────────────────────────────────────────────────
  const clearCart = async () => {
    setLoading(true);
    try {
      await cartApi.clear();
      setItems([]);
      toast.success("Cart cleared");
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ─── Computed Values ────────────────────────────────────────────────────────
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // ─── Value ──────────────────────────────────────────────────────────────────
  const value: CartContextType = {
    items,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}