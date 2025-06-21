// NEXT.JS SERVER (WEB CLIENT): src/hooks/useSocket.ts
'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useInterviewStore, Message } from '@/app/store/useInterviewStore';
import { useAuthStore } from '@/app/store/useAuthStore';
import { toast } from 'sonner';

export const useSocket = (roomCode: string) => {
  const socketRef = useRef<Socket | null>(null);
  const addMessage = useInterviewStore((state) => state.addMessage);
  const addSecurityAlert = useInterviewStore((state) => state.addSecurityAlert);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    const socket = io(process.env.NEXT_PUBLIC_CLIENT_URL!, {
      path: '/api/socket',
      transports: ['polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      socket.emit('join-room', roomCode, user.id);
    });

    socket.on('receive-chat-message', (message: Omit<Message, 'timestamp'>) => {
      // Don't add our own messages twice
      if (message.sender !== user.id) {
          addMessage({ ...message, timestamp: Date.now() });
      }
    });

    socket.on('receive-security-alert', (alert: { type: string; message: string }) => {
      addSecurityAlert(alert);
      toast.error(`🚨 Security Alert: ${alert.type}`, { description: alert.message });
    });
    
    socket.on('disconnect', () => console.log('❌ Socket disconnected'));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomCode, user, addMessage, addSecurityAlert]);


  // --- THIS IS THE CRITICAL FIX ---
  const sendMessage = (text: string) => {
    if (socketRef.current && user) {
      const message = { sender: user.id, text };
      
      // Send the message to the server to be broadcasted
      socketRef.current.emit('send-chat-message', roomCode, message);
      
      // Add the message to our own screen immediately for a snappy UX
      addMessage({ sender: 'interviewer', text, timestamp: Date.now() });
    }
  };
  const pushCodingQuestion = (markdown: string) => {
    if (socketRef.current) {
      socketRef.current.emit('push-coding-question', roomCode, markdown);
      toast.success("Coding question sent to interviewee.");
    }
  };
  
  const launchQuiz = (quizData: any) => {
    if (socketRef.current) {
        socketRef.current.emit('launch-quiz', roomCode, quizData);
        toast.info("Quiz has been launched for the interviewee.");
    }
  };

  const endInterviewSession = () => {
    if (socketRef.current) {
      console.log(`> Emitting interview-ended for room: ${roomCode}`);
      socketRef.current.emit('broadcast-end-session', roomCode);
    }
  }

  return { sendMessage, pushCodingQuestion, launchQuiz,  endInterviewSession };
};