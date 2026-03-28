
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-dot-pattern flex bg-zinc-950 text-white font-sans">
      
      {/* Left side design */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 border-r border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none" />
        
        <Link href="/" className="flex items-center gap-3 z-10 w-fit hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-400">
            K
          </div>
          <span className="text-sm font-bold tracking-widest uppercase">KUBER - AI MONEY MENTOR</span>
        </Link>

        <div className="z-10">
          <h2 className="text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            Welcome back.
          </h2>
          <p className="text-zinc-400 text-lg w-3/4">
            Log in to continue building your early retirement plan and optimizing your tax strategies.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md space-y-8 z-10">
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-400">
              K
            </div>
            <span className="text-sm font-bold tracking-widest uppercase">KUBER - AI MONEY MENTOR</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Log In</h1>
            <p className="text-zinc-400 text-sm">Enter your email to sign in to your account</p>
          </div>

          <form className="space-y-6" action="/onboarding">
            <div className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs uppercase tracking-widest text-zinc-400">Password</Label>
                  <Link href="#" className="text-xs text-emerald-500 hover:text-emerald-400">Forgot password?</Link>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  className="bg-zinc-900/50 border-zinc-800 rounded-none h-12 focus-visible:ring-emerald-500" 
                  required 
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-none h-12 font-bold tracking-widest text-xs">
              SIGN IN
            </Button>
          </form>

          <div className="text-center text-sm text-zinc-400">
            Don t have an account?{" "}
            <Link href="/signup" className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

