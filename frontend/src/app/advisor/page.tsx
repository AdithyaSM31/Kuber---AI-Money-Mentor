"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Send, Bot, User, TerminalSquare, Loader2, Zap } from "lucide-react";
import ReactMarkdown from 'react-markdown';

import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export default function AdvisorChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Hello! I am **ET MoneyMind**. I have deep knowledge of Indian taxation, mutual funds, and your personal financial profile. What would you like to plan today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [agentLogs, setAgentLogs] = useState<{time: string, agent: string, action: string}[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agentLogs]);

  const addLog = (agent: string, action: string) => {
    setAgentLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit', fractionalSecondDigits: 2 }),
      agent,
      action
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    addLog("SystemUI", "Triggered dispatch to API Gateway...");

    try {
      // Pass a mocked context simulating session data
      const mockContext = {
        name: "Anonymous User",
        health_score: 62,
        savings_rate: "15%",
        tax_regime: "unsure"
      };

      const res = await fetch("https://kuber-backend-fb4dbb569c44.herokuapp.com/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: messages, context: mockContext })
      });

      const data = await res.json();

      // Simulate a structured multi-agent feed visualization
      if (data.logs) {
        for (let i = 0; i < data.logs.length; i++) {
          setTimeout(() => {
            addLog(data.logs[i].agent, data.logs[i].action);
          }, i * 600); // 600ms stagger for visual "thinking" effect
        }
      }

      // Show the answer slightly after logs finish
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
        setLoading(false);
      }, (data.logs?.length || 0) * 600 + 400);

    } catch (e: any) {
      addLog("Network Error", e.message);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I am offline right now." }]);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col selection:bg-emerald-500/30 relative relative overflow-hidden h-screen max-h-screen">
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
      <nav className="border-b border-zinc-800/80 p-4 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md z-50 flex-none">
        <div className="text-xl font-black tracking-tighter flex items-center gap-2">
          <span>ET</span>
          <span className="text-emerald-400">MoneyMind</span>
          <span className="ml-2 px-2 py-0.5 bg-zinc-800 text-[10px] text-zinc-400 rounded-sm uppercase tracking-widest font-mono border border-zinc-700">Phase 4 Alpha</span>
        </div>
        <Link href="/" className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">
          Back to Home
        </Link>
      </nav>

      {/* Main Grid UI */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 h-full">
        
        {/* Chat Window (Left Side) */}
        <div className="col-span-2 flex flex-col border-r border-zinc-800/80 bg-zinc-950 relative min-h-0">
          
          <div className="absolute top-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
             <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-1.5 rounded-full flex items-center gap-2 font-mono">
               <Zap size={12} className="fill-emerald-400" />
               GROQ LLaMA 3.3
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 pb-32">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'ai' && (
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={20} className="text-emerald-400" />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl p-5 ${
                  m.role === 'user' 
                    ? 'bg-emerald-500 text-emerald-950 rounded-tr-sm font-medium' 
                    : 'bg-zinc-900 border border-zinc-800/50 text-zinc-300 rounded-tl-sm'
                } leading-relaxed`}>
                  
                  {m.role === 'ai' ? (
                     <div className="prose prose-invert prose-emerald max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-a:text-emerald-400">
                       <ReactMarkdown>{m.content}</ReactMarkdown>
                     </div>
                  ) : (
                     m.content
                  )}
                  
                </div>

                {m.role === 'user' && (
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={20} className="text-emerald-500" />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                  <Bot size={20} className="text-zinc-500" />
                </div>
                <div className="bg-zinc-900 border border-zinc-800/50 rounded-2xl rounded-tl-sm p-5 flex items-center gap-3">
                  <div className="flex gap-1">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]"></span>
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]"></span>
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
            <div className="relative max-w-3xl mx-auto flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about MFs, taxation, or your health score..."
                className="w-full bg-zinc-900/90 border border-zinc-700/50 text-white p-4 pl-6 pr-14 rounded-2xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-lg backdrop-blur-md"
              />
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-2 p-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-xl transition-all disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Agent Feed Window (Right Side) */}
        <div className="hidden lg:flex flex-col bg-[#0A0A0A] border-l border-zinc-800/80 font-mono text-xs min-h-0">
          <div className="p-4 border-b border-zinc-800/80 flex items-center gap-2 bg-zinc-900/50">
            <TerminalSquare size={16} className="text-zinc-400" />
            <span className="text-zinc-300 font-bold uppercase tracking-widest">Multi-Agent Activity Feed</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {agentLogs.length === 0 ? (
               <div className="text-zinc-600 italic">Waiting for queries to orchestrate...</div>
            ) : (
              agentLogs.map((log, i) => (
                <div key={i} className="flex flex-col gap-1 border-l-2 border-zinc-800 pl-3 py-1">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <span>[{log.time}]</span>
                    <span className="text-emerald-500/80 font-bold uppercase">{log.agent}</span>
                  </div>
                  <div className="text-zinc-300 leading-relaxed">
                    &gt; {log.action}
                  </div>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}