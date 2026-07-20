"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, Minus, Plus, Package, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ordersApi } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import toast from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { items, loading, updateQuantity, removeFromCart, clearCart, refreshCart, totalPrice } = useCart();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      await ordersApi.placeOrder();
      toast.success("Order placed successfully!");
      await refreshCart();
      router.push("/orders");
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Failed to place order";
      toast.error(msg);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container animate-fade-in py-20">
        <EmptyState
          icon={Package}
          title="Please login to view your cart"
          description="You need to be logged in to access your shopping cart"
          action={
            <Link href="/login" className="btn-primary">
              Go to Login
            </Link>
          }
        />
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="py-40" />;
  }

  return (
    <div className="page-container animate-fade-in py-12">
      <h1 className="section-title text-3xl mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add some products to get started"
          action={
            <Link href="/products" className="btn-primary flex items-center gap-2">
              Browse Products <ArrowRight size={16} />
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="card p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
              >
                {/* Product Image */}
                <div className="relative w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-white/[0.02] flex-shrink-0">
                  {item.product.image_url ? (
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={24} className="text-white/20" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{item.product.name}</h3>
                  <p className="text-white/40 text-sm">{item.product.category}</p>
                  <p className="text-orange-400 font-bold mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white flex items-center justify-center transition-all"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white flex items-center justify-center transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[80px]">
                  <p className="text-white font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 rounded-lg bg-white/[0.04] hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-white/40 hover:text-red-400 text-sm transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-semibold text-white text-lg mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Subtotal ({items.length} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Shipping</span>
                  <span>{totalPrice >= 50 ? "Free" : "$5.00"}</span>
                </div>
                <div className="border-t border-white/[0.06] pt-3 flex justify-between">
                  <span className="font-semibold text-white">Total</span>
                  <span className="font-bold text-orange-400 text-lg">
                    ${(totalPrice >= 50 ? totalPrice : totalPrice + 5).toFixed(2)}
                  </span>
                </div>
              </div>

              {totalPrice < 50 && (
                <p className="text-white/40 text-xs mb-4">
                  Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
                </p>
              )}

              <button
                onClick={handlePlaceOrder}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                Place Order <ArrowRight size={16} />
              </button>

              <Link
                href="/products"
                className="block text-center text-white/40 hover:text-white text-sm mt-3 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}