"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Package, Search, Upload, Image as ImageIcon } from "lucide-react";
import { Product } from "@/types";
import { adminApi, productsApi } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import toast from "react-hot-toast";

type ProductInput = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
};

const EMPTY_FORM: ProductInput = {
  name: "", description: "", price: 0, stock: 0, category: "", image_url: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsApi.getAll();
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      category: product.category || "",
      image_url: product.image_url || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.category || form.price <= 0) {
      toast.error("Please fill all required fields.");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateProduct(editing.id, form);
        toast.success("Product updated!");
      } else {
        await adminApi.createProduct(form);
        toast.success("Product created!");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Save failed.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const res = await adminApi.uploadImage(file);
      setForm((f) => ({ ...f, image_url: res.data.url }));
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await adminApi.deleteProduct(id);
      toast.success("Product deleted.");
      fetchProducts();
    } catch {
      toast.error("Could not delete product.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-white/40 text-sm">Manage your product catalog</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title={search ? "No products found" : "No products yet"}
          description={search ? "Try a different search term" : "Create your first product to get started"}
          action={
            !search && (
              <button onClick={openCreate} className="btn-primary">
                Add Product
              </button>
            )
          }
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {["Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-white/40 font-medium text-xs uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{p.name}</p>
                      <p className="text-white/40 text-xs line-clamp-1 max-w-xs">{p.description}</p>
                    </td>
                    <td className="px-5 py-4 text-white/60">{p.category || "-"}</td>
                    <td className="px-5 py-4 font-bold text-orange-400">${p.price.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={p.stock > 0 ? "text-green-400" : "text-red-400"}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white transition-all"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-lg bg-white/[0.04] hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161616] border border-white/10 rounded-2xl w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <h2 className="font-bold text-white text-lg">
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="label">Name *</label>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input-field resize-none h-20"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input-field"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="label">Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Category *</label>
                <input
                  className="input-field"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Electronics"
                />
              </div>
              <div>
                <label className="label">Product Image</label>
                <div className="flex items-center gap-4">
                  {form.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-20 h-20 rounded-xl object-cover border border-white/10 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={20} className="text-white/20" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <label className="btn-secondary inline-flex items-center gap-2 cursor-pointer text-sm px-4 py-2">
                      <Upload size={14} />
                      {uploading ? "Uploading..." : "Upload Image"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={uploading}
                      />
                    </label>
                    <input
                      className="input-field text-xs"
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      placeholder="or paste an image URL"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0 border-t border-white/[0.06]">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                {saving ? "Saving..." : editing ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}