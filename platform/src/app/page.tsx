"use client"
//main landing page with motion enhancements
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView, AnimatePresence, Variants } from "framer-motion"
import { useRef } from "react"

export default function GaruraLanding() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDemo, setActiveDemo] = useState(0)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [currentTechIndex, setCurrentTechIndex] = useState(0)

  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const demoRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" })
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" })
  const demoInView = useInView(demoRef, { once: true, margin: "-100px" })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const securityStats = {
    threatsBlocked: 12847,
    sessionsSecured: 5293,
    uptime: 99.99,
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
    { name: "ELECTRON.JS", icon: "⬡" },
    { name: "SOCKET.IO", icon: "⬢" },
    { name: "PRISMA", icon: "⬡" },
    { name: "POSTGRESQL", icon: "⬢" },
    { name: "STREAM.IO", icon: "⬡" },
    { name: "GOOGLE GEMINI", icon: "⬢" },
    { name: "JUDGE0", icon: "⬡" },
    { name: "VERCEL", icon: "⬢" },
    { name: "RENDER", icon: "⬡" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const specialFeatures = [
    {
      tagline: "SYSTEM.INTEGRITY.CHECK",
      title: "MANDATORY SECURE CLIENT",
      description:
        "Candidates must use our locked-down Electron desktop client running in kiosk mode. Pre-launch scans detect prohibited software like Discord, OBS, TeamViewer, and advanced stealth applications using WDA_EXCLUDEFROMCAPTURE detection.",
      mockup: (
        <motion.div className="relative group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          {/* Terminal Window */}
          <motion.div
            className="bg-gradient-to-br from-gray-950 to-black border border-cyan-400/30 hover:border-cyan-400/60 relative rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Terminal Header */}
            <div className="border-b border-cyan-400/30 p-3 flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50">
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-3 h-3 rounded-full border border-red-400 bg-red-400/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                ></motion.div>
                <motion.div
                  className="w-3 h-3 rounded-full border border-yellow-400 bg-yellow-400/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                ></motion.div>
                <motion.div
                  className="w-3 h-3 rounded-full border border-cyan-400 bg-cyan-400/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
                ></motion.div>
              </div>
              <motion.div
                className="text-cyan-400 text-xs font-mono"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                SECURITY.MONITOR.EXE
              </motion.div>
            </div>

            {/* Terminal Content */}
            <div className="p-4 font-mono text-xs space-y-2">
              <motion.div
                className="text-cyan-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                &gt; INITIALIZING SECURITY PROTOCOLS...
              </motion.div>
              <motion.div
                className="text-cyan-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                &gt; SYSTEM.PROCESSES.SCAN [████████████] 100%
              </motion.div>
              <motion.div
                className="text-cyan-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                &gt; SCREENSHOT.PROTECTION [ACTIVE]
              </motion.div>
              <motion.div
                className="text-red-400 animate-pulse"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                &gt; THREAT.DETECTED: teamviewer.exe [BLOCKED]
              </motion.div>
              <motion.div
                className="text-red-400 animate-pulse"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                &gt; THREAT.DETECTED: anydesk.exe [BLOCKED]
              </motion.div>
              <motion.div
                className="text-yellow-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                &gt; FOCUS.LOST.EVENT [INTERVIEWER.NOTIFIED]
              </motion.div>
              <motion.div
                className="text-cyan-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.7 }}
              >
                &gt; SYSTEM.STATUS: [SECURE]
              </motion.div>
            </div>
          </motion.div>

          {/* Glowing Border Effect */}
          <motion.div
            className="absolute inset-0 border border-cyan-400/50 rounded-xl animate-pulse pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
              boxShadow: ["0 0 0 rgba(6,182,212,0)", "0 0 20px rgba(6,182,212,0.3)", "0 0 0 rgba(6,182,212,0)"],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          ></motion.div>
        </motion.div>
      ),
    },
    {
      tagline: "AI.ASSISTED.INTERVIEW.FLOW",
      title: "SMART QUIZ & CODE EXECUTION",
      description:
        "Leverage Google Gemini API to generate custom quizzes instantly. Our CodeMirror editor with syntax highlighting for Java, C++, Python, and JavaScript executes code securely via Judge0 API for real validation.",
      mockup: (
        <motion.div className="relative group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <motion.div
            className="bg-gradient-to-br from-gray-950 to-black border border-cyan-400/30 hover:border-cyan-400/60 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* AI Interface Header */}
            <div className="border-b border-cyan-400/30 p-3 flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border border-cyan-400/60 rounded-lg flex items-center justify-center">
                  <motion.div
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  ></motion.div>
                </div>
                <div className="text-cyan-400 text-xs font-mono">AI.CONTENT.GENERATION</div>
              </div>
              <motion.div
                className="text-cyan-400 text-xs"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                STATUS: ANALYZING
              </motion.div>
            </div>

            {/* AI Content */}
            <div className="p-4 space-y-3">
              <motion.div
                className="border border-cyan-400/30 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 p-3 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-cyan-400 text-xs font-mono mb-1">SUGGESTION.QUEUE</div>
                <div className="text-white text-xs">"Ask about time complexity optimization"</div>
              </motion.div>
              <motion.div
                className="border border-cyan-400/30 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 p-3 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-cyan-400 text-xs font-mono mb-1">ANALYSIS.RESULT</div>
                <div className="text-white text-xs">Strong problem-solving approach detected</div>
              </motion.div>
              <motion.div
                className="border border-yellow-400/30 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 p-3 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-yellow-400 text-xs font-mono mb-1">ALERT.SYSTEM</div>
                <div className="text-white text-xs">Consider testing edge cases</div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ),
    },
    {
      tagline: "CONTINUOUS.MONITORING.PROTOCOL",
      title: "REAL-TIME THREAT DETECTION",
      description:
        "Active monitoring detects PrintScreen attempts (instant termination), Ctrl key presses (3-strike system), focus loss events, and runs clipboard wiping every 5 seconds throughout the session.",
      mockup: (
        <motion.div className="relative group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <motion.div
            className="bg-gradient-to-br from-gray-950 to-black border border-cyan-400/30 hover:border-cyan-400/60 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Code Editor Header */}
            <div className="border-b border-cyan-400/30 p-3 flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50">
              <div className="text-cyan-400 text-xs font-mono">CODE.EDITOR.COLLABORATIVE</div>
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                ></motion.div>
                <div className="text-cyan-400 text-xs">SYNC.ACTIVE</div>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-4 font-mono text-xs space-y-1">
              <motion.div
                className="text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                // COLLABORATIVE.SESSION.ACTIVE
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <span className="text-cyan-400">function</span> <span className="text-yellow-400">binarySearch</span>
                <span className="text-white">(arr, target) {"{"}</span>
              </motion.div>
              <motion.div
                className="ml-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <span className="text-cyan-400">let</span> <span className="text-blue-400">left</span> ={" "}
                <span className="text-orange-400">0</span>, <span className="text-blue-400">right</span> = arr.length -{" "}
                <span className="text-orange-400">1</span>;
              </motion.div>
              <motion.div
                className="ml-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <span className="text-cyan-400">while</span> (left {"<="} right) {"{"}
              </motion.div>
              <motion.div
                className="ml-8"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                <div>
                  <span className="text-cyan-400">const</span> <span className="text-blue-400">mid</span> =
                </div>
                <div>
                  {"Math.floor((left + right) / "}
                  <span className="text-orange-400">2</span>
                  {");"}
                </div>
              </motion.div>
              <motion.div
                className="ml-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                {"}"}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 2.0 }}
              >
                {"}"}
              </motion.div>
              <motion.div
                className="mt-3 flex items-center text-cyan-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.2 }}
              >
                <motion.div
                  className="w-2 h-2 bg-cyan-400 mr-2 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                ></motion.div>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  CANDIDATE.TYPING...
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ),
    },
  ]

  const demoScreens = [
    {
      title: "SECURITY.DASHBOARD",
      content: (
        <motion.div
          className="bg-gradient-to-br from-gray-950 to-black border border-cyan-400/30 p-6 rounded-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="text-cyan-400 font-mono text-sm">SYSTEM.MONITOR.STATUS</div>
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-3 h-3 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              ></motion.div>
              <div className="text-cyan-400 text-xs font-mono">ACTIVE</div>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-2 gap-4 text-xs font-mono"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="border border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-blue-600/5 p-3 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-cyan-400 mb-2">PROCESS.MONITORING</div>
              <div className="text-white">ENABLED</div>
            </motion.div>
            <motion.div
              className="border border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-blue-600/5 p-3 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-cyan-400 mb-2">SCREENSHOT.PROTECTION</div>
              <div className="text-white">ACTIVE</div>
            </motion.div>
            <motion.div
              className="border border-cyan-400/30 bg-gradient-to-br from-cyan-400/5 to-blue-600/5 p-3 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-cyan-400 mb-2">CLIPBOARD.ACCESS</div>
              <div className="text-white">BLOCKED</div>
            </motion.div>
            <motion.div
              className="border border-red-400/30 bg-gradient-to-br from-red-400/5 to-orange-400/5 p-3 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              animate={{
                borderColor: ["rgba(248,113,113,0.3)", "rgba(248,113,113,0.6)", "rgba(248,113,113,0.3)"],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="text-red-400 mb-2">THREAT.DETECTED</div>
              <motion.div
                className="text-red-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              >
                SUSPICIOUS.PROCESS
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
    },
    {
      title: "CODE.EDITOR.EXECUTABLE",
      content: (
        <motion.div
          className="bg-gradient-to-br from-gray-950 to-black border border-cyan-400/30 p-6 rounded-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-gray-500 mb-3 font-mono text-xs"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            // LIVE.COLLABORATIVE.CODING
          </motion.div>
          <motion.div
            className="font-mono text-sm space-y-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="text-cyan-400">function</span> <span className="text-yellow-400">fibonacci</span>
              <span className="text-white">(n) {"{"}</span>
            </motion.div>
            <motion.div className="ml-4" variants={itemVariants}>
              <span className="text-cyan-400">if</span> (n {"<="} 1) <span className="text-cyan-400">return</span> n;
            </motion.div>
            <motion.div className="ml-4" variants={itemVariants}>
              <span className="text-cyan-400">return</span> fibonacci(n-1) + fibonacci(n-2);
            </motion.div>
            <motion.div variants={itemVariants}>{"}"}</motion.div>
          </motion.div>
          <motion.div
            className="mt-4 flex items-center text-cyan-400 text-xs font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.div
              className="w-2 h-2 bg-cyan-400 mr-2 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              CANDIDATE.TYPING...
            </motion.span>
          </motion.div>
        </motion.div>
      ),
    },
    {
      title: "AI.QUIZ.GENERATION",
      content: (
        <motion.div
          className="bg-gradient-to-br from-gray-950 to-black border border-cyan-400/30 p-6 rounded-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-center mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-8 h-8 border border-cyan-400/60 rounded-lg flex items-center justify-center mr-3">
              <motion.div
                className="w-3 h-3 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              ></motion.div>
            </div>
            <div className="text-cyan-400 font-mono text-sm">AI.INSIGHTS.NEURAL.NET</div>
          </motion.div>

          <motion.div
            className="space-y-3 text-xs font-mono"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="border border-cyan-400/30 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 p-2 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-cyan-400">QUESTIONING.POSITIVE</div>
              <div className="text-white">Strong personalised questioning approach</div>
            </motion.div>
            <motion.div
              className="border border-yellow-400/30 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 p-2 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-yellow-400">ANSWER.QUEUE</div>
              <div className="text-white">Get instant score of your answers</div>
            </motion.div>
            <motion.div
              className="border border-cyan-400/30 bg-gradient-to-r from-cyan-400/5 to-blue-600/5 p-2 rounded-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-cyan-400">RECOMMENDATION</div>
              <div className="text-white">Suggest realtime quiz based on diverse topics</div>
            </motion.div>
          </motion.div>
        </motion.div>
      ),
    },
  ]

  const features = [
    {
      icon: "⬢",
      title: "PRE-LAUNCH SYSTEM SCAN",
      description:
        "Scans running processes and detects WDA_EXCLUDEFROMCAPTURE applications before launch. Requires admin privileges on Windows 11 for deep system access.",
      demo: "PROCESS.MONITORING.ACTIVE",
      size: "large",
    },
    {
      icon: "⬡",
      title: "SESSION LOCKDOWN",
      description:
        "PrintScreen detection with instant termination. 3-strike Ctrl key monitoring. Real-time focus loss alerts. Clipboard wiped every 5 seconds.",
      demo: "SESSION.SECURED",
      size: "medium",
    },
    {
      icon: "⬢",
      title: "EXECUTABLE CODE EDITOR",
      description:
        "CodeMirror editor with Java, C++, Python, JavaScript support. Secure code execution via Judge0 API with real-time output validation.",
      demo: "LIVE.CODING.SESSION",
      size: "medium",
    },
    {
      icon: "⬡",
      title: "AI-POWERED QUIZ GENERATION",
      description:
        "Google Gemini API generates topic-based quizzes instantly. Real-time scoring and performance analysis for comprehensive assessment.",
      demo: "AI.GENERATING.QUESTIONS",
      size: "large",
    },
    {
      icon: "⬢",
      title: "COMPREHENSIVE AUDIT REPORT",
      description:
        "Complete process logs captured every 10 minutes. Final report uploaded to Vercel Blob storage with permanent secure URL access.",
      demo: "GENERATING.REPORT",
      size: "small",
    },
    {
      icon: "⬡",
      title: "MANDATORY DESKTOP CLIENT",
      description:
        "Electron.js application in borderless kiosk mode. Forced camera, microphone, and screen permissions with unmutable audio monitoring.",
      demo: "KIOSK.MODE.ENABLED",
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
      {/* TRON Grid Background with Parallax */}
      <motion.div className="fixed inset-0 opacity-40 pointer-events-none" style={{ y }}>
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
      </motion.div>

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
        <motion.div
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        ></motion.div>
        <motion.div
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        ></motion.div>
        <motion.div
          className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
        ></motion.div>
        <motion.div
          className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
        ></motion.div>
      </div>

      {/* Header */}
      <motion.header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/90 backdrop-blur-xl border-b border-gray-800/50" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-10 h-10 border-2 border-cyan-400/60 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-cyan-400/20 group-hover:to-blue-600/20 group-hover:border-cyan-400 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-lg font-bold text-cyan-400 font-mono">G</span>
            </motion.div>
            <div className="text-xl font-bold text-cyan-400 font-mono tracking-widest">GARURA</div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {["ABOUT", "FEATURES", "DEMO", "FAQS", "CONTACT"].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-cyan-400 transition-all duration-300 px-4 py-2 font-mono text-sm rounded-lg hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 backdrop-blur-sm"
                >
                  <motion.span whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                    {item}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <motion.div
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/auth" passHref>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="bg-gray-900/50 backdrop-blur-sm border border-cyan-400/60 text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 hover:border-cyan-400 font-mono text-sm px-6 rounded-xl transition-all duration-300"
                >
                  LOGIN
                </Button>
              </motion.div>
            </Link>
            <Link href="/auth" passHref>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-cyan-500/90 to-blue-600/90 hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-white font-mono text-sm px-6 font-bold transition-all duration-300 rounded-xl backdrop-blur-sm">
                  GET.STARTED
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 border border-cyan-400/60 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 transition-all duration-300 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-cyan-400 font-mono text-sm">{isMobileMenuOpen ? "CLOSE" : "MENU"}</span>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800/50 rounded-b-2xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-6 space-y-4">
                {["ABOUT", "FEATURES", "DEMO", "FAQS", "CONTACT"].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={`#${item.toLowerCase()}`}
                      className="block text-gray-400 hover:text-cyan-400 transition-colors py-2 px-4 border border-transparent hover:border-cyan-400/30 font-mono rounded-lg"
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  className="flex flex-col space-y-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
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
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 relative" ref={heroRef}>
        <motion.div className="container mx-auto text-center max-w-6xl relative z-10" style={{ opacity }}>
          {/* Status Badge */}
          <motion.div
            className="inline-flex items-center space-x-2 border border-cyan-400/60 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm px-6 py-2 mb-8 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 hover:border-cyan-400 transition-all duration-300 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-2 h-2 bg-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>
            <span className="text-cyan-400 font-mono text-sm">POWERED.BY.AI.AND.OS.LEVEL.SECURITY</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight font-mono"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            THE{" "}
            <motion.span className="text-cyan-400 relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              UNCHEATABLE
              <motion.div
                className="absolute inset-0 border border-cyan-400/50 pointer-events-none rounded-lg"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              ></motion.div>
            </motion.span>
            <br />
            <motion.span className="text-cyan-400 relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              INTERVIEW
              <motion.div
                className="absolute inset-0 border border-cyan-400/50 pointer-events-none rounded-lg"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.02, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              ></motion.div>
            </motion.span>{" "}
            ENVIRONMENT
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-mono"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Garura provides <span className="text-cyan-400">DUAL-CLIENT.ARCHITECTURE</span> with OS-level security for
            candidates and powerful tools for interviewers, ensuring{" "}
            <span className="text-cyan-400">COMPLETE.INTERVIEW.INTEGRITY</span>.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="https://youtu.be/1Vv3z5EYjMM?si=br9oJMKVXt4w5OzM" target="_blank" rel="noopener noreferrer">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] text-white px-10 py-6 text-lg font-mono font-bold transition-all duration-300 rounded-2xl backdrop-blur-sm"
                >
                  WATCH.DEMO
                </Button>
              </motion.div>
            </Link>
            <Link href="/auth" passHref>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-gray-900/50 backdrop-blur-sm border border-cyan-400/60 text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 hover:border-cyan-400 px-10 py-6 text-lg font-mono rounded-2xl transition-all duration-300"
                >
                  GET.STARTED
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Live Security Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            {[
              {
                label: "THREATS.BLOCKED",
                value: securityStats.threatsBlocked,
                status: "LIVE.MONITORING",
                desc: "Advanced OS-level monitoring detects all threats",
              },
              {
                label: "SESSIONS.SECURED",
                value: securityStats.sessionsSecured,
                status: "100%.SUCCESS.RATE",
                desc: "Electron client with kiosk mode security",
              },
              {
                label: "SYSTEM.UPTIME",
                value: securityStats.uptime + "%",
                status: "ALWAYS.AVAILABLE",
                desc: "Windows 11 optimized with admin privileges",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="border border-gray-800/50 bg-gradient-to-br from-gray-900/30 to-black/50 backdrop-blur-sm hover:border-cyan-400/60 hover:bg-gradient-to-br hover:from-cyan-400/10 hover:to-blue-600/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-500 p-6 relative group rounded-2xl"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="text-3xl font-bold text-cyan-400 group-hover:text-orange-400 transition-colors mb-2 font-mono"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-300 font-mono text-sm mb-2">{stat.label}</div>
                <div className="flex items-center mb-2">
                  <motion.div
                    className="w-2 h-2 bg-cyan-400 group-hover:bg-orange-400 transition-colors mr-2 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
                  ></motion.div>
                  <span className="text-xs text-cyan-300 group-hover:text-orange-300 transition-colors font-mono">
                    {stat.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono">{stat.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Special Features Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block border border-cyan-400/60 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm px-6 py-2 mb-6 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-cyan-400 font-mono text-sm">SYSTEM.FEATURES.ADVANCED</span>
            </motion.div>
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6 text-cyan-400 font-mono"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              WHAT.MAKES.US.SPECIAL
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto font-mono"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Revolutionary features that redefine interview security
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <div className="space-y-24">
            {specialFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <motion.div
                  className={`space-y-6 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <motion.div
                    className="inline-block border border-cyan-400/60 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 px-4 py-2 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-cyan-400 font-mono text-sm font-bold">{feature.tagline}</span>
                  </motion.div>
                  <motion.h3
                    className="text-3xl md:text-4xl font-bold text-white leading-tight font-mono"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    className="text-lg text-gray-300 leading-relaxed font-mono"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
                <motion.div
                  className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {feature.mockup}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-24 px-4 relative" ref={demoRef}>
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={demoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block border border-cyan-400/60 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm px-6 py-2 mb-6 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-cyan-400 font-mono text-sm">INTERACTIVE.DEMONSTRATION</span>
            </motion.div>
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6 text-cyan-400 font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={demoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              SEE.GARURA.IN.ACTION
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={demoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Experience our platform's powerful features through interactive demos
            </motion.p>
          </motion.div>

          {/* Demo Navigation */}
          <motion.div
            className="grid md:grid-cols-3 gap-4 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate={demoInView ? "visible" : "hidden"}
          >
            {demoScreens.map((demo, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveDemo(index)}
                className={`p-4 border transition-all duration-300 text-left font-mono rounded-2xl backdrop-blur-sm ${
                  activeDemo === index
                    ? "border-cyan-400/80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20"
                    : "border-gray-800/50 bg-gradient-to-br from-gray-900/30 to-black/50 hover:border-cyan-400/60 hover:bg-gradient-to-br hover:from-cyan-400/10 hover:to-blue-600/10"
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-bold mb-2 text-cyan-400">{demo.title}</h3>
                <div className="text-sm text-gray-400">CLICK.TO.PREVIEW</div>
              </motion.button>
            ))}
          </motion.div>

          {/* Demo Content */}
          <motion.div
            className="border border-cyan-400/60 bg-gradient-to-br from-gray-900/30 to-black/50 backdrop-blur-sm min-h-[400px] relative rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={demoInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="border-b border-cyan-400/30 p-4 flex items-center justify-between bg-gradient-to-r from-gray-900/50 to-gray-800/50">
              <motion.h3
                className="text-xl font-bold text-cyan-400 font-mono"
                key={activeDemo}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {demoScreens[activeDemo].title}
              </motion.h3>
              <div className="flex space-x-2">
                <motion.div
                  className="w-3 h-3 rounded-full border border-red-400 bg-red-400/20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                ></motion.div>
                <motion.div
                  className="w-3 h-3 rounded-full border border-yellow-400 bg-yellow-400/20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                ></motion.div>
                <motion.div
                  className="w-3 h-3 rounded-full border border-cyan-400 bg-cyan-400/20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
                ></motion.div>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDemo}
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {demoScreens[activeDemo].content}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 px-4 relative" ref={featuresRef}>
        <div className="container mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block border border-cyan-400/60 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm px-6 py-2 mb-6 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-cyan-400 font-mono text-sm">TRUST.VERIFICATION.PROTOCOL</span>
            </motion.div>
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6 text-cyan-400 font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              WHY.YOU.CAN.TRUST.GARURA
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto font-mono"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Advanced OS-level security features that make cheating impossible
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={getBentoGridClass(feature.size)}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <Card className="bg-gradient-to-br from-blue-900/80 to-cyan-900/60 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-500/90 hover:to-blue-600/90 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-500 group overflow-hidden relative rounded-2xl h-full">
                  <CardContent className="p-6 relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <motion.div
                        className="text-4xl mb-6 text-cyan-300 group-hover:scale-110 group-hover:text-white transition-all duration-300"
                        animate={{
                          rotate: hoveredFeature === index ? 360 : 0,
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold mb-4 text-white group-hover:text-black font-mono">
                        {feature.title}
                      </h3>
                      <p className="text-blue-100 group-hover:text-gray-800 leading-relaxed mb-4 font-mono text-sm">
                        {feature.description}
                      </p>
                    </div>

                    <AnimatePresence>
                      {hoveredFeature === index && (
                        <motion.div
                          className="border border-white/30 bg-gradient-to-r from-white/20 to-gray-100/20 p-3 rounded-lg"
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center space-x-2">
                            <motion.div
                              className="w-2 h-2 bg-cyan-400 rounded-full"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                            ></motion.div>
                            <span className="text-black text-xs font-mono font-bold">{feature.demo}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Carousel */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block border border-cyan-400/60 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm px-6 py-2 mb-6 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-cyan-400 font-mono text-sm">TECHNOLOGY.STACK.MODERN</span>
            </motion.div>
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6 text-cyan-400 font-mono"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              BUILT.WITH.MODERN.TECHNOLOGY
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto font-mono"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Cutting-edge technologies powering secure interviews
            </motion.p>
          </motion.div>

          {/* Interactive Carousel */}
          <motion.div
            className="relative max-w-6xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="overflow-hidden border border-cyan-400/60 bg-gradient-to-br from-gray-900/30 to-black/50 backdrop-blur-sm p-8 rounded-2xl">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out gap-6"
                style={{ transform: `translateX(-${currentTechIndex * 20}%)` }}
                animate={{ x: -currentTechIndex * 20 + "%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {[...allTechItems, ...allTechItems.slice(0, 5)].map((tech, index) => (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 w-48"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.div
                      className="bg-gradient-to-br from-gray-900/40 to-black/60 backdrop-blur-sm border border-gray-800/50 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:bg-gradient-to-br hover:from-cyan-400/15 hover:via-purple-500/15 hover:to-blue-600/15 p-6 transition-all duration-500 group cursor-pointer h-32 flex flex-col items-center justify-center relative overflow-hidden rounded-2xl"
                      whileHover={{
                        scale: 1.05,
                        y: -5,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="text-3xl text-cyan-400 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-purple-500 group-hover:to-orange-400 group-hover:bg-clip-text mb-3 group-hover:scale-110 transition-all duration-300"
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                          delay: index * 0.5,
                        }}
                      >
                        {tech.icon}
                      </motion.div>
                      <div className="text-cyan-400 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-purple-500 group-hover:to-orange-400 group-hover:bg-clip-text text-center font-mono text-xs font-bold transition-all duration-300">
                        {tech.name}
                      </div>
                      {/* RGB Glow Effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        animate={{
                          background: [
                            "linear-gradient(45deg, rgba(6,182,212,0.1), rgba(168,85,247,0.1), rgba(251,146,60,0.1))",
                            "linear-gradient(90deg, rgba(168,85,247,0.1), rgba(251,146,60,0.1), rgba(6,182,212,0.1))",
                            "linear-gradient(135deg, rgba(251,146,60,0.1), rgba(6,182,212,0.1), rgba(168,85,247,0.1))",
                          ],
                        }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-orange-400/20 animate-pulse rounded-2xl"></div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            <motion.button
              onClick={() => setCurrentTechIndex(Math.max(0, currentTechIndex - 1))}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-400/60 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-blue-600/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center text-cyan-400 hover:text-white transition-all duration-300 disabled:opacity-50 font-mono rounded-xl"
              disabled={currentTechIndex === 0}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              ←
            </motion.button>
            <motion.button
              onClick={() => setCurrentTechIndex(Math.min(allTechItems.length - 5, currentTechIndex + 1))}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-cyan-400/60 hover:border-cyan-400 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-blue-600/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center text-cyan-400 hover:text-white transition-all duration-300 disabled:opacity-50 font-mono rounded-xl"
              disabled={currentTechIndex >= allTechItems.length - 5}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(allTechItems.length / 5) }).map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentTechIndex(index * 5)}
                  className={`h-3 transition-all duration-300 rounded-full ${
                    Math.floor(currentTechIndex / 5) === index
                      ? "bg-gradient-to-r from-cyan-400 to-orange-400 w-8"
                      : "bg-gray-600 hover:bg-cyan-400/50 w-3"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-24 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block border border-cyan-400/60 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm px-6 py-2 mb-6 rounded-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-cyan-400 font-mono text-sm">FREQUENTLY.ASKED.QUESTIONS</span>
            </motion.div>
            <motion.h2
              className="text-3xl md:text-5xl font-bold mb-6 text-cyan-400 font-mono"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              FAQ.DATABASE
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 font-mono"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Everything you need to know about Garura
            </motion.p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "What operating systems does Garura support?",
                  answer:
                    "Currently, Garura supports Windows 11 exclusively. Our platform requires deep OS-level integration including admin privileges, PowerShell scripting for WDA_EXCLUDEFROMCAPTURE detection, and system process monitoring that is optimized specifically for Windows 11.",
                },
                {
                  question: "Is Garura compliant with privacy regulations?",
                  answer:
                    "Yes, Garura is fully transparent about monitoring. We track system processes every 10 minutes, monitor for prohibited applications, detect screenshot attempts, and track focus events. All data is encrypted and candidates are informed of all monitoring activities.",
                },
                {
                  question: "Can candidates use a web browser instead of the desktop app?",
                  answer:
                    "No, candidates must use our secure Electron desktop application. This is essential for our OS-level security features including process monitoring, screenshot detection, clipboard wiping, and kiosk mode enforcement that cannot be implemented in web browsers.",
                },
                {
                  question: "How does the AI helper work?",
                  answer:
                    "Our AI system uses Google Gemini API to generate personalized quizzes based on selected topics and difficulty levels. It provides instant scoring, real-time performance analysis, and adaptive questioning based on candidate responses.",
                },
                {
                  question: "What happens if suspicious activity is detected?",
                  answer:
                    "Our system provides real-time alerts for: prohibited application launches, PrintScreen attempts (instant termination), focus loss events, suspicious Ctrl key usage (3-strike system), and any attempts to access external resources. Sessions can be immediately terminated when threats are detected.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border border-gray-800/50 bg-gradient-to-r from-gray-900/20 to-black/40 backdrop-blur-sm hover:border-cyan-400/60 hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 px-6 py-2 transition-all duration-300 rounded-2xl"
                  >
                    <AccordionTrigger className="text-left text-cyan-400 hover:text-cyan-300 transition-colors text-lg font-mono py-4">
                      <motion.span whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                        {faq.question}
                      </motion.span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 leading-relaxed pb-4 font-mono text-sm">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        {faq.answer}
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="border border-gray-800/50 bg-gradient-to-br from-gray-900/20 to-black/40 backdrop-blur-sm p-6 md:p-12 relative rounded-3xl shadow-2xl hover:border-cyan-400/60 hover:bg-gradient-to-br hover:from-cyan-400/5 hover:to-blue-600/5 transition-all duration-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Section Header */}
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="inline-block border border-cyan-400/60 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 px-4 py-2 mb-6 rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-cyan-400 font-mono text-xs md:text-sm">CONTACT.PROTOCOL.INIT</span>
              </motion.div>
              <motion.h2
                className="text-xl md:text-3xl lg:text-4xl font-bold mb-6 text-cyan-400 font-mono leading-tight break-words"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                READY.TO.SECURE.YOUR.HIRING.PROCESS?
              </motion.h2>
              <motion.p
                className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto font-mono leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Contact us to learn more about our secure interview platform. We'd love to hear from you.
              </motion.p>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              className="space-y-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Input
                  type="email"
                  placeholder="YOUR.EMAIL.ADDRESS"
                  className="bg-gradient-to-r from-gray-900/50 to-black/70 backdrop-blur-sm border border-gray-800/50 text-cyan-400 placeholder:text-gray-400 focus:border-cyan-400/80 hover:border-cyan-400/60 hover:bg-gradient-to-r hover:from-cyan-400/5 hover:to-blue-600/5 transition-all duration-300 h-12 font-mono text-sm w-full rounded-xl"
                />
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Textarea
                  placeholder="TELL.US.ABOUT.YOUR.HIRING.NEEDS..."
                  rows={6}
                  className="bg-gradient-to-r from-gray-900/50 to-black/70 backdrop-blur-sm border border-gray-800/50 text-cyan-400 placeholder:text-gray-400 focus:border-cyan-400/80 hover:border-cyan-400/60 hover:bg-gradient-to-r hover:from-cyan-400/5 hover:to-blue-600/5 transition-all duration-300 resize-none font-mono text-sm w-full rounded-xl"
                />
              </motion.div>
              <div className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] text-white transition-all duration-300 px-8 md:px-12 py-4 md:py-6 text-base md:text-lg font-mono font-bold rounded-2xl"
                  >
                    SEND.MESSAGE
                  </Button>
                </motion.div>
              </div>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="py-16 px-4 relative border-t border-gray-800/50 bg-gradient-to-b from-black/50 to-gray-950/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto">
          <motion.div
            className="grid md:grid-cols-4 gap-8 mb-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Company Info */}
            <motion.div className="md:col-span-2" variants={itemVariants}>
              <motion.div
                className="flex items-center space-x-3 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-10 h-10 border-2 border-cyan-400/60 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-blue-600/20 transition-all duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-lg font-bold text-cyan-400 font-mono">G</span>
                </motion.div>
                <div className="text-xl font-bold text-cyan-400 font-mono tracking-widest">GARURA</div>
              </motion.div>
              <p className="text-gray-300 text-lg mb-4 font-mono">
                The most secure remote interview platform with dual-client architecture, OS-level monitoring, and
                AI-powered assessment tools for fair technical hiring.
              </p>
              <p className="text-gray-500 font-mono">A.HACK4BENGAL.PROJECT</p>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-cyan-400 font-mono text-lg mb-4">QUICK.LINKS</h3>
              <div className="space-y-2">
                {["ABOUT", "FEATURES", "DEMO", "FAQS"].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={`#${item.toLowerCase()}`}
                      className="block text-gray-300 hover:text-cyan-400 transition-colors font-mono text-sm hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 px-2 py-1 rounded-lg"
                    >
                      <motion.span whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                        {item}
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Connect */}
            <motion.div variants={itemVariants}>
              <h3 className="text-cyan-400 font-mono text-lg mb-4">CONNECT</h3>
              <div className="space-y-3">
                {[
                  { name: "GITHUB", code: "GH", url: "https://github.com/TheCurryGuy/Garura" },
                  { name: "LINKEDIN", code: "LI", url: "https://www.linkedin.com/in/thecurryguy" },
                  { name: "TWITTER", code: "TW", url: "#" },
                ].map((social, index) => (
                  <motion.div
                    key={social.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={social.url}
                      target={social.url !== "#" ? "_blank" : "_self"}
                      rel={social.url !== "#" ? "noopener noreferrer" : ""}
                      className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors group"
                    >
                      <motion.div
                        className="w-8 h-8 border border-gray-700 group-hover:border-cyan-400 group-hover:bg-gradient-to-br group-hover:from-cyan-400/10 group-hover:to-blue-600/10 flex items-center justify-center transition-all duration-300 rounded-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-xs font-mono">{social.code}</span>
                      </motion.div>
                      <motion.span className="font-mono text-sm" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                        {social.name}
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-gray-400 mb-4 md:mb-0 font-mono text-sm">© 2024 GARURA. ALL RIGHTS RESERVED.</p>
            <div className="flex space-x-6 text-sm text-gray-400 font-mono">
              {["PRIVACY.POLICY", "TERMS.OF.SERVICE", "SUPPORT"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href="#"
                    className="hover:text-cyan-400 transition-colors hover:bg-gradient-to-r hover:from-cyan-400/10 hover:to-blue-600/10 px-2 py-1 rounded-lg"
                  >
                    <motion.span whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                      {item}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}
