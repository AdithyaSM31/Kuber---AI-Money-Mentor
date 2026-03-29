"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";

import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function WhatIfSimulator() {
  const [currentSIP, setCurrentSIP] = useState([10000]);
  const [stepUp, setStepUp] = useState([5]);
  const [years, setYears] = useState([15]);
  const [returnRate, setReturnRate] = useState([12]);

  // Calculate Data
  const generateData = () => {
    let data = [];
    let currentWealth = 0;
    let baselineWealth = 0;
    
    let currentMonthly = currentSIP[0];
    let baselineMonthly = currentSIP[0]; // No step-up for baseline
    
    const r = returnRate[0] / 100 / 12; // monthly yield

    for (let yr = 0; yr <= years[0]; yr++) {
      if(yr === 0) {
        data.push({ year: 0, Optimized: 0, Baseline: 0 });
      } else {
        // Calculate 1 year of growth
        for(let m = 1; m <= 12; m++) {
          currentWealth = (currentWealth + currentMonthly) * (1 + r);
          baselineWealth = (baselineWealth + baselineMonthly) * (1 + r);
        }
        data.push({ 
          year: yr, 
          Optimized: Math.round(currentWealth), 
          Baseline: Math.round(baselineWealth) 
        });
        
        // Apply step up at the end of the year
        currentMonthly = currentMonthly * (1 + (stepUp[0] / 100));
      }
    }
    return data;
  };

  const chartData = generateData();
  const finalOptimized = chartData[chartData.length - 1]?.Optimized || 0;
  const finalBaseline = chartData[chartData.length - 1]?.Baseline || 0;
  const wealthDifference = finalOptimized - finalBaseline;

  const formatCurrency = (val: number) => {
    if (val > 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val > 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500/30 relative overflow-hidden">
      <AnimatedGridPattern
        numSquares={50}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
          "fixed inset-0 min-h-screen w-full opacity-60 z-0"
        )}
      />
      <nav className="border-b border-zinc-800/50 p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <span>Kuber</span>
          <span className="text-emerald-400"> AI Money Mentor</span>
        </div>
        <Link href="/" className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">
          Back to Home
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto p-6 pt-12">
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
            The <span className="text-blue-500">What-If</span> Simulator
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light">
            Discover the magic of compounding. See the massive impact of a small annual step-up or optimizing your returns.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col gap-8">
            <div>
              <div className="flex justify-between mb-4">
                <label className="font-bold text-sm tracking-widest uppercase text-zinc-400">Monthly SIP</label>
                <span className="text-emerald-400 font-mono font-bold">₹{currentSIP[0].toLocaleString('en-IN')}</span>
              </div>
              <Slider min={1000} max={100000} step={1000} value={currentSIP} onValueChange={setCurrentSIP} className="w-full" />
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <label className="font-bold text-sm tracking-widest uppercase text-zinc-400">Annual Step-up</label>
                <span className="text-blue-500 font-mono font-bold">{stepUp[0]}%</span>
              </div>
              <Slider min={0} max={20} step={1} value={stepUp} onValueChange={setStepUp} className="w-full" />
              <p className="text-xs text-zinc-500 mt-2">Increase your SIP amount slightly every year.</p>
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <label className="font-bold text-sm tracking-widest uppercase text-zinc-400">Expected Return</label>
                <span className="text-amber-500 font-mono font-bold">{returnRate[0]}%</span>
              </div>
              <Slider min={5} max={25} step={1} value={returnRate} onValueChange={setReturnRate} className="w-full" />
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <label className="font-bold text-sm tracking-widest uppercase text-zinc-400">Time Horizon</label>
                <span className="text-purple-500 font-mono font-bold">{years[0]} Years</span>
              </div>
              <Slider min={5} max={40} step={1} value={years} onValueChange={setYears} className="w-full" />
            </div>
            
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-3xl">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Estimated Corpus</h3>
                <div className="text-5xl font-black font-mono text-white">
                  {formatCurrency(finalOptimized)}
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl">
                <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Extra Wealth Created</h3>
                <div className="text-5xl font-black font-mono text-blue-400">
                  +{formatCurrency(wealthDifference)}
                </div>
                <p className="text-xs text-blue-400/70 mt-2 font-mono">Vs {formatCurrency(finalBaseline)} strictly without Step-up</p>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#71717a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#71717a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="year" stroke="#71717a" tick={{fill: '#71717a', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `Year ${val}`} />
                  <YAxis stroke="#71717a" tick={{fill: '#71717a', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    formatter={(value) => formatCurrency(value as number)}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#a1a1aa' }}/>
                  <Area type="monotone" dataKey="Optimized" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorOptimized)" />
                  <Area type="monotone" dataKey="Baseline" stroke="#71717a" strokeWidth={2} fillOpacity={1} fill="url(#colorBaseline)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}