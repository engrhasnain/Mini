"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-2 left-2 right-2 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Smart<span className="text-orange-400">Store</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-white/60 hover:text-white text-sm transition-colors">
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/cart" className="relative text-white/60 hover:text-white transition-colors">
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {isAdmin && (
                  <Link href="/admin" className="text-orange-400 hover:text-orange-300 text-sm transition-colors">
                    Admin
                  </Link>
                )}

                <div className="flex items-center gap-3 pl-4 border-l border-white/[0.06]">
                  <span className="text-white/40 text-sm">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white/60 hover:text-white text-sm transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}