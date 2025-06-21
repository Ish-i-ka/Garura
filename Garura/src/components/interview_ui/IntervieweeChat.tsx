"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"

export type Message = {
  sender: "interviewer" | "interviewee" | "System"
  text: string
  timestamp: number
}

export default function IntervieweeChat({
  messages,
  onSendMessage,
}: {
  messages: Message[]
  onSendMessage: (text: string) => void
}) {
  const [text, setText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onSendMessage(text.trim())
      setText("")
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
      {/* The main scrolling message area */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Messages from the interviewer will appear here.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.timestamp}
              className={`flex w-full ${msg.sender === "interviewee" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-white break-words ${
                  msg.sender === "interviewee"
                    ? "bg-blue-600"
                    : msg.sender === "System"
                      ? "bg-yellow-800/60"
                      : "bg-slate-700"
                }`}
              >
                {msg.sender !== "interviewee" && (
                  <p className="text-xs font-bold text-slate-400 capitalize mb-1">{msg.sender}</p>
                )}
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* The input form */}
      <form onSubmit={handleSend} className="p-2 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 bg-slate-700 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-slate-400"
        />
        <button
          type="submit"
          className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded font-semibold shrink-0 text-white"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
