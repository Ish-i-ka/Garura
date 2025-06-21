// src/components/interview_ui/IntervieweeChat.tsx
'use client';

import { useState, useRef, useEffect } from 'react'; // <-- All hooks are now used.
import { Send } from 'lucide-react';

// Define the shape of a message for clarity.
type Message = {
  text: string;
  timestamp: number;
};

export default function IntervieweeChat({ onSendMessage }: { onSendMessage: (text: string) => void }) {
  const [text, setText] = useState('');
  // We will keep a local log of messages the interviewee has sent.
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  
  // This ref will point to the scrolling container div.
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // This effect will run every time the `sentMessages` array changes.
  useEffect(() => {
    // It smoothly scrolls the container to the bottom to show the latest message.
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sentMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const newMessage = { text: text.trim(), timestamp: Date.now() };
      
      // Call the function passed down from the parent to send the message via socket.
      onSendMessage(newMessage.text);
      
      // Add the message to our local log to display it in the UI.
      setSentMessages(prevMessages => [...prevMessages, newMessage]);
      
      setText('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
      {/* The main scrolling message area */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {sentMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Your sent messages will appear here.
          </div>
        ) : (
          sentMessages.map((msg) => (
            // All messages from the interviewee are right-aligned.
            <div key={msg.timestamp} className="flex justify-end">
              <div className="max-w-[80%] bg-blue-600 text-white rounded-lg px-3 py-2">
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))
        )}
        {/* This empty div is the target for our auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* The input form */}
      <form onSubmit={handleSend} className="p-2 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 bg-slate-700 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button type="submit" className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 rounded font-semibold shrink-0">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}