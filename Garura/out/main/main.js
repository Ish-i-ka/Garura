"use strict";
const electron = require("electron");
const path = require("node:path");
const os = require("node:os");
const node_child_process = require("node:child_process");
const axios = require("axios");
const socket_ioClient = require("socket.io-client");
const execa = require("execa");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const SERVER_URL = "https://garuraweb.onrender.com";
const FLAGGED_APPS = [
  "obs64.exe",
  "obs32.exe",
  "discord.exe",
  "anydesk.exe",
  "teamviewer.exe",
  "slack.exe",
  "skype.exe",
  "zoom.exe",
  "mstsc.exe"
];
const PROCESS_LOG_INTERVAL_MS = 10 * 60 * 1e3;
let win = null;
let socket = null;
let processLogIntervalId = null;
let ctrlPressCount = 0;
let securityCleanup = null;
const getRunningProcesses = () => new Promise((resolve, reject) => {
  const command = os.platform() === "win32" ? "tasklist" : "ps -ax";
  node_child_process.exec(command, (err, stdout) => err ? reject(err) : resolve(stdout));
});
const checkDisplayAffinity = () => {
  return new Promise(async (resolve) => {
    if (os.platform() !== "win32") return resolve(false);
    const scriptPath = electron.app.isPackaged ? path.join(process.resourcesPath, "..", "scripts", "check_affinity.ps1") : path.resolve(__dirname, "../../scripts/check_affinity.ps1");
    try {
      const { stdout } = await execa.execa(
        "powershell.exe",
        ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPath],
        { timeout: 5e3 }
      );
      const result = stdout.trim().toLowerCase();
      console.log(`Display Affinity Scan Result: ${result}`);
      resolve(result === "true");
    } catch (error) {
      console.error("PowerShell script execution failed:", error);
      resolve(false);
    }
  });
};
const startProcessLogging = (roomCode) => {
  const log = async () => {
    try {
      const processList = await getRunningProcesses();
      await axios.post(`${SERVER_URL}/api/log/process`, { roomCode, processList });
      console.log(`[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}] Successfully sent process log.`);
    } catch (error) {
      console.error("Failed to log processes.");
    }
  };
  log();
  processLogIntervalId = setInterval(log, PROCESS_LOG_INTERVAL_MS);
};
function startSecurityMonitoring(window, roomCode) {
  console.log("Starting security monitoring for room:", roomCode);
  electron.globalShortcut.register("PrintScreen", () => {
    socket?.emit("security-alert", roomCode, {
      type: "Screenshot Attempt",
      message: "Candidate tried to take a screenshot; app terminated."
    });
    setTimeout(() => electron.app.quit(), 500);
  });
  const clipboardInterval = setInterval(() => electron.clipboard.clear(), 5e3);
  const handleBlur = () => {
    socket?.emit("security-alert", roomCode, {
      type: "Focus Loss",
      message: "Candidate switched away from the interview window."
    });
  };
  window.on("blur", handleBlur);
  const handleKeyPress = (event, input) => {
    if (input.key.toLowerCase() === "control" && input.type === "keyDown" && !input.isAutoRepeat) {
      ctrlPressCount++;
      console.log(`[Input Event] Control key pressed. Count: ${ctrlPressCount}`);
      window.webContents.send("event:ctrl-key-warning", ctrlPressCount);
      socket?.emit("security-alert", roomCode, {
        type: "Ctrl Key Pressed",
        message: `Candidate pressed the Ctrl key. (Count: ${ctrlPressCount})`
      });
      if (ctrlPressCount >= 3) {
        console.log("Ctrl key limit reached! Terminating.");
        socket?.emit("security-alert", roomCode, {
          type: "Suspicious Activity",
          message: "Candidate pressed the Ctrl key 3 times; app terminated."
        });
        setTimeout(() => electron.app.quit(), 500);
      }
    }
  };
  window.webContents.on("before-input-event", handleKeyPress);
  return () => {
    console.log("Cleaning up security monitoring...");
    electron.globalShortcut.unregister("PrintScreen");
    clearInterval(clipboardInterval);
    if (!window.isDestroyed()) {
      window.off("blur", handleBlur);
      window.webContents.off("before-input-event", handleKeyPress);
    }
  };
}
function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  win = new electron.BrowserWindow({
    width,
    height,
    frame: false,
    kiosk: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js")
    }
  });
  win.setClosable(false);
  win.setMinimizable(false);
  win.setMovable(false);
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
  if (!electron.app.isPackaged) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}
function initializeIpcHandlers() {
  electron.ipcMain.handle("run-pre-launch-scan", async () => {
    try {
      const processes = (await getRunningProcesses()).toLowerCase();
      const flaggedApp = FLAGGED_APPS.find((app2) => processes.includes(app2.toLowerCase()));
      if (flaggedApp) return { success: false, reason: `Please close: ${flaggedApp}` };
      if (await checkDisplayAffinity()) return { success: false, reason: "A window with screen capture protection is active." };
      return { success: true };
    } catch (error) {
      return { success: false, reason: "Failed to scan processes. Please run as administrator." };
    }
  });
  electron.ipcMain.handle("api:verify-room", async (_, rc) => axios.post(`${SERVER_URL}/api/interview/verify-room`, { roomCode: rc }).then((r) => r.data));
  electron.ipcMain.handle("api:get-stream-token", async (_, uid, rc) => axios.post(`${SERVER_URL}/api/stream/token`, { userId: uid, roomCode: rc }).then((r) => r.data));
  electron.ipcMain.handle("api:submit-quiz", async (_, payload) => axios.post(`${SERVER_URL}/api/quiz/submit`, payload).then((res) => res.data));
  electron.ipcMain.handle("api:run-code", async (_, payload) => axios.post(`${SERVER_URL}/api/code/run`, payload).then((res) => res.data));
  electron.ipcMain.on("socket:connect", (_, roomCode) => {
    if (socket?.connected) return;
    socket = socket_ioClient.io(SERVER_URL, { path: "/api/socket", transports: ["polling"] });
    socket.on("connect", () => {
      console.log("Socket.IO connected to server.");
      socket?.emit("join-room", roomCode, `interviewee-${socket.id}`);
      startProcessLogging(roomCode);
      if (win) {
        securityCleanup = startSecurityMonitoring(win, roomCode);
      }
    });
    socket.on("interview-ended", () => win?.webContents.send("event:interview-ended"));
    socket.on("receive-coding-question", (md) => win?.webContents.send("event:new-question", md));
    socket.on("quiz-started", (data) => win?.webContents.send("event:quiz-started", data));
  });
  electron.ipcMain.on("socket:disconnect", () => {
    if (securityCleanup) {
      securityCleanup();
      securityCleanup = null;
    }
    ctrlPressCount = 0;
    socket?.disconnect();
    if (processLogIntervalId) {
      clearInterval(processLogIntervalId);
      processLogIntervalId = null;
    }
  });
  electron.ipcMain.on("socket:quiz-scored", (_, payload) => socket?.emit("quiz-scored", payload.roomCode, { score: payload.score, total: payload.total }));
  electron.ipcMain.on("socket:send-chat", (_, payload) => socket?.emit("send-chat-message", payload.roomCode, { sender: "interviewee", text: payload.text }));
  electron.ipcMain.on("socket:submit-code", (_, payload) => socket?.emit("code-submitted", payload.roomCode, payload.code));
}
initializeIpcHandlers();
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("will-quit", () => {
  if (securityCleanup) {
    securityCleanup();
    securityCleanup = null;
  }
  electron.globalShortcut.unregisterAll();
  if (processLogIntervalId) {
    clearInterval(processLogIntervalId);
    processLogIntervalId = null;
  }
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
