"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, User, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [shopName, setShopName] = useState("Gupta Kirana & Store");
  const [ownerName, setOwnerName] = useState("Ramesh Gupta");
  const [email, setEmail] = useState("ramesh.gupta@smartshop.ai");
  const [password, setPassword] = useState("••••••••");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/80 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-2xl mx-auto mb-3 shadow-md">
            S
          </div>
          <h1 className="text-2xl font-black text-white">Create Shop Account</h1>
          <p className="text-xs text-slate-400 mt-1">Start managing your store with SmartShop AI</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Shop Name</label>
            <div className="relative">
              <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Owner Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-400 mb-3">Already have an account?</p>
          <Link href="/login" className="text-xs font-bold text-emerald-400 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
