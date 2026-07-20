"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authApi.login(email, password);
      await login(res.data);
      toast.success("Welcome back!");
      
      // Redirect based on user role
      if (res.data.user.is_admin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Login failed. Please check your credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Smart<span className="text-orange-400">Store</span>
            </span>
          </Link>
          <p className="text-white/40 text-sm">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Email */}
          <div>
            <label className="label flex items-center gap-2">
              <Mail size={14} className="text-white/40" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="label flex items-center gap-2">
              <Lock size={14} className="text-white/40" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Register Link */}
          <p className="text-center text-white/40 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-orange-400 hover:text-orange-300 font-medium">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}