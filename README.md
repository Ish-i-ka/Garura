Of course. My apologies for the naming inconsistency and the use of emojis. You are right to want a clean, professional, and accurate README for your project.

Here is the complete, corrected, and professional README file in Markdown, incorporating the exact name "Garura" and the deployment link you provided.

---

```markdown
# Garura: The Secure Remote Interview Platform

<!-- TODO: Replace with a project banner image -->
<!-- ![Garura Banner](https://user-images.githubusercontent.com/path/to/your/banner.png) -->

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![TypeScript](https://img.shields.io/badge/--blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)

**Garura is a high-integrity, cheat-proof remote interview platform designed to validate a candidate's true skills by creating a secure, monitored, and controlled testing environment.**

**Live Demo:** [**https://garuraweb.onrender.com/**](https://garuraweb.onrender.com/)

---

### Table of Contents

- [The Problem](#the-problem-the-rise-of-the-interview-coder)
- [The Solution: Garura](#the-solution-garura--a-proctoring-powerhouse)
- [Key Features](#key-features)
  - [For the Interviewer (Web Platform)](#for-the-interviewer-web-platform)
  - [The Garura Security Shield](#the-garura-security-shield-the-core-usp)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Live Workflow Scenario](#live-workflow-scenario)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. The Web Platform (Server & Interviewer Client)](#1-the-web-platform-server--interviewer-client)
  - [2. The Garura Desktop App (Interviewee Client)](#2-the-garura-desktop-app-interviewee-client)
- [Roadmap](#roadmap)
- [License](#license)

---

### The Problem: The Rise of the "Interview Coder"

In an era of remote work, the integrity of technical interviews is under constant threat. Sophisticated tools, known as "Interview Coders," have emerged that allow candidates to cheat in real-time. These applications can:

- Transcribe the interviewer's questions and feed them to an AI for instant answers.
- Overlay an invisible window on the screen that the interviewee can see but is not captured by screen sharing.
- Allow a "helper" to see the screen and type solutions remotely.

This erosion of trust undermines meritocracy and makes it incredibly difficult for companies to identify genuine talent. Standard platforms like HackerRank or Zoom operate on a foundation of trust and are easily bypassed by these tools.

### The Solution: Garura – A Proctoring Powerhouse

Garura is not just another video call with a code editor. It is a purpose-built system designed to actively combat real-time cheating. Its core differentiator is a mandatory **asymmetric architecture**:

- **Interviewers** use a flexible and powerful web application.
- **Interviewees** are **required** to join via a custom, locked-down **Electron desktop application**.

This desktop client acts as a "sandbox," giving Garura the necessary permissions to monitor the candidate's environment, a level of control that is impossible for a purely browser-based platform to achieve.

<!-- TODO: Add a screenshot or GIF of the platform in action -->
<!-- ![Screenshot](https://user-images.githubusercontent.com/path/to/your/screenshot.png) -->

### Key Features

#### For the Interviewer (Web Platform)

- **Dynamic Session Creation:** Configure interviews on the fly by enabling/disabling modules like a whiteboard, a coding challenge, or a quiz.
- **AI-Powered Quiz Generation:** Don't rely on a fixed question bank. Specify a topic (e.g., "React Hooks," "Cybersecurity Fundamentals"), number of questions, and duration, and Garura uses **Google Gemini** to generate a unique quiz for that session.
- **Three-Pane Command Center:**
    1.  **Video Pane:** An intelligent grid that gracefully arranges video feeds and screen shares, powered by **Stream.io**.
    2.  **Control Pane:** Push Markdown-formatted coding questions, launch the AI quiz, and view security alerts.
    3.  **Chat Pane:** Real-time text communication.
- **Comprehensive Dashboard:** View a history of all past interviews and access their generated integrity reports.

#### The Garura Security Shield (The Core USP)

These features run silently inside the interviewee's mandatory Electron app:

- **Pre-Launch Process Scan:** Before the app window even opens, it scans the system's running processes against a "flagged list" of known cheating software. If a match is found, Garura refuses to start.
- **Continuous Process Logging:** Every 5 minutes, the app captures a full snapshot of the interviewee's running processes and sends it to the server.
- **The Final Integrity Report:** When the interviewer ends the call, a time-stamped text file containing all logged processes is generated. This provides an undeniable audit trail of the candidate's environment during the interview.
- **Screenshot Blocking:** Any attempt to use system-level screenshot tools **immediately terminates the application**, serving as an unambiguous red flag to the interviewer.
- **Clipboard Neutralization:** Copy-paste functionality is disabled, ensuring the code written is the candidate's own.
- **Focus & Minimize Detection:** If the application loses focus or is minimized, a real-time alert is sent to the interviewer's screen.
- **Forced Permissions:** The interviewee's microphone is permanently enabled, and full-screen sharing is mandatory to provide complete environmental context.

### Tech Stack & Architecture

Garura is a monorepo composed of two main packages: `platform` (the Next.js web app) and `Garura` (the Electron desktop app).

| Category                  | Technology                                                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Web Platform (Server)** | ![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=next.js) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript) ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js) |
| **Web Platform (Client)** | ![React](https://img.shields.io/badge/-React-61DAFB?logo=react) ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwindcss) ![shadcn/ui](https://img.shields.io/badge/-shadcn/ui-000000)      |
| **Interviewee App**       | ![Electron](https://img.shields.io/badge/-Electron-47848F?logo=electron) ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite) ![React](https://img.shields.io/badge/-React-61DAFB?logo=react)            |
| **Database & ORM**        | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql) ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?logo=prisma)                               |
| **Real-time Communication** | ![Stream](https://img.shields.io/badge/-Stream%20(Video)-FF7A00) ![Socket.IO](https://img.shields.io/badge/-Socket.IO-010101?logo=socket.io)                                 |
| **AI Integration**        | ![Google Gemini](https://img.shields.io/badge/-Google%20Gemini-8E77D8)                                      |

### Live Workflow Scenario

1.  **Setup:** Interviewer Priya logs into the Garura web platform. She creates a new interview session for a "Senior Frontend Developer" role, enabling the Coding Challenge and an AI Quiz on the topic of "React Performance." She copies the unique Room Code.
2.  **Joining:** Candidate Alex receives the code. He opens the mandatory Garura Electron app. The app quickly scans his system for flagged applications and, finding none, allows him to proceed. He enters the Room Code and grants the required camera, microphone, and full-screen sharing permissions.
3.  **The Interview:** Priya and Alex can see and hear each other. Priya pushes a coding question to Alex's screen. Alex writes the solution in the provided editor. Meanwhile, Garura silently logs his running processes every 5 minutes.
4.  **Dynamic Challenge:** Priya clicks "Launch Quiz." The Garura server sends the topic "React Performance" to Google Gemini, receives a fresh set of questions, and pushes them to Alex's app. Alex completes the quiz within the time limit.
5.  **Conclusion:** Priya ends the call using the "End Interview for All" button. The call terminates for both users.
6.  **Post-Mortem:** Priya is redirected to her dashboard. She sees the completed interview in her "Past Interviews" list and clicks "View Report." A text file opens, showing the process logs captured during the session, confirming that no suspicious applications were running.

### Getting Started

Follow these instructions to get Garura running locally for development and testing.

#### Prerequisites

- Node.js (v18 or later)
- `npm` or your preferred package manager
- A local or remote PostgreSQL database instance

#### 1. The Web Platform (Server & Interviewer Client)

```bash
# Navigate to the platform directory
cd platform

# Install dependencies
npm install

# Set up your environment variables
# Copy the example file and fill in your database URL, JWT secret, and API keys
cp .env.example .env

# Run Prisma migrations to set up your database schema
npx prisma migrate dev

# Start the development server
npm run dev
```
The interviewer web app will be available at `http://localhost:3000`.

#### 2. The Garura Desktop App (Interviewee Client)

```bash
# Navigate to the Garura Electron app directory
cd Garura

# Install dependencies
npm install

# Start the development build
npm run dev
```
The Electron application window for the interviewee will launch.

### Roadmap

- **Advanced Anomaly Detection:** Use AI to analyze the process log reports and automatically flag suspicious patterns.
- **Plagiarism Detection:** Integrate a plagiarism checker for the code editor.
- **Interview Replay:** A feature to record and replay the entire session (video, code, and chat) for review.
- **Expanded Flagged List:** Continuously update the list of known cheating applications.
- **Company/Team Accounts:** Introduce organizational accounts for managing multiple interviewers.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built by **TheBotheads**.
```
