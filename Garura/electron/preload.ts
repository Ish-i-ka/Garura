import { contextBridge, ipcRenderer } from 'electron';

// This is the complete and final API that our React code will be able to access.
contextBridge.exposeInMainWorld('electronAPI', {
  // --- Security & Setup ---
  runPreLaunchScan: (): Promise<{ success: boolean; reason?: string }> => 
    ipcRenderer.invoke('run-pre-launch-scan'),
  
  // --- API Calls (Proxied through the main process for security) ---
  verifyRoomCode: (roomCode: string) => ipcRenderer.invoke('api:verify-room', roomCode),
  getStreamToken: (userId: string, roomCode: string) => ipcRenderer.invoke('api:get-stream-token', userId, roomCode),
  sendProcessLog: (logData: { roomCode: string; processList: string }) => ipcRenderer.invoke('api:send-log', logData),
  submitQuiz: (payload: { answers: any[]; questions: any[] }) => ipcRenderer.invoke('api:submit-quiz', payload),

  // --- Real-time Socket.IO Management (Commands to the main process) ---
  connectSocket: (roomCode: string) => ipcRenderer.send('socket:connect', roomCode),
  disconnectSocket: () => ipcRenderer.send('socket:disconnect'),
  notifyQuizScored: (payload: { roomCode: string, score: number, total: number }) => ipcRenderer.send('socket:quiz-scored', payload),
  
  sendChatMessage: (payload: { roomCode: string, text: string }) => ipcRenderer.send('socket:send-chat', payload),
  submitCode: (payload: { roomCode: string, code: string }) => ipcRenderer.send('socket:submit-code', payload),
  runCode: (payload: { code: string, language: string }) => ipcRenderer.invoke('api:run-code', payload),
  // --- Event Listeners (Receiving events from the main process) ---
  onInterviewEnded: (callback: () => void) => {
    ipcRenderer.on('event:interview-ended', callback);
    // Return a cleanup function to be used in React's useEffect
    return () => ipcRenderer.removeAllListeners('event:interview-ended');
  },
  onCtrlKeyWarning: (callback: (count: number) => void) => {
    ipcRenderer.on('event:ctrl-key-warning', (_event, count) => callback(count));
    return () => ipcRenderer.removeAllListeners('event:ctrl-key-warning');
  },
  onNewCodingQuestion: (callback: (markdown: string) => void) => {
    ipcRenderer.on('event:new-question', (_event, markdown) => callback(markdown));
    return () => ipcRenderer.removeAllListeners('event:new-question');
  },
  onQuizStarted: (callback: (quizData: any) => void) => {
    ipcRenderer.on('event:quiz-started', (_event, quizData) => callback(quizData));
    return () => ipcRenderer.removeAllListeners('event:quiz-started');
  },
});