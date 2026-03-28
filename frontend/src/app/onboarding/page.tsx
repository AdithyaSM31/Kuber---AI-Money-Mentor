
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [formData, setFormData] = useState({
    age: "",
    income: "",
    savings: "",
    expenses: "",
  });

  
  const [scoreData, setScoreData] = useState<any>(null);
  const [isFetchingScore, setIsFetchingScore] = useState(false);
  
  const generateScore = async () => {
    setIsFetchingScore(true);
    try {
      const expenses = parseInt(formData.expenses) || 1000;
      const savings = parseInt(formData.savings) || 0;
      const payload = {
        user_id: "user_auto_" + Math.floor(Math.random() * 10000),
        name: "Anonymous User",
        age: parseInt(formData.age) || 30,
        monthly_income: parseInt(formData.income) || Math.max(expenses + 1000, 2000),
        monthly_expenses: expenses,
        emergency_fund_months: savings / expenses,
        has_term_insurance: false,
        has_health_insurance: false,
        monthly_sip: 0,
        has_loans: false,
        monthly_emi: 0,
        tax_regime: "unsure",
        risk_appetite: "moderate"
      };

      const res = await fetch("https://kuber-backend-fb4dbb569c44.herokuapp.com/api/v1/health-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setScoreData(data);
      animateCounter(data.overall || 0);
    } catch (e) {
      console.error(e);
      animateCounter(62); // fallback
    } finally {
      setIsFetchingScore(false);
    }
  };

  const animateCounter = (targetScore: number) => {
    let currentScore = 0;
    const interval = setInterval(() => {
      if (currentScore < targetScore) {
        currentScore += 1;
        setScore(currentScore);
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  const nextStep = () => {
    if (step === 3) {
      generateScore();
    }
    setStep(step + 1);
  };



  const steps = [
    {
      title: "Welcome to Kuber - AI Money Mentor \u{1F4B8}",
      description: "Get your personalized financial plan and Money Health Score in 2 minutes. Let's make financial planning as easy as chatting on WhatsApp.",
      action: "Start Now",
      content: null,
    },
    {
      title: "How old are you?",
      description: "This helps us understand your time horizon for investments like retirement and compounding.",
      action: "Next",
      content: (
        <input
          type="number"
          placeholder="e.g. 28"
          className="w-full text-center text-3xl p-6 bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500 rounded-none text-white outline-none transition-colors"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        />
      ),
    },
    {
      title: "What is your monthly income?",
      description: "Used to structure an optimal SIP plan and tax strategy based on the old vs new regime.",
      action: "Next",
      content: (
        <input
          type="number"
          placeholder="e.g. 85000"
          className="w-full text-center text-3xl p-6 bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500 rounded-none text-white outline-none transition-colors"
          value={formData.income}
          onChange={(e) => setFormData({ ...formData, income: e.target.value })}
        />
      ),
    },
    {
      title: "Total current savings / investments?",
      description: "Including FDs, Mutual Funds, Stocks, and EPF.",
      action: "Generate My Health Score",
      content: (
        <input
          type="number"
          placeholder="e.g. 150000"
          className="w-full text-center text-3xl p-6 bg-zinc-900/50 border border-zinc-800 focus:border-emerald-500 rounded-none text-white outline-none transition-colors"
          value={formData.savings}
          onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
        />
      ),
    },
    {
      title: "Your Money Health Score",

      description: "Based on the 6 dimensions of financial wellness",
      action: "View Full Plan & X-Ray",
      content: (
        <div className="flex flex-col gap-8 w-full text-left">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex flex-col">
                <span className="font-semibold text-2xl text-white">Overall Score</span>
                <span className="text-xs text-emerald-500 font-mono tracking-widest mt-1">
                    {isFetchingScore ? "CALCULATING..." : (scoreData?.is_fallback ? "HEURISTIC ENGINE" : "POWERED BY GROQ LLaMA 3.3")}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {!isFetchingScore && (
                  <Badge variant="outline" className={`px-3 py-1 text-sm font-bold tracking-widest uppercase ${score >= 80 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : score >= 50 ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                    {score >= 80 ? "Excellent" : score >= 50 ? "Needs Attention" : "Critical"}
                  </Badge>
                )}
                <div className="text-5xl font-black text-emerald-400 tabular-nums w-[110px] text-right">
                  {isFetchingScore ? "--" : score}/100
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              {[
                { label: "Emergency", icon: "🚨", value: scoreData?.scores?.emergency || 0, color: "bg-blue-500", delay: "delay-[100ms]" },
                { label: "Insurance", icon: "🛡️", value: scoreData?.scores?.insurance || 0, color: "bg-amber-500", delay: "delay-[200ms]" },
                { label: "Diversification", icon: "📊", value: scoreData?.scores?.diversification || 0, color: "bg-purple-500", delay: "delay-[300ms]" },
                { label: "Debt Health", icon: "⚖️", value: scoreData?.scores?.debtHealth || 0, color: "bg-emerald-500", delay: "delay-[400ms]" },
                { label: "Tax Efficiency", icon: "💸", value: scoreData?.scores?.taxEfficiency || 0, color: "bg-cyan-500", delay: "delay-[500ms]" },
                { label: "Retirement", icon: "🏖️", value: scoreData?.scores?.retirement || 0, color: "bg-pink-500", delay: "delay-[600ms]" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm font-mono tracking-wider text-zinc-300 uppercase">
                    <span className="flex items-center gap-2"><span className="text-lg">{item.icon}</span> {item.label}</span>
                    <span className="text-zinc-500 font-bold">{item.value}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-none overflow-hidden">
                    <div className={`h-full ${item.color} transition-all duration-1000 ease-out ${item.delay}`} style={{ width: (!isFetchingScore && step === 4) ? `${item.value}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>
            {scoreData?.insights && scoreData.insights.length > 0 ? (
                <div className="mt-2 p-5 bg-zinc-900/80 border border-zinc-800 rounded-none text-sm text-zinc-300 flex flex-col gap-4">
                {scoreData.insights.map((rec: any, idx: number) => (
                    <p key={idx} className={`flex gap-3 items-start ${idx > 0 ? "border-t border-zinc-800/50 pt-4" : ""}`}>
                    <span className="text-emerald-500 text-lg flex-shrink-0">
                      {rec.type === 'warning' ? "⚠️" : rec.type === 'positive' ? "✅" : "💡"}
                    </span>
                    <span className="leading-relaxed">{rec.text}</span>
                    </p>
                ))}
                </div>
            ) : (
                <div className="mt-2 p-5 bg-zinc-900/80 border border-zinc-800 rounded-none text-sm text-zinc-300 flex flex-col gap-4 opacity-50">
                    <p className="text-center animate-pulse">Analyzing financial profile...</p>
                </div>
            )}
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-dot-pattern flex flex-col bg-zinc-950 text-white font-sans selection:bg-emerald-500/30 relative">
      
      
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
<header className="absolute top-0 w-full flex items-center justify-between p-6 lg:p-10 z-50 pointer-events-none">
        <Link href="/" className="flex items-center gap-3 pointer-events-auto hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-400">
            K
          </div>
          <span className="text-sm font-bold tracking-widest uppercase hidden md:inline">KUBER - AI MONEY MENTOR</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className={`w-full ${step === 4 ? "max-w-4xl" : "max-w-xl"} z-10 transition-all duration-500 p-8 md:p-12 border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-2xl`}>
          <div className="flex flex-col items-center text-center gap-10">
            
            <div className="w-full text-center">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                {currentStep.title}
              </h1>
              {currentStep.description && (
                <p className="text-zinc-400 text-sm md:text-base px-4 max-w-2xl mx-auto">
                  {currentStep.description}
                </p>
              )}
            </div>

            <div className="w-full flex justify-center">
              {currentStep.content}
            </div>

            <Button 
              className={`w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none tracking-widest text-sm font-bold transition-all uppercase ${step === 4 ? "animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.4)]" : ""}`}
              onClick={step < steps.length - 1 ? nextStep : () => router.push('/mf-xray')}
            >
              {currentStep.action}
            
          </Button>

            </div>
        </div>

        {/* Progress indicator */}
        <div className="fixed bottom-0 left-0 w-full h-1.5 bg-zinc-900 border-t border-white/10">
           <div 
             className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
             style={{ width: `${((step + 1) / steps.length) * 100}%` }}
           />
        </div>

        {/* Agent Activity Terminal */}
        {step > 0 && step < 4 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-center opacity-50 z-20">
            <code className="text-xs font-mono text-emerald-500 flex items-center gap-2 bg-zinc-950 px-4 py-2 border border-emerald-900/30">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              [Agent] Profiler capturing financial vectors...
            </code>
          </div>
        )}

      </main>
    </div>
  );
}



