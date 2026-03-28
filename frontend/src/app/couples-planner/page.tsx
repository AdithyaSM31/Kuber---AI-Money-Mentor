"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Heart, Home, TrendingUp, Link as LinkIcon, RefreshCcw, ShieldCheck } from "lucide-react";
import ChatPanel from "@/components/couples/ChatPanel";

export default function CouplesPlanner() {
  const [partner1, setPartner1] = useState(1200000);
  const [partner2, setPartner2] = useState(900000);
  const [rent, setRent] = useState(40000);
  const [results, setResults] = useState<any>(null);

  const optimize = () => {
    // Basic HRA/Tax Arbitrage Calculation
    // Assuming New Regime rates for simplicity, or just a rough bracket match
    // Bracket estimation
    const getTaxRate = (income: number) => {
      if (income > 1500000) return 0.3;
      if (income > 1200000) return 0.2;
      if (income > 900000) return 0.15;
      if (income > 600000) return 0.1;
      return 0.05;
    };

    const rate1 = getTaxRate(partner1);
    const rate2 = getTaxRate(partner2);

    // If one is in a higher tax bracket, they should claim more of the rent for HRA exemption.
    // Simplifying HRA exemption as the lower of (Rent - 10% basic), etc. We will mock the optimization conceptually with real scaling:
    // If rate1 > rate2, P1 should claim 100% of rent if allowed, or split proportionally if both need deduction.

    let p1Share = 0.5;
    let p2Share = 0.5;
    let strategy = 'Split Equally';

    if (rate1 > rate2) {
      // P1 has higher tax rate, shift more rent to P1
      p1Share = 0.8; // Not 100% just to be realistic with partial rent receipts
      p2Share = 0.2;
      strategy = 'Shift to Partner 1';
    } else if (rate2 > rate1) {
      // P2 has higher tax rate
      p1Share = 0.2;
      p2Share = 0.8;
      strategy = 'Shift to Partner 2';
    }

    const annualRent = rent * 12;
    const p1RentClaim = annualRent * p1Share;
    const p2RentClaim = annualRent * p2Share;

    // Estimated tax saving is roughly the HRA exemption * tax rate.
    // Assuming 50% of claimed rent becomes exempt for the sake of the formula:
    const p1TaxSaving = (p1RentClaim * 0.5) * rate1;
    const p2TaxSaving = (p2RentClaim * 0.5) * rate2;

    const totalSaving = p1TaxSaving + p2TaxSaving;

    setResults({
      rentSplit: { p1: p1RentClaim / 12, p2: p2RentClaim / 12 },
      p1TaxSaving: Math.round(p1TaxSaving),
      p2TaxSaving: Math.round(p2TaxSaving),
      totalSaving: Math.round(totalSaving),
      strategy
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500/30 relative pt-20 pb-20">
      <AnimatedGridPattern numSquares={50} maxOpacity={0.1} duration={3} repeatDelay={1} className={cn("[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]", "fixed inset-0 min-h-screen w-full opacity-60 z-0")} />
      
      <nav className="fixed top-0 w-full border-b border-zinc-800/80 p-4 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md z-50">
        <div className="text-xl font-black tracking-tighter flex items-center gap-2">
          <span>ET</span><span className="text-emerald-400">MoneyMind</span>
          <span className="ml-2 px-2 py-0.5 bg-zinc-800 text-[10px] text-zinc-400 rounded-sm uppercase tracking-widest font-mono border border-zinc-700">Phase 5</span>
        </div>
        <Link href="/" className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">Back to Home</Link>
      </nav>
      
      <div className="relative z-10 flex flex-col items-center justify-start min-h-[calc(100vh-80px)] p-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10 mt-4 w-full">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-rose-400 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-emerald-600">Couple&apos;s Planner</h1>
          </div>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Merge finances smartly. Optimize HRA and shared expenses intelligently.</p>
        </div>

        <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl p-8 mb-8">
           <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white border-b border-zinc-800/80 pb-4"><LinkIcon className="w-5 h-5 text-rose-400"/> Income & Shared Configuration</h2>
           
           <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-6">
                <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-950/50 shadow-inner">
                  <label className="text-xs text-zinc-400 font-mono tracking-widest uppercase mb-3 block">Partner 1 Annual Income</label>
                  <input type="range" min="300000" max="5000000" step="100000" value={partner1} onChange={e=>setPartner1(Number(e.target.value))} className="w-full accent-rose-400 mb-2" />
                  <p className="text-3xl font-black text-white">₹{partner1.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-950/50 shadow-inner">
                  <label className="text-xs text-zinc-400 font-mono tracking-widest uppercase mb-3 block">Partner 2 Annual Income</label>
                  <input type="range" min="300000" max="5000000" step="100000" value={partner2} onChange={e=>setPartner2(Number(e.target.value))} className="w-full accent-emerald-400 mb-2" />
                  <p className="text-3xl font-black text-white">₹{partner2.toLocaleString('en-IN')}</p>
                </div>
             </div>
             
             <div className="space-y-6 flex flex-col">
                <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-950/50 flex-1 shadow-inner flex flex-col justify-center">
                  <label className="text-xs text-zinc-400 font-mono tracking-widest uppercase mb-3 flex items-center gap-2"><Home className="w-4 h-4"/> Monthly Shared Rent</label>
                  <input type="range" min="10000" max="150000" step="5000" value={rent} onChange={e=>setRent(Number(e.target.value))} className="w-full accent-indigo-400 mb-2 mt-2" />
                  <p className="text-4xl font-black text-indigo-400 mt-2 hover:scale-105 transition-transform origin-left cursor-default">₹{rent.toLocaleString('en-IN')}<span className="text-lg font-medium text-zinc-500">/mo</span></p>
                </div>
                <button onClick={optimize} className="w-full py-5 bg-gradient-to-r from-rose-600/80 to-emerald-600/80 hover:from-rose-500 hover:to-emerald-500 rounded-xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                   <RefreshCcw className="w-5 h-5" /> Generate Optimization Strategy
                </button>
             </div>
           </div>
        </div>

        {results && (
          <div className="w-full animate-in slide-in-from-bottom-8 fade-in flex flex-col gap-4 duration-500">
             <h3 className="text-lg font-semibold text-zinc-300 px-2 tracking-wide uppercase font-mono text-xs">AI Financial Recommendation</h3>
             <div className="grid md:grid-cols-3 gap-6">
                <div className="col-span-2 bg-gradient-to-br from-indigo-900/40 to-zinc-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                   <ShieldCheck className="absolute -right-4 -bottom-4 w-40 h-40 text-indigo-500/10" />
                   <p className="text-indigo-300 font-mono text-xs uppercase tracking-widest mb-2">HRA Rent Split Strategy</p>
                   <p className="text-zinc-400 text-sm mb-6 max-w-md">Shift rent claim burden according to this ratio to maximize tax savings across both slabs:</p>
                   
                   <div className="flex items-end gap-6 relative z-10">
                      <div className="flex-1 bg-zinc-950/80 p-5 rounded-xl border border-zinc-800 shadow-inner">
                         <p className="text-xs text-zinc-500 mb-2">Partner 1 pays</p>
                         <p className="text-2xl font-black text-white">₹{results.rentSplit.p1.toLocaleString('en-IN')}</p>
                         <div className="mt-2 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden"><div className="bg-rose-400 h-full" style={{ width: `${(results.rentSplit.p1 / rent) * 100}%` }}></div></div>
                      </div>
                      <div className="flex-1 bg-zinc-950/80 p-5 rounded-xl border border-zinc-800 shadow-inner">
                         <p className="text-xs text-zinc-500 mb-2">Partner 2 pays</p>
                         <p className="text-2xl font-black text-white">₹{results.rentSplit.p2.toLocaleString('en-IN')}</p>
                         <div className="mt-2 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-400 h-full" style={{ width: `${(results.rentSplit.p2 / rent) * 100}%` }}></div></div>
                      </div>
                   </div>
                </div>
                
                <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-xl">
                   <div className="w-16 h-16 rounded-full bg-emerald-900/50 flex items-center justify-center mb-4 border border-emerald-500/30">
                     <TrendingUp className="w-8 h-8 text-emerald-400" />
                   </div>
                   <p className="text-zinc-400 text-sm mb-1">Combined Tax Saved</p>
                   <p className="text-4xl font-black text-emerald-400 mb-3 tracking-tighter">₹{results.totalSaving.toLocaleString('en-IN')}</p>
                   <div className="bg-emerald-500/20 px-3 py-1 rounded border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                     Annually
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
      <ChatPanel 
        coupleContext={{ 
          partner1: { name: "User", annual_income: partner1, tax_payable: 0, regime: "New" }, 
          partner2: { name: "Spouse", annual_income: partner2, tax_payable: 0, regime: "New" }, 
          household: { combined_savings: results?.totalSaving || 0, recommended_hra_claimant: results?.strategy || "Unknown" } 
        }} 
      />
    </div>
  );
}
