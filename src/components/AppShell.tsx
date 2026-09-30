"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useShop } from "@/context/ShopContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  Store,
  ChevronRight,
  LogOut,
  User,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products & Stock", href: "/products", icon: Package },
  { name: "Record Sales (POS)", href: "/sales", icon: ShoppingBag },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "AI Assistant", href: "/ai-assistant", icon: Sparkles, badge: "AI" },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings, notifications, markNotificationRead, clearAllNotifications, products, sales } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLandingPage = pathname === "/" || pathname === "/login" || pathname === "/signup";

  if (isLandingPage) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  // Global search filtering
  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredSales = searchQuery.trim()
    ? sales.filter(
        (s) =>
          s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.items.some((i) => i.product_name.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg">
              S
            </div>
            <span className="text-base tracking-tight">{settings.shop_name}</span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-slate-900 text-white flex-shrink-0 min-h-screen border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-extrabold text-xl shadow-md">
              S
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-sm leading-tight">{settings.shop_name}</h1>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI Connected
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Demo Mode Badge */}
        {settings.is_demo && (
          <div className="mx-3 my-2 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-xs">
            <div className="flex items-center justify-between text-emerald-300 font-medium mb-1">
              <span>Demo Mode Active</span>
              <span className="text-[10px] bg-emerald-800 text-emerald-100 px-1.5 py-0.5 rounded">Kirana</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Pre-loaded with sample Indian grocery items & 30-day sales history.
            </p>
          </div>
        )}

        {/* User Footer Card */}
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {settings.owner_name.charAt(0)}
              </div>
              <div className="truncate max-w-[110px]">
                <p className="text-xs font-medium text-slate-200 truncate">{settings.owner_name}</p>
                <p className="text-[10px] text-slate-400 truncate">Shop Owner</p>
              </div>
            </div>
            <Link
              href="/"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors"
              title="Exit to Landing"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-slate-900 text-white flex flex-col z-10">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  S
                </div>
                <span className="font-bold text-sm truncate">{settings.shop_name}</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium ${
                      isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                <span>Exit Demo</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 px-6 items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Left: Search trigger button */}
          <div className="w-80">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-left"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search products, sales, category...</span>
              <kbd className="ml-auto bg-white border border-slate-200 text-[10px] text-slate-500 px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Notifications</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications right now. Everything looks good!
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 text-xs cursor-pointer transition-colors ${
                            n.read ? "bg-white text-slate-600" : "bg-emerald-50/50 text-slate-800 font-medium"
                          } hover:bg-slate-50`}
                        >
                          <div className="flex items-start gap-2">
                            {n.type === "low_stock" || n.type === "out_of_stock" ? (
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            ) : n.type === "expiring" ? (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">{n.title}</p>
                              <p className="text-slate-500 text-[11px] mt-0.5 leading-snug">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {formatDateTime(n.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
                  {settings.owner_name.charAt(0)}
                </div>
                <div className="text-left leading-tight hidden lg:block">
                  <p className="text-xs font-semibold text-slate-800">{settings.owner_name}</p>
                  <p className="text-[10px] text-slate-500">{settings.shop_name}</p>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-50 py-1">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{settings.owner_name}</p>
                    <p className="text-[11px] text-slate-500">{settings.phone}</p>
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Shop Settings</span>
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 border-t border-slate-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Exit Application</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Global Search Modal */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
              <div className="p-3 border-b border-slate-200 flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products, SKUs, or transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full text-sm outline-none text-slate-800 placeholder-slate-400 bg-transparent"
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                {searchQuery.trim() === "" ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Type a product name like <span className="font-semibold text-slate-600">"Milk"</span>,{" "}
                    <span className="font-semibold text-slate-600">"Oil"</span>, or category.
                  </div>
                ) : (
                  <>
                    {/* Matching Products */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Products ({filteredProducts.length})
                      </h4>
                      {filteredProducts.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No products matched</p>
                      ) : (
                        <div className="space-y-1">
                          {filteredProducts.map((p) => (
                            <Link
                              key={p.id}
                              href={`/products?search=${encodeURIComponent(p.name)}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-xs"
                            >
                              <div>
                                <p className="font-semibold text-slate-800">{p.name}</p>
                                <span className="text-[10px] text-slate-500">
                                  {p.category} • SKU: {p.sku}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-slate-900">{formatCurrency(p.selling_price)}</span>
                                <p className={`text-[10px] ${p.quantity <= p.reorder_level ? "text-rose-600 font-bold" : "text-slate-500"}`}>
                                  {p.quantity} {p.unit} in stock
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Matching Transactions */}
                    {filteredSales.length > 0 && (
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Recent Matching Sales
                        </h4>
                        <div className="space-y-1">
                          {filteredSales.map((s) => (
                            <div
                              key={s.id}
                              className="p-2 rounded-lg bg-slate-50 text-xs flex justify-between items-center"
                            >
                              <div>
                                <span className="font-bold text-slate-800">{s.id}</span>
                                <p className="text-[10px] text-slate-500">
                                  {s.items.map((i) => `${i.product_name} (${i.quantity})`).join(", ")}
                                </p>
                              </div>
                              <span className="font-bold text-emerald-700">{formatCurrency(s.total_amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Page Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
