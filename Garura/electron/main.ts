import { app, BrowserWindow, ipcMain, screen, globalShortcut, clipboard } from 'electron';
import path from 'node:path';
import os from 'node:os';
import { exec } from 'node:child_process';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { execa } from 'execa'; 

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

// --- Configuration ---
const SERVER_URL = 'http://localhost:3000'; 
const FLAGGED_APPS = [
  'obs64.exe', 'obs32.exe', 'discord.exe', 'anydesk.exe', 'teamviewer.exe', 
  'slack.exe', 'skype.exe', 'zoom.exe', 'mstsc.exe'
];
const PROCESS_LOG_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

// --- Application State ---
let win: BrowserWindow | null = null;
let socket: Socket | null = null;
let processLogIntervalId: NodeJS.Timeout | null = null;
let ctrlPressCount = 0;
let currentRoomCode: string | null = null;

// --- Helper Functions ---
const getRunningProcesses = (): Promise<string> => new Promise((resolve, reject) => {
  const command = os.platform() === 'win32' ? 'tasklist' : 'ps -ax';
  exec(command, (err, stdout) => err ? reject(err) : resolve(stdout));
});

const checkDisplayAffinity = (): Promise<boolean> => {
  return new Promise(async (resolve) => {
    if (os.platform() !== 'win32') return resolve(false);

    // FIX: Corrected path resolution for production builds
    const scriptPath = app.isPackaged
      ? path.join(process.resourcesPath, '..', 'scripts', 'check_affinity.ps1')
      : path.resolve(__dirname, '../../scripts/check_affinity.ps1');

    try {
      const { stdout } = await execa(
        'powershell.exe',
        ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', scriptPath],
        { timeout: 5000 }
      );
      
      const result = stdout.trim().toLowerCase();
      console.log(`Display Affinity Scan Result: ${result}`);
      resolve(result === 'true');
    } catch (error) {
      console.error("PowerShell script execution failed:", error);
      resolve(false);
    }
  });
};


const startProcessLogging = (roomCode: string) => {
  const log = async () => {
      try {
          const processList = await getRunningProcesses();
          await axios.post(`${SERVER_URL}/api/log/process`, { roomCode, processList });
          console.log(`[${new Date().toLocaleTimeString()}] Successfully sent process log.`);
      } catch (error) { 
          console.error("Failed to log processes."); 
      }
  };
  log();
  processLogIntervalId = setInterval(log, PROCESS_LOG_INTERVAL_MS);
};

// --- Security Monitoring ---
function startSecurityMonitoring(window: BrowserWindow, roomCode: string) {
  console.log("Starting security monitoring for room:", roomCode);
  globalShortcut.register('PrintScreen', () => {
    socket?.emit('security-alert', roomCode, { type: 'Screenshot Attempt', message: 'Candidate tried to take a screenshot; app terminated.' });
    setTimeout(() => app.quit(), 500);
  });
  setInterval(() => clipboard.clear(), 5000);
  window.on('blur', () => {
    socket?.emit('security-alert', roomCode, { type: 'Focus Loss', message: 'Candidate switched away from the interview window.' });
  });
  globalShortcut.register('Control', () => {
    ctrlPressCount++;
    window.webContents.send('event:ctrl-key-warning', ctrlPressCount);
    socket?.emit('security-alert', roomCode, { type: 'Ctrl Key Pressed', message: `Candidate pressed the Ctrl key. (Count: ${ctrlPressCount})` });
    if (ctrlPressCount >= 3) {
      socket?.emit('security-alert', roomCode, { type: 'Suspicious Activity', message: 'Candidate pressed the Ctrl key 3 times; app terminated.' });
      setTimeout(() => app.quit(), 500);
    }
  });
}

// --- Main Window Creation ---
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width, height, frame: false, kiosk: true, alwaysOnTop: true,
    webPreferences: {
      // --- FIX #1: THE CORRECT PRELOAD PATH ---
      // Your build process puts the compiled preload script in `out/preload/preload.js`.
      // The compiled main script is in `out/main/main.js`.
      // Therefore, the path from here is up one level (`../`) and then into `preload/`.
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  });
  win.setClosable(false);
  win.setMinimizable(false);
  win.setMovable(false);

  // --- FIX #2: THE CORRECT RENDERER PATH ---
  if (VITE_DEV_SERVER_URL) {
    // In development, this is correct and will be used.
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // In PRODUCTION, we load the index.html file that your build process creates.
    // The path from `out/main` is up one level (`../`) and then into `renderer/`.
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Open dev tools ONLY if not in a packaged app.
  if (!app.isPackaged) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// --- App Lifecycle & IPC Handlers (No changes needed below this line) ---
function initializeIpcHandlers() {
  ipcMain.handle('run-pre-launch-scan', async () => {
    try {
      const processes = (await getRunningProcesses()).toLowerCase();
      const flaggedApp = FLAGGED_APPS.find(app => processes.includes(app.toLowerCase()));
      if (flaggedApp) return { success: false, reason: `Please close: ${flaggedApp}` };
      if (await checkDisplayAffinity()) return { success: false, reason: 'A window with screen capture protection is active.' };
      return { success: true };
    } catch (error) {
      return { success: false, reason: 'Failed to scan processes. Please run as administrator.' };
    }
  });

  ipcMain.handle('api:verify-room', async (_, rc) => axios.post(`${SERVER_URL}/api/interview/verify-room`, { roomCode: rc }).then(r => r.data));
  ipcMain.handle('api:get-stream-token', async (_, uid, rc) => axios.post(`${SERVER_URL}/api/stream/token`, { userId: uid, roomCode: rc }).then(r => r.data));
  ipcMain.handle('api:submit-quiz', async (_, payload) => axios.post(`${SERVER_URL}/api/quiz/submit`, payload).then(res => res.data));
  ipcMain.handle('api:run-code', async (_, payload) => axios.post(`${SERVER_URL}/api/code/run`, payload).then(res => res.data));

  ipcMain.on('socket:connect', (_, roomCode) => {
    if (socket?.connected) return;
    currentRoomCode = roomCode;
    socket = io(SERVER_URL, { path: '/api/socket' });
    socket.on('connect', () => {
      console.log('Socket.IO connected to server.');
      socket?.emit('join-room', roomCode, `interviewee-${socket.id}`);
      startProcessLogging(roomCode);
      if (win) startSecurityMonitoring(win, roomCode);
    });
    socket.on('interview-ended', () => win?.webContents.send('event:interview-ended'));
    socket.on('receive-coding-question', (md) => win?.webContents.send('event:new-question', md));
    socket.on('quiz-started', (data) => win?.webContents.send('event:quiz-started', data));
  });

  ipcMain.on('socket:disconnect', () => {
    socket?.disconnect();
    if (processLogIntervalId) clearInterval(processLogIntervalId);
  });
  ipcMain.on('socket:quiz-scored', (_, payload) => socket?.emit('quiz-scored', payload.roomCode, { score: payload.score, total: payload.total }));
  ipcMain.on('socket:send-chat', (_, payload) => socket?.emit('send-chat-message', payload.roomCode, { sender: 'interviewee', text: payload.text }));
  ipcMain.on('socket:submit-code', (_, payload) => socket?.emit('code-submitted', payload.roomCode, payload.code));
}

// --- App Lifecycle ---
app.whenReady().then(() => {
  // 1. Initialize all our IPC listeners BEFORE creating the window.
  initializeIpcHandlers();
  
  // 2. THEN, create the window which will immediately try to use them.
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


// Re-pasted the helper functions here so you can copy the whole file easily.
const startProcessLogging_full = (roomCode: string) => {
  const log = async () => {
    try {
      const processList = await getRunningProcesses();
      await axios.post(`${SERVER_URL}/api/log/process`, { roomCode, processList });
      console.log(`[${new Date().toLocaleTimeString()}] Successfully sent process log.`);
    } catch (error) { 
      console.error("Failed to log processes."); 
    }
  };
  log();
  processLogIntervalId = setInterval(log, PROCESS_LOG_INTERVAL_MS);
};
function startSecurityMonitoring_full(window: BrowserWindow, roomCode: string) {
  console.log("Starting security monitoring for room:", roomCode);
  globalShortcut.register('PrintScreen', () => {
    socket?.emit('security-alert', roomCode, { type: 'Screenshot Attempt', message: 'Candidate tried to take a screenshot; app terminated.' });
    setTimeout(() => app.quit(), 500);
  });
  setInterval(() => clipboard.clear(), 5000);
  window.on('blur', () => {
    socket?.emit('security-alert', roomCode, { type: 'Focus Loss', message: 'Candidate switched away from the interview window.' });
  });
  globalShortcut.register('Control', () => {
    ctrlPressCount++;
    window.webContents.send('event:ctrl-key-warning', ctrlPressCount);
    socket?.emit('security-alert', roomCode, { type: 'Ctrl Key Pressed', message: `Candidate pressed the Ctrl key. (Count: ${ctrlPressCount})` });
    if (ctrlPressCount >= 3) {
      socket?.emit('security-alert', roomCode, { type: 'Suspicious Activity', message: 'Candidate pressed the Ctrl key 3 times; app terminated.' });
      setTimeout(() => app.quit(), 500);
    }
  });
}