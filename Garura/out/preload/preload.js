"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // --- Security & Setup ---
  runPreLaunchScan: () => electron.ipcRenderer.invoke("run-pre-launch-scan"),
  // --- API Calls (Proxied through the main process for security) ---
  verifyRoomCode: (roomCode) => electron.ipcRenderer.invoke("api:verify-room", roomCode),
  getStreamToken: (userId, roomCode) => electron.ipcRenderer.invoke("api:get-stream-token", userId, roomCode),
  requestScreenShare: () => electron.ipcRenderer.invoke("request-screen-share"),
  sendProcessLog: (logData) => electron.ipcRenderer.invoke("api:send-log", logData),
  submitQuiz: (payload) => electron.ipcRenderer.invoke("api:submit-quiz", payload),
  // --- Real-time Socket.IO Management (Commands to the main process) ---
  connectSocket: (roomCode) => electron.ipcRenderer.send("socket:connect", roomCode),
  disconnectSocket: () => electron.ipcRenderer.send("socket:disconnect"),
  notifyQuizScored: (payload) => electron.ipcRenderer.send("socket:quiz-scored", payload),
  sendChatMessage: (payload) => electron.ipcRenderer.send("socket:send-chat", payload),
  submitCode: (payload) => electron.ipcRenderer.send("socket:submit-code", payload),
  runCode: (payload) => electron.ipcRenderer.invoke("api:run-code", payload),
  // --- Event Listeners (Receiving events from the main process) ---
  onInterviewEnded: (callback) => {
    electron.ipcRenderer.on("event:interview-ended", callback);
    return () => electron.ipcRenderer.removeAllListeners("event:interview-ended");
  },
  onCtrlKeyWarning: (callback) => {
    electron.ipcRenderer.on("event:ctrl-key-warning", (_event, count) => callback(count));
    return () => electron.ipcRenderer.removeAllListeners("event:ctrl-key-warning");
  },
  onNewCodingQuestion: (callback) => {
    electron.ipcRenderer.on("event:new-question", (_event, markdown) => callback(markdown));
    return () => electron.ipcRenderer.removeAllListeners("event:new-question");
  },
  onQuizStarted: (callback) => {
    electron.ipcRenderer.on("event:quiz-started", (_event, quizData) => callback(quizData));
    return () => electron.ipcRenderer.removeAllListeners("event:quiz-started");
  },
  onReceiveChatMessage: (callback) => {
    electron.ipcRenderer.on("event:receive-chat", (_event, message) => callback(message));
    return () => electron.ipcRenderer.removeAllListeners("event:receive-chat");
  }
});
