"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Minus, Plus, Package } from "lucide-react";
import { productsApi } from "@/lib/api";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id || typeof id !== "string") {
      router.push("/products");
      return;
    }

    productsApi
      .getOne(id)
      .then((res) => setProduct(res.data))
      .catch(() => router.push("/products"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!product) return;
    
    await addToCart(product.id, qty);
  };

  if (loading) return <LoadingSpinner size="lg" className="py-40" />;
  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="page-container animate-fade-in py-12">
      {/* Back Link */}
      <Link href="/products" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.06]">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={64} className="text-white/10" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          {product.category && (
            <span className="badge-orange mb-4 self-start w-fit">
              {product.category}
            </span>
          )}
          
          <h1 className="font-bold text-3xl lg:text-4xl text-white mb-4 leading-tight">
            {product.name}
          </h1>
          
          {product.description && (
            <p className="text-white/50 leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          <div className="flex items-baseline gap-3 mb-8">
            <span className="font-bold text-4xl text-orange-400">
              ${product.price.toFixed(2)}
            </span>
            <span className={`text-sm ${isOutOfStock ? "text-red-400" : "text-green-400"}`}>
              {isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
            </span>
          </div>

          {isOutOfStock ? (
            <button disabled className="btn-primary w-full py-4 opacity-50 cursor-not-allowed">
              Out of Stock
            </button>
          ) : (
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-white/50 text-sm">Quantity</span>
                <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white flex items-center justify-center transition-all"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-white font-medium w-8 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white flex items-center justify-center transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                {cartLoading ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}