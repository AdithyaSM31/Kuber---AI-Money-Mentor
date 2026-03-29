"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Calculator, TrendingUp, IndianRupee, Target } from "lucide-react";

export default function FIREPlanner() {
  const [formData, setFormData] = useState({
    currentAge: 30,
    retirementAge: 45,
    currentCorpus: 1500000,
    monthlyInvestment: 50000,
    expectedReturn: 12,
    monthlyExpenses: 80000,
    inflation: 6
  });

  const [results, setResults] = useState<any>(null);

  const calculateFIRE = () => {
    const years = formData.retirementAge - formData.currentAge;
    const months = years * 12;
    const monthlyRate = formData.expectedReturn / 100 / 12;
    
    const fvCorpus = formData.currentCorpus * Math.pow(1 + formData.expectedReturn / 100, years);
    const fvSIP = formData.monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalProjected = fvCorpus + fvSIP;
    
    const futureMonthlyExpenses = formData.monthlyExpenses * Math.pow(1 + formData.inflation / 100, years);
    const futureAnnualExpenses = futureMonthlyExpenses * 12;
    const requiredCorpus = futureAnnualExpenses * 33; // ~3% SWR
    
    setResults({
      totalProjected,
      requiredCorpus,
      futureMonthlyExpenses,
      years,
      isOnTrack: totalProjected >= requiredCorpus
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500/30 relative pt-20 pb-20">
      <AnimatedGridPattern numSquares={50} maxOpacity={0.1} duration={3} repeatDelay={1} className={cn("[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]", "fixed inset-0 min-h-screen w-full opacity-60 z-0")} />
      
      <nav className="fixed top-0 w-full border-b border-zinc-800/80 p-4 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md z-50">
        <div className="text-xl font-black tracking-tighter flex items-center gap-2">
          <Image src="/kuber.png" alt="Kuber Logo" width={32} height={32} className="rounded-full rounded-tl-sm object-cover" />
          <span>Kuber</span><span className="text-emerald-400"> AI Money Mentor</span>
        </div>
        <Link href="/" className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">Back to Home</Link>
      </nav>
      
      <div className="relative z-10 flex flex-col items-center justify-start min-h-[calc(100vh-80px)] p-6 text-center max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-4 mt-4">
          <Target className="w-8 h-8 text-emerald-400" />
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-700">FIRE Path Planner</h1>
        </div>
        <p className="text-zinc-400 max-w-2xl text-lg mb-8">Calculate when you can achieve Financial Independence & Retire Early.</p>
        
        <div className="grid md:grid-cols-2 gap-8 w-full">
          <div className="p-8 border border-zinc-800 bg-zinc-900/50 rounded-2xl backdrop-blur-sm shadow-2xl text-left flex flex-col gap-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-zinc-800 pb-4">
                <Calculator className="w-5 h-5 text-emerald-400" /> Let's run the numbers
            </h2>
            <div className="grid grid-cols-2 gap-5 text-sm mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 font-medium">Current Age</label>
                <input type="number" name="currentAge" value={formData.currentAge} onChange={handleInputChange} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 font-medium">Retirement Age</label>
                <input type="number" name="retirementAge" value={formData.retirementAge} onChange={handleInputChange} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-zinc-400 font-medium flex justify-between"><span>Current Invested Corpus</span><span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">{formatCurrency(formData.currentCorpus)}</span></label>
                <input type="range" name="currentCorpus" min="0" max="50000000" step="100000" value={formData.currentCorpus} onChange={handleInputChange} className="w-full accent-emerald-500" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-zinc-400 font-medium flex justify-between"><span>Monthly SIP</span><span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">{formatCurrency(formData.monthlyInvestment)}</span></label>
                <input type="range" name="monthlyInvestment" min="0" max="500000" step="5000" value={formData.monthlyInvestment} onChange={handleInputChange} className="w-full accent-emerald-500" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-zinc-400 font-medium flex justify-between"><span>Current Monthly Expenses</span><span className="text-emerald-400 font-mono text-xs bg-emerald-500/10 px-2 py-1 rounded">{formatCurrency(formData.monthlyExpenses)}</span></label>
                <input type="range" name="monthlyExpenses" min="10000" max="500000" step="5000" value={formData.monthlyExpenses} onChange={handleInputChange} className="w-full accent-emerald-500" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 font-medium">Expected Return (%)</label>
                <input type="number" name="expectedReturn" value={formData.expectedReturn} onChange={handleInputChange} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 font-medium">Inflation (%)</label>
                <input type="number" name="inflation" value={formData.inflation} onChange={handleInputChange} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono" />
              </div>
            </div>
            <button onClick={calculateFIRE} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg active:scale-[0.98]">
              Calculate Projection
            </button>
          </div>

          <div className="p-8 border border-zinc-800 bg-zinc-950/80 rounded-2xl backdrop-blur-sm shadow-xl flex flex-col justify-center items-center relative overflow-hidden min-h-[400px]">
            {!results ? (
              <div className="flex flex-col items-center text-zinc-500 gap-4">
                <TrendingUp className="w-16 h-16 opacity-20" />
                <p>Run the numbers to see your FIRE projection.</p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col text-left gap-6 animate-in fade-in duration-500">
                <div className="absolute top-0 right-0 p-4 opacity-5"><IndianRupee className="w-40 h-40" /></div>
                
                <h3 className="text-2xl font-black text-white border-b border-zinc-800 pb-4 relative z-10 flex justify-between items-center">
                  Projection
                  {results.isOnTrack ? (<span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-mono tracking-widest uppercase">On Track</span>) : (<span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/20 font-mono tracking-widest uppercase">Shortfall</span>)}
                </h3>
                
                <div className="flex flex-col gap-6 relative z-10 flex-1 justify-center">
                  <div>
                    <p className="text-sm text-zinc-400 font-medium mb-1">Projected Corpus at Age {formData.retirementAge}</p>
                    <p className={cn("text-4xl md:text-5xl font-black tracking-tight", results.isOnTrack ? "text-emerald-400" : "text-white")}>{formatCurrency(results.totalProjected)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 font-medium mb-1">Required Target Corpus</p>
                    <p className="text-3xl font-bold tracking-tight text-zinc-300">{formatCurrency(results.requiredCorpus)}</p>
                    <p className="text-xs text-zinc-500 mt-2 font-mono border-l-2 border-zinc-800 pl-3">Based on 3% withdrawal rate & {formatCurrency(results.futureMonthlyExpenses)}/mo inf. adj. expenses.</p>
                  </div>
                  <div className="mt-auto p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex items-start gap-4">
                    <div className="p-2 bg-zinc-800 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-400" /></div>
                    <div>
                      <p className="text-sm font-semibold text-white">{results.isOnTrack ? "You are crushing it!" : "Gap detected."}</p>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {results.isOnTrack ? `Surplus of ${formatCurrency(results.totalProjected - results.requiredCorpus)} projected.` : `Shortfall of ${formatCurrency(results.requiredCorpus - results.totalProjected)}. Bump up your SIP by around ${formatCurrency((results.requiredCorpus - results.totalProjected)/(results.years * 12))}/mo.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
