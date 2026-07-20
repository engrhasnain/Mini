"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingBag, ArrowRight, Clock, CheckCircle, Truck } from "lucide-react";
import { ordersApi } from "@/lib/api";
import { Order } from "@/types";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

// Status badge colors
const statusStyles: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400",
  confirmed: "bg-blue-500/10 text-blue-400",
  shipped: "bg-purple-500/10 text-purple-400",
  delivered: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: Package,
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner size="lg" className="py-40" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="page-container animate-fade-in py-12">
      <h1 className="section-title text-3xl mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Start shopping to see your orders here"
          action={
            <Link href="/products" className="btn-primary flex items-center gap-2">
              Browse Products <ArrowRight size={16} />
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status] || Clock;
            
            return (
              <div key={order.id} className="card p-6">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/[0.06]">
                  <div>
                    <p className="text-white/40 text-sm">Order ID</p>
                    <p className="text-white font-mono text-sm">{order.id.slice(0, 8)}...</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Date</p>
                    <p className="text-white text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/40 text-sm">Total</p>
                    <p className="text-orange-400 font-bold">${order.total_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status] || "bg-white/[0.04] text-white/60"}`}>
                      <StatusIcon size={12} className="inline mr-1" />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/[0.02] flex-shrink-0">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} className="text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{item.product.name}</p>
                        <p className="text-white/40 text-sm">
                          Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-white font-semibold">
                        ${(item.quantity * item.unit_price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}