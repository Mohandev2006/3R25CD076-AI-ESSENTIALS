"use client";

import React, { useState, useMemo } from "react";
import { useShop } from "@/context/ShopContext";
import { PaymentMethod } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  CreditCard,
  QrCode,
  Banknote,
  Receipt,
  AlertCircle,
  X,
  PlusCircle,
  Clock,
  ChevronRight,
} from "lucide-react";

interface CartItem {
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  available_stock: number;
  unit: string;
}

export default function SalesPage() {
  const { products, sales, recordSale } = useShop();

  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");

  // Success / Error Feedback
  const [successSaleId, setSuccessSaleId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter products for quick selection
  const availableProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [products, searchQuery]);

  // Add product to cart
  const addToCart = (p: (typeof products)[0]) => {
    if (p.quantity <= 0) {
      setErrorMessage(`${p.name} is out of stock!`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product_id === p.id);
      if (existing) {
        if (existing.quantity + 1 > p.quantity) {
          setErrorMessage(`Cannot exceed available stock of ${p.quantity} ${p.unit}s for ${p.name}`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.product_id === p.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prevCart,
          {
            product_id: p.id,
            product_name: p.name,
            unit_price: p.selling_price,
            quantity: 1,
            available_stock: p.quantity,
            unit: p.unit,
          },
        ];
      }
    });
    setErrorMessage(null);
  };

  // Adjust cart item quantity
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product_id === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.available_stock) {
              setErrorMessage(`Stock limit reached (${item.available_stock} ${item.unit}s available)`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== productId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  }, [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const items = cart.map((i) => ({
      product_id: i.product_id,
      quantity: i.quantity,
    }));

    const result = recordSale(items, paymentMethod);

    if (result.success && result.saleId) {
      setSuccessSaleId(result.saleId);
      setCart([]);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error || "Failed to record sale");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
            <span>Record Sale (POS Interface)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quick counter sale entry. Stock levels will automatically decrease upon checkout.
          </p>
        </div>
      </div>

      {/* POS Grid: Left Product Picker, Right Cart Checkout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side (7 cols): Search & Select Items */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search items by name or scan barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-colors text-slate-800 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Available Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[480px] overflow-y-auto p-1">
              {availableProducts.length === 0 ? (
                <div className="col-span-2 p-8 text-center text-xs text-slate-400">
                  No products matched search term.
                </div>
              ) : (
                availableProducts.map((p) => {
                  const isOutOfStock = p.quantity <= 0;
                  return (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p)}
                      disabled={isOutOfStock}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isOutOfStock
                          ? "bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed"
                          : "bg-slate-50/80 hover:bg-emerald-50/60 border-slate-200 hover:border-emerald-500/50 cursor-pointer"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-bold text-xs text-slate-900 line-clamp-1">{p.name}</p>
                          <PlusCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{p.category}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60">
                        <span className="font-extrabold text-xs text-slate-900">
                          {formatCurrency(p.selling_price)}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isOutOfStock
                              ? "bg-rose-100 text-rose-800"
                              : p.quantity <= p.reorder_level
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isOutOfStock ? "Out of Stock" : `${p.quantity} ${p.unit}s`}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side (5 cols): Current Sale Cart & Checkout */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between min-h-[480px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Current Cart ({cart.length} items)</span>
                </h2>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-[11px] text-rose-600 hover:underline font-semibold"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {/* Error or Success alerts */}
              {errorMessage && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successSaleId && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Sale recorded! Invoice <strong>#{successSaleId}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => setSuccessSaleId(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Cart items list */}
              <div className="mt-3 divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    Your cart is empty. Click items on the left to add to sale.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product_id} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate">{item.product_name}</p>
                        <p className="text-[10px] text-slate-500">
                          {formatCurrency(item.unit_price)} × {item.quantity} ={" "}
                          <strong className="text-slate-900">
                            {formatCurrency(item.unit_price * item.quantity)}
                          </strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product_id, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="p-1 text-slate-400 hover:text-rose-600 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Checkout Section */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === "upi"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`p-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === "cash"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-2 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === "card"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Card</span>
                  </button>
                </div>
              </div>

              {/* Total & Checkout Button */}
              <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Grand Total</span>
                  <span className="text-xl font-black text-emerald-400">{formatCurrency(cartTotal)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className={`px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all ${
                    cart.length === 0
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  }`}
                >
                  Confirm Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h2 className="font-extrabold text-base text-slate-900">Recent Transactions</h2>
          </div>
          <span className="text-xs text-slate-500">Total recorded: {sales.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Invoice ID</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Items Sold</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sales.slice(0, 8).map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-900">{s.id}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDateTime(s.created_at)}</td>
                  <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                    {s.items.map((i) => `${i.product_name} (${i.quantity})`).join(", ")}
                  </td>
                  <td className="px-4 py-3 uppercase text-[10px] font-bold text-slate-600">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100">{s.payment_method}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-extrabold text-slate-900">
                    {formatCurrency(s.total_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
