"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useShop } from "@/context/ShopContext";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Layers,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const { products, sales, insights, settings, resetDemoData } = useShop();

  const [salesTimeframe, setSalesTimeframe] = useState<"today" | "7days" | "30days">("7days");

  // Filter sales based on selected timeframe
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const salesToday = useMemo(() => {
    return sales.filter((s) => s.created_at.startsWith(todayStr));
  }, [sales, todayStr]);

  const totalSalesToday = useMemo(() => {
    return salesToday.reduce((sum, s) => sum + s.total_amount, 0);
  }, [salesToday]);

  // Yesterday sales for comparison %
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const salesYesterday = useMemo(() => {
    return sales.filter((s) => s.created_at.startsWith(yesterdayStr));
  }, [sales, yesterdayStr]);
  const totalSalesYesterday = useMemo(() => {
    return salesYesterday.reduce((sum, s) => sum + s.total_amount, 0);
  }, [salesYesterday]);

  const todayPercentageChange = useMemo(() => {
    if (totalSalesYesterday === 0) return 100;
    return (((totalSalesToday - totalSalesYesterday) / totalSalesYesterday) * 100).toFixed(1);
  }, [totalSalesToday, totalSalesYesterday]);

  // Inventory value
  const totalInventoryValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.quantity * p.selling_price, 0);
  }, [products]);

  // Low stock items
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.quantity <= p.reorder_level);
  }, [products]);

  // Slow moving products (0 sales in past 14 days)
  const slowMovingProducts = useMemo(() => {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(now.getDate() - 14);

    const recentSales = sales.filter((s) => new Date(s.created_at) >= fourteenDaysAgo);
    const soldProductIds = new Set<string>();
    recentSales.forEach((s) => s.items.forEach((item) => soldProductIds.add(item.product_id)));

    return products.filter((p) => !soldProductIds.has(p.id) && p.quantity > 0);
  }, [products, sales]);

  // Chart data calculation
  const chartData = useMemo(() => {
    const days = salesTimeframe === "today" ? 1 : salesTimeframe === "7days" ? 7 : 30;
    const result: { date: string; revenue: number; transactions: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const daySales = sales.filter((s) => s.created_at.startsWith(dateStr));
      const revenue = daySales.reduce((sum, s) => sum + s.total_amount, 0);

      const label =
        days === 1
          ? "Today"
          : d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

      result.push({
        date: label,
        revenue,
        transactions: daySales.length,
      });
    }

    return result;
  }, [sales, salesTimeframe]);

  // Top selling products ranked by revenue or quantity
  const topSellingProducts = useMemo(() => {
    const productSalesMap = new Map<string, { product: (typeof products)[0]; unitsSold: number; totalRevenue: number }>();

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const p = products.find((prod) => prod.id === item.product_id);
        if (p) {
          const current = productSalesMap.get(p.id) || { product: p, unitsSold: 0, totalRevenue: 0 };
          current.unitsSold += item.quantity;
          current.totalRevenue += item.total_price;
          productSalesMap.set(p.id, current);
        }
      });
    });

    return Array.from(productSalesMap.values())
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);
  }, [products, sales]);

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Shop Overview</span>
            <span className="text-xs px-2 py-0.5 font-bold bg-emerald-100 text-emerald-800 rounded-full">
              Live
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time business performance and smart recommendations for {settings.shop_name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/sales"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Record Sale</span>
          </Link>
          <button
            onClick={resetDemoData}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset to default demo shop state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Metric 1: Today's Sales */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Today's Sales</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{formatCurrency(totalSalesToday)}</p>
          <div className="flex items-center gap-1 mt-2 text-[11px]">
            {Number(todayPercentageChange) >= 0 ? (
              <span className="text-emerald-600 font-bold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />+{todayPercentageChange}%
              </span>
            ) : (
              <span className="text-rose-600 font-bold flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" />
                {todayPercentageChange}%
              </span>
            )}
            <span className="text-slate-400">vs yesterday</span>
          </div>
        </div>

        {/* Metric 2: Today's Transactions */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Transactions</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{salesToday.length}</p>
          <p className="text-[11px] text-slate-400 mt-2">Recorded today</p>
        </div>

        {/* Metric 3: Total Products */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Total Products</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{products.length}</p>
          <p className="text-[11px] text-slate-400 mt-2">Active SKUs</p>
        </div>

        {/* Metric 4: Low Stock Count */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Low Stock</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{lowStockProducts.length}</p>
          <Link
            href="/products?status=low_stock"
            className="text-[11px] text-amber-700 hover:underline font-semibold mt-2 inline-block"
          >
            Reorder needed →
          </Link>
        </div>

        {/* Metric 5: Estimated Inventory Value */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Inventory Value</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900">{formatCurrency(totalInventoryValue)}</p>
          <p className="text-[11px] text-slate-400 mt-2">At retail price</p>
        </div>
      </div>

      {/* AI Business Insights Banner Section */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-800/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight">AI Assistant Insights</h2>
              <p className="text-[11px] text-emerald-300">Automated recommendations based on actual shop transactions</p>
            </div>
          </div>
          <Link
            href="/ai-assistant"
            className="text-xs text-emerald-300 hover:text-white font-semibold flex items-center gap-1 bg-emerald-800/50 px-3 py-1.5 rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <span>Ask AI Assistant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-emerald-500/50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      insight.type === "alert"
                        ? "bg-rose-400"
                        : insight.type === "warning"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <h3 className="text-xs font-bold text-slate-100 line-clamp-1">{insight.title}</h3>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug line-clamp-3 mb-3">
                  {insight.description}
                </p>
              </div>

              {insight.action_label && insight.action_href && (
                <Link
                  href={insight.action_href}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 mt-auto"
                >
                  <span>{insight.action_label}</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Charts & Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Sales Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">Sales Overview</h2>
              <p className="text-xs text-slate-500">Revenue trend over selected timeframe</p>
            </div>

            {/* Timeframe Selector Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
              <button
                onClick={() => setSalesTimeframe("today")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  salesTimeframe === "today" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setSalesTimeframe("7days")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  salesTimeframe === "7days" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setSalesTimeframe("30days")}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  salesTimeframe === "30days" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value)), "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    color: "#f8fafc",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Top Selling Products */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-base text-slate-900">Top Selling Items</h2>
              <Link href="/analytics" className="text-xs text-emerald-600 hover:underline font-semibold">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {topSellingProducts.map((item, idx) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-slate-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-slate-500">{item.unitsSold} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-xs text-slate-900">{formatCurrency(item.totalRevenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Low Stock Alerts & Slow Moving Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-base text-slate-900">Low Stock Alerts</h2>
            </div>
            <Link href="/products?status=low_stock" className="text-xs text-emerald-600 hover:underline font-semibold">
              Manage Stock
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              All inventory levels are healthy!
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-rose-100 bg-rose-50/40"
                >
                  <div>
                    <p className="font-bold text-xs text-slate-900">{p.name}</p>
                    <p className="text-[11px] text-slate-500">Reorder Level: {p.reorder_level} {p.unit}s</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 rounded-md text-xs font-black bg-rose-100 text-rose-800">
                      {p.quantity} {p.unit}s left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slow Moving Products */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-base text-slate-900">Slow-Moving Inventory</h2>
            </div>
            <Link href="/analytics?tab=slow-moving" className="text-xs text-emerald-600 hover:underline font-semibold">
              Investigate
            </Link>
          </div>

          {slowMovingProducts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              No slow-moving inventory detected in the last 14 days.
            </div>
          ) : (
            <div className="space-y-2.5">
              {slowMovingProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60"
                >
                  <div>
                    <p className="font-bold text-xs text-slate-900">{p.name}</p>
                    <p className="text-[11px] text-slate-500">0 sales in 14 days • Value: {formatCurrency(p.quantity * p.selling_price)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                      {p.quantity} in stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
