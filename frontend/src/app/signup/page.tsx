
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-dot-pattern flex bg-zinc-950 text-white font-sans">
      
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 border-r border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
        
        <Link href="/" className="flex items-center gap-3 z-10 w-fit hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-400">
            K
          </div>
          <span className="text-sm font-bold tracking-widest uppercase">KUBER - AI MONEY MENTOR</span>
        </Link>

        <div className="z-10">
          <h2 className="text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            Start your journey.
          </h2>
          <p className="text-zinc-400 text-lg w-3/4">
            Join the 5% of Indians with a real financial plan. Get your AI-powered advisor today.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md space-y-8 z-10">
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-400">
              K
            </div>
            <span className="text-sm font-bold tracking-widest uppercase">KUBER - AI MONEY MENTOR</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
            <p className="text-zinc-400 text-sm">Enter your details to get started</p>
          </div>

          <form className="space-y-6" action="/onboarding">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs uppercase tracking-widest text-zinc-400">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    className="bg-zinc-900/50 border-zinc-800 rounded-none h-12 focus-visible:ring-emerald-500" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs uppercase tracking-widest text-zinc-400">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    className="bg-zinc-900/50 border-zinc-800 rounded-none h-12 focus-visible:ring-emerald-500" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest text-zinc-400">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="bg-zinc-900/50 border-zinc-800 rounded-none h-12 focus-visible:ring-emerald-500" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-widest text-zinc-400">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  className="bg-zinc-900/50 border-zinc-800 rounded-none h-12 focus-visible:ring-emerald-500" 
                  required 
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-none h-12 font-bold tracking-widest text-xs">
              CREATE ACCOUNT
            </Button>
          </form>

          <div className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

