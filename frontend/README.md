# 🎨 CollabBoard – Real-Time Collaborative Whiteboard

> A full-stack, real-time collaborative whiteboard for remote teams, classrooms, and creators.  
> Draw, chat, annotate, and share ideas — all in one place.

<p align="center">
  <img src="./docs/whiteboard-preview.gif" alt="Collaborative Whiteboard Preview" width="800"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/real--time-websockets-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/collaboration-multiuser-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" />
</p>

---

## 📚 Table of Contents

1. [Background](#-background)
2. [Features](#-features)
   - [User Features](#user-features)
   - [Admin / Moderator Features](#admin--moderator-features)
3. [System Overview & Architecture](#-system-overview--architecture)
4. [Tech Stack (Suggested)](#-tech-stack-suggested)
5. [Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Running the App](#running-the-app)
6. [Usage Guide](#-usage-guide)
   - [User Flow](#user-flow)
   - [Whiteboard Tools](#whiteboard-tools)
   - [Roles & Permissions](#roles--permissions)
   - [Chat & Comments](#chat--comments)
   - [Saving & Exporting](#saving--exporting)
7. [Real-Time Collaboration](#-real-time-collaboration)
8. [Security & Non-Functional Requirements](#-security--non-functional-requirements)
9. [Analytics & Admin Dashboard](#-analytics--admin-dashboard)
10. [Roadmap](#-roadmap)
11. [Contributing](#-contributing)
12. [License](#-license)

---

## 🧠 Background

Remote work, online education, and distributed teams are now the norm. Traditional tools often lack **truly interactive** and **visual** real-time collaboration.

**CollabBoard** aims to solve that by providing:

- A **shared canvas** where multiple users can draw, type, and annotate together.
- **Real-time updates** with low latency.
- **Persistent sessions** that can be saved, organized, and revisited.
- **Export options** for sharing outcomes as images or PDFs.
- **Built-in chat** for context-rich collaboration.

---

## ✨ Features

### 👥 User Features

- ✅ **Authentication**
  - Register, log in, and manage your profile.
- 🧾 **Whiteboard Sessions**
  - Create new whiteboard sessions.
  - Join existing sessions via **unique link** or **session code**.
- 🎨 **Drawing & Annotation Tools**
  - Pen & highlighter tools.
  - Eraser.
  - Basic shapes (rectangle, circle, line, arrow).
  - Text boxes.
  - Sticky notes.
  - Color & thickness picker.
- 🤝 **Real-Time Collaboration**
  - View others’ actions live (in < 2s).
  - Show participant cursors / presence indicators (optional).
- 💾 **Persistence**
  - Save whiteboards to your account.
  - Load previously saved boards.
  - Version history (optional, if implemented).
- 📤 **Export**
  - Export whiteboard as:
    - 🖼️ PNG / JPEG.
    - 📄 PDF.
- 💬 **Communication**
  - In-session **chat** for real-time discussion.
  - Inline **comments** attached to specific areas (optional).

### 🛡️ Admin / Moderator Features

- 👤 **User Management**
  - View, deactivate/ban users (for misuse).
- 🧷 **Session Moderation**
  - Grant / revoke edit access.
  - Promote/demote users: Owner / Editor / Viewer.
- 📊 **Analytics Dashboard**
  - Active sessions count.
  - Online users.
  - Most popular tools (pen vs. sticky notes vs. shapes).
  - Session duration & user participation metrics.

<p align="center">
  <img src="./docs/admin-dashboard.png" alt="Admin Dashboard Preview" width="800" />
</p>

---

## 🏗 System Overview & Architecture

At a high level, the system consists of:

- **Client App (Web / Mobile)** – Draw, chat, and interact with boards.
- **API Server** – Auth, REST/GraphQL APIs, persistence.
- **Real-Time Server** – WebSocket/Socket server for live collaboration.
- **Database** – Stores users, sessions, whiteboard data, messages, analytics.
- **File/Storage Layer** – Stores exports & snapshots.

> Replace the image below with your actual architecture diagram.

<p align="center">
  <img src="./docs/architecture-diagram.png" alt="System Architecture Diagram" width="800" />
</p>

**Core flows:**

- Client connects to server via **WebSocket** for real-time canvas updates.
- Client uses **REST/GraphQL** for auth, saving/loading boards, and listings.
- Whiteboard state can be stored as:
  - JSON of drawing events / operations, or
  - Vector-based model (shapes, strokes, text objects).

---

## 🛠 Tech Stack (Suggested)

You can adapt this section to your actual implementation.

**Frontend (Web)**  
- ⚛️ React - vite 
- 🎨 Tailwind CSS  
- 🕸 Canvas rendering using `HTML5 Canvas` 

**Backend**  
- 🌐 Node.js + Express 
- 🔌 Socket.IO - WebSocket for real-time communication  
- 🗄 MongoDB   for db

**Other**  
- 🔐 JWT / OAuth2 for authentication  
- ☁️ mongodb storage storage for exported file

---

## 🚀 Getting Started

> Below is a generic setup. Adjust paths and commands based on your actual project structure.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- Database (MongoDB)
- npm / yarn / pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Pragativarshney16/team-19-project
cd team-19-project

# 2. Install server dependencies
cd server
npm install
npm run dev

# 3. Install client dependencies
cd ../client
npm install
npm run dev
