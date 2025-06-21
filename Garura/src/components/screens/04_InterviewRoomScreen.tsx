"use client"

import type React from "react"

import { useAppStore } from "../../store/useAppStore"
import { useEffect, useState, useMemo } from "react"
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  type Call,
  useCall,
  useCallStateHooks,
  ParticipantView,
  PaginatedGridLayout,
  SpeakerLayout,
} from "@stream-io/video-react-sdk"
import {
  Loader2,
  XCircle,
  AlertTriangle,
  Send,
  Users,
  Video,
  VideoOff,
  Monitor,
  Grid3X3,
  Layout,
  Settings,
  Volume2,
  MicOff,
} from "lucide-react"
import { nanoid } from "nanoid"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

// Import all the UI components for the right-hand pane
import CodeQuestionViewer from "../interview_ui/CodeQuestionViewer"
import CodeEditor from "../interview_ui/CodeEditor"
import QuizInterface from "../interview_ui/QuizInterface"
import Whiteboard from "../interview_ui/Whiteboard"
import IntervieweeChat from "../interview_ui/IntervieweeChat"
import type { Message } from "../interview_ui/IntervieweeChat"

// Utility function to combine class names
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(" ")
}

type LayoutType = "grid" | "speaker" | "auto"

// Simple Dropdown Component - FIXED VERSION
const Dropdown = ({
  trigger,
  children,
  isOpen,
  onToggle,
}: {
  trigger: React.ReactNode
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}) => {
  return (
    <div className="relative">
      <div
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800/95 backdrop-blur-xl border border-slate-700 text-white rounded-xl shadow-2xl min-w-[200px] z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  )
}

const DropdownItem = ({
  onClick,
  children,
  className = "",
}: {
  onClick: () => void
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`px-3 py-2 hover:bg-slate-700/50 cursor-pointer transition-colors ${className}`}
    >
      {children}
    </div>
  )
}

// A small, dedicated helper component to manage the call state.
// This enforces the "microphone always on" rule robustly.
const CallManager = () => {
  const call = useCall()
  useEffect(() => {
    if (call) {
      const enableMic = () => {
        // Check if microphone is disabled
        if (call.microphone.state.status === "disabled") {
          call.microphone.enable()
        }
      }
      enableMic() // Enable on mount.
      const interval = setInterval(enableMic, 3000) // Re-check every 3 seconds to enforce.
      return () => clearInterval(interval) // Cleanup on unmount.
    }
  }, [call])
  return null // This component renders no UI itself.
}

// Video Meeting Component with all the advanced features
const IntervieweeVideoMeeting = () => {
  const call = useCall()
  const { useCameraState, useParticipants } = useCallStateHooks()
  const { isMute: isCameraMuted } = useCameraState()
  const participants = useParticipants()

  const [layoutType, setLayoutType] = useState<LayoutType>("auto")
  const [showParticipants, setShowParticipants] = useState(false)
  const [showLayoutMenu, setShowLayoutMenu] = useState(false)

  // Check if anyone is screen sharing
  const screenSharingParticipant = participants.find((p) => p.screenShareStream)
  const isScreenSharing = !!screenSharingParticipant

  // Close dropdowns when clicking outside - FIXED VERSION
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Only close if clicking outside the dropdown areas
      const target = e.target as HTMLElement
      if (!target.closest(".dropdown-container")) {
        setShowParticipants(false)
        setShowLayoutMenu(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  // Memoize layout to prevent re-renders
  const videoLayout = useMemo(() => {
    if (!participants.length) return null

    // GRID VIEW - Custom grid that includes screen share
    if (layoutType === "grid") {
      if (isScreenSharing && screenSharingParticipant) {
        // Create a custom grid with screen share + participants
        const allItems = [
          { type: "screen", participant: screenSharingParticipant },
          ...participants.map((p) => ({ type: "video", participant: p })),
        ]

        const gridCols = allItems.length <= 2 ? "grid-cols-2" : allItems.length <= 4 ? "grid-cols-2" : "grid-cols-3"

        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className={`w-full max-w-6xl grid ${gridCols} gap-4 max-h-full`}>
              {allItems.map((item, index) => (
                <div
                  key={`${item.type}-${item.participant.sessionId}-${index}`}
                  className="aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700 relative group hover:border-slate-600 transition-colors"
                >
                  <ParticipantView
                    participant={item.participant}
                    trackType={item.type === "screen" ? "screenShareTrack" : "videoTrack"}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1 text-white text-xs font-medium flex items-center gap-1">
                    {item.type === "screen" ? (
                      <>
                        <Monitor className="w-3 h-3 text-blue-400" />
                        {item.participant.name || "Someone"}'s shared screen
                      </>
                    ) : (
                      <>
                        {item.participant.audioStream ? (
                          <Volume2 className="w-3 h-3 text-green-400" />
                        ) : (
                          <MicOff className="w-3 h-3 text-red-400" />
                        )}
                        {item.participant.name || "Unknown"}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      } else {
        // Regular grid without screen sharing
        return (
          <div className="w-full h-full p-4">
            <PaginatedGridLayout />
          </div>
        )
      }
    }

    // SPEAKER VIEW - Screen share as main speaker, participants in sidebar
    if (layoutType === "speaker") {
      if (isScreenSharing && screenSharingParticipant) {
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-full max-w-7xl flex gap-4 items-start">
              {/* Main screen share area - fixed aspect ratio */}
              <div className="flex-1 max-w-4xl">
                <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700 relative">
                  <ParticipantView participant={screenSharingParticipant} trackType="screenShareTrack" />
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-md px-3 py-1.5 text-white text-sm font-medium flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-400" />
                    {screenSharingParticipant.name || "Someone"}'s shared screen
                  </div>
                </div>
              </div>

              {/* Participants sidebar - fixed width */}
              <div className="w-72 flex flex-col gap-3">
                {participants.map((participant) => (
                  <div
                    key={participant.sessionId}
                    className="aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700 relative group hover:border-slate-600 transition-colors"
                  >
                    <ParticipantView participant={participant} trackType="videoTrack" />
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1 text-white text-xs font-medium flex items-center gap-1">
                      {participant.audioStream ? (
                        <Volume2 className="w-3 h-3 text-green-400" />
                      ) : (
                        <MicOff className="w-3 h-3 text-red-400" />
                      )}
                      {participant.name || "Unknown"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      } else {
        // Regular speaker layout without screen sharing
        return (
          <div className="w-full h-full">
            <SpeakerLayout participantsBarPosition="right" />
          </div>
        )
      }
    }

    // AUTO LAYOUT - Compact screen sharing layout
    if (layoutType === "auto") {
      if (isScreenSharing && screenSharingParticipant) {
        return (
          <div className="w-full h-full flex items-center justify-center p-3">
            <div className="w-full max-w-7xl h-full max-h-[500px] flex gap-3">
              {/* Main screen share area - constrained aspect ratio */}
              <div className="flex-1 aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700 relative">
                <ParticipantView participant={screenSharingParticipant} trackType="screenShareTrack" />
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1 text-white text-xs font-medium flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-blue-400" />
                  {screenSharingParticipant.name || "Someone"}'s shared screen
                </div>
              </div>

              {/* Compact participants sidebar - constrained */}
              <div className="w-56 flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                {participants.map((participant) => (
                  <div
                    key={participant.sessionId}
                    className="aspect-video bg-slate-800 rounded-md overflow-hidden border border-slate-700 relative group hover:border-slate-600 transition-colors flex-shrink-0"
                  >
                    <ParticipantView participant={participant} trackType="videoTrack" />
                    <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 text-white text-xs font-medium flex items-center gap-1">
                      {participant.audioStream ? (
                        <Volume2 className="w-2.5 h-2.5 text-green-400" />
                      ) : (
                        <MicOff className="w-2.5 h-2.5 text-red-400" />
                      )}
                      {participant.name?.split(" ")[0] || "User"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }

      // Regular auto layouts when no screen sharing
      if (participants.length === 1) {
        return (
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="w-full max-w-4xl aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700 relative group hover:border-slate-600 transition-colors">
              <ParticipantView participant={participants[0]} />
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-md px-3 py-2 text-white text-sm font-medium flex items-center gap-2">
                {participants[0].audioStream ? (
                  <Volume2 className="w-4 h-4 text-green-400" />
                ) : (
                  <MicOff className="w-4 h-4 text-red-400" />
                )}
                {participants[0].name || "Unknown User"}
              </div>
            </div>
          </div>
        )
      }

      if (participants.length === 2) {
        return (
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid grid-cols-2 gap-4">
              {participants.map((participant) => (
                <div
                  key={participant.sessionId}
                  className="aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700 relative group hover:border-slate-600 transition-colors"
                >
                  <ParticipantView participant={participant} />
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-md px-3 py-1.5 text-white text-sm font-medium flex items-center gap-2">
                    {participant.audioStream ? (
                      <Volume2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <MicOff className="w-4 h-4 text-red-400" />
                    )}
                    {participant.name || "Unknown User"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      // For more participants in auto mode, use paginated grid
      return (
        <div className="w-full h-full p-4">
          <PaginatedGridLayout />
        </div>
      )
    }

    return null
  }, [participants, isScreenSharing, screenSharingParticipant, layoutType])

  const toggleCamera = () => call?.camera.toggle()
  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await call?.screenShare.disable()
      } else {
        await call?.screenShare.enable()
      }
    } catch (error) {
      console.error("Screen share toggle failed:", error)
      toast.error("Failed to toggle screen sharing")
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 relative overflow-hidden">
      {/* Main Video Area */}
      <div className="flex-1 relative">
        {videoLayout}

        {/* Floating Participant Count */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
          {participants.length} participant{participants.length !== 1 ? "s" : ""}
        </div>

        {/* Layout Type Indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-medium">
          {layoutType === "grid" && "Grid View"}
          {layoutType === "speaker" && "Speaker View"}
          {layoutType === "auto" && "Auto Layout"}
          {isScreenSharing && " • Screen Sharing"}
        </div>
      </div>

      {/* Bottom Control Bar - NO MIC BUTTON */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 bg-slate-800/95 backdrop-blur-xl rounded-2xl px-6 py-4 border border-slate-700/50 shadow-2xl">
          {/* Camera */}
          <button
            onClick={toggleCamera}
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:scale-105",
              isCameraMuted
                ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                : "bg-slate-700 hover:bg-slate-600 text-white",
            )}
            title={isCameraMuted ? "Turn on camera" : "Turn off camera"}
          >
            {isCameraMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 hover:scale-105",
              isScreenSharing
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                : "bg-slate-700 hover:bg-slate-600 text-white",
            )}
            title={isScreenSharing ? "Stop sharing" : "Share screen"}
          >
            <Monitor className="w-5 h-5" />
          </button>

          {/* Separator */}
          <div className="w-px h-8 bg-slate-600 mx-2" />

          {/* Participants */}
          <div className="dropdown-container">
            <Dropdown
              isOpen={showParticipants}
              onToggle={() => {
                setShowParticipants(!showParticipants)
                setShowLayoutMenu(false) // Close other dropdown
              }}
              trigger={
                <button className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200 relative hover:scale-105">
                  <Users className="w-5 h-5" />
                  {participants.length > 1 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {participants.length}
                    </span>
                  )}
                </button>
              }
            >
              <div className="p-4 w-80 max-h-96">
                <h3 className="text-sm font-semibold mb-3 text-slate-300">Participants ({participants.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {participants.map((participant) => (
                    <div
                      key={participant.sessionId}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                        {participant.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{participant.name || "Unknown User"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {participant.audioStream ? (
                            <Volume2 className="w-3 h-3 text-green-400" />
                          ) : (
                            <MicOff className="w-3 h-3 text-red-400" />
                          )}
                          {participant.videoStream ? (
                            <Video className="w-3 h-3 text-green-400" />
                          ) : (
                            <VideoOff className="w-3 h-3 text-red-400" />
                          )}
                          {participant.screenShareStream && <Monitor className="w-3 h-3 text-blue-400" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Dropdown>
          </div>

          {/* Layout Settings */}
          <div className="dropdown-container">
            <Dropdown
              isOpen={showLayoutMenu}
              onToggle={() => {
                setShowLayoutMenu(!showLayoutMenu)
                setShowParticipants(false) // Close other dropdown
              }}
              trigger={
                <button className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200 hover:scale-105">
                  <Settings className="w-5 h-5" />
                </button>
              }
            >
              <div className="p-2">
                <div className="text-xs text-slate-400 px-2 py-1 mb-1">Layout Options</div>
                <DropdownItem
                  onClick={() => {
                    setLayoutType("grid")
                    setShowLayoutMenu(false)
                  }}
                  className={cn(
                    "rounded-lg mx-1 flex items-center",
                    layoutType === "grid" && "bg-blue-600/20 text-blue-300",
                  )}
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid View
                  {layoutType === "grid" && <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full" />}
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setLayoutType("speaker")
                    setShowLayoutMenu(false)
                  }}
                  className={cn(
                    "rounded-lg mx-1 flex items-center",
                    layoutType === "speaker" && "bg-blue-600/20 text-blue-300",
                  )}
                >
                  <Layout className="w-4 h-4 mr-2" />
                  Speaker View
                  {layoutType === "speaker" && <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full" />}
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setLayoutType("auto")
                    setShowLayoutMenu(false)
                  }}
                  className={cn(
                    "rounded-lg mx-1 flex items-center",
                    layoutType === "auto" && "bg-blue-600/20 text-blue-300",
                  )}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Auto Layout
                  {layoutType === "auto" && <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full" />}
                </DropdownItem>
                <div className="text-xs text-slate-500 px-2 py-1 mt-1">
                  {isScreenSharing ? "Screen sharing active" : "All layouts work with screen sharing"}
                </div>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
        <div className="flex items-center gap-2 text-white text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Connected
        </div>
      </div>
    </div>
  )
}

// This is the main screen for the entire live interview experience.
export default function InterviewRoomScreen() {
  const { roomCode, sessionConfig } = useAppStore()

  // State for the connection and video client
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [call, setCall] = useState<Call | null>(null)

  // A single, unified state for managing the connection lifecycle
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "error" | "success">("loading")
  const [errorMessage, setErrorMessage] = useState("")

  // State for the dynamic UI content driven by the interviewer
  const [codingQuestion, setCodingQuestion] = useState<string | null>(null)
  const [quizData, setQuizData] = useState<any | null>(null) // 'any' is acceptable here as quiz shape is dynamic
  const [currentCode, setCurrentCode] = useState<string>("") // Holds the live code from the editor
  const [ctrlWarning, setCtrlWarning] = useState<string | null>(null)

  const [chatLog, setChatLog] = useState<Message[]>([])

  // This single, consolidated useEffect handles the entire setup and event listening.
  useEffect(() => {
    if (!roomCode) {
      setErrorMessage("Critical error: Room code is missing.")
      setConnectionStatus("error")
      return
    }

    const userId = `interviewee-${nanoid(8)}`
    const apiKey = import.meta.env.VITE_STREAM_API_KEY
    if (!apiKey) {
      setErrorMessage("Configuration error: Stream API key is missing from .env file.")
      setConnectionStatus("error")
      return
    }

    let videoClient: StreamVideoClient

    const setupConnectionAndListeners = async () => {
      try {
        // 1. Fetch the token from our secure main process
        const { token } = await window.electronAPI.getStreamToken(userId, roomCode)

        // 2. Create and connect the video client
        videoClient = new StreamVideoClient({ apiKey, user: { id: userId, name: "Interviewee" }, token })
        const videoCall = videoClient.call("default", roomCode)
        await videoCall.join()

        // 3. Set the state to render the UI
        setClient(videoClient)
        setCall(videoCall)
        setConnectionStatus("success")
      } catch (err: any) {
        console.error("Connection setup failed:", err)
        setErrorMessage(err.message || "An unknown error occurred while connecting to the interview.")
        setConnectionStatus("error")
      }
    }

    setupConnectionAndListeners()

    // --- All event listeners are set up once and cleaned up on unmount ---
    const cleanupEnd = window.electronAPI.onInterviewEnded(() => {
      setErrorMessage("This interview has been ended by the host. The application will close shortly.")
      setConnectionStatus("error")
    })
    const cleanupQuestion = window.electronAPI.onNewCodingQuestion((markdown) => {
      setQuizData(null) // Ensure only one panel shows at a time
      setCodingQuestion(markdown)
      toast.info("A new coding question has been posted.")
    })
    const cleanupQuiz = window.electronAPI.onQuizStarted((data) => {
      setCodingQuestion(null) // Ensure only one panel shows
      setQuizData(data)
      toast.info("The quiz has started!")
    })
    const cleanupCtrl = window.electronAPI.onCtrlKeyWarning((count) => {
      setCtrlWarning(`Warning: System key pressed (${count}/3). Please avoid OS shortcuts.`)
    })

    // This new listener handles incoming chat messages
    const cleanupChat = (window.electronAPI as any).onReceiveChatMessage((message: Omit<Message, "timestamp">) => {
      setChatLog((prev) => [...prev, { ...message, timestamp: Date.now() }])
    })

    return () => {
      videoClient?.disconnectUser()
      cleanupEnd()
      cleanupQuestion()
      cleanupQuiz()
      cleanupCtrl()
      cleanupChat()
    }
  }, [roomCode]) // This effect runs only once when the roomCode is available.

  // --- Action Handlers ---
  const handleSendMessage = (text: string) => {
    if (roomCode) {
      // Don't add our own message locally - let it come back from server to avoid duplicates
      // const ourMessage: Message = { sender: "interviewee", text, timestamp: Date.now() }
      // setChatLog((prev) => [...prev, ourMessage])

      // Send it to the main process to be broadcast to the server
      window.electronAPI.sendChatMessage({ roomCode, text })
    }
  }
  const handleCodeSubmit = () => {
    if (roomCode) {
      window.electronAPI.submitCode({ roomCode, code: currentCode })
      toast.success("Your code has been submitted to the interviewer.")
    }
  }

  // --- RENDER LOGIC ---

  if (connectionStatus === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-gradient-to-br from-slate-900 to-slate-950">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
        <h1 className="text-2xl font-bold text-white">Connecting to Interview...</h1>
        <p className="text-slate-400">This may take a few moments</p>
      </div>
    )
  }

  if (connectionStatus === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 text-center bg-gradient-to-br from-slate-900 to-slate-950 p-6">
        <div className="bg-slate-800/50 rounded-2xl p-8 max-w-md border border-slate-700 shadow-xl">
          <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-3">Session Disconnected</h1>
          <p className="text-slate-400 mb-6">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl font-medium text-white transition-all shadow-lg"
          >
            Try Reconnecting
          </button>
        </div>
      </div>
    )
  }

  return (
    // We are certain client and call exist here because status is 'success'
    <StreamVideo client={client!}>
      <StreamCall call={call!}>
        <CallManager />
        <div className="h-screen w-screen flex bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden">
          <AnimatePresence>
            {ctrlWarning && (
              <motion.div
                key={ctrlWarning}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-500 text-black font-semibold p-3 rounded-lg flex items-center gap-2 shadow-lg"
              >
                <AlertTriangle size={20} />
                {ctrlWarning}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Area (Video + Chat) */}
          <div className="flex-grow h-full flex flex-col p-4 gap-4">
            <div className="flex-grow relative min-h-0 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
              <IntervieweeVideoMeeting />
            </div>
            <div className="h-[25%] min-h-[160px]">
              <IntervieweeChat messages={chatLog} onSendMessage={handleSendMessage} />
            </div>
          </div>

          {/* Right Pane: Dynamic Content */}
          <div className="w-[40%] min-w-[450px] max-w-[600px] h-full bg-slate-800/30 border-l border-slate-700/50 p-4 flex flex-col gap-4 backdrop-blur-sm">
            {codingQuestion && sessionConfig.hasCodingChallenge && (
              <div className="flex-1 flex flex-col gap-4 min-h-0">
                <div className="h-[40%] rounded-xl overflow-hidden">
                  <CodeQuestionViewer markdown={codingQuestion} />
                </div>
                <div className="h-[55%] rounded-xl overflow-hidden">
                  <CodeEditor onChange={setCurrentCode} />
                </div>
                <button
                  onClick={handleCodeSubmit}
                  className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-xl font-semibold text-base transition-all transform hover:-translate-y-0.5 shadow-lg"
                >
                  <Send size={18} className="mr-2" /> Submit Code
                </button>
              </div>
            )}

            {quizData && sessionConfig.hasQuiz && (
              <div className="flex-1 min-h-0 rounded-xl overflow-hidden">
                <QuizInterface quizData={quizData} />
              </div>
            )}

            {sessionConfig.hasWhiteboard && !codingQuestion && !quizData && (
              <div className="flex-1 min-h-0 rounded-xl overflow-hidden">
                <Whiteboard />
              </div>
            )}

            {!codingQuestion && !quizData && !sessionConfig.hasWhiteboard && (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/30 p-6">
                <div className="bg-slate-800/50 rounded-full p-4 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Awaiting Instructions</h3>
                <p className="text-center max-w-xs">The interviewer will provide instructions shortly</p>
              </div>
            )}
          </div>
        </div>
      </StreamCall>
    </StreamVideo>
  )
}
