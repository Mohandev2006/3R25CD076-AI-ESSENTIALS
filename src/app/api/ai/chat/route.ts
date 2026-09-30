import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, products, sales } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const promptLower = message.toLowerCase();

    // RESTOCK INTENT
    if (
      promptLower.includes("restock") ||
      promptLower.includes("stock low") ||
      promptLower.includes("running low") ||
      promptLower.includes("reorder")
    ) {
      // Calculate restocking using 14-day sales average
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const itemsToRestock: {
        name: string;
        currentStock: number;
        avgDailySales: number;
        estDaysRemaining: string;
        status: string;
      }[] = [];

      products.forEach((p: any) => {
        // Find sales for this product in past 14 days
        let unitsSold = 0;
        sales.forEach((s: any) => {
          if (new Date(s.created_at) >= fourteenDaysAgo) {
            s.items.forEach((item: any) => {
              if (item.product_id === p.id) {
                unitsSold += item.quantity;
              }
            });
          }
        });

        const avgDailySales = unitsSold / 14;
        const estDays = avgDailySales > 0 ? (p.quantity / avgDailySales).toFixed(1) : "N/A (No sales)";

        if (p.quantity <= p.reorder_level || (avgDailySales > 0 && p.quantity / avgDailySales <= 2)) {
          itemsToRestock.push({
            name: p.name,
            currentStock: p.quantity,
            avgDailySales: Number(avgDailySales.toFixed(1)),
            estDaysRemaining: estDays === "N/A (No sales)" ? "> 14 days" : `${estDays} days`,
            status: p.quantity <= p.reorder_level ? "Critical Low Stock" : "Restock Recommended Soon",
          });
        }
      });

      return NextResponse.json({
        sender: "assistant",
        text: `Based on your last 14 days of sales history and current inventory, here are the restocking recommendations for ${products.length} registered products:`,
        intent: "restock_recommendation",
        tableData: {
          headers: ["Product", "Current Stock", "Avg Daily Sales", "Est Days Left", "Stock Status"],
          rows: itemsToRestock.map((item) => [
            item.name,
            item.currentStock,
            item.avgDailySales,
            item.estDaysRemaining,
            item.status,
          ]),
        },
        recommendation: {
          title: "Restock Priority Action Plan",
          items: itemsToRestock.slice(0, 3).map((item) => `Reorder ${item.name} (Current stock: ${item.currentStock}, est. ${item.estDaysRemaining} remaining)`),
          based_on: ["Last 14 days of recorded sales transactions", "Current stock levels", "Configured reorder levels"],
        },
      });
    }

    // SLOW MOVING / NOT SELLING INTENT
    if (
      promptLower.includes("not selling") ||
      promptLower.includes("slow moving") ||
      promptLower.includes("slowest") ||
      promptLower.includes("dead stock")
    ) {
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const recentSales = sales.filter((s: any) => new Date(s.created_at) >= fourteenDaysAgo);
      const soldProductIds = new Set<string>();
      recentSales.forEach((s: any) => s.items.forEach((item: any) => soldProductIds.add(item.product_id)));

      const slowProducts = products
        .filter((p: any) => !soldProductIds.has(p.id) && p.quantity > 0)
        .map((p: any) => [
          p.name,
          p.category,
          p.quantity,
          `₹${p.selling_price}`,
          `₹${(p.quantity * p.purchase_price).toLocaleString()}`,
        ]);

      return NextResponse.json({
        sender: "assistant",
        text: `I analyzed your inventory against sales over the past 14 days. Found ${slowProducts.length} slow-moving products with zero recent sales:`,
        intent: "slow_moving_products",
        tableData: {
          headers: ["Product", "Category", "In Stock", "Retail Price", "Capital Locked"],
          rows: slowProducts,
        },
        recommendation: {
          title: "Strategies to Move Idle Stock",
          items: [
            "Apply a 10% discount on slow items during weekend sales.",
            "Display slow-moving items near the cash counter for impulse buys.",
            "Avoid placing new wholesale orders for these SKUs until current stock clears.",
          ],
          based_on: ["14-day sales frequency check", "Purchase cost valuation"],
        },
      });
    }

    // BEST SELLING / TOP PRODUCTS INTENT
    if (
      promptLower.includes("best selling") ||
      promptLower.includes("top product") ||
      promptLower.includes("highest revenue") ||
      promptLower.includes("most sold")
    ) {
      const productSalesMap = new Map<string, { name: string; category: string; units: number; revenue: number }>();

      sales.forEach((s: any) => {
        s.items.forEach((item: any) => {
          const current = productSalesMap.get(item.product_id) || {
            name: item.product_name,
            category: "General",
            units: 0,
            revenue: 0,
          };
          current.units += item.quantity;
          current.revenue += item.total_price;
          productSalesMap.set(item.product_id, current);
        });
      });

      const topProducts = Array.from(productSalesMap.values())
        .sort((a, b) => b.units - a.units)
        .slice(0, 5)
        .map((item, idx) => [`#${idx + 1} ${item.name}`, item.units, `₹${item.revenue.toLocaleString()}`]);

      return NextResponse.json({
        sender: "assistant",
        text: "Here are your top 5 best-selling products ranked by total volume and revenue recorded:",
        intent: "top_products",
        tableData: {
          headers: ["Rank & Product", "Units Sold", "Total Revenue"],
          rows: topProducts,
        },
        recommendation: {
          title: "Growth Opportunities",
          items: [
            "Keep buffer stock for your top 3 products to prevent out-of-stock losses.",
            "Consider negotiating volume bulk discounts with suppliers for top SKUs.",
          ],
          based_on: ["Total historical transaction logs"],
        },
      });
    }

    // TODAY'S SALES INTENT
    if (promptLower.includes("today") || promptLower.includes("how much did i sell")) {
      const todayStr = new Date().toISOString().split("T")[0];
      const todaySales = sales.filter((s: any) => s.created_at.startsWith(todayStr));
      const todayTotal = todaySales.reduce((sum: number, s: any) => sum + s.total_amount, 0);

      return NextResponse.json({
        sender: "assistant",
        text: `Today's Sales Performance (${new Date().toLocaleDateString("en-IN")}):`,
        intent: "sales_summary",
        dataSummary: [
          { label: "Total Revenue Recorded Today", value: `₹${todayTotal.toLocaleString()}` },
          { label: "Total Transactions", value: todaySales.length },
          { label: "Average Bill Value", value: todaySales.length > 0 ? `₹${Math.round(todayTotal / todaySales.length)}` : "₹0" },
        ],
        recommendation: {
          title: "Daily Summary",
          items: ["Ensure all cash and UPI transactions match counter register before closing."],
          based_on: ["Real-time daily transaction database"],
        },
      });
    }

    // GENERAL BUSINESS QUESTION DEFAULT FALLBACK
    const totalInventoryValue = products.reduce((sum: number, p: any) => sum + p.quantity * p.selling_price, 0);
    const lowStockCount = products.filter((p: any) => p.quantity <= p.reorder_level).length;

    return NextResponse.json({
      sender: "assistant",
      text: `Hello! I am your SmartShop AI Assistant. Here is your current shop status:`,
      intent: "general_business_question",
      dataSummary: [
        { label: "Active Products in Store", value: products.length },
        { label: "Total Inventory Retail Value", value: `₹${totalInventoryValue.toLocaleString()}` },
        { label: "Items Needing Restock", value: lowStockCount },
        { label: "Total Recorded Transactions", value: sales.length },
      ],
      recommendation: {
        title: "Suggested Questions You Can Ask Me",
        items: [
          '"What should I restock today?"',
          '"Which products are not selling?"',
          '"What were my best-selling products?"',
          '"How much did I sell today?"',
        ],
        based_on: ["Live database metrics"],
      },
    });
  } catch (error) {
    console.error("AI Assistant API Error:", error);
    return NextResponse.json(
      {
        sender: "assistant",
        text: "AI insights are temporarily unavailable. Your inventory and sales data are still safe.",
      },
      { status: 500 }
    );
  }
}
