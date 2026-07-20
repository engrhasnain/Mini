"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { adminApi, productsApi, ordersApi } from "@/lib/api";
import { Product, Order, User } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";

interface Stats {
  products: number;
  orders: number;
  users: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch counts
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        productsApi.getAll(),
        adminApi.getAllOrders(),
        adminApi.getAllUsers(),
      ]);

      const products = productsRes.data || [];
      const orders = ordersRes.data || [];
      const users = usersRes.data || [];

      // Calculate revenue from delivered orders
      const revenue = orders
        .filter((o: Order) => o.status === "delivered")
        .reduce((sum: number, o: Order) => sum + o.total_price, 0);

      setStats({
        products: products.length,
        orders: orders.length,
        users: users.length,
        revenue,
      });

      // Get recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400",
    confirmed: "bg-blue-500/10 text-blue-400",
    shipped: "bg-purple-500/10 text-purple-400",
    delivered: "bg-green-500/10 text-green-400",
    cancelled: "bg-red-500/10 text-red-400",
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm">Overview of your store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.products}
          href="/admin/products"
          color="orange"
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats.orders}
          href="/admin/orders"
          color="blue"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.users}
          href="/admin/users"
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          label="Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          href="/admin/orders"
          color="green"
        />
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white text-lg">Recent Orders</h2>
          <Link href="/admin/orders" className="text-orange-400 hover:text-orange-300 text-sm">
            View All →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-white/40 text-sm">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/40 border-b border-white/[0.06]">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="py-3 font-mono text-white/60">{order.id.slice(0, 8)}...</td>
                    <td className="py-3 text-white">{order.user_id.slice(0, 8)}...</td>
                    <td className="py-3 text-orange-400 font-medium">${order.total_price.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-white/40">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Stat Card Component ─────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  href,
  color,
}: {
  icon: any;
  label: string;
  value: number | string;
  href: string;
  color: "orange" | "blue" | "purple" | "green";
}) {
  const colors: Record<string, string> = {
    orange: "bg-orange-500/10 text-orange-400",
    blue: "bg-blue-500/10 text-blue-400",
    purple: "bg-purple-500/10 text-purple-400",
    green: "bg-green-500/10 text-green-400",
  };

  return (
    <Link href={href} className="card p-5 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/40 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
    </Link>
  );
}