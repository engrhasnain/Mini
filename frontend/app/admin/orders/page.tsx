"use client";

import { useEffect, useState } from "react";
import { Package, Search } from "lucide-react";
import { adminApi } from "@/lib/api";
import { Order } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import toast from "react-hot-toast";

const statusOptions = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllOrders();
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.user_id.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      toast.success("Order status updated");
      fetchOrders();
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Failed to update status";
      toast.error(msg);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-white/40 text-sm">Manage and track customer orders</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search by order ID or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title={search ? "No orders found" : "No orders yet"}
          description={search ? "Try a different search term" : "Orders will appear here when customers place them"}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {["Order ID", "User ID", "Total", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-white/40 font-medium text-xs uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-mono text-white/60">{order.id.slice(0, 8)}...</td>
                    <td className="px-5 py-4 text-white">{order.user_id.slice(0, 8)}...</td>
                    <td className="px-5 py-4 font-bold text-orange-400">${order.total_price.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border bg-transparent cursor-pointer transition-all ${
                          statusColors[order.status]
                        } ${updating === order.id ? "opacity-50 cursor-wait" : "hover:opacity-80"}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status} className="bg-[#161616] text-white">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-white/40">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-white/40 text-xs">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}