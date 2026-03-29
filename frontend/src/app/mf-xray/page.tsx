"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { UploadCloud, FileText, ArrowRight, Loader2, Target, AlertTriangle } from "lucide-react";
import Link from "next/link";

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899', '#ef4444'];

interface Holding {
  fund_name: string;
  category: string;
  amount: number;
}

import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function MFXRayPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState<Holding[] | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Only PDF files are supported.");
      }
    }
  };

  const processStatement = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://kuber-backend-fb4dbb569c44.herokuapp.com/api/v1/mf-xray", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to process document");
      }

      const resData = await res.json();
      if (resData.status === "success" && resData.data?.holdings) {
        setPortfolioData(resData.data.holdings);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Group portfolio data by category for the Pie Chart
  const getChartData = () => {
    if (!portfolioData) return [];
    const grouped = portfolioData.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key],
    }));
  };

  const chartData = getChartData();
  const totalValue = portfolioData?.reduce((sum, h) => sum + h.amount, 0) || 0;

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
      {/* Navbar Minimal */}
      <nav className="border-b border-zinc-800/50 p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
          <span>Kuber</span>
          <span className="text-emerald-400"> AI Money Mentor</span>
        </div>
        <Link href="/" className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">
          Back to Home
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto p-6 pt-12">
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
            Mutual Fund <span className="text-emerald-400">X-Ray</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light">
            Upload your CAS (Consolidated Account Statement) PDF. Our AI engine extracts the holdings and maps your exposure instantly.
          </p>
        </header>

        {!portfolioData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all ${
                file ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-900'
              }`}
            >
              {file ? (
                <>
                  <div className="p-4 bg-emerald-500/20 rounded-full mb-4">
                    <FileText className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{file.name}</h3>
                  <p className="text-zinc-500 text-sm mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button 
                    onClick={() => setFile(null)}
                    className="text-xs text-zinc-400 hover:text-red-400 uppercase tracking-widest font-bold"
                  >
                    Remove File
                  </button>
                </>
              ) : (
                <>
                  <div className="p-4 bg-zinc-800 rounded-full mb-4">
                    <UploadCloud className="w-10 h-10 text-zinc-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Drag & drop your CAS PDF</h3>
                  <p className="text-zinc-500 text-sm mb-6">Supported formats: .pdf up to 10MB</p>
                  <label className="bg-white text-zinc-950 px-6 py-3 rounded-full font-bold cursor-pointer hover:bg-zinc-200 transition-colors">
                    Browse Files
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="application/pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          if (e.target.files[0].type === "application/pdf") {
                            setFile(e.target.files[0]);
                            setError(null);
                          } else {
                            setError("Only PDF files are supported.");
                          }
                        }
                      }}
                    />
                  </label>
                </>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-[100px] group-hover:bg-emerald-500/10 transition-colors"></div>
                <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                  <Target className="text-emerald-400" /> Run AI Analysis
                </h3>
                <p className="text-zinc-400 mb-8 font-light">
                  Our Groq LLaMA 3.3 engine will intelligently parse tables across multiple pages, ignoring jargon and strictly isolating fund names, asset classes, and valuations.
                </p>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3 text-sm font-bold">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button 
                  onClick={processStatement}
                  disabled={!file || loading}
                  className="w-full bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400 text-zinc-950 p-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" /> Extracting Data...</>
                  ) : (
                    <>Scan Document <ArrowRight /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Results Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-3xl border border-zinc-800">
                <h3 className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-2">Total Extracted Value</h3>
                <div className="text-6xl font-black font-mono">
                  ₹{totalValue.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="bg-emerald-500 text-zinc-950 p-8 rounded-3xl flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-8 -top-8 text-black/10">
                  <Target className="w-48 h-48" />
                </div>
                <h3 className="font-bold uppercase tracking-widest text-xs mb-2 relative z-10 text-emerald-950">Funds Detected</h3>
                <div className="text-6xl font-black font-mono relative z-10">
                  {portfolioData.length}
                </div>
              </div>
            </div>

            {/* Dashboard grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Recharts Pie Chart */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <h3 className="text-xl font-black mb-8">Category Allocation</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`}
                      />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px', fontWeight: '600' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Column: Holdings List */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 overflow-hidden flex flex-col">
                <h3 className="text-xl font-black mb-6">Holdings Breakdown</h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  {portfolioData.map((fund, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors border border-zinc-800/50 hover:border-zinc-700">
                      <div>
                        <div className="font-bold text-sm mb-1">{fund.fund_name}</div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                          {fund.category}
                        </span>
                      </div>
                      <div className="font-mono font-bold text-lg">
                        ₹{fund.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button 
                onClick={() => {
                  setPortfolioData(null);
                  setFile(null);
                }}
                className="text-zinc-500 hover:text-white font-bold text-sm uppercase tracking-widest transition-colors"
              >
                Scan Another Document
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
