"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Users, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (!isAdmin) {
        router.push("/");
      }
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[calc(100vh-4rem)]" />;
  }

  if (!isAdmin) {
    return null;
  }

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/users", label: "Users", icon: Users },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/[0.06] bg-[#0f0f0f] p-4 flex flex-col">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Package size={18} className="text-white" />
          </div>
          <span className="font-bold text-white">Admin Panel</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-orange-500/15 text-orange-400"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-white/[0.06] space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-white/50 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 text-sm transition-colors w-full text-left"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}