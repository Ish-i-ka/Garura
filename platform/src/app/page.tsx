"use client"
//main landing page
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function GaruraLanding() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDemo, setActiveDemo] = useState(0)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [currentTechIndex, setCurrentTechIndex] = useState(0)

  const securityStats = {
    threatsBlocked: 2847,
    sessionsSecured: 1293,
    uptime: 99.97,
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Tech stack carousel auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTechIndex((prev) => (prev + 1) % allTechItems.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const allTechItems = [
    { name: "NEXT.JS", icon: "⬢" },
    { name: "REACT", icon: "⬡" },
    { name: "TYPESCRIPT", icon: "⬢" },
    { name: "TAILWIND", icon: "⬡" },
    { name: "SOCKET.IO", icon: "⬢" },
    { name: "PRISMA", icon: "⬡" },
    { name: "POSTGRESQL", icon: "⬢" },
    { name: "ELECTRON", icon: "⬡" },
    { name: "GOOGLE AI", icon: "⬢" },
    { name: "STREAM.IO", icon: "⬡" },
    { name: "VERCEL", icon: "⬢" },
  ]

  const specialFeatures = [
    {
      tagline: "SYSTEM.SECURITY.LEVEL_MAX",
      title: "OS-LEVEL PROCESS MONITORING",
      description:
        "Deep Windows integration that detects and blocks any unauthorized applications, screen sharing tools, or virtual machines in real-time.",
      mockup: (
        <div className="relative group">
          {/* Terminal Window */}
          <div className="bg-gradient-to-br from-gray-950 to-black border border-cyan-400/30 hover:border-cyan-400/60 relative rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            {/* Terminal Header */}
            <div className="border-b border-cyan-400/30 p-3 flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full border border-red-400 bg-red-400/20"></div>
                <div className="w-3 h-3 rounded-full border border-yellow-400 bg-yellow-400/20"></div>
                <div className="w-3 h-3 rounded-full border border-cyan-400 bg-cyan-400/20"></div>
              </div>
              <div className="text-cyan-400 text-xs font-mono">SECURITY.MONITOR.EXE</div>
            </div>

            {/* Terminal Content */}
            <div className="p-4 font-mono text-xs space-y-2">
              <div className="text-cyan-400">&gt; INITIALIZING SECURITY PROTOCOLS...</div>
              <div className="text-cyan-400">&gt; SYSTEM.PROCESSES.SCAN [████████████] 100%</div>
              <div className="text-cyan-400">&gt; SCREENSHOT.PROTECTION [ACTIVE]</div>
              <div className="text-red-400 animate-pulse">&gt; THREAT.DETECTED: teamviewer.exe [BLOCKED]</div>
              <div className="text-red-400 animate-pulse">&gt; THREAT.DETECTED: anydesk.exe [BLOCKED]</div>
              <div className="text-yellow-400">&gt; FOCUS.LOST.EVENT [INTERVIEWER.NOTIFIED]</div>
              <div className="text-cyan-400">&gt; SYSTEM.STATUS: [SECURE]</div>
            </div>
          </div>

          {/* Glowing Border Effect */}
          <div className="absolute inset-0 border border-cyan-400/50 rounded-xl animate-pulse pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      ),
    },
    {
      tagline: "AI.NEURAL.NETWORK.ACTIVE",
      title: "SMART INTERVIEWER ASSISTANT",
      description:
        "Google Gemini AI helps in curating personalized questions on diverse topics and analyzes candidate responses in real-time, and provides performance scores.",
      mockup: (
        <div className="relative group">
          <div className="bg-gradient-to-br from-gray-950 to-black border border-cyan-400/30 hover:border-cyan-400/60 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            {/* AI Interface Header */}
            <div className="border-b border-cyan-400/30 p-3 flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border border-cyan-400/60 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-cyan-400 animate-pulse rounded-full"></div>
                </div>
                <div className="text-cyan-400 text-xs font-mono">AI.ASSISTANT.NEURAL.NET</div>
              </div>
              <div className="text-cyan-400 text-xs">STATUS: ANALYZING</div>
            </div>

            {/* AI Content */}
            <div className="p-4 space-y-3">
              <div className="border border-cyan-400/30 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 p-3 rounded-lg">
                <div className="text-cyan-400 text-xs font-mono mb-1">SUGGESTION.QUEUE</div>
                <div className="text-white text-xs">"Ask about time complexity optimization"</div>
              </div>
              <div className="border border-cyan-400/30 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 p-3 rounded-lg">
                <div className="text-cyan-400 text-xs font-mono mb-1">ANALYSIS.RESULT</div>
                <div className="text-white text-xs">Strong problem-solving approach detected</div>
              </div>
              <div className="border border-yellow-400/30 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 p-3 rounded-lg">
                <div className="text-yellow-400 text-xs font-mono mb-1">ALERT.SYSTEM</div>
                <div className="text-white text-xs">Consider testing edge cases</div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 border border-cyan-400/50 rounded-xl animate-pulse pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      ),
    },
    {
      tagline: "COLLABORATION.PROTOCOL.SYNC",
      title: "REAL-TIME CODE & WHITEBOARD",
      description:
        "Built-in collaborative code editor with syntax highlighting and digital whiteboard for technical discussions and problem solving.",
      mockup: (
        <div className="relative group">
          <div className="bg-gradient-to-br from-gray-950 to-black border border-cyan-400/30 hover:border-cyan-400/60 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            {/* Code Editor Header */}
            <div className="border-b border-cyan-400/30 p-3 flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50">
              <div className="text-cyan-400 text-xs font-mono">CODE.EDITOR.COLLABORATIVE</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 animate-pulse rounded-full"></div>
                <div className="text-cyan-400 text-xs">SYNC.ACTIVE</div>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-4 font-mono text-xs space-y-1">
              <div className="text-gray-500">// COLLABORATIVE.SESSION.ACTIVE</div>
              <div>
                <span className="text-cyan-400">function</span>{' '}
                <span className="text-yellow-400">binarySearch</span>
                <span className="text-white">(arr, target) {'{'}</span>
              </div>
              <div className="ml-4">
                <span className="text-cyan-400">let</span>{' '}
                <span className="text-blue-400">left</span> ={' '}
                <span className="text-orange-400">0</span>,{' '}
                <span className="text-blue-400">right</span> = arr.length -{' '}
                <span className="text-orange-400">1</span>;
              </div>
              <div className="ml-4">
                <span className="text-cyan-400">while</span> (left {'<='} right) {'{'}
              </div>
              <div className="ml-8">
                <div>
                  <span className="text-cyan-400">const</span>{' '}
                  <span className="text-blue-400">mid</span> =
                </div>
                <div>
                  {'Math.floor((left + right) / '}<span className="text-orange-400">2</span>{');'}
                </div>
              </div>
              <div className="ml-4">{'}'}</div>
              <div>{'}'}</div>
              <div className="mt-3 flex items-center text-cyan-400">
                <div className="w-2 h-2 bg-cyan-400 animate-pulse mr-2 rounded-full"></div>
                CANDIDATE.TYPING...
              </div>
            </div>
          </div>

          <div className="absolute inset-0 border border-cyan-400/50 rounded-xl animate-pulse pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      ),
    },
  ]

  const demoScreens = [
    {
      title: "SECURITY.DASHBOARD",
      content: (
        <div className="bg-gradient-to-br from-gray-950 to-black border border-cyan-400/30 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="text-cyan-400 font-mono text-sm">SYSTEM.MONITOR.STATUS</div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-400 animate-pulse rounded-full"></div>
              <div className="text-cyan-400 text-xs font-mono">ACTIVE</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="border border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-blue-600/5 p-3 rounded-lg">
              <div className="text-cyan-400 mb-2">PROCESS.MONITORING</div>
              <div className="text-white">ENABLED</div>
            </div>
            <div className="border border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-blue-600/5 p-3 rounded-lg">
              <div className="text-cyan-400 mb-2">SCREENSHOT.PROTECTION</div>
              <div className="text-white">ACTIVE</div>
            </div>
            <div className="border border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-blue-600/5 p-3 rounded-lg">
              <div className="text-cyan-400 mb-2">CLIPBOARD.ACCESS</div>
              <div className="text-white">BLOCKED</div>
            </div>
            <div className="border border-red-400/30 bg-gradient-to-br from-red-400/5 to-orange-400/5 p-3 rounded-lg">
              <div className="text-red-400 mb-2">THREAT.DETECTED</div>
              <div className="text-red-400 animate-pulse">SUSPICIOUS.PROCESS</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "CODE.EDITOR",
      content: (
        <div className="bg-gradient-to-br from-gray-950 to-black border border-cyan-400/30 p-6 rounded-xl">
          <div className="text-gray-500 mb-3 font-mono text-xs">// LIVE.COLLABORATIVE.CODING</div>
          <div className="font-mono text-sm space-y-1">
            <div>
              <span className="text-cyan-400">function</span> <span className="text-yellow-400">fibonacci</span>
              <span className="text-white">(n) {'{'}</span>
            </div>
            <div className="ml-4">
              <span className="text-cyan-400">if</span> (n {'<='} 1) <span className="text-cyan-400">return</span> n;
            </div>
            <div className="ml-4">
              <span className="text-cyan-400">return</span> fibonacci(n-1) + fibonacci(n-2);
            </div>
            <div>{'}'}</div>
          </div>
          <div className="mt-4 flex items-center text-cyan-400 text-xs font-mono">
            <div className="w-2 h-2 bg-cyan-400 animate-pulse mr-2 rounded-full"></div>
            CANDIDATE.TYPING...
          </div>
        </div>
      ),
    },
    {
      title: "AI.HELPER",
      content: (
        <div className="bg-gradient-to-br from-gray-950 to-black border border-cyan-400/30 p-6 rounded-xl">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 border border-cyan-400/60 rounded-lg flex items-center justify-center mr-3">
              <div className="w-3 h-3 bg-cyan-400 animate-pulse rounded-full"></div>
            </div>
            <div className="text-cyan-400 font-mono text-sm">AI.INSIGHTS.NEURAL.NET</div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="border border-cyan-400/30 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 p-2 rounded-lg">
              <div className="text-cyan-400">QUESTIONING.POSITIVE</div>
              <div className="text-white">Strong personalised questioning approach</div>
            </div>
            <div className="border border-yellow-400/30 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 p-2 rounded-lg">
              <div className="text-yellow-400">ANSWER.QUEUE</div>
              <div className="text-white">Get instant score of your answers</div>
            </div>
            <div className="border border-cyan-400/30 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 p-2 rounded-lg">
              <div className="text-cyan-400">RECOMMENDATION</div>
              <div className="text-white">Suggest realtime quiz based on diverse topics</div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const features = [
    {
      icon: "⬢",
      title: "OS-LEVEL MONITORING",
      description: "Deep system integration detects and blocks cheating applications and unauthorized tools.",
      demo: "PROCESS.MONITORING.ACTIVE",
      size: "large",
    },
    {
      icon: "⬡",
      title: "ANTI-CHEATING CONTROLS",
      description: "Disables screenshots, clipboard access, and monitors application focus.",
      demo: "SCREENSHOT.BLOCKED",
      size: "medium",
    },
    {
      icon: "⬢",
      title: "COLLABORATIVE TOOLS",
      description: "Real-time code editor, digital whiteboard, and integrated video chat.",
      demo: "LIVE.CODING.SESSION",
      size: "medium",
    },
    {
      icon: "⬡",
      title: "AI-POWERED QUESTION CURATION",
      description: "Smart question suggestions and performance analysis powered by AI.",
      demo: "AI.ANALYZING.RESPONSES",
      size: "large",
    },
    {
      icon: "⬢",
      title: "DETAILED REPORTS",
      description: "Complete audit trail of all activities during the interview session.",
      demo: "GENERATING.REPORT",
      size: "small",
    },
    {
      icon: "⬡",
      title: "SECURE DESKTOP CLIENT",
      description: "Dedicated application ensuring maximum control and security.",
      demo: "SYSTEM.SECURED",
      size: "small",
    },
  ]

  const getBentoGridClass = (size: string) => {
    switch (size) {
      case "large":
        return "md:col-span-2 md:row-span-2"
      case "medium":
        return "md:col-span-2"
      case "small":
        return "md:col-span-1"
      default:
        return "md:col-span-1"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white relative overflow-x-hidden">
      {/* TRON Grid Background */}
      <div className="fixed inset-0 opacity-40 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
        linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px),
        linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)
      `,
            backgroundSize: "60px 60px, 60px 60px, 20px 20px, 20px 20px",
            backgroundPosition: "0 0, 0 0, 0 0, 0 0",
          }}
        />
      </div>

      {/* Additional Subtle Check Pattern */}
      <div className="fixed inset-0 opacity-25 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(6,182,212,0.5) 1px, transparent 0)
      `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Extra Grid Layer for More Visibility */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
        linear-gradient(rgba(6,182,212,0.6) 0.5px, transparent 0.5px),
        linear-gradient(90deg, rgba(6,182,212,0.6) 0.5px, transparent 0.5px)
      `,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Animated Circuit Lines */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse delay-1000"></div>
        <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-pulse delay-500"></div>
        <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-pulse delay-1500"></div>
      </div>

      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/90 backdrop-blur-xl border-b border-gray-800/50" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 border-2 border-cyan-400/60 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-cyan-400/20 group-hover:to-blue-600/20 group-hover:border-cyan-400 transition-all duration-300 backdrop-blur-sm">
              <span className="text-lg font-bold text-cyan-400 font-mono">G</span>
            </div>
            <div className="text-xl font-bold text-cyan-400 font-mono tracking-widest">GARURA</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {["ABOUT", "FEATURES", "DEMO", "FAQS", "CONTACT"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-gray-300 hover:text-cyan-400 transition-all duration-300 px-4 py-2 font-mono text-sm rounded-lg hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 backdrop-blur-sm"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth" passHref>
              <Button
                variant="outline"
                className="bg-gray-900/50 backdrop-blur-sm border border-cyan-400/60 text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 hover:border-cyan-400 font-mono text-sm px-6 rounded-xl transition-all duration-300"
              >
                LOGIN
              </Button>
            </Link>
            <Link href="/auth" passHref>
              <Button className="bg-gradient-to-r from-cyan-500/90 to-blue-600/90 hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-white font-mono text-sm px-6 font-bold transition-all duration-300 rounded-xl backdrop-blur-sm">
                GET.STARTED
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 border border-cyan-400/60 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 transition-all duration-300 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="text-cyan-400 font-mono text-sm">{isMobileMenuOpen ? "CLOSE" : "MENU"}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800/50 rounded-b-2xl">
            <div className="container mx-auto px-4 py-6 space-y-4">
              {["ABOUT", "FEATURES", "DEMO", "FAQS", "CONTACT"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-400 hover:text-cyan-400 transition-colors py-2 px-4 border border-transparent hover:border-cyan-400/30 font-mono rounded-lg"
                >
                  {item}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 pt-4">
                <Link href="/login" passHref>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-mono rounded-xl"
                  >
                    LOGIN
                  </Button>
                </Link>
                <Link href="/register" passHref>
                  <Button className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white hover:from-cyan-300 hover:to-blue-500 font-mono font-bold rounded-xl">
                    GET.STARTED
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 relative">
        <div className="container mx-auto text-center max-w-6xl relative z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 border border-cyan-400/60 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm px-6 py-2 mb-8 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 hover:border-cyan-400 transition-all duration-300 rounded-full">
            <div className="w-2 h-2 bg-cyan-400 animate-pulse rounded-full"></div>
            <span className="text-cyan-400 font-mono text-sm">POWERED.BY.AI.AND.OS.LEVEL.SECURITY</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight font-mono">
            THE{" "}
            <span className="text-cyan-400 relative">
              UNCHEATABLE
              <div className="absolute inset-0 border border-cyan-400/50 animate-pulse pointer-events-none rounded-lg"></div>
            </span>
            <br />
            <span className="text-cyan-400 relative">
              INTERVIEW
              <div className="absolute inset-0 border border-cyan-400/50 animate-pulse delay-500 pointer-events-none rounded-lg"></div>
            </span>{" "}
            ENVIRONMENT
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-mono">
            Garura provides <span className="text-cyan-400">OS-LEVEL.INTEGRATION</span> for candidates, giving you{" "}
            <span className="text-cyan-400">COMPLETE.CONFIDENCE</span> in your remote technical assessments.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] text-white px-10 py-6 text-lg font-mono font-bold transition-all duration-300 rounded-2xl backdrop-blur-sm"
            >
              WATCH.DEMO
            </Button>
            <Link href="/auth" passHref>
              <Button
                size="lg"
                variant="outline"
                className="bg-gray-900/50 backdrop-blur-sm border border-cyan-400/60 text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 hover:border-cyan-400 px-10 py-6 text-lg font-mono rounded-2xl transition-all duration-300"
              >
                GET.STARTED
              </Button>
            </Link>
          </div>

          {/* Live Security Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                label: "THREATS.BLOCKED",
                value: "2,847",
                status: "LIVE.MONITORING",
                desc: "Based on industry avg of 2.2 threats per session",
              },
              {
                label: "SESSIONS.SECURED",
                value: "1,293",
                status: "100%.SUCCESS.RATE",
                desc: "Zero successful cheating attempts recorded",
              },
              {
                label: "SYSTEM.UPTIME",
                value: "99.97%",
                status: "ALWAYS.AVAILABLE",
                desc: "Enterprise-grade reliability standards",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="border border-gray-800/50 bg-gradient-to-br from-gray-900/30 to-black/50 backdrop-blur-sm hover:border-cyan-400/60 hover:bg-gradient-to-br hover:from-cyan-400/10 hover:to-blue-600/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-500 p-6 relative group rounded-2xl"
              >
                <div className="text-3xl font-bold text-cyan-400 group-hover:text-orange-400 transition-colors mb-2 font-mono">
                  {stat.value}
                </div>
                <div className="text-gray-300 font-mono text-sm mb-2">{stat.label}</div>
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-cyan-400 group-hover:bg-orange-400 transition-colors animate-pulse mr-2 rounded-full"></div>
                  <span className="text-xs text-cyan-300 group-hover:text-orange-300 transition-colors font-mono">
                    {stat.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Features Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block border border-cyan-400/60 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm px-6 py-2 mb-6 rounded-full">
              <span className="text-cyan-400 font-mono text-sm">SYSTEM.FEATURES.ADVANCED</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-cyan-400 font-mono">WHAT.MAKES.US.SPECIAL</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-mono">
              Revolutionary features that redefine interview security
            </p>
          </div>

          {/* Features Grid */}
          <div className="space-y-24">
            {specialFeatures.map((feature, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
              >
                <div className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="inline-block border border-cyan-400/60 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 px-4 py-2 rounded-lg">
                    <span className="text-cyan-400 font-mono text-sm font-bold">{feature.tagline}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight font-mono">{feature.title}</h3>
                  <p className="text-lg text-gray-300 leading-relaxed font-mono">{feature.description}</p>
                </div>
                <div className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>{feature.mockup}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block border border-cyan-400/60 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm px-6 py-2 mb-6 rounded-full">
              <span className="text-cyan-400 font-mono text-sm">INTERACTIVE.DEMONSTRATION</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-cyan-400 font-mono">SEE.GARURA.IN.ACTION</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-mono">
              Experience our platform's powerful features through interactive demos
            </p>
          </div>

          {/* Demo Navigation */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {demoScreens.map((demo, index) => (
              <button
                key={index}
                onClick={() => setActiveDemo(index)}
                className={`p-4 border transition-all duration-300 text-left font-mono rounded-2xl backdrop-blur-sm ${
                  activeDemo === index
                    ? "border-cyan-400/80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20"
                    : "border-gray-800/50 bg-gradient-to-br from-gray-900/30 to-black/50 hover:border-cyan-400/60 hover:bg-gradient-to-br hover:from-cyan-400/10 hover:to-blue-600/10"
                }`}
              >
                <h3 className="text-lg font-bold mb-2 text-cyan-400">{demo.title}</h3>
                <div className="text-sm text-gray-400">CLICK.TO.PREVIEW</div>
              </button>
            ))}
          </div>

          {/* Demo Content */}
          <div className="border border-cyan-400/60 bg-gradient-to-br from-gray-900/30 to-black/50 backdrop-blur-sm min-h-[400px] relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="border-b border-cyan-400/30 p-4 flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50">
              <h3 className="text-xl font-bold text-cyan-400 font-mono">{demoScreens[activeDemo].title}</h3>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full border border-red-400 bg-red-400/20"></div>
                <div className="w-3 h-3 rounded-full border border-yellow-400 bg-yellow-400/20"></div>
                <div className="w-3 h-3 rounded-full border border-cyan-400 bg-cyan-400/20"></div>
              </div>
            </div>
            <div className="p-6">{demoScreens[activeDemo].content}</div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 px-4 relative">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block border border-cyan-400/60 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm px-6 py-2 mb-6 rounded-full">
              <span className="text-cyan-400 font-mono text-sm">TRUST.VERIFICATION.PROTOCOL</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-cyan-400 font-mono">WHY.YOU.CAN.TRUST.GARURA</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-mono">
              Advanced OS-level security features that make cheating impossible
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={` ${getBentoGridClass(feature.size)} bg-gradient-to-br from-blue-900/80 to-cyan-900/60 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-500/90 hover:to-blue-600/90 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-500 group overflow-hidden relative rounded-2xl`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardContent className="p-6 relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-6 text-cyan-300 group-hover:scale-110 group-hover:text-white transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-black font-mono">
                      {feature.title}
                    </h3>
                    <p className="text-blue-100 group-hover:text-gray-800 leading-relaxed mb-4 font-mono text-sm">
                      {feature.description}
                    </p>
                  </div>

                  {hoveredFeature === index && (
                    <div className="border border-white/30 bg-gradient-to-r from-white/20 to-gray-100/20 p-3 animate-in slide-in-from-bottom-2 duration-300 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-cyan-400 animate-pulse rounded-full"></div>
                        <span className="text-black text-xs font-mono font-bold">{feature.demo}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Carousel */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block border border-cyan-400/60 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm px-6 py-2 mb-6 rounded-full">
              <span className="text-cyan-400 font-mono text-sm">TECHNOLOGY.STACK.MODERN</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-cyan-400 font-mono">
              BUILT.WITH.MODERN.TECHNOLOGY
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-mono">
              Cutting-edge technologies powering secure interviews
            </p>
          </div>

          {/* Interactive Carousel */}
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden border border-cyan-400/60 bg-gradient-to-br from-gray-900/30 to-black/50 backdrop-blur-sm p-8 rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out gap-6"
                style={{ transform: `translateX(-${currentTechIndex * 20}%)` }}
              >
                {[...allTechItems, ...allTechItems.slice(0, 5)].map((tech, index) => (
                  <div key={index} className="flex-shrink-0 w-48">
                    <div className="bg-gradient-to-br from-gray-900/40 to-black/60 backdrop-blur-sm border border-gray-800/50 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:bg-gradient-to-br hover:from-cyan-400/15 hover:via-purple-500/15 hover:to-blue-600/15 p-6 transition-all duration-500 group cursor-pointer h-32 flex flex-col items-center justify-center relative overflow-hidden rounded-2xl">
                      <div className="text-3xl text-cyan-400 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-purple-500 group-hover:to-orange-400 group-hover:bg-clip-text mb-3 group-hover:scale-110 transition-all duration-300">
                        {tech.icon}
                      </div>
                      <div className="text-cyan-400 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-purple-500 group-hover:to-orange-400 group-hover:bg-clip-text text-center font-mono text-xs font-bold transition-all duration-300">
                        {tech.name}
                      </div>
                      {/* RGB Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-orange-400/20 animate-pulse rounded-2xl"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentTechIndex(Math.max(0, currentTechIndex - 1))}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-400/60 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-blue-600/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center text-cyan-400 hover:text-white transition-all duration-300 disabled:opacity-50 font-mono rounded-xl"
              disabled={currentTechIndex === 0}
            >
              ←
            </button>
            <button
              onClick={() => setCurrentTechIndex(Math.min(allTechItems.length - 5, currentTechIndex + 1))}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-400/60 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-blue-600/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center text-cyan-400 hover:text-white transition-all duration-300 disabled:opacity-50 font-mono rounded-xl"
              disabled={currentTechIndex >= allTechItems.length - 5}
            >
              →
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(allTechItems.length / 5) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTechIndex(index * 5)}
                  className={`h-3 transition-all duration-300 rounded-full ${
                    Math.floor(currentTechIndex / 5) === index
                      ? "bg-gradient-to-r from-cyan-400 to-orange-400 w-8"
                      : "bg-gray-600 hover:bg-cyan-400/50 w-3"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-24 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block border border-cyan-400/60 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm px-6 py-2 mb-6 rounded-full">
              <span className="text-cyan-400 font-mono text-sm">FREQUENTLY.ASKED.QUESTIONS</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-cyan-400 font-mono">FAQ.DATABASE</h2>
            <p className="text-xl text-gray-300 font-mono">Everything you need to know about Garura</p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "What operating systems does Garura support?",
                answer:
                  "Currently, Garura supports Windows 11 exclusively. Our platform requires deep OS-level integration for maximum security, which is specifically optimized for Windows 11. We're working on expanding support to other platforms in the future.",
              },
              {
                question: "Is Garura compliant with privacy regulations?",
                answer:
                  "Yes, Garura is designed with privacy in mind. We only monitor system-level activities during the interview session and provide full transparency to candidates about what is being monitored. All data is encrypted and handled according to GDPR and other privacy regulations.",
              },
              {
                question: "Can candidates use a web browser instead of the desktop app?",
                answer:
                  "No, candidates must use our secure desktop application. This is essential for our OS-level security features to work properly, including process monitoring and advanced anti-cheating controls that cannot be implemented in a web browser.",
              },
              {
                question: "How does the AI helper work?",
                answer:
                  "Our AI helper helps in curating personalized questions on diverse topics and analyzes candidate responses in real-time, and provides performance scores.",
              },
              {
                question: "What happens if suspicious activity is detected?",
                answer:
                  "Our system immediately alerts the interviewer if any suspicious activity is detected, such as launching prohibited applications, losing focus from the interview window, or attempting to access external resources. The session can be paused or terminated if necessary.",
              },
            ].map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-800/50 bg-gradient-to-r from-gray-900/20 to-black/40 backdrop-blur-sm hover:border-cyan-400/60 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 px-6 py-2 transition-all duration-300 rounded-2xl"
              >
                <AccordionTrigger className="text-left text-cyan-400 hover:text-cyan-300 transition-colors text-lg font-mono py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed pb-4 font-mono text-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="border border-gray-800/50 bg-gradient-to-br from-gray-900/20 to-black/40 backdrop-blur-sm p-6 md:p-12 relative rounded-3xl shadow-2xl hover:border-cyan-400/60 hover:bg-gradient-to-br hover:from-cyan-400/5 hover:to-blue-600/5 transition-all duration-500">
            {/* Section Header */}
            <div className="mb-8 text-center">
              <div className="inline-block border border-cyan-400/60 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 px-4 py-2 mb-6 rounded-lg">
                <span className="text-cyan-400 font-mono text-xs md:text-sm">CONTACT.PROTOCOL.INIT</span>
              </div>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-6 text-cyan-400 font-mono leading-tight break-words">
                READY.TO.SECURE.YOUR.HIRING.PROCESS?
              </h2>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-mono leading-relaxed">
                Contact us to learn more about our secure interview platform. We'd love to hear from you.
              </p>
            </div>

            {/* Contact Form */}
            <form className="space-y-6 max-w-2xl mx-auto">
              <Input
                type="email"
                placeholder="YOUR.EMAIL.ADDRESS"
                className="bg-gradient-to-r from-gray-900/50 to-black/70 backdrop-blur-sm border border-gray-800/50 text-cyan-400 placeholder:text-gray-400 focus:border-cyan-400/80 hover:border-cyan-400/60 hover:bg-gradient-to-r hover:from-cyan-400/5 hover:to-blue-600/5 transition-all duration-300 h-12 font-mono text-sm w-full rounded-xl"
              />
              <Textarea
                placeholder="TELL.US.ABOUT.YOUR.HIRING.NEEDS..."
                rows={6}
                className="bg-gradient-to-r from-gray-900/50 to-black/70 backdrop-blur-sm border border-gray-800/50 text-cyan-400 placeholder:text-gray-400 focus:border-cyan-400/80 hover:border-cyan-400/60 hover:bg-gradient-to-r hover:from-cyan-400/5 hover:to-blue-600/5 transition-all duration-300 resize-none font-mono text-sm w-full rounded-xl"
              />
              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] text-white transition-all duration-300 px-8 md:px-12 py-4 md:py-6 text-base md:text-lg font-mono font-bold rounded-2xl"
                >
                  SEND.MESSAGE
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 relative border-t border-gray-800/50 bg-gradient-to-b from-black/50 to-gray-950/80 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 border-2 border-cyan-400/60 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-blue-600/20 transition-all duration-300">
                  <span className="text-lg font-bold text-cyan-400 font-mono">G</span>
                </div>
                <div className="text-xl font-bold text-cyan-400 font-mono tracking-widest">GARURA</div>
              </div>
              <p className="text-gray-300 text-lg mb-4 font-mono">
                The most secure remote interview platform designed to prevent cheating and ensure fair assessments.
              </p>
              <p className="text-gray-500 font-mono">A.HACK4BENGAL.PROJECT</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-cyan-400 font-mono text-lg mb-4">QUICK.LINKS</h3>
              <div className="space-y-2">
                {["ABOUT", "FEATURES", "DEMO", "FAQS"].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 px-2 py-1 rounded-lg"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-cyan-400 font-mono text-lg mb-4">CONNECT</h3>
              <div className="space-y-3">
                {[
                  { name: "GITHUB", code: "GH" },
                  { name: "LINKEDIN", code: "LI" },
                  { name: "TWITTER", code: "TW" },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href="#"
                    className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors group"
                  >
                    <div className="w-8 h-8 border border-gray-700 group-hover:border-cyan-400 group-hover:bg-gradient-to-br group-hover:from-cyan-400/10 group-hover:to-blue-600/10 flex items-center justify-center transition-all duration-300 rounded-lg">
                      <span className="text-xs font-mono">{social.code}</span>
                    </div>
                    <span className="font-mono text-sm">{social.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0 font-mono text-sm">© 2024 GARURA. ALL RIGHTS RESERVED.</p>
            <div className="flex space-x-6 text-sm text-gray-400 font-mono">
              <Link
                href="#"
                className="hover:text-cyan-400 transition-colors hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 px-2 py-1 rounded-lg"
              >
                PRIVACY.POLICY
              </Link>
              <Link
                href="#"
                className="hover:text-cyan-400 transition-colors hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 px-2 py-1 rounded-lg"
              >
                TERMS.OF.SERVICE
              </Link>
              <Link
                href="#"
                className="hover:text-cyan-400 transition-colors hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 px-2 py-1 rounded-lg"
              >
                SUPPORT
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
