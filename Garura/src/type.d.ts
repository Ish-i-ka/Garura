// src/types.d.ts
import { IpcRenderer } from 'electron';

export interface IElectronAPI {
  runPreLaunchScan: () => Promise<{ success: boolean; reason?: string }>;
  verifyRoomCode: (roomCode: string) => Promise<{ isValid: boolean; sessionConfig: any }>;
  getStreamToken: (userId: string, roomCode: string) => Promise<{ token: string }>;
  sendProcessLog: (logData: { roomCode: string; processList: string }) => Promise<any>;
  connectSocket: (roomCode: string) => void;
  disconnectSocket: () => void;
  
  // --- ADDED THE MISSING FUNCTIONS ---
  submitQuiz: (payload: { answers: any[]; questions: any[] }) => Promise<{ score: number, totalQuestions: number }>;
  notifyQuizScored: (payload: { roomCode: string; score: number; total: number }) => void;
  sendChatMessage: (payload: { roomCode: string, text: string }) => void;
  submitCode: (payload: { roomCode: string, code: string }) => void;
  runCode: (payload: { code: string, language: string }) => Promise<any>; 
  
  onInterviewEnded: (callback: () => void) => () => void;
  onCtrlKeyWarning: (callback: (count: number) => void) => () => void;
  onReceiveChatMessage: (callback: (message: { sender: string; text: string }) => void) => () => void;
  onNewCodingQuestion: (callback: (markdown: string) => void) => () => void;
  onQuizStarted: (callback: (quizData: any) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}