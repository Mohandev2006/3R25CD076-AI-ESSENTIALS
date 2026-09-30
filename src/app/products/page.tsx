"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { Product, StockStatus } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  X,
  Calendar,
  Layers,
  Tag,
} from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "all";

  const { products, addProduct, updateProduct, deleteProduct } = useShop();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "Staples & Grains",
    sku: "",
    unit: "packet",
    quantity: 10,
    purchase_price: 0,
    selling_price: 0,
    reorder_level: 10,
    expiry_date: "",
    supplier: "",
  });

  // Calculate Categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => cats.add(p.category));
    return ["all", ...Array.from(cats)];
  }, [products]);

  // Status helper function
  const getProductStatus = (p: Product): StockStatus => {
    if (p.quantity <= 0) return "out_of_stock";
    if (p.quantity <= p.reorder_level) return "low_stock";

    if (p.expiry_date) {
      const expiry = new Date(p.expiry_date);
      const today = new Date();
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) return "expiring_soon";
    }

    return "in_stock";
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.supplier && p.supplier.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;

      const status = getProductStatus(p);
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "low_stock" && (status === "low_stock" || status === "out_of_stock")) ||
        (selectedStatus === "expiring_soon" && status === "expiring_soon") ||
        (selectedStatus === "in_stock" && status === "in_stock");

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  // Form open handlers
  const openAddModal = () => {
    setFormData({
      name: "",
      category: "Staples & Grains",
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      unit: "packet",
      quantity: 20,
      purchase_price: 50,
      selling_price: 65,
      reorder_level: 10,
      expiry_date: "",
      supplier: "",
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      sku: p.sku,
      unit: p.unit || "packet",
      quantity: p.quantity,
      purchase_price: p.purchase_price,
      selling_price: p.selling_price,
      reorder_level: p.reorder_level,
      expiry_date: p.expiry_date || "",
      supplier: p.supplier || "",
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        sku: formData.sku,
        unit: formData.unit,
        quantity: Number(formData.quantity),
        purchase_price: Number(formData.purchase_price),
        selling_price: Number(formData.selling_price),
        reorder_level: Number(formData.reorder_level),
        expiry_date: formData.expiry_date || undefined,
        supplier: formData.supplier || undefined,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        sku: formData.sku,
        unit: formData.unit,
        quantity: Number(formData.quantity),
        purchase_price: Number(formData.purchase_price),
        selling_price: Number(formData.selling_price),
        reorder_level: Number(formData.reorder_level),
        expiry_date: formData.expiry_date || undefined,
        supplier: formData.supplier || undefined,
      });
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  // Unit profit calculation
  const calculatedUnitProfit = Number(formData.selling_price) - Number(formData.purchase_price);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>Products & Inventory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage product catalogue, stock levels, reorder alerts, and profit margins.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name, SKU, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors text-slate-800"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 font-semibold cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 font-semibold cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low / Out of Stock</option>
            <option value="expiring_soon">Expiring Soon</option>
          </select>
        </div>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> of {products.length} products
          </span>
          {(searchTerm || selectedCategory !== "all" || selectedStatus !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedStatus("all");
              }}
              className="text-emerald-600 hover:underline font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Selling Price</th>
                <th className="px-4 py-3">Purchase Price</th>
                <th className="px-4 py-3">Unit Profit</th>
                <th className="px-4 py-3">Reorder Level</th>
                <th className="px-4 py-3">Expiry Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-slate-400">
                    No products matching your search or filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const status = getProductStatus(p);
                  const profitMargin = p.selling_price - p.purchase_price;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        <div>
                          <span>{p.name}</span>
                          <p className="text-[10px] text-slate-400 font-normal">SKU: {p.sku}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.category}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {p.quantity} {p.unit}
                      </td>
                      <td className="px-4 py-3 font-extrabold text-slate-900">{formatCurrency(p.selling_price)}</td>
                      <td className="px-4 py-3 text-slate-500">{formatCurrency(p.purchase_price)}</td>
                      <td className="px-4 py-3 font-bold text-emerald-700">
                        +{formatCurrency(profitMargin)}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {p.reorder_level} {p.unit}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {p.expiry_date ? formatDate(p.expiry_date) : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {status === "in_stock" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> In Stock
                          </span>
                        )}
                        {status === "low_stock" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        )}
                        {status === "out_of_stock" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            <XCircle className="w-3 h-3" /> Out of Stock
                          </span>
                        )}
                        {status === "expiring_soon" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                            <Clock className="w-3 h-3" /> Expiring Soon
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProductId(p.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" />
                <span>{editingProduct ? "Edit Product Details" : "Add New Product"}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amul Taaza Toned Milk 1L"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                  >
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Staples & Grains">Staples & Grains</option>
                    <option value="Oil & Ghee">Oil & Ghee</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Snacks & Biscuits">Snacks & Biscuits</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Household">Household</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit Type</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                  >
                    <option value="packet">packet</option>
                    <option value="bag">bag</option>
                    <option value="bottle">bottle</option>
                    <option value="pack">pack</option>
                    <option value="bar">bar</option>
                    <option value="tube">tube</option>
                    <option value="jar">jar</option>
                    <option value="box">box</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Purchase Price (Cost ₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (Retail ₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Automatic Margin Preview Badge */}
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-semibold">Calculated Unit Profit:</span>
                <span className="font-extrabold text-emerald-700">{formatCurrency(calculatedUnitProfit)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reorder Level *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.reorder_level}
                    onChange={(e) => setFormData({ ...formData, reorder_level: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU / Barcode (Optional)</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Supplier / Distributor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amul Dairy Dist"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-1">Delete Product?</h3>
            <p className="text-xs text-slate-500 mb-6">
              This action cannot be undone. All sales logs will maintain transaction history.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading products table...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
