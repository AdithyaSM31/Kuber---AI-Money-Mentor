"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ChatPanelProps {
  coupleContext: any;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPanel({ coupleContext }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "What if one of us gets a raise?",
    "Should we both claim HRA?",
    "How does a baby change our taxes?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8001/api/v1/couples-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages,
          couple_context: coupleContext
        }),
      });

      if (!response.ok) throw new Error("Failed to connect to Kuber");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (!reader) throw new Error("No reader");

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data.trim() === '[DONE]') {
              continue;
            } else if (data.startsWith('[ERROR]')) {
               console.error(data);
               assistantMessage += "\n\n**Error:** An issue occurred.";
               setMessages((prev) => {
                 const updated = [...prev];
                 updated[updated.length - 1].content = assistantMessage;
                 return updated;
               });
            } else {
               // The backend replaces \n with \\n, so we need to reverse it
               assistantMessage += data.replace(/\\n/g, '\n');
               setMessages((prev) => {
                 const updated = [...prev];
                 updated[updated.length - 1].content = assistantMessage;
                 return updated;
               });
            }
          }
        }
      }

    } catch (e: any) {
       setMessages(prev => [...prev, { role: 'assistant', content: '?? Sorry, I could not process your request currently.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all z-50 flex items-center justify-center group active:scale-95",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Chat Panel */}
      <div className={cn(
        "fixed right-4 sm:right-8 bottom-8 w-[calc(100vw-2rem)] sm:w-[400px] h-[600px] max-h-[80vh] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right",
        isOpen ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Kuber</h3>
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono">Tax AI</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center">
                   <MessageSquare className="w-8 h-8 text-emerald-400 opacity-50" />
                </div>
                <div>
                   <p className="text-white font-bold mb-2">Ask me anything!</p>
                   <p className="text-xs text-zinc-400 max-w-[250px]">I have context on your combined incomes and HRA calculation. How can I help optimize your taxes?</p>
                </div>
                <div className="flex flex-col gap-2 w-full mt-4">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      className="text-xs text-left p-3 rounded-lg border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800 text-zinc-300 transition-colors"
                    >
                      "{s}"
                    </button>
                  ))}
                </div>
             </div>
          ) : (
             messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                   <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", m.role === 'user' ? "bg-zinc-800 text-white" : "bg-emerald-900/50 border border-emerald-500/30 text-emerald-400")}>
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                   </div>
                   <div className={cn("px-4 py-3 rounded-2xl max-w-[80%] text-sm", m.role === 'user' ? "bg-emerald-600 text-white rounded-tr-sm" : "bg-zinc-800/50 text-zinc-300 border border-zinc-700/50 rounded-tl-sm prose prose-invert prose-emerald prose-sm")}>
                      {m.role === 'user' ? m.content : <ReactMarkdown>{m.content}</ReactMarkdown>}
                   </div>
                </div>
             ))
          )}
          {isLoading && (
             <div className="flex gap-3 flex-row">
                <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                   <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 rounded-tl-sm flex items-center gap-2">
                   <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                   <span className="text-xs text-zinc-400 animate-pulse">Thinking...</span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Kuber..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
