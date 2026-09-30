"use client";

import React, { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { ChatMessage } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  Send,
  Bot,
  User,
  HelpCircle,
  TrendingUp,
  Package,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  "What should I restock?",
  "Which products are not selling?",
  "What were my best-selling products?",
  "How much did I sell today?",
];

export default function AIAssistantPage() {
  const { products, sales } = useShop();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: "Namaste! I am your SmartShop AI Assistant. I analyze your actual sales logs and product stock levels to give you plain-English business recommendations. What would you like to know about your shop today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          products,
          sales,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const aiData = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: aiData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        dataSummary: aiData.dataSummary,
        tableData: aiData.tableData,
        recommendation: aiData.recommendation,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: "AI insights are temporarily unavailable. Your inventory and sales data are still safe.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <span>AI Business Assistant</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ask natural language questions about your shop. Powered 100% by your real inventory and sales records.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Data Grounded (No Hallucinations)</span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
          <HelpCircle className="w-3.5 h-3.5" /> Quick Prompts:
        </span>
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 text-xs font-semibold shadow-2xs transition-all"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                  msg.sender === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs shadow-2xs ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white rounded-tr-none font-medium"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-3"
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Key Metrics Summary Cards if available */}
                {msg.dataSummary && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {msg.dataSummary.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] text-slate-500 font-semibold block">{item.label}</span>
                        <span className="text-sm font-black text-slate-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Data Table View if present */}
                {msg.tableData && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 mt-2">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 font-bold text-slate-700 uppercase text-[9px]">
                        <tr>
                          {msg.tableData.headers.map((h, i) => (
                            <th key={i} className="px-3 py-2">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {msg.tableData.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3 py-2">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Recommendations Card */}
                {msg.recommendation && (
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl space-y-2 mt-2">
                    <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{msg.recommendation.title}</span>
                    </h4>
                    <ul className="space-y-1">
                      {msg.recommendation.items.map((item, idx) => (
                        <li key={idx} className="text-[11px] text-emerald-950 flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Grounding Explanation Badge */}
                    <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-1 text-[10px] text-emerald-700">
                      <span className="font-bold">Based on:</span>
                      <span>{msg.recommendation.based_on.join(" • ")}</span>
                    </div>
                  </div>
                )}

                <span
                  className={`text-[9px] block text-right mt-1 ${
                    msg.sender === "user" ? "text-emerald-200" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Analyzing shop database & calculating metrics...</span>
            </div>
          )}
        </div>

        {/* Query Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI anything about inventory, sales, or restocking..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-slate-800 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className={`p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center ${
              !inputQuery.trim() || isThinking
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
