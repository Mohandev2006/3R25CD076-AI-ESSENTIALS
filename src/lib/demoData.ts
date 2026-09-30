import { Product, Sale, ShopSettings, ShopNotification, AIInsight } from "@/types";

export const INITIAL_SETTINGS: ShopSettings = {
  id: "shop-001",
  shop_name: "Gupta Kirana & Store",
  owner_name: "Ramesh Gupta",
  phone: "+91 98765 43210",
  currency: "INR",
  address: "Shop No. 12, Main Market, Sector 15, New Delhi",
  default_low_stock_threshold: 10,
  slow_moving_days_threshold: 14,
  is_demo: true,
};

// Generate historical dates helper
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

const daysInFuture = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    shop_id: "shop-001",
    name: "Amul Taaza Toned Milk 1L",
    category: "Dairy & Eggs",
    sku: "MILK-001",
    quantity: 6, // Low stock!
    purchase_price: 60,
    selling_price: 66,
    reorder_level: 15,
    expiry_date: daysInFuture(2), // Expiring soon!
    supplier: "Amul Dairy Dist",
    unit: "packet",
    created_at: daysAgo(60),
    updated_at: daysAgo(0),
  },
  {
    id: "prod-2",
    shop_id: "shop-001",
    name: "Britannia Brown Bread 400g",
    category: "Bakery",
    sku: "BREAD-001",
    quantity: 4, // Low stock!
    purchase_price: 38,
    selling_price: 45,
    reorder_level: 10,
    expiry_date: daysInFuture(3),
    supplier: "Britannia Distributors",
    unit: "packet",
    created_at: daysAgo(60),
    updated_at: daysAgo(0),
  },
  {
    id: "prod-3",
    shop_id: "shop-001",
    name: "Farm Fresh White Eggs (Pack of 6)",
    category: "Dairy & Eggs",
    sku: "EGGS-006",
    quantity: 18,
    purchase_price: 42,
    selling_price: 54,
    reorder_level: 8,
    expiry_date: daysInFuture(10),
    supplier: "Local Poultry Farm",
    unit: "pack",
    created_at: daysAgo(45),
    updated_at: daysAgo(1),
  },
  {
    id: "prod-4",
    shop_id: "shop-001",
    name: "Fortune Sunlite Sunflower Oil 1L",
    category: "Oil & Ghee",
    sku: "OIL-001",
    quantity: 8, // Low stock!
    purchase_price: 135,
    selling_price: 155,
    reorder_level: 12,
    expiry_date: daysInFuture(240),
    supplier: "Adani Wilmar Ltd",
    unit: "pouch",
    created_at: daysAgo(90),
    updated_at: daysAgo(0),
  },
  {
    id: "prod-5",
    shop_id: "shop-001",
    name: "Aashirvaad Shuddh Chakki Atta 5kg",
    category: "Staples & Grains",
    sku: "ATTA-005",
    quantity: 22,
    purchase_price: 210,
    selling_price: 245,
    reorder_level: 10,
    expiry_date: daysInFuture(120),
    supplier: "ITC Foods Supplier",
    unit: "bag",
    created_at: daysAgo(90),
    updated_at: daysAgo(2),
  },
  {
    id: "prod-6",
    shop_id: "shop-001",
    name: "India Gate Basmati Rice Super 1kg",
    category: "Staples & Grains",
    sku: "RICE-001",
    quantity: 35,
    purchase_price: 95,
    selling_price: 120,
    reorder_level: 15,
    expiry_date: daysInFuture(300),
    supplier: "KRBL Limited",
    unit: "bag",
    created_at: daysAgo(90),
    updated_at: daysAgo(1),
  },
  {
    id: "prod-7",
    shop_id: "shop-001",
    name: "Tata Salt Vacuum Evaporated 1kg",
    category: "Staples & Grains",
    sku: "SALT-001",
    quantity: 48,
    purchase_price: 22,
    selling_price: 28,
    reorder_level: 20,
    expiry_date: daysInFuture(500),
    supplier: "Tata Consumer Products",
    unit: "packet",
    created_at: daysAgo(90),
    updated_at: daysAgo(5),
  },
  {
    id: "prod-8",
    shop_id: "shop-001",
    name: "Madhur Pure Sugar 1kg",
    category: "Staples & Grains",
    sku: "SUGAR-001",
    quantity: 30,
    purchase_price: 44,
    selling_price: 52,
    reorder_level: 15,
    supplier: "Shree Renuka Sugars",
    unit: "packet",
    created_at: daysAgo(90),
    updated_at: daysAgo(2),
  },
  {
    id: "prod-9",
    shop_id: "shop-001",
    name: "Red Label Strong Tea 250g",
    category: "Beverages",
    sku: "TEA-001",
    quantity: 25,
    purchase_price: 130,
    selling_price: 155,
    reorder_level: 10,
    supplier: "HUL Tea Division",
    unit: "box",
    created_at: daysAgo(90),
    updated_at: daysAgo(1),
  },
  {
    id: "prod-10",
    shop_id: "shop-001",
    name: "Nescafe Classic Instant Coffee 50g",
    category: "Beverages",
    sku: "COFFEE-001",
    quantity: 12,
    purchase_price: 165,
    selling_price: 195,
    reorder_level: 8,
    supplier: "Nestle India",
    unit: "jar",
    created_at: daysAgo(90),
    updated_at: daysAgo(3),
  },
  {
    id: "prod-11",
    shop_id: "shop-001",
    name: "Parle-G Gold Biscuits 100g",
    category: "Snacks & Biscuits",
    sku: "BISC-001",
    quantity: 65,
    purchase_price: 8,
    selling_price: 10,
    reorder_level: 25,
    supplier: "Parle Biscuits Agency",
    unit: "packet",
    created_at: daysAgo(90),
    updated_at: daysAgo(0),
  },
  {
    id: "prod-12",
    shop_id: "shop-001",
    name: "Lays Cream & Onion Chips 50g",
    category: "Snacks & Biscuits",
    sku: "CHIPS-001",
    quantity: 40,
    purchase_price: 16,
    selling_price: 20,
    reorder_level: 15,
    supplier: "PepsiCo India",
    unit: "packet",
    created_at: daysAgo(60),
    updated_at: daysAgo(0),
  },
  {
    id: "prod-13",
    shop_id: "shop-001",
    name: "Dettol Original Soap 125g",
    category: "Personal Care",
    sku: "SOAP-001",
    quantity: 28,
    purchase_price: 36,
    selling_price: 45,
    reorder_level: 10,
    supplier: "Reckitt Benckiser",
    unit: "bar",
    created_at: daysAgo(90),
    updated_at: daysAgo(4),
  },
  {
    id: "prod-14",
    shop_id: "shop-001",
    name: "Colgate Strong Teeth Toothpaste 100g",
    category: "Personal Care",
    sku: "TOOTH-001",
    quantity: 15,
    purchase_price: 52,
    selling_price: 65,
    reorder_level: 8,
    supplier: "Colgate Palmolive",
    unit: "tube",
    created_at: daysAgo(90),
    updated_at: daysAgo(3),
  },
  {
    id: "prod-15",
    shop_id: "shop-001",
    name: "Coca-Cola Original Taste 750ml",
    category: "Beverages",
    sku: "DRINK-001",
    quantity: 18,
    purchase_price: 32,
    selling_price: 40,
    reorder_level: 10,
    expiry_date: daysInFuture(60),
    supplier: "Hindustan Coca-Cola",
    unit: "bottle",
    created_at: daysAgo(40),
    updated_at: daysAgo(0),
  },
  {
    id: "prod-16",
    shop_id: "shop-001",
    name: "Herbal Green Tea Bags (Pack of 25)",
    category: "Beverages",
    sku: "TEA-SLOW",
    quantity: 24, // Slow moving! 0 sales in 20 days
    purchase_price: 180,
    selling_price: 230,
    reorder_level: 5,
    supplier: "Organic India Distributors",
    unit: "box",
    created_at: daysAgo(90),
    updated_at: daysAgo(25),
  },
  {
    id: "prod-17",
    shop_id: "shop-001",
    name: "Premium Almonds 250g",
    category: "Snacks & Biscuits",
    sku: "DRYF-001",
    quantity: 16, // Slow moving! High price
    purchase_price: 220,
    selling_price: 290,
    reorder_level: 5,
    supplier: "Dry Fruit Traders",
    unit: "pack",
    created_at: daysAgo(90),
    updated_at: daysAgo(18),
  },
];

export function generateSampleSales(): Sale[] {
  const sales: Sale[] = [];
  let saleIdCounter = 1000;

  // Generate sales for the past 30 days
  for (let i = 30; i >= 0; i--) {
    const dateStr = daysAgo(i);
    // Determine sales density: weekend higher, recent days steady
    const isToday = i === 0;
    const numSalesThisDay = isToday ? 8 : Math.floor(Math.random() * 6) + 5;

    for (let s = 0; s < numSalesThisDay; s++) {
      saleIdCounter++;
      const hour = Math.floor(Math.random() * 12) + 9; // 9 AM to 9 PM
      const minute = Math.floor(Math.random() * 60);
      const timestamp = `${dateStr}T${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:00.000Z`;

      // Select 1 to 4 random fast-moving products
      const fastProducts = SAMPLE_PRODUCTS.filter(
        (p) => p.sku !== "TEA-SLOW" && p.sku !== "DRYF-001"
      );
      const selectedCount = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...fastProducts].sort(() => 0.5 - Math.random());
      const selectedProducts = shuffled.slice(0, selectedCount);

      let saleTotal = 0;
      const saleItems = selectedProducts.map((p, idx) => {
        const qty = p.category === "Dairy & Eggs" || p.category === "Bakery"
          ? Math.floor(Math.random() * 2) + 1
          : p.sku === "PARLE-G" || p.sku === "BISC-001"
          ? Math.floor(Math.random() * 4) + 1
          : 1;

        const total = qty * p.selling_price;
        saleTotal += total;

        return {
          id: `item-${saleIdCounter}-${idx}`,
          sale_id: `INV-${saleIdCounter}`,
          product_id: p.id,
          product_name: p.name,
          quantity: qty,
          unit_price: p.selling_price,
          total_price: total,
        };
      });

      const paymentMethods: ("cash" | "upi" | "card")[] = ["upi", "cash", "upi", "cash", "card"];
      const pm = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      sales.push({
        id: `INV-${saleIdCounter}`,
        shop_id: "shop-001",
        total_amount: saleTotal,
        payment_method: pm,
        created_at: timestamp,
        items: saleItems,
      });
    }
  }

  return sales;
}

export const SAMPLE_NOTIFICATIONS: ShopNotification[] = [
  {
    id: "notif-1",
    title: "Low Stock Alert: Milk",
    message: "Amul Taaza Milk has only 6 units left (reorder level: 15).",
    type: "low_stock",
    date: new Date().toISOString(),
    read: false,
    link: "/products?status=low_stock",
  },
  {
    id: "notif-2",
    title: "Expiring Soon Alert",
    message: "Amul Milk & Brown Bread expire in less than 3 days.",
    type: "expiring",
    date: new Date().toISOString(),
    read: false,
    link: "/products?status=expiring_soon",
  },
  {
    id: "notif-3",
    title: "AI Insight Available",
    message: "Milk and Bread account for 34% of morning sales. Consider bundling.",
    type: "ai_insight",
    date: new Date().toISOString(),
    read: true,
    link: "/ai-assistant",
  },
];

export const SAMPLE_AI_INSIGHTS: AIInsight[] = [
  {
    id: "insight-1",
    shop_id: "shop-001",
    type: "alert",
    title: "2 High-Velocity Items Need Urgent Restocking",
    description: "Amul Taaza Milk (6 units remaining) and Britannia Brown Bread (4 units) will stock out before tomorrow based on average daily sales of 9 and 7 units/day.",
    action_label: "View Low Stock",
    action_href: "/products?status=low_stock",
    created_at: daysAgo(0),
  },
  {
    id: "insight-2",
    shop_id: "shop-001",
    type: "warning",
    title: "Slow-Moving Capital Tied in 2 Products",
    description: "Herbal Green Tea Bags and Premium Almonds have generated ₹0 sales in the last 18+ days. Total capital locked: ₹8,000.",
    action_label: "Review Inventory",
    action_href: "/analytics?tab=slow-moving",
    created_at: daysAgo(0),
  },
  {
    id: "insight-3",
    shop_id: "shop-001",
    type: "positive",
    title: "Dairy & Bakery Category Surged 18% This Week",
    description: "Dairy products contributed ₹4,850 to total weekly revenue, led by Milk and Farm Eggs.",
    action_label: "View Sales Analytics",
    action_href: "/analytics",
    created_at: daysAgo(0),
  },
  {
    id: "insight-4",
    shop_id: "shop-001",
    type: "info",
    title: "UPI Payments Account for 62% of Revenue",
    description: "Digital transactions were dominant today with cash payments reduced to 38%.",
    action_label: "View Sales",
    action_href: "/sales",
    created_at: daysAgo(0),
  },
];
