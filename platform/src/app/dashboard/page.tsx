// src/app/dashboard/page.tsx
'use client';

import { useAuthStore } from '@/app/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Video, FileText, Calendar, Clock, User, LogOut, Plus, Download, ChevronRight, AlertTriangle, Loader2, Copy } from "lucide-react";
import CallList from '@/components/dashboard/CallList';
import CreateInterviewModal from '@/components/dashboard/CreateInterviewModal';

// --- Type Definition for our fetched data ---
interface Meeting {
  id: string;
  name: string;
  status: 'upcoming' | 'ongoing' | 'expired';
  createdAt: string;
  reportFilePath?: string; // ADDED: Assuming reportFilePath is now part of the Meeting type
}

class FetchError extends Error {
  info?: any;
  status?: number;
}
const apiUrl = '/api/interview/history';
const fetcher = async ([apiUrl, token]: [string, string]): Promise<any> => {
  const res = await fetch(apiUrl, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!res.ok) {
    const error = new FetchError('An error occurred while fetching the data.');
    try {
      error.info = await res.json();
    } catch (e) { /* Ignore */ }
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function DashboardPage() {
  const { user, token, logout, isHydrated } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  // --- Dynamic Time and Date State ---
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000 * 60); // update every minute
    return () => clearInterval(interval);
  }, []);

  // --- Authentication and Logout Logic ---
  useEffect(() => {
    if (isHydrated && !token) {
      router.replace('/');
    }
  }, [isHydrated, token, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // --- Data Fetching with Axios ---
  const [meetings, setMeetings] = useState<Meeting[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for creating a new meeting room ---
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [createRoomError, setCreateRoomError] = useState<string | null>(null);
  const [downloadingReportId, setDownloadingReportId] = useState<string | null>(null);
  const [copiedMeetingId, setCopiedMeetingId] = useState<string | null>(null);

  // --- Handler for downloading a report ---
  const handleDownloadReport = async (meetingId: string, reportFilePath?: string) => {
    if (!token || downloadingReportId || !reportFilePath) return; // Added check for reportFilePath
    setDownloadingReportId(meetingId);
    try {
      // Directly use the reportFilePath if it exists
      const res = await axios.get(reportFilePath, {  // Use the provided reportFilePath
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Necessary for file downloads
      });

      // Extract filename from the URL
      const filename = reportFilePath.substring(reportFilePath.lastIndexOf('/') + 1);

      // Create a temporary URL and trigger the browser download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Clean up the temporary URL
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Failed to download report:", err);
      alert(err?.response?.data?.message || 'Failed to download report. It may not exist yet or the link might be invalid.'); // Improved error message
    } finally {
      setDownloadingReportId(null);
    }
  };

  // --- Handler for creating a new meeting room ---
  const handleCreateRoom = async () => {
    if (!token) return;
    setCreatingRoom(true);
    setCreateRoomError(null);
    try {
      const res = await axios.post('/api/interview/create', {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Assuming the API returns the new room info, e.g., { roomCode: '...', ... }
      const { roomCode } = res.data;
      // Redirect to the new meeting room page if you have such a route
      if (roomCode) {
        router.push(`/interview/${roomCode}`);
      } else {
        // Optionally, refresh meetings list or show a success message
        setMeetings((prev) => prev ? [...prev] : prev);
      }
    } catch (err: any) {
      setCreateRoomError(err?.response?.data?.message || err.message || 'Failed to create room');
    } finally {
      setCreatingRoom(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    axios.get(apiUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        setMeetings(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err?.response?.data?.message || err.message || 'Failed to load data');
        setLoading(false);
      });
  }, [token]);

  const processedData = useMemo(() => {
    if (!meetings) {
      return { upcoming: [], ongoing: [], expired: [] };
    }
    return {
      upcoming: meetings.filter((m) => m.status === 'upcoming'),
      ongoing: meetings.filter((m) => m.status === 'ongoing'),
      expired: meetings.filter((m) => m.status === 'expired'),
    };
  }, [meetings]);

  // --- Dynamic Calendar Data ---
  const calendarDate = now; // use the same 'now' as for the clock
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth(); // 0-indexed
  const today = calendarDate.getDate();
  const monthName = calendarDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)

  // Build the calendar grid: pad with blanks for the first week
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  // --- Loading and Error States ---
  if (!isHydrated || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center p-8 border border-red-500/30 bg-red-900/20 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-white">Failed to load data</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const renderGreeting = () => {
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return greeting;
  };

  // --- RENDER FUNCTIONS USING YOUR EXACT LAYOUT AND STYLING ---
  const renderHomeContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-100 mb-2 tracking-tight">{renderGreeting()}, {user?.name || 'Alex'}</h1>
          <p className="text-gray-400 text-base">Welcome back to your interview dashboard</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-medium text-white">
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </div>
          <div className="text-gray-400 text-sm">
            {now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-medium text-gray-200 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" /> Upcoming Meetings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {processedData.upcoming.length > 0 ? processedData.upcoming.slice(0, 3).map((meeting) => (
                <Card key={meeting.id} className="bg-gray-800/50 border-gray-700/50 rounded-xl">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-blue-900/50 text-blue-400 border-blue-500/30 rounded-md px-2 py-1 text-xs font-medium">{meeting.name}</Badge>
                      <Video className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-400 font-mono flex items-center gap-2">
                      {meeting.id}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(meeting.id);
                          // Optionally, show feedback
                          setCopiedMeetingId(meeting.id);
                          setTimeout(() => setCopiedMeetingId(null), 1200);
                        }}
                        className="ml-1 p-1 rounded hover:bg-gray-700 transition-colors"
                        title="Copy Meeting ID"
                      >
                        <Copy className="w-4 h-4 text-blue-400" />
                      </button>
                      {copiedMeetingId === meeting.id && (
                        <span className="text-green-400 text-xs ml-1">Copied!</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )) : <p className="text-gray-500 col-span-3">No upcoming meetings.</p>}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-200 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-gray-400" /> Recent Meetings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {processedData.expired.length > 0 ?
                // Show only the last 6 meetings, most recent first
                [...processedData.expired]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 6)
                  .map((room) => (
                    <Card key={room.id} className="bg-gray-800/30 border-gray-700/30 rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-gray-700/50 text-gray-300 border-gray-600/50 rounded-lg px-2 py-1 text-xs">{room.name}</Badge>
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-600 font-mono mb-4">{room.id}</div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50 rounded-lg"
                          onClick={() => handleDownloadReport(room.id, room.reportFilePath)} // Pass reportFilePath
                          disabled={downloadingReportId === room.id || !room.reportFilePath} // Disable if no reportFilePath
                        >
                          {downloadingReportId === room.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Download className="h-3 w-3 mr-1" /> {room.reportFilePath ? 'Download Report' : 'No Report'}
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                : <p className="text-gray-500 col-span-3">No past meeting rooms found.</p>}
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-medium text-gray-200 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-white" />
            Calendar
          </h2>
          <Card className="bg-gray-800/50 border-gray-700/50 rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-200 text-sm">{monthName} {year}</h3>
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                  <div key={day} className="text-gray-500 font-medium p-2 h-8 flex items-center justify-center">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {calendarCells.map((day, idx) => (
                  day ? (
                    <div
                      key={day}
                      className={`p-2 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                        day === today ? "bg-blue-500 text-white font-bold" : "text-gray-300 hover:bg-gray-700/50"
                      }`}
                    >
                      {day}
                    </div>
                  ) : (
                    <div key={`empty-${idx}`} />
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderNewMeetingContent = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-100 mb-2 tracking-tight">Create New Meeting</h1>
        <p className="text-gray-400 text-base">Start a new interview session</p>
      </div>
      <div className="flex justify-center">
        <Card className="bg-gray-800/50 border-gray-700/50 rounded-xl w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-medium text-gray-200 mb-3">Create New Meeting Room</h3>
            <p className="text-gray-400 text-base mb-8">Start an instant interview session</p>
            <CreateInterviewModal/>

            {/* <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg py-3 text-base"
              onClick={handleCreateRoom}
              disabled={creatingRoom}
            >
              {creatingRoom ? <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" /> : null}
              {creatingRoom ? 'Creating...' : 'Create Room'}
            </Button> */}
            {createRoomError && (
              <div className="mt-4 text-red-400 text-sm">{createRoomError}</div>
            )}
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-xl font-medium text-gray-200 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-gray-400" /> Past Meeting Rooms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedData.expired.length > 0 ? processedData.expired.map((room) => (
            <Card key={room.id} className="bg-gray-800/30 border-gray-700/30 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-gray-700/50 text-gray-300 border-gray-600/50 rounded-lg px-2 py-1 text-xs">{room.name}</Badge>
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-600 font-mono mb-4">{room.id}</div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50 rounded-lg"
                   onClick={() => handleDownloadReport(room.id, room.reportFilePath)} // Pass reportFilePath
                  disabled={downloadingReportId === room.id || !room.reportFilePath} // Disable if no reportFilePath
                >
                  {downloadingReportId === room.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Download className="h-3 w-3 mr-1" />  {room.reportFilePath ? 'Download Report' : 'No Report'}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )) : <p className="text-gray-500 col-span-3">No past meeting rooms found.</p>}
        </div>
      </div>
    </div>
  );

  const renderRecordsContent = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-100 mb-2 tracking-tight">Meeting Records</h1>
        <p className="text-gray-400 text-base">View and manage your interview history</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <h2 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" /> Upcoming
          </h2>
          <div className="space-y-3">
            {processedData.upcoming.length > 0 ? processedData.upcoming.map((record) => (
              <Card key={record.id} className="bg-gray-800/50 border-gray-700/50 hover:border-blue-500/30 rounded-xl">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-200 text-sm">{record.name}</h3>
                    <p className="text-gray-400 text-xs font-mono">{record.id}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>
            )) : <p className="text-gray-500">No upcoming records.</p>}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div> Ongoing
          </h2>
          <div className="space-y-3">
            {processedData.ongoing.length > 0 ? processedData.ongoing.map((record) => (
              <Card 
                key={record.id} 
                className="bg-gray-800/50 border-2 border-green-500/50 hover:border-green-500/70 rounded-xl cursor-pointer"
                onClick={() => router.push(`/interview/${record.id}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-200 text-sm">{record.name}</h3>
                    <p className="text-gray-400 text-xs font-mono">{record.id}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </CardContent>
              </Card>
            )) : <p className="text-gray-500">No ongoing meetings.</p>}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-gray-400" /> Expired
          </h2>
          <div className="space-y-3">
            {processedData.expired.length > 0 ? processedData.expired.map((record) => (
              <Card key={record.id} className="bg-gray-800/30 border-gray-700/30 rounded-xl">
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-medium text-gray-300 text-sm">{record.name}</h3>
                    <p className="text-gray-600 text-xs font-mono">{record.id}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50 rounded-lg"
                    onClick={() => handleDownloadReport(record.id, record.reportFilePath)} // Pass reportFilePath
                    disabled={downloadingReportId === record.id || !record.reportFilePath} // Disable if no reportFilePath
                  >
                    {downloadingReportId === record.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="h-3 w-3 mr-1" /> {record.reportFilePath ? 'Download Report' : 'No Report'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )) : <p className="text-gray-500">No expired records.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <aside className="w-64 bg-gray-900 min-h-screen border-r border-gray-800/70 flex flex-col">
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-2xl font-bold text-white tracking-tight">Garuda</h1>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-2 flex-1">
              <button onClick={() => setActiveTab("home")} className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${activeTab === "home" ? "bg-blue-500/20 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
                <Home className="h-5 w-5 mr-3" /> Home
              </button>
              <button onClick={() => setActiveTab("meeting")} className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${activeTab === "meeting" ? "bg-blue-500/20 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
                <Video className="h-5 w-5 mr-3" /> New Meeting
              </button>
              <button onClick={() => setActiveTab("records")} className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${activeTab === "records" ? "bg-blue-500/20 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}>
                <FileText className="h-5 w-5 mr-3" /> Records
              </button>
            </nav>
            <Button onClick={handleLogout} variant="outline" className="w-full border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-gray-600 hover:text-white rounded-lg transition-colors duration-200">
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-8 bg-black">
          {activeTab === 'home' && renderHomeContent()}
          {activeTab === 'meeting' && renderNewMeetingContent()}
          {activeTab === 'records' && renderRecordsContent()}
        </main>
      </div>
    </div>
  );
}