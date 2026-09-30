"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, Sale, ShopSettings, ShopNotification, AIInsight, PaymentMethod } from "@/types";
import { INITIAL_SETTINGS, SAMPLE_PRODUCTS, generateSampleSales, SAMPLE_NOTIFICATIONS, SAMPLE_AI_INSIGHTS } from "@/lib/demoData";

interface ShopContextType {
  products: Product[];
  sales: Sale[];
  settings: ShopSettings;
  notifications: ShopNotification[];
  insights: AIInsight[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, "id" | "shop_id" | "created_at" | "updated_at">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  recordSale: (items: { product_id: string; quantity: number }[], paymentMethod: PaymentMethod) => { success: boolean; saleId?: string; error?: string };
  resetDemoData: () => void;
  updateSettings: (newSettings: Partial<ShopSettings>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PRODUCTS = "smartshop_products_v1";
const LOCAL_STORAGE_KEY_SALES = "smartshop_sales_v1";
const LOCAL_STORAGE_KEY_SETTINGS = "smartshop_settings_v1";
const LOCAL_STORAGE_KEY_NOTIFS = "smartshop_notifs_v1";

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(INITIAL_SETTINGS);
  const [notifications, setNotifications] = useState<ShopNotification[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>(SAMPLE_AI_INSIGHTS);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from local storage or fallback to demo data
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
      const savedSales = localStorage.getItem(LOCAL_STORAGE_KEY_SALES);
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      const savedNotifs = localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFS);

      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(SAMPLE_PRODUCTS);
        localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(SAMPLE_PRODUCTS));
      }

      if (savedSales) {
        setSales(JSON.parse(savedSales));
      } else {
        const initialSales = generateSampleSales();
        setSales(initialSales);
        localStorage.setItem(LOCAL_STORAGE_KEY_SALES, JSON.stringify(initialSales));
      }

      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        setSettings(INITIAL_SETTINGS);
        localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      }

      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      } else {
        setNotifications(SAMPLE_NOTIFICATIONS);
        localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, JSON.stringify(SAMPLE_NOTIFICATIONS));
      }
    } catch (e) {
      console.error("Failed to load local storage data, using sample fallback", e);
      setProducts(SAMPLE_PRODUCTS);
      setSales(generateSampleSales());
      setSettings(INITIAL_SETTINGS);
      setNotifications(SAMPLE_NOTIFICATIONS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save changes to localStorage
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(newProducts));
  };

  const saveSales = (newSales: Sale[]) => {
    setSales(newSales);
    localStorage.setItem(LOCAL_STORAGE_KEY_SALES, JSON.stringify(newSales));
  };

  const saveSettings = (newSettings: ShopSettings) => {
    setSettings(newSettings);
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
  };

  const saveNotifications = (newNotifs: ShopNotification[]) => {
    setNotifications(newNotifs);
    localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, JSON.stringify(newNotifs));
  };

  const addProduct = (productData: Omit<Product, "id" | "shop_id" | "created_at" | "updated_at">) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      shop_id: settings.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newProduct, ...products];
    saveProducts(updated);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  const recordSale = (
    items: { product_id: string; quantity: number }[],
    paymentMethod: PaymentMethod
  ) => {
    // Check stock availability
    for (const item of items) {
      const p = products.find((prod) => prod.id === item.product_id);
      if (!p) {
        return { success: false, error: "Product not found" };
      }
      if (p.quantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${p.name}. Available: ${p.quantity}, requested: ${item.quantity}`,
        };
      }
    }

    const saleId = `INV-${Date.now().toString().slice(-6)}`;
    let totalAmount = 0;

    // Build sale items and update product stock
    const updatedProducts = [...products];
    const saleItems = items.map((item, idx) => {
      const pIdx = updatedProducts.findIndex((prod) => prod.id === item.product_id);
      const p = updatedProducts[pIdx];

      const unitPrice = p.selling_price;
      const itemTotal = unitPrice * item.quantity;
      totalAmount += itemTotal;

      // Deduct stock
      updatedProducts[pIdx] = {
        ...p,
        quantity: p.quantity - item.quantity,
        updated_at: new Date().toISOString(),
      };

      return {
        id: `item-${saleId}-${idx}`,
        sale_id: saleId,
        product_id: p.id,
        product_name: p.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: itemTotal,
      };
    });

    const newSale: Sale = {
      id: saleId,
      shop_id: settings.id,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      created_at: new Date().toISOString(),
      items: saleItems,
    };

    saveProducts(updatedProducts);
    saveSales([newSale, ...sales]);

    // Check if any product went below reorder level and add notification if so
    items.forEach((item) => {
      const updatedP = updatedProducts.find((p) => p.id === item.product_id);
      if (updatedP && updatedP.quantity <= updatedP.reorder_level) {
        const newNotif: ShopNotification = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          title: `Low Stock: ${updatedP.name}`,
          message: `${updatedP.name} is down to ${updatedP.quantity} ${updatedP.unit}s! Reorder recommended.`,
          type: "low_stock",
          date: new Date().toISOString(),
          read: false,
          link: "/products?status=low_stock",
        };
        saveNotifications([newNotif, ...notifications]);
      }
    });

    return { success: true, saleId };
  };

  const resetDemoData = () => {
    const sampleSales = generateSampleSales();
    saveProducts(SAMPLE_PRODUCTS);
    saveSales(sampleSales);
    saveSettings(INITIAL_SETTINGS);
    saveNotifications(SAMPLE_NOTIFICATIONS);
    setInsights(SAMPLE_AI_INSIGHTS);
  };

  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    const updated = { ...settings, ...newSettings };
    saveSettings(updated);
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        sales,
        settings,
        notifications,
        insights,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        recordSale,
        resetDemoData,
        updateSettings,
        markNotificationRead,
        clearAllNotifications,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
