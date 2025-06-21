# Garura: The Secure Remote Interview Platform  
**A Hack4Bengal 4.0 (2025) Submission by TheBotheads**  

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![TypeScript](https://img.shields.io/badge/--blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)

**Garura is a high-integrity, cheat-proof remote interview platform designed to validate a candidate's true skills through a secure, monitored testing environment.**  

**Live Demo:** [https://garuraweb.onrender.com/](https://garuraweb.onrender.com/)  

---

## Table of Contents
- [The Problem](#the-problem-crisis-of-integrity-in-remote-interviews)
- [Our Solution](#our-solution-garura)
- [Core Features](#core-features)
  - [For Interviewers](#for-interviewers-web-platform)
  - [For Interviewees](#for-interviewees-desktop-client)
- [Security Shield](#security-shield)
- [Tech Stack](#tech-stack)
- [Workflow Scenario](#workflow-scenario)
- [Getting Started](#getting-started)
  - [Web Platform Setup](#1-web-platform-server--interviewer-client)
  - [Desktop App Setup](#2-desktop-app-interviewee-client)
- [Directory Structure](#directory-structure)
- [Team](#team)
- [License](#license)

---

## The Problem: Crisis of Integrity in Remote Interviews  
Remote technical interviews face critical vulnerabilities from sophisticated cheating tools that can:  
- 🚨 Transcribe questions and feed AI-generated answers in real-time  
- 🕵️ Overlay invisible windows undetectable by screen sharing  
- 👥 Allow remote "helpers" to solve challenges  
Standard platforms (Zoom, HackerRank) lack system-level control, eroding trust in meritocracy and increasing hiring costs.

## Our Solution: Garura  
Garura enforces integrity through an **asymmetric architecture**:  
- **Interviewers** use a flexible web platform  
- **Interviewees** join via a mandatory locked-down Electron desktop app  

This architecture enables system-level security impossible in browser-based solutions, creating a trusted assessment environment.  

![Garura Banner](https://github.com/SatoruZati/Garura/blob/4a9eebdc07c58dd1008863a1e58a6184d39381fe/Banner.png)  

## Core Features  

### For Interviewers (Web Platform)  
- **Dynamic Session Builder**  
  Enable/disable modules (code editor, whiteboard, quiz) per interview  
- **AI-Powered Quiz Generation**  
  Generate unique tests on any topic using Google Gemini  
- **Three-Pane Command Center**  
  - *Video Pane*: Intelligent video grid (Stream.io)  
  - *Control Pane*: Push questions, launch quizzes, view alerts  
  - *Chat Pane*: Real-time communication  
- **Comprehensive Dashboard**  
  Review past interviews with integrity reports  

### For Interviewees (Desktop Client)  
- **Locked-Down Kiosk Mode**  
  Borderless full-screen with no minimize/close buttons  
- **Integrated Tool Suite**  
  - CodeMirror editor (Java/C++/Python/JS) with Judge0 execution  
  - tldraw-powered whiteboard  
  - Unified interface for all tools  
- **Immutable Audio/Video**  
  Microphone permanently enabled, camera controlled by platform  

## Security Shield  
Garura's Electron app implements military-grade protections:  

| Security Measure              | Description                                                                 | Status |
|-------------------------------|-----------------------------------------------------------------------------|--------|
| **Pre-Launch System Scan**    | Blocks launch if cheating tools (Discord, OBS) are detected                 | ✅     |
| **Display Affinity Scan**     | Detects windows hidden from screen capture (Windows)                        | ✅     |
| **Forced Admin Privileges**   | Requires elevated permissions for deep monitoring                           | ✅     |
| **Screenshot Termination**    | Terminates app instantly on PrintScreen key press                           | ✅     |
| **Ctrl Key Monitoring**       | Alerts interviewer on Ctrl press (3 presses = termination)                  | ✅     |
| **Focus Loss Detection**      | Sends alert when app loses focus (Alt+Tab)                                  | ✅     |
| **Periodic Process Logging**  | Captures running processes every 10 minutes for final report                | ✅     |
| **Clipboard Wiping**          | Periodically clears system clipboard                                        | ✅     |
| **Windows Blur Handler**      | Monitors the window focus and warns if 'blur' triggers                      | ✅     |

## Tech Stack  
**End-to-End Modern Architecture**  

| Component                 | Technologies                                                                 |
|---------------------------|------------------------------------------------------------------------------|
| **Interviewer Platform**  | Next.js, React, TypeScript, TailwindCSS, shadcn/ui                           |
| **Interviewee Desktop**   | Electron, Vite, React, PowerShell (Windows)                                  |
| **Backend & Database**    | Node.js, PostgreSQL, Prisma, Socket.IO                                       |
| **Real-time Services**    | Stream (Video), Google Gemini (AI Quizzes), Judge0 (Code Execution)          |

## Workflow Scenario  
1. **Setup**  
   Interviewer ABC configures a "React Performance" quiz + coding challenge  
2. **Security Scan**  
   Candidate XYZ's system is scanned for cheating tools before app launch  
3. **Controlled Session**  
   - ABC pushes coding questions and AI-generated quizzes  
   - XYZ solves problems in locked-down environment  
   - System silently logs processes every 10 minutes  
4. **Termination & Report**  
   Session ends with integrity report showing all system activities  

## Getting Started  

### 1. Web Platform (Server & Interviewer Client)  

cd platform

# Install dependencies
npm install

# Configure environment
cp .env.example .env  # Add your keys

# Initialize database
npx prisma migrate dev

# Start dev server
npm run dev

Access at: http://localhost:3000

### 2. Desktop App (Interviewee Client)
cd Garura

# Install dependencies
npm install

# Configure environment
cp .env.example .env  # Add Stream API key

# Launch Electron app
npm run dev

## Directory Structure
Directory structure:
└── thecurryguy-garura.git/
    ├── README.md
    ├── LICENSE
    ├── Garura/
    │   ├── README.md
    │   ├── electron.vite.config.ts
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   ├── tsconfig.node.json
    │   ├── vite.config.ts
    │   ├── .gitignore
    │   ├── electron/
    │   │   ├── main.ts
    │   │   └── preload.ts
    │   ├── out/
    │   │   ├── main/
    │   │   │   └── main.js
    │   │   ├── preload/
    │   │   │   └── preload.js
    │   │   └── renderer/
    │   │       ├── index.html
    │   │       └── assets/
    │   │           ├── index-128hJQKo.css
    │   │           ├── index-BE_j8zJx.js
    │   │           └── latency-chart-Bj5OSYzg.es-CFw5dkYU.js
    │   ├── scripts/
    │   │   └── check_affinity.ps1
    │   └── src/
    │       ├── index.css
    │       ├── main.tsx
    │       ├── type.d.ts
    │       ├── vite-env.d.ts
    │       ├── components/
    │       │   ├── App.tsx
    │       │   ├── interview_ui/
    │       │   │   ├── CodeEditor.tsx
    │       │   │   ├── CodeQuestionViewer.tsx
    │       │   │   ├── IntervieweeChat.tsx
    │       │   │   ├── QuizInterface.tsx
    │       │   │   └── Whiteboard.tsx
    │       │   └── screens/
    │       │       ├── 01_PreLaunchScreen.tsx
    │       │       ├── 01a_ScanFailedScreen.tsx
    │       │       ├── 02_RoomEntryScreen.tsx
    │       │       ├── 03_PermissionScreen.tsx
    │       │       └── 04_InterviewRoomScreen.tsx
    │       ├── lib/
    │       │   └── utils.ts
    │       └── store/
    │           └── useAppStore.ts
    └── platform/
        ├── README.md
        ├── components.json
        ├── eslint.config.mjs
        ├── next.config.ts
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.mjs
        ├── tsconfig.json
        ├── .gitignore
        ├── prisma/
        │   ├── schema.prisma
        │   └── migrations/
        │       ├── migration_lock.toml
        │       ├── 20250620180236_init/
        │       │   └── migration.sql
        │       └── 20250621065911_add_report_url/
        │           └── migration.sql
        └── src/
            ├── app/
            │   ├── globals.css
            │   ├── layout.tsx
            │   ├── page.tsx
            │   ├── api/
            │   │   ├── auth/
            │   │   │   ├── login/
            │   │   │   │   └── route.ts
            │   │   │   └── register/
            │   │   │       └── route.ts
            │   │   ├── code/
            │   │   │   └── run/
            │   │   │       └── route.ts
            │   │   ├── interview/
            │   │   │   ├── create/
            │   │   │   │   └── route.ts
            │   │   │   ├── end/
            │   │   │   │   └── route.ts
            │   │   │   ├── history/
            │   │   │   │   └── route.ts
            │   │   │   └── verify-room/
            │   │   │       └── route.ts
            │   │   ├── log/
            │   │   │   └── process/
            │   │   │       └── route.ts
            │   │   ├── quiz/
            │   │   │   ├── generate/
            │   │   │   │   └── route.ts
            │   │   │   └── submit/
            │   │   │       └── route.ts
            │   │   └── stream/
            │   │       └── token/
            │   │           └── route.ts
            │   ├── auth/
            │   │   └── page.tsx
            │   ├── dashboard/
            │   │   └── page.tsx
            │   ├── interview/
            │   │   └── [roomCode]/
            │   │       └── page.tsx
            │   ├── providers/
            │   │   └── AppProviders.tsx
            │   └── store/
            │       ├── useAuthStore.ts
            │       └── useInterviewStore.ts
            ├── components/
            │   ├── auth/
            │   │   ├── LoginForm.tsx
            │   │   └── RegisterForm.tsx
            │   ├── dashboard/
            │   │   ├── CallList.tsx
            │   │   ├── CreateInterviewModal.tsx
            │   │   ├── Loader.tsx
            │   │   └── MeetingCard.tsx
            │   ├── interview/
            │   │   ├── ChatWindow.tsx
            │   │   ├── EndCallButton.tsx
            │   │   ├── InterviewRoom.tsx
            │   │   ├── MeetingRoom.tsx
            │   │   ├── MeetingSetup.tsx
            │   │   ├── RightPaneTabs.tsx
            │   │   └── VideoPane.tsx
            │   └── ui/
            │       ├── alert.tsx
            │       ├── button.tsx
            │       ├── card.tsx
            │       ├── checkbox.tsx
            │       ├── dialog.tsx
            │       ├── dropdown-menu.tsx
            │       ├── form.tsx
            │       ├── input.tsx
            │       ├── label.tsx
            │       ├── resizable.tsx
            │       ├── sonner.tsx
            │       ├── tabs.tsx
            │       └── textarea.tsx
            ├── hooks/
            │   └── useSocket.ts
            ├── lib/
            │   ├── api.ts
            │   ├── auth.ts
            │   ├── gemini.ts
            │   ├── prisma.ts
            │   ├── socket-helper.ts
            │   ├── utils.ts
            │   └── types/
            │       └── index.d.ts
            ├── pages/
            │   └── api/
            │       └── socket.ts
            └── sockets/
                └── index.ts
## Team
TheBotheads - Hack4Bengal 4.0 (2025) Participants

# Key Points

## Advanced Security & Monitoring
1. **Advanced Anomaly Detection**  
   Uses PowerShell scripts to analyze process log reports and automatically flag suspicious patterns in real-time.

2. **Interview Record**  
   Maintains comprehensive session recordings with timestamped process logs for post-interview forensic review.

3. **Expanded Flagged List**  
   Continuously updated database of known cheating applications with automated detection mechanisms.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
