"use client"

import { useAuthStore } from "@/app/store/useAuthStore"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  Video,
  FileText,
  Calendar,
  Clock,
  LogOut,
  Plus,
  Download,
  ChevronRight,
  Loader2,
  Copy,
  Activity,
  Bird,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import CreateInterviewModal from "@/components/dashboard/CreateInterviewModal"

interface InterviewSession {
  id: string
  roomCode: string
  status: "PENDING" | "ACTIVE" | "ENDED"
  createdAt: string
  endedAt: string | null
  reportFilePath: string | null
}

const apiUrl = "/api/interview/history"

export default function DashboardPage() {
  const { user, token, logout, isHydrated } = useAuthStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000 * 60)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isHydrated && !token) {
      router.replace("/")
    }
  }, [isHydrated, token, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const [meetings, setMeetings] = useState<InterviewSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingReportId, setDownloadingReportId] = useState<string | null>(null)
  const [copiedMeetingId, setCopiedMeetingId] = useState<string | null>(null)

  const handleDownloadReport = async (reportUrl: string, meetingId: string) => {
    if (!reportUrl || downloadingReportId) return
    setDownloadingReportId(meetingId)
    try {
      const res = await axios.get(reportUrl, { responseType: "blob" })
      const filename = reportUrl.split("/").pop() || `report-${meetingId}.txt`
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Failed to download report:", err)
      alert("Failed to download report. The link may have expired or the file is not available.")
    } finally {
      setDownloadingReportId(null)
    }
  }

  useEffect(() => {
    if (token && (activeTab === "home" || activeTab === "records")) {
      setLoading(true)
      axios
        .get(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setMeetings(res.data)
        })
        .catch((err) => {
          setError(err?.response?.data?.message || "Failed to load data")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [token, activeTab])

  const processedData = useMemo(() => {
    if (!meetings) return { upcoming: [], ongoing: [], expired: [] }
    const sortedMeetings = [...meetings].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    return {
      upcoming: sortedMeetings.filter((m) => m.status === "PENDING"),
      ongoing: sortedMeetings.filter((m) => m.status === "ACTIVE"),
      expired: sortedMeetings.filter((m) => m.status === "ENDED"),
    }
  }, [meetings])

  const calendarDate = now
  const year = calendarDate.getFullYear()
  const month = calendarDate.getMonth()
  const today = calendarDate.getDate()
  const monthName = calendarDate.toLocaleString("default", { month: "long" })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const calendarCells = Array(firstDayOfWeek)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
          <p className="text-gray-300 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const renderGreeting = () => {
    const hour = now.getHours()
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  }

  const renderHomeContent = () => (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/50 to-black/50 p-8 border border-cyan-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">
              {renderGreeting()}, <span className="text-cyan-400">{user?.name || "Interviewer"}</span>
            </h1>
            <p className="text-gray-300 text-lg">Ready to conduct amazing interviews today?</p>
          </div>
          <div className="text-right space-y-1">
            <div className="text-3xl font-mono font-bold text-cyan-400">
              {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}
            </div>
            <div className="text-gray-300 font-medium">
              {now.toLocaleDateString([], { weekday: "long", day: "numeric", month: "short" })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900/50 border-gray-800 hover:border-cyan-500/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Meetings</p>
                <p className="text-2xl font-bold text-white">{meetings.length}</p>
              </div>
              <div className="h-12 w-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <Video className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Active Now</p>
                <p className="text-2xl font-bold text-white">{processedData.ongoing.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Upcoming</p>
                <p className="text-2xl font-bold text-white">{processedData.upcoming.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 hover:border-cyan-500/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-white">{processedData.expired.length}</p>
              </div>
              <div className="h-12 w-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <CheckCircle2 className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Upcoming Meetings */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <div className="h-8 w-1 bg-cyan-400 rounded-full mr-3" />
                Upcoming <span className="text-cyan-400 ml-2">Meetings</span>
              </h2>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                {processedData.upcoming.length} scheduled
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                </div>
              ) : processedData.upcoming.length > 0 ? (
                processedData.upcoming.slice(0, 6).map((session, index) => (
                  <Card
                    key={session.id}
                    className="group bg-gray-900/50 border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                    onClick={() => router.push(`/interview/${session.roomCode}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 px-3 py-1">
                          Room {session.roomCode}
                        </Badge>
                        <Video className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400 font-mono">{session.roomCode}</div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(session.roomCode)
                              setCopiedMeetingId(session.id)
                              setTimeout(() => setCopiedMeetingId(null), 1200)
                            }}
                            className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                            title="Copy Room Code"
                          >
                            <Copy className="w-4 h-4 text-cyan-400" />
                          </button>
                          {copiedMeetingId === session.id && (
                            <span className="text-green-400 text-xs animate-in fade-in-50">Copied!</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">No upcoming meetings scheduled</p>
                  <p className="text-gray-500 text-sm mt-1">Create a new meeting to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Meetings */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <div className="h-8 w-1 bg-cyan-400 rounded-full mr-3" />
                Recent <span className="text-cyan-400 ml-2">Meetings</span>
              </h2>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                {processedData.expired.length} completed
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-full flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                </div>
              ) : processedData.expired.length > 0 ? (
                processedData.expired.slice(0, 4).map((session) => (
                  <Card
                    key={session.id}
                    className="group bg-gray-900/30 border-gray-800 hover:border-green-500/30 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-gray-700/50 text-gray-300 border-gray-600/50 px-3 py-1">
                          Room {session.roomCode}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-xs text-gray-400">Completed</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 font-mono mb-4">
                        Ended:{" "}
                        {new Date(session.endedAt!).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50 hover:border-cyan-500/50 transition-all duration-200"
                        onClick={() => handleDownloadReport(session.reportFilePath!, session.id)}
                        disabled={downloadingReportId === session.id || !session.reportFilePath}
                      >
                        {downloadingReportId === session.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            {session.reportFilePath ? "Download Report" : "No Report"}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">No completed meetings yet</p>
                  <p className="text-gray-500 text-sm mt-1">Your interview history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-lg">
                  {monthName} {year}
                </h3>
                <Calendar className="h-5 w-5 text-cyan-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-3">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="text-gray-400 font-semibold p-2 h-8 flex items-center justify-center"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {calendarCells.map((day, idx) =>
                  day ? (
                    <div
                      key={day}
                      className={`p-2 h-10 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ${
                        day === today
                          ? "bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/25"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      }`}
                    >
                      {day}
                    </div>
                  ) : (
                    <div key={`empty-${idx}`} className="p-2 h-10" />
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <h3 className="font-semibold text-white flex items-center">
                <Zap className="h-5 w-5 mr-2 text-cyan-400" />
                Quick <span className="text-cyan-400 ml-1">Actions</span>
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold border-0 shadow-lg shadow-cyan-500/25 transition-all duration-200"
                onClick={() => setActiveTab("meeting")}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Meeting
              </Button>
              <Button
                variant="outline"
                className="w-full bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-cyan-500/50"
                onClick={() => setActiveTab("records")}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Records
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderNewMeetingContent = () => (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Create New <span className="text-cyan-400">Meeting</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Start a new interview session and connect with candidates instantly
        </p>
      </div>

      <div className="flex justify-center">
        <Card className="bg-gray-900/50 border-gray-800 w-full max-w-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-cyan-500/25">
              <Plus className="h-12 w-12 text-black" />
            </div>
            <h3 className="text-3xl font-semibold text-white mb-4">Create Meeting Room</h3>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Generate a unique room code and start interviewing candidates right away
            </p>
            <CreateInterviewModal />
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderRecordsContent = () => (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Meeting <span className="text-cyan-400">Records</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">Manage your interview history and download reports</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400" />
            <p className="text-gray-300">Loading your records...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-red-400 text-lg">Error loading records</p>
          <p className="text-gray-400 mt-2">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Clock className="h-5 w-5 mr-2 text-cyan-400" />
                Upcoming
              </h2>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">{processedData.upcoming.length}</Badge>
            </div>
            <div className="space-y-4">
              {processedData.upcoming.length > 0 ? (
                processedData.upcoming.map((session) => (
                  <Card
                    key={session.id}
                    className="group bg-gray-900/50 border-gray-800 hover:border-cyan-500/50 cursor-pointer transition-all duration-300 hover:scale-105"
                    onClick={() => router.push(`/interview/${session.roomCode}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white mb-1">Room {session.roomCode}</h3>
                          <p className="text-gray-400 text-sm font-mono">{session.id}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No upcoming meetings</p>
                </div>
              )}
            </div>
          </div>

          {/* Ongoing */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Ongoing
              </h2>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                {processedData.ongoing.length}
              </Badge>
            </div>
            <div className="space-y-4">
              {processedData.ongoing.length > 0 ? (
                processedData.ongoing.map((session) => (
                  <Card
                    key={session.id}
                    className="group bg-green-500/10 border-2 border-green-500/50 hover:border-green-400/70 cursor-pointer transition-all duration-300 hover:scale-105"
                    onClick={() => router.push(`/interview/${session.roomCode}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white mb-1">Room {session.roomCode}</h3>
                          <p className="text-gray-400 text-sm font-mono">{session.id}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No ongoing meetings</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-cyan-400" />
                Completed
              </h2>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">{processedData.expired.length}</Badge>
            </div>
            <div className="space-y-4">
              {processedData.expired.length > 0 ? (
                processedData.expired.map((session) => (
                  <Card
                    key={session.id}
                    className="bg-gray-900/30 border-gray-800 transition-all duration-300 hover:border-cyan-500/30"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-200 mb-1">Room {session.roomCode}</h3>
                        <p className="text-gray-500 text-xs font-mono mb-2">ID: {session.id}</p>
                        <p className="text-gray-400 text-xs">
                          Ended:{" "}
                          {new Date(session.endedAt!).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50 hover:border-cyan-500/50 transition-all duration-200"
                        onClick={() => handleDownloadReport(session.reportFilePath!, session.id)}
                        disabled={downloadingReportId === session.id || !session.reportFilePath}
                      >
                        {downloadingReportId === session.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            {session.reportFilePath ? "Download Report" : "No Report"}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No completed meetings</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-gray-900/80 min-h-screen border-r border-gray-800 flex flex-col">
          <div className="p-8 flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-cyan-500 rounded-xl flex items-center justify-center">
                  <Bird className="h-6 w-6 text-black" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  <span className="text-cyan-400">GARURA</span>
                </h1>
              </div>
              <Avatar className="h-10 w-10 border-2 border-cyan-500/30">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-cyan-500/20 text-cyan-300">{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
              <button
                onClick={() => setActiveTab("home")}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group ${
                  activeTab === "home"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <Home className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Home
              </button>

              <button
                onClick={() => setActiveTab("meeting")}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group ${
                  activeTab === "meeting"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <Video className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                New Meeting
              </button>

              <button
                onClick={() => setActiveTab("records")}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group ${
                  activeTab === "records"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <FileText className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                Records
              </button>
            </nav>

            {/* User Info & Logout */}
            <div className="space-y-4 pt-6 border-t border-gray-800">
              <div className="flex items-center space-x-3 px-4 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-cyan-500/20 text-cyan-300 text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || "user@example.com"}</p>
                </div>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-gray-600/50 text-gray-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {activeTab === "home" && renderHomeContent()}
          {activeTab === "meeting" && renderNewMeetingContent()}
          {activeTab === "records" && renderRecordsContent()}
        </main>
      </div>
    </div>
  )
}
