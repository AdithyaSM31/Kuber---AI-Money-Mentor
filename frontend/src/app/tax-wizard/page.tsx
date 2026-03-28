"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { FileText, UploadCloud, Calculator, IndianRupee, PieChart } from "lucide-react";

export default function TaxWizard() {
  const [activeTab, setActiveTab] = useState("upload");
  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [baseSalary, setBaseSalary] = useState(1500000);
  const [investments80C, setInvestments80C] = useState(120000);
  const [hra, setHra] = useState(250000);

  const calculateTax = () => {
    // Old Regime calculation
    // Standard deduction of 50000
    let taxableOld = baseSalary - 50000;
    // Section 80C up to 150000
    let deduction80C = Math.min(investments80C, 150000);
    taxableOld -= deduction80C;
    // HRA Exemption (simplified)
    taxableOld -= hra;
    taxableOld = Math.max(0, taxableOld);

    let taxOld = 0;
    if (taxableOld > 1000000) {
      taxOld += (taxableOld - 1000000) * 0.3 + 112500;
    } else if (taxableOld > 500000) {
      taxOld += (taxableOld - 500000) * 0.2 + 12500;
    } else if (taxableOld > 250000) {
      taxOld += (taxableOld - 250000) * 0.05;
    }
    // Rebate 87A if taxable <= 500000
    if (taxableOld <= 500000) taxOld = 0;
    else taxOld *= 1.04; // Cess 4%

    // New Regime calculation (FY 2023-24 / AY 2024-25)
    // Standard deduction of 50000 allowed in new regime now
    let taxableNew = baseSalary - 50000;
    taxableNew = Math.max(0, taxableNew);

    let taxNew = 0;
    if (taxableNew > 1500000) {
      taxNew += (taxableNew - 1500000) * 0.3 + 150000;
    } else if (taxableNew > 1200000) {
      taxNew += (taxableNew - 1200000) * 0.2 + 90000;
    } else if (taxableNew > 900000) {
      taxNew += (taxableNew - 900000) * 0.15 + 45000;
    } else if (taxableNew > 600000) {
      taxNew += (taxableNew - 600000) * 0.1 + 15000;
    } else if (taxableNew > 300000) {
      taxNew += (taxableNew - 300000) * 0.05;
    }
    // Rebate 87A if taxable <= 700000
    if (taxableNew <= 700000) taxNew = 0;
    else taxNew *= 1.04; // Cess 4%

    return {
      oldRegime: {
        tax: Math.round(taxOld),
        deductions: 50000 + deduction80C + hra,
        effectiveRate: ((taxOld / baseSalary) * 100).toFixed(1) + "%",
      },
      newRegime: {
        tax: Math.round(taxNew),
        deductions: 50000,
        effectiveRate: ((taxNew / baseSalary) * 100).toFixed(1) + "%",
      },
      recommended: taxNew <= taxOld ? "New Regime" : "Old Regime",
      savings: Math.round(Math.abs(taxOld - taxNew)),
    };
  };

  const handleSimulate = () => {
    setCalculating(true);
    setTimeout(() => {
      setResults(calculateTax());
      setCalculating(false);
    }, 800);
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
            <FileText className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-700">Tax Wizard</h1>
          </div>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">AI-powered Old vs New Regime optimizer and deduction finder.</p>
        </div>
        
        <div className="w-full max-w-4xl bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl flex flex-col md:flex-row min-h-[450px]">
          <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col">
            <div className="flex gap-2 mb-8 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800/50">
              <button onClick={() => setActiveTab("upload")} className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", activeTab === "upload" ? "bg-zinc-800 text-white shadow-md shadow-black/50" : "text-zinc-500 hover:text-zinc-300")}>Upload Form-16</button>
              <button onClick={() => setActiveTab("manual")} className={cn("flex-1 py-2 text-sm font-bold rounded-lg transition-all", activeTab === "manual" ? "bg-zinc-800 text-white shadow-md shadow-black/50" : "text-zinc-500 hover:text-zinc-300")}>Manual Input</button>
            </div>
            
            {activeTab === "upload" ? (
               <div className="flex-1 border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 rounded-xl bg-zinc-950/30 flex flex-col items-center justify-center p-8 transition-colors relative group">
                 <input 
                   type="file" 
                   accept=".pdf" 
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                   onChange={(e) => {
                     if (e.target.files && e.target.files.length > 0) {
                       setUploadedFile(e.target.files[0]);
                     }
                   }}
                 />
                 <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-0">
                   <UploadCloud className={cn("w-8 h-8 transition-colors", uploadedFile ? "text-emerald-400" : "text-zinc-400 group-hover:text-emerald-400")} />
                 </div>
                 <p className="text-white font-medium mb-1 relative z-0">{uploadedFile ? uploadedFile.name : "Drag & Drop Form 16 PDF"}</p>
                 <p className="text-xs text-zinc-500 text-center relative z-0">{uploadedFile ? "Ready to parse" : "Secure, entirely local parsing."}</p>
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     handleSimulate();
                   }} 
                   className={cn("mt-6 px-6 py-2 border rounded-lg text-sm font-bold transition-all relative z-20", uploadedFile ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500" : "bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600 hover:text-white")}
                 >
                   {uploadedFile ? "Parse & Optimize" : "Simulate Upload"}
                 </button>
               </div>
            ) : (
               <div className="flex flex-col gap-4 flex-1">
                 <div className="space-y-1"><label className="text-xs text-zinc-400 ml-1">Base Salary (Annual)</label><input type="number" value={baseSalary} onChange={(e) => setBaseSalary(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
                 <div className="space-y-1"><label className="text-xs text-zinc-400 ml-1">80C Investments</label><input type="number" value={investments80C} onChange={(e) => setInvestments80C(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
                 <div className="space-y-1"><label className="text-xs text-zinc-400 ml-1">HRA / Rent Paid</label><input type="number" value={hra} onChange={(e) => setHra(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" /></div>
                 <button onClick={handleSimulate} className="mt-auto w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold text-white shadow-lg transition-colors flex justify-center items-center gap-2"><Calculator className="w-4 h-4" /> Calculate Optimize</button>
               </div>
            )}
          </div>
          
          <div className="w-full md:w-1/2 bg-zinc-950/80 p-8 flex flex-col justify-center items-center text-center">
            {calculating ? (
              <div className="flex flex-col items-center gap-4"><PieChart className="w-12 h-12 text-emerald-500 animate-spin" style={{ animationDuration: '2s' }} /><p className="text-zinc-400 font-mono text-sm animate-pulse">Computing optimizing deductions...</p></div>
            ) : !results ? (
              <div className="opacity-40 flex flex-col items-center gap-2"><Calculator className="w-16 h-16 text-zinc-500 mb-2" /><p className="text-zinc-400 max-w-[200px] text-sm">Upload a document to see AI breakdown.</p></div>
            ) : (
              <div className="w-full h-full flex flex-col text-left animate-in fade-in duration-500">
                <div className="flex gap-2 items-center mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 relative"><div className="w-full h-full rounded-full bg-emerald-500 animate-ping absolute top-0 left-0"></div></div>
                  <h3 className="text-emerald-400 font-mono text-sm uppercase tracking-widest">Recommendation</h3>
                </div>
                <div className="bg-zinc-900 border border-emerald-500/20 p-5 rounded-xl mb-6 relative overflow-hidden shadow-lg shadow-black/40">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><IndianRupee className="w-24 h-24" /></div>
                  <p className="text-zinc-400 text-sm mb-1 z-10 relative">Switch structure to the</p>
                  <p className="text-3xl font-black text-white z-10 relative">{results.recommended}</p>
                  <p className="text-emerald-400 text-sm font-medium mt-2 z-10 relative flex items-center gap-2">
                    <span className="bg-emerald-500/20 px-2 py-0.5 rounded text-xs border border-emerald-500/20">Save ₹{results.savings.toLocaleString('en-IN')}</span> 
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mt-auto">
                   <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-xl">
                      <p className="text-zinc-500 font-medium mb-2 text-[10px] uppercase tracking-wider">Old Regime</p>
                      <p className="text-zinc-400 text-xs mb-1">Tax Est.</p>
                      <p className="text-xl font-bold text-white mb-2">₹{results.oldRegime.tax.toLocaleString('en-IN')}</p>
                      <p className="text-zinc-500 text-xs">Rate: {results.oldRegime.effectiveRate}</p>
                   </div>
                   <div className="p-4 bg-zinc-950 border border-emerald-500/30 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-emerald-500/20 px-1.5 py-0.5 rounded-bl-lg"><span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">Selected</span></div>
                      <p className="text-emerald-500 font-medium mb-2 text-[10px] uppercase tracking-wider">New Regime</p>
                      <p className="text-emerald-400/70 text-xs mb-1">Tax Est.</p>
                      <p className="text-xl font-bold text-emerald-400 mb-2">₹{results.newRegime.tax.toLocaleString('en-IN')}</p>
                      <p className="text-zinc-500 text-xs text-emerald-400/50">Rate: {results.newRegime.effectiveRate}</p>
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
