"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import {
  Settings,
  Store,
  User,
  Phone,
  MapPin,
  RefreshCw,
  CheckCircle2,
  Bell,
  ShieldCheck,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings, resetDemoData } = useShop();

  const [formData, setFormData] = useState({
    shop_name: settings.shop_name,
    owner_name: settings.owner_name,
    phone: settings.phone,
    address: settings.address,
    currency: settings.currency,
    default_low_stock_threshold: settings.default_low_stock_threshold,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-600" />
          <span>Shop Settings & Configuration</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Update store information, inventory threshold defaults, and manage demo state.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Store Details</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Shop Name</label>
                <input
                  type="text"
                  required
                  value={formData.shop_name}
                  onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  required
                  value={formData.owner_name}
                  onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Currency Symbol</label>
                <select
                  value={formData.currency}
                  onChange={(e: any) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
                >
                  <option value="INR">INR (₹ Indian Rupee)</option>
                  <option value="USD">USD ($ US Dollar)</option>
                  <option value="EUR">EUR (€ Euro)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Shop Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Inventory Defaults */}
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Inventory Thresholds</span>
            </h2>

            <div className="max-w-xs">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Low Stock Alert Threshold
              </label>
              <input
                type="number"
                min="1"
                value={formData.default_low_stock_threshold}
                onChange={(e) => setFormData({ ...formData, default_low_stock_threshold: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-800"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Products created in future will default to this reorder level.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span>Reset Kirana Demo Data</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Wipes any changes made during testing and restores initial 17 Kirana products and 30-day sales history.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          Reset Demo Store
        </button>
      </div>
    </div>
  );
}
