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

## ❓ Why CollabBoard?

The world is remote-first — but existing tools are expensive, laggy, or not truly collaborative.

CollabBoard is built to solve these gaps by enabling **instant visual collaboration** from anywhere.

| Challenge | CollabBoard Solution |
|----------|---------------------|
| Difficult/paid tools | Simple UI, 100% open-source |
| Sync delays & glitchy UX | Fast low-latency WebSockets |
| Work doesn’t persist | Save + restore sessions anytime |
| Lack of collaboration features | Live cursors, chat, presence |
| Limited sharing options | Export as PNG/JPEG/PDF & share links |

> If **Miro + Jamboard + MS Whiteboard** merged into one open-source tool — you’d get **CollabBoard**. 🚀

---

## 📌 Where Can It Be Used?

- 🧑‍💼 Corporate teams — workshops, sprint planning
- 🏫 Schools & universities — live teaching & group work
- ✍️ Creators — storyboards, sketching, wireframes
- 🚀 Hackathons — brainstorming product ideas
- 🎮 Communities — design games / drawing battles

---

## 🎯 Goals of the Application

- Improve **remote collaboration productivity**
- Provide a **visual & interactive** workspace
- Enable **multi-user** real-time editing
- Support **persistence** & secure access
- Maintain **fast performance** and smooth UX

---

## ✨ Features

### 👥 User Features
- 🔐 Authentication (Signup/Login)
- 🧾 Create & join sessions via link or code
- 🎨 Drawing tools: Pencil, Eraser, Shapes, Text
- 📝 Sticky notes & color controls
- 🔄 Real-time live collaboration
- 💬 In-session chat
- 💾 Save sessions & revisit anytime
- 📤 Export: PNG/JPEG/PDF
- 🕒 Optional version history

### 🛡 Admin / Moderator Features
- Manage users (ban / deactivate)
- Control editing permissions
- Promote Owner / Editor / Viewer roles
- Analytics dashboard:
  - Active users & sessions
  - Participation metrics
  - Tool usage statistics

---

## 🏗 System Overview & Architecture

The platform consists of:

- 🎨 **Web Client** — canvas drawing & real-time UI
- 🔌 **WebSocket Server** — broadcast board updates instantly
- 🛠 **REST API** — user auth, session CRUD
- 🗄 **Database** — stores boards, chat & user data
- ☁ Storage for exports (images, PDFs)

<p align="center">
  <img src="./docs/architecture-diagram.png" alt="Architecture Diagram" width="800" />
</p>

---

## 🛠 Tech Stack (Suggested)

| Layer | Technology |
|------|------------|
| Frontend | React (Vite), TailwindCSS, HTML5 Canvas |
| Backend | Node.js + Express |
| Real-time | Socket.IO |
| Database | MongoDB |
| Auth | JWT |
| Storage | MongoDB GridFS or cloud storage |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- MongoDB
- npm / yarn / pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/Pragativarshney16/team-19-project
cd team-19-project

# Backend setup
cd server
npm install
npm run dev

# Frontend setup
cd ../client
npm install
npm run dev
```

- Add .env

```json
# Server
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

# Client
VITE_API_URL=http://localhost:5000/api

```