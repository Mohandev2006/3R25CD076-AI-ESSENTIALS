import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  Package,
  TrendingUp,
  Bot,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BarChart3,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Header Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
              S
            </div>
            <span className="font-bold text-lg tracking-tight text-white">SmartShop AI</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md hover:shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <span>Try Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-4 text-center max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built specifically for small shopkeepers & Kirana stores</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Run Your Shop Smarter with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">AI</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Track inventory, record daily sales, monitor stock levels, and get real-time recommendations on what to restock — directly backed by your actual shop database.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Explore Demo Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ai-assistant"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>Ask AI Assistant</span>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-slate-400 text-xs">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Data-Grounded (No AI Hallucinations)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant POS Sales Entry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mobile & Desktop Friendly</span>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="py-16 px-4 max-w-6xl mx-auto border-t border-slate-800">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Everything Your Shop Needs To Thrive</h2>
            <p className="text-slate-400 text-sm mt-2">
              Designed to feel like a simple digital assistant, not an overwhelming admin panel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Smart Inventory & Stock Alerts</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Manage stock, reorder levels, purchase & selling prices, and expiry dates. Get notified instantly before you run out of fast-moving items.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Lightning Fast POS Sales</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Record sales in seconds with automatic stock reduction and profit computation. Supports UPI, Cash, and Card payments.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Conversational AI Assistant</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Ask questions like "What should I restock today?" or "Which products are slow moving?" and get answers calculated directly from your database.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Clear Business Analytics</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Understand daily, weekly, and monthly sales trends, profit margins per category, and top revenue generators with simple visual charts.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Slow-Moving Stock Identification</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Identify products that have had zero or negligible sales over 14+ days so you can adjust prices or run promotions before ordering more.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">Instant Demo Mode</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Test the complete application instantly with pre-populated realistic Kirana shop data (Milk, Bread, Flour, Rice, Biscuits, Oil) and 30 days of sales history.
              </p>
            </div>
          </div>
        </section>

        {/* Value Prop Banner */}
        <section className="py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-emerald-950/80 to-slate-900 p-8 sm:p-12 rounded-3xl border border-emerald-500/30">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              "Tell me what is happening in my shop and help me decide what to do next."
            </h2>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              No technical expertise required. Designed for everyday shopkeepers to maximize profit and save time.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-md transition-all"
            >
              <span>Launch Demo Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} SmartShop AI — AI Business Assistant for Small Shops.</p>
      </footer>
    </div>
  );
}
