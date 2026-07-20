import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Package } from "lucide-react";
import { productsApi } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

// ─── Fetch Products (Server Component) ───────────────────────────────────────
async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/products`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// ─── Home Page Component ─────────────────────────────────────────────────────
export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden pt-20 pb-24">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-orange-500/10 rounded-full blur-[140px]" />
        </div>

        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 badge-orange mb-8 text-sm px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            New arrivals every week
          </div>

          <h1 className="font-bold text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-8">
            Shop Smarter,
            <span className="block text-orange-400 mt-2">Live Better.</span>
          </h1>

          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Discover thousands of products at unbeatable prices.
            Fast delivery, easy returns, no hassle.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/products"
              className="btn-primary flex items-center gap-2 text-base px-8 py-3"
            >
              Shop Now
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/register"
              className="btn-secondary text-base px-8 py-3"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] py-12">
        <div className="page-container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center sm:text-left">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On all orders over $50" },
              { icon: RotateCcw, title: "Easy Returns", desc: "30-day hassle-free returns" },
              { icon: ShieldCheck, title: "Secure Checkout", desc: "Your data is always safe" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon size={22} className="text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-base">{title}</p>
                  <p className="text-white/40 text-sm mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="page-container py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="section-title text-3xl">Featured Products</h2>
          <Link href="/products" className="btn-ghost text-sm flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Package size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/40">No products yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="page-container py-20">
        <h2 className="section-title text-3xl mb-12">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Toys", "Food"].map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${encodeURIComponent(cat)}`}
              className="card p-6 text-center hover:bg-white/[0.06] transition-colors"
            >
              <p className="font-medium text-white/80 hover:text-white">{cat}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="page-container pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-[#161005] border border-orange-500/30 p-14 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-500/25 rounded-full blur-[100px]" />
          </div>

          <h2 className="font-bold text-4xl mb-4 relative z-10">
            Ready to start shopping?
          </h2>
          <p className="text-white/60 mb-8 relative z-10 text-lg">
            Join thousands of happy customers today.
          </p>
          <Link
            href="/register"
            className="btn-primary inline-flex items-center gap-2 relative z-10 text-base px-8 py-3"
          >
            Get Started — It&apos;s Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}