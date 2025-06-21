import { app, BrowserWindow, ipcMain, screen, globalShortcut, clipboard } from 'electron';
import path from 'node:path';
import os from 'node:os';
import { exec } from 'node:child_process';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { execa } from 'execa'; 

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

// --- Configuration ---
const SERVER_URL = 'https://garura.vercel.app'; 
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
let securityCleanup: (() => void) | null = null; // For security monitoring cleanup

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

// --- Updated Security Monitoring ---
function startSecurityMonitoring(window: BrowserWindow, roomCode: string): () => void {
  console.log("Starting security monitoring for room:", roomCode);
  
  // Screenshot blocking
  globalShortcut.register('PrintScreen', () => {
    socket?.emit('security-alert', roomCode, { 
      type: 'Screenshot Attempt', 
      message: 'Candidate tried to take a screenshot; app terminated.' 
    });
    setTimeout(() => app.quit(), 500);
  });
  
  // Clipboard clearing
  const clipboardInterval = setInterval(() => clipboard.clear(), 5000);
  
  // Window focus monitoring
  const handleBlur = () => {
    socket?.emit('security-alert', roomCode, { 
      type: 'Focus Loss', 
      message: 'Candidate switched away from the interview window.' 
    });
  };
  window.on('blur', handleBlur);
  
  // Ctrl key monitoring using Electron's built-in input handler
  const handleKeyPress = (event: Electron.Event, input: Electron.Input) => {
    // We detect the press of the Control key itself.
    // The `!input.isAutoRepeat` is important to not count holding the key down.
    if (input.key.toLowerCase() === 'control' && input.type === 'keyDown' && !input.isAutoRepeat) {
      
      // We do NOT call event.preventDefault() here, as that would break
      // legitimate OS-level uses of the Ctrl key. We only want to monitor it.

      ctrlPressCount++;
      console.log(`[Input Event] Control key pressed. Count: ${ctrlPressCount}`);
      
      window.webContents.send('event:ctrl-key-warning', ctrlPressCount);
      socket?.emit('security-alert', roomCode, { 
        type: 'Ctrl Key Pressed', 
        message: `Candidate pressed the Ctrl key. (Count: ${ctrlPressCount})` 
      });
      
      if (ctrlPressCount >= 3) {
        console.log('Ctrl key limit reached! Terminating.');
        socket?.emit('security-alert', roomCode, { 
          type: 'Suspicious Activity', 
          message: 'Candidate pressed the Ctrl key 3 times; app terminated.' 
        });
        setTimeout(() => app.quit(), 500);
      }
    }
  };
  window.webContents.on('before-input-event', handleKeyPress);
  
  return () => {
    console.log("Cleaning up security monitoring...");
    globalShortcut.unregister('PrintScreen');
    clearInterval(clipboardInterval);
    if (!window.isDestroyed()) {
        window.off('blur', handleBlur);
        window.webContents.off('before-input-event', handleKeyPress);
    }
  };
}

// --- Main Window Creation ---
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width, 
    height, 
    frame: false, 
    kiosk: true, 
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  });
  win.setClosable(false);
  win.setMinimizable(false);
  win.setMovable(false);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  if (!app.isPackaged) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// --- App Lifecycle & IPC Handlers ---
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
    socket = io(SERVER_URL, { path: '/api/socket', transports:['polling'], });
    socket.on('connect', () => {
      console.log('Socket.IO connected to server.');
      socket?.emit('join-room', roomCode, `interviewee-${socket.id}`);
      startProcessLogging(roomCode);
      
      if (win) {
        // Store cleanup function when starting monitoring
        securityCleanup = startSecurityMonitoring(win, roomCode);
      }
    });
    
    socket.on('interview-ended', () => win?.webContents.send('event:interview-ended'));
    socket.on('receive-coding-question', (md) => win?.webContents.send('event:new-question', md));
    socket.on('quiz-started', (data) => win?.webContents.send('event:quiz-started', data));
  });

  ipcMain.on('socket:disconnect', () => {
    // Clean up security monitoring
    if (securityCleanup) {
      securityCleanup();
      securityCleanup = null;
    }
    ctrlPressCount = 0; // Reset counter
    
    socket?.disconnect();
    if (processLogIntervalId) {
      clearInterval(processLogIntervalId);
      processLogIntervalId = null;
    }
  });
  
  ipcMain.on('socket:quiz-scored', (_, payload) => socket?.emit('quiz-scored', payload.roomCode, { score: payload.score, total: payload.total }));
  ipcMain.on('socket:send-chat', (_, payload) => socket?.emit('send-chat-message', payload.roomCode, { sender: 'interviewee', text: payload.text }));
  ipcMain.on('socket:submit-code', (_, payload) => socket?.emit('code-submitted', payload.roomCode, payload.code));
}

  initializeIpcHandlers();
// --- App Lifecycle ---
app.whenReady().then(() => {

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  // Clean up security monitoring if still active
  if (securityCleanup) {
    securityCleanup();
    securityCleanup = null;
  }
  
  // Clear all global shortcuts
  globalShortcut.unregisterAll();
  
  // Clear any remaining intervals
  if (processLogIntervalId) {
    clearInterval(processLogIntervalId);
    processLogIntervalId = null;
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});