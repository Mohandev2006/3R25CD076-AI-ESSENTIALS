"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  PackageCheck,
  AlertTriangle,
  Clock,
  Layers,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899", "#14b8a6", "#6366f1"];

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "revenue";

  const { products, sales } = useShop();

  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const [activeTab, setActiveTab] = useState(initialTab);

  const now = new Date();

  // Daily revenue chart data (past 14 days)
  const dailySalesData = useMemo(() => {
    const result = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const daySales = sales.filter((s) => s.created_at.startsWith(dateStr));
      const revenue = daySales.reduce((sum, s) => sum + s.total_amount, 0);

      result.push({
        date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        revenue,
        transactions: daySales.length,
      });
    }
    return result;
  }, [sales]);

  // Category performance revenue
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const p = products.find((prod) => prod.id === item.product_id);
        const cat = p ? p.category : "General";
        map.set(cat, (map.get(cat) || 0) + item.total_price);
      });
    });

    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [products, sales]);

  // Product performance stats
  const productPerformance = useMemo(() => {
    const map = new Map<
      string,
      { product: (typeof products)[0]; unitsSold: number; totalRevenue: number; totalProfit: number }
    >();

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const p = products.find((prod) => prod.id === item.product_id);
        if (p) {
          const unitProfit = p.selling_price - p.purchase_price;
          const current = map.get(p.id) || {
            product: p,
            unitsSold: 0,
            totalRevenue: 0,
            totalProfit: 0,
          };

          current.unitsSold += item.quantity;
          current.totalRevenue += item.total_price;
          current.totalProfit += unitProfit * item.quantity;

          map.set(p.id, current);
        }
      });
    });

    const list = Array.from(map.values());
    const topByRevenue = [...list].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5);
    const topByProfit = [...list].sort((a, b) => b.totalProfit - a.totalProfit).slice(0, 5);

    return { topByRevenue, topByProfit };
  }, [products, sales]);

  // Inventory analytics
  const totalValuation = useMemo(() => {
    return products.reduce((sum, p) => sum + p.quantity * p.selling_price, 0);
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.quantity <= p.reorder_level && p.quantity > 0).length;
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => p.quantity <= 0).length;
  }, [products]);

  const slowMovingProducts = useMemo(() => {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(now.getDate() - 14);

    const recentSales = sales.filter((s) => new Date(s.created_at) >= fourteenDaysAgo);
    const soldProductIds = new Set<string>();
    recentSales.forEach((s) => s.items.forEach((item) => soldProductIds.add(item.product_id)));

    return products.filter((p) => !soldProductIds.has(p.id) && p.quantity > 0);
  }, [products, sales]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>Business Analytics & Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data-backed visual insights into store revenue, top products, category breakdown, and stock health.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold text-slate-700">
          <button
            onClick={() => setActiveTab("revenue")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "revenue" ? "bg-emerald-600 text-white shadow-xs" : "hover:text-slate-900"
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "products" ? "bg-emerald-600 text-white shadow-xs" : "hover:text-slate-900"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("slow-moving")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "slow-moving" ? "bg-emerald-600 text-white shadow-xs" : "hover:text-slate-900"
            }`}
          >
            Slow Stock
          </button>
        </div>
      </div>

      {/* REVENUE TAB CONTENT */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="font-extrabold text-base text-slate-900">Daily Revenue Performance</h2>
                <p className="text-xs text-slate-500">Calculated over past 14 days</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), "Revenue"]}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      color: "#f8fafc",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Revenue Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h2 className="font-extrabold text-base text-slate-900 mb-1">Category Revenue Breakdown</h2>
              <p className="text-xs text-slate-500 mb-4">Percentage share of total sales by product category</p>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [formatCurrency(Number(val)), "Revenue"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h2 className="font-extrabold text-base text-slate-900 mb-1">Category Sales List</h2>
              <p className="text-xs text-slate-500 mb-4">Total revenue generated per category</p>

              <div className="space-y-3">
                {categoryData.map((cat, idx) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                      />
                      <span className="font-bold text-xs text-slate-900">{cat.name}</span>
                    </div>
                    <span className="font-black text-xs text-slate-900">{formatCurrency(cat.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS PERFORMANCE TAB */}
      {activeTab === "products" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Revenue Products */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="font-extrabold text-base text-slate-900 mb-1">Highest Revenue Products</h2>
            <p className="text-xs text-slate-500 mb-4">Products generating the largest total sales volume</p>

            <div className="space-y-3">
              {productPerformance.topByRevenue.map((item, idx) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{item.product.name}</p>
                      <p className="text-[10px] text-slate-500">{item.unitsSold} units sold</p>
                    </div>
                  </div>
                  <span className="font-black text-xs text-slate-900">{formatCurrency(item.totalRevenue)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highest Profit Products */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h2 className="font-extrabold text-base text-slate-900 mb-1">Highest Profit Margin Items</h2>
            <p className="text-xs text-slate-500 mb-4">Products driving the highest total gross profit</p>

            <div className="space-y-3">
              {productPerformance.topByProfit.map((item, idx) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/40 border border-emerald-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{item.product.name}</p>
                      <p className="text-[10px] text-slate-500">Unit Profit: {formatCurrency(item.product.selling_price - item.product.purchase_price)}</p>
                    </div>
                  </div>
                  <span className="font-black text-xs text-emerald-800">+{formatCurrency(item.totalProfit)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SLOW-MOVING STOCK TAB */}
      {activeTab === "slow-moving" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div>
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>Slow-Moving Products Analysis</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Items with zero recorded sales in the last 14 days. Consider reviewing pricing or running promotional bundles.
            </p>
          </div>

          {slowMovingProducts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              No slow moving inventory! All items have sales within 14 days.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Current Stock</th>
                    <th className="px-4 py-3">Selling Price</th>
                    <th className="px-4 py-3">Locked Capital</th>
                    <th className="px-4 py-3">Action Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {slowMovingProducts.map((p) => {
                    const lockedCapital = p.quantity * p.purchase_price;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-900">{p.name}</td>
                        <td className="px-4 py-3 text-slate-600">{p.category}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {p.quantity} {p.unit}s
                        </td>
                        <td className="px-4 py-3 text-slate-900 font-bold">{formatCurrency(p.selling_price)}</td>
                        <td className="px-4 py-3 text-amber-800 font-extrabold">{formatCurrency(lockedCapital)}</td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-semibold text-slate-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                            Discount price by 10% or feature at checkout
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading analytics charts...</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}
