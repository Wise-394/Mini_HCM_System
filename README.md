<div align="center">

# ⏱️ Mini HCM Time Tracking

**Lightweight Human Capital Management, built with free tools.**

*Record punches, compute hours, track OT, night differential, lateness, and undertime — all in one place.*

<br />

![Status](https://img.shields.io/badge/Status-Active%20Development-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

</div>
<div align="center">

### 🌐 [mini-hcm-system.web.app](https://mini-hcm-system.web.app/)

</div>
---

## Overview

**Mini HCM** is a full-stack time tracking system. It handles employee punch-in/punch-out, automatically computes worked hours, overtime (OT), night differential (ND), lateness, and undertime and surfaces everything in a clean daily dashboard.

Built entirely on **free-tier tools**: Firebase for auth and data, React for the frontend, and Node.js + Express for server-side computation.

---

## Tech Stack

### 🖥️ Frontend

<p>
  <img src="https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
</p>

### ⚙️ Backend

<p>
  <img src="https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
</p>

### 🔥 Database & Auth

<p>
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Firestore-FF6F00?style=for-the-badge&logo=firebase&logoColor=white" alt="Firestore" />
  <img src="https://img.shields.io/badge/Firebase_Auth-4285F4?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase Auth" />
</p>

### ☁️ Hosting

<p>
  <img src="https://img.shields.io/badge/Firebase_Hosting-FFA000?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase Hosting" />
  <img src="https://img.shields.io/badge/Railway-46E3B7?style=for-the-badge&logo=railway&logoColor=white" alt="Railway" />
</p>

---
## Screenshots

<div align="center">
   <img width="1130" height="809" alt="image" src="https://github.com/user-attachments/assets/cae5c1ff-b524-4167-961a-9a3c1bb05fbc" />
  <img width="1128" height="811" alt="image" src="https://github.com/user-attachments/assets/59437df7-ebbf-4644-a0d7-3803e60dbfde" />
  <img width="1128" height="813" alt="image" src="https://github.com/user-attachments/assets/741dae6c-b1f4-45f7-bf09-fc7c73926188" />
  <img width="1128" height="813" alt="image" src="https://github.com/user-attachments/assets/4eb2650c-3c5d-4d67-81a4-f8f3fbce9c04" />
  <img width="1125" height="811" alt="image" src="https://github.com/user-attachments/assets/4eb38b1b-3b8a-4302-83b0-277d5c8dde33" />
  <img width="1127" height="809" alt="image" src="https://github.com/user-attachments/assets/a6e4d41e-7069-4822-8dbe-593fd0363e10" />
</div>

---

## Features

### Authentication & User Management
- **Email/Password auth** via Firebase Authentication
- User profiles stored in Firestore with `name`, `email`, `role`, and `timezone`
- Each user has a **shift schedule** (`start` / `end` times) used for all computations
- **Role-based access** — Employee and Admin roles

### Time-In / Time-Out
- Simple **Punch In / Punch Out** interface built in React
- Punches saved to Firestore `attendance` collection with timestamp and user ID
- Real-time feedback on punch status

### Automatic Hour Computation
All computed server-side via Node.js + Express:
- **Regular hours** — time worked within the scheduled shift
- **Overtime (OT)** — hours beyond shift end
- **Night Differential (ND)** — hours worked between 22:00 and 06:00
- **Late** — arrival time after scheduled shift start
- **Undertime** — departure before scheduled shift end

### Daily Summary Dashboard
- Daily totals stored in Firestore `dailySummary` collection
- React dashboard with full **KPI breakdown**: regular hours, OT, ND, late, and undertime
- History table for reviewing past days at a glance

### Admin Tools
- View and edit employee punch records
- Daily for all employees
- Full metrics per employee: regular, OT, ND, late, undertime

---

## Getting Started

### Prerequisites
- Node.js v18+
- A Firebase project (free tier is sufficient)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mini-hcm.git
cd mini-hcm

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Environment Variables

**Client** — create `client/.env`:
```env
VITE_BACKEND_API=http://localhost:3000
```

**Server** — place your Firebase service account key file in the server directory and reference it in your config (e.g. `serviceAccountKey.json`).

### Run in Development

```bash
# Start the backend
cd server && npm run dev

# Start the frontend (new terminal)
cd client && npm run dev
```

---

## Computation Logic

| Metric | Rule |
|---|---|
| Regular Hours | Time worked within scheduled shift window |
| Overtime (OT) | Time worked beyond scheduled shift end |
| Night Differential (ND) | Any hours worked between 22:00 – 06:00 |
| Late | Punch-in time minus scheduled shift start (if positive) |
| Undertime | Scheduled shift end minus punch-out time (if positive) |

Shift schedule is stored per user in Firestore:
```js
schedule: { start: '09:00', end: '18:00' }
```


<div align="center">
  <sub>Built with free tools. Designed to demonstrate core HCM fundamentals.</sub>
</div>
