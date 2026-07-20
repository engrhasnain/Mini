"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    
    await addToCart(product.id, 1);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="card hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-white/[0.02] rounded-t-2xl">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={40} className="text-white/10" />
            </div>
          )}
          
          {/* Category Badge */}
          {product.category && (
            <span className="absolute top-3 left-3 badge-orange">
              {product.category}
            </span>
          )}
          
          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-2xl">
              <span className="text-white/80 text-sm font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm leading-tight mb-1 line-clamp-2 group-hover:text-orange-400 transition-colors">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-white/40 text-xs line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span className="text-orange-400 font-bold text-lg">
                ${product.price.toFixed(2)}
              </span>
              <p className="text-white/30 text-xs mt-0.5">
                {isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || loading}
              className={`p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                isOutOfStock
                  ? "bg-white/[0.04] text-white/20 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20"
              }`}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}