"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Package } from "lucide-react";
import { productsApi } from "@/lib/api";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

// ─── Products Content (Client Component) ─────────────────────────────────────
function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: { category?: string; search?: string } = {};
      if (category) params.category = category;
      if (search) params.search = search;
      
      const res = await productsApi.getAll(params);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const categories = ["All", "Electronics", "Clothing", "Books", "Home", "Sports", "Beauty"];

  return (
    <div className="page-container animate-fade-in py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="section-title text-3xl">All Products</h1>
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        <Filter size={16} className="text-white/40 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat === "All" ? "" : cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              (cat === "All" && !category) || category === cat
                ? "bg-orange-500 text-white"
                : "bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description={search || category ? "Try adjusting your filters" : "Check back soon for new arrivals"}
          action={
            (search || category) && (
              <button onClick={() => { setSearch(""); setCategory(""); }} className="btn-secondary">
                Clear Filters
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page (with Suspense boundary) ──────────────────────────────────────
export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" className="py-40" />}>
      <ProductsContent />
    </Suspense>
  );
}