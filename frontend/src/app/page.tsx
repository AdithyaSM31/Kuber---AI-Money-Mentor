import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col text-white font-sans selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Background Grid Pattern */}
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
      
      <header className="flex items-center justify-between p-6 lg:p-10 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Image src="/kuber.png" alt="Kuber Logo" width={32} height={32} className="rounded-full rounded-tl-sm object-cover shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
          <span className="text-sm font-bold tracking-widest uppercase">KUBER - AI MONEY MENTOR</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-zinc-400">
          <Link href="#about" className="hover:text-emerald-400 transition-colors">ABOUT</Link>
          <Link href="#features" className="hover:text-emerald-400 transition-colors">FEATURES</Link>
          <Link href="#contact" className="hover:text-emerald-400 transition-colors">CONTACT</Link>
        </nav>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/10 hidden sm:flex">
              LOG IN
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-none tracking-widest text-xs font-bold px-6">
              GET STARTED
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-6 lg:px-20 relative pt-12 pb-24">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl z-10 grid lg:grid-cols-12 gap-12 items-center mx-auto w-full">

          <div className="lg:col-span-8 flex flex-col gap-6 -mt-12">
            <h1 className="text-6xl md:text-8xl lg:text-[130px] leading-[0.85] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 pb-4">
              Wealth <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-700 py-2 pr-4 inline-block">Creation,</span> <br />
              Automated.
            </h1>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8 pb-4">
            <p className="text-lg text-zinc-400 font-light border-l-2 border-emerald-500 pl-6 bg-gradient-to-r from-zinc-900/50 to-transparent py-4">
              Answering all of your financial planning needs. From MF overlap analysis to automated tax optimizations under old vs new regimes.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/onboarding" className="w-full">
                <ShimmerButton className="w-full h-14 rounded-xl transition-all hover:scale-105">
                  <span className="whitespace-pre-wrap text-center text-lg font-bold leading-none tracking-tight text-white">
                    Start Health Onboarding
                  </span>
                </ShimmerButton>
              </Link>
              <Link href="/mf-xray" className="w-full">
                <ShimmerButton className="w-full h-14 rounded-xl transition-all hover:scale-105">
                  <span className="whitespace-pre-wrap text-center text-lg font-bold leading-none tracking-tight text-white">
                    MF X-Ray Upload
                  </span>
                </ShimmerButton>
              </Link>
              <Link href="/what-if" className="w-full">
                <ShimmerButton className="w-full h-14 rounded-xl transition-all hover:scale-105">
                  <span className="whitespace-pre-wrap text-center text-lg font-bold leading-none tracking-tight text-white">
                    The "What-If" Simulator
                  </span>
                </ShimmerButton>
              </Link>
              <Link href="/advisor" className="w-full mt-4">
                <ShimmerButton className="w-full h-14 rounded-xl transition-all hover:scale-105">
                  <span className="whitespace-pre-wrap flex items-center justify-center gap-2 text-center text-lg font-bold leading-none tracking-tight text-white">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    Chat with AI Advisor
                  </span>
                </ShimmerButton>
              </Link>

              <div className="grid grid-cols-2 gap-3 mt-2 w-full">
                <Link href="/fire-planner" className="w-full">
                  <ShimmerButton className="w-full h-12 px-3 text-left justify-start rounded-xl transition-all hover:scale-[1.02]">
                    <span className="whitespace-pre-wrap text-left text-xs font-semibold leading-none tracking-tight text-white flex justify-center items-center gap-2 w-full">
                      🎯 FIRE Planner
                    </span>
                  </ShimmerButton>
                </Link>
                <Link href="/tax-wizard" className="w-full">
                  <ShimmerButton className="w-full h-12 px-3 text-left justify-start rounded-xl transition-all hover:scale-[1.02]">
                    <span className="whitespace-pre-wrap text-left text-xs font-semibold leading-none tracking-tight text-white flex justify-center items-center gap-2 w-full">
                      📄 Tax Wizard
                    </span>
                  </ShimmerButton>
                </Link>
                <Link href="/couples-planner" className="w-full col-span-2">
                  <ShimmerButton className="w-full h-12 px-3 text-left justify-start rounded-xl transition-all hover:scale-[1.02]">
                    <span className="whitespace-pre-wrap text-left text-xs font-semibold leading-none tracking-tight text-white w-full flex justify-between items-center">
                      <span className="flex gap-2 justify-center ml-auto">💍 Couple's Planner</span>
                      <span className="text-[10px] text-zinc-400 font-normal ml-auto">Joint Goals &gt;</span>
                    </span>
                  </ShimmerButton>
                </Link>
              </div>
            </div>


          </div>

        </div>
      </main>

      <div className="border-t border-white/5 py-6 px-6 lg:px-10 flex justify-between text-xs font-mono text-zinc-600 uppercase tracking-widest mt-auto relative z-10 bg-zinc-950/80 backdrop-blur-sm">
        <span>© 2026 Kuber - AI Money Mentor</span>
        <span>Secure. Encrypted. Private.</span>
      </div>
    </div>
  )
}
