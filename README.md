# ⚡ NEXORA — College Technology Club Portal

> **"CREATE. INNOVATE. INSPIRE."**  
> A modern, responsive, and futuristic college technology club web application built with **HTML5, CSS3, Vanilla JavaScript, Node.js, Express.js, and MongoDB**.

---

## 🌟 Overview

**NEXORA** is a collegiate technology society where students learn full-stack web development, artificial intelligence, cybersecurity, UI/UX design, and participate in competitive coding and national hackathons.

This project delivers a **premium, futuristic dark-themed frontend** with neon glassmorphism and an **approachable, robust Node.js/Express.js backend** with MongoDB database persistence.

---

## 🏗️ Architecture

```
[ Frontend: HTML5 + CSS3 + Vanilla JavaScript ]
                      │
                      │  HTTP REST API Requests (Fetch API)
                      ▼
[ Backend Server: Node.js + Express.js (PORT 5000) ]
                      │
                      │  Mongoose ODM (with in-memory fallback)
                      ▼
[ Database: MongoDB (Collections: events, registrations, contacts) ]
```

---

## 📁 Project Structure

```
NEXORA/
│
├── public/                     # Static Frontend Assets
│   ├── index.html              # Landing page (Hero, Stats, Activities, Events, Team, Gallery, Contact)
│   ├── about.html              # Deep-dive club story, mission, vision, values & milestone timeline
│   ├── events.html             # Dynamic technical events hub with category filters & search
│   ├── team.html               # Executive board (President, VP, Tech Lead, etc.) & domain mentors
│   ├── gallery.html            # Photography gallery with JavaScript interactive lightbox
│   ├── contact.html            # Contact info, inquiry form & interactive FAQ accordion
│   │
│   ├── css/
│   │   └── style.css           # Design system, glassmorphism, responsive grid, animations
│   │
│   ├── js/
│   │   └── script.js           # DOM manipulation, canvas particles, animated counters, API fetch
│   │
│   └── images/
│       └── favicon.svg         # SVG Brand icon & logo
│
├── models/                     # Mongoose Data Models
│   ├── Event.js                # Schema for club events & hackathons
│   ├── Registration.js         # Schema for student event registrations
│   └── Contact.js              # Schema for user contact inquiries
│
├── server.js                   # Main Express application & REST API endpoints
├── package.json                # Project dependencies and startup scripts
├── .env                        # Environment configuration (Port, Database URI)
├── .env.example                # Sample environment template
└── README.md                   # Comprehensive guide and viva prep notes
```

---

## 🚀 Key Features

### 🎨 Frontend (HTML5, CSS3, Vanilla JS)
- **Visual Design**: Sleek dark space theme (`#07080e`), electric cyan and purple neon gradients, glassmorphism (`backdrop-filter: blur(16px)`), glowing buttons, and rounded cards.
- **Hero Section**: Full-screen entrance with interactive constellation **canvas particles** and floating glass badges.
- **Animated Counters**: Numbers (`500+ Members`, `30+ Events`, `20+ Projects`, `10+ Workshops`) smoothly increment from 0 to target when scrolled into view.
- **Activities Grid**: 6 domain cards (Web Development, AI & ML, Cybersecurity, Hackathons, UI/UX, Coding) with neon glow hover effects.
- **Dynamic Events Hub**: Real-time event loading from `/api/events` with search bar and category filters.
- **Event Registration Modal**: Interactive modal prefilled with event title; posts to backend with instant feedback toast.
- **Working Contact Form**: Submits messages directly to `/api/contact` and saves to MongoDB.
- **Interactive Gallery Lightbox**: Click-to-zoom modal for high-definition event photography.
- **Responsive Navigation**: Glassmorphic sticky header with mobile hamburger drawer.
- **Toast Notifications**: Built-in alert toast system for success and error messages.

### ⚙️ Backend (Node.js, Express, MongoDB)
- **Express.js API**: Clean RESTful endpoints serving static frontend and handling data exchanges.
- **MongoDB + Mongoose**: Schemas for `Event`, `Registration`, and `Contact`.
- **Auto-Seeding**: Seeds initial sample events if the database is newly initialized.
- **Zero-Crash Resilience**: If local MongoDB service is not started, the server automatically provides a smart in-memory data store so student demonstrations run without errors.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, CSS3 (Vanilla CSS with Custom Properties), Vanilla JavaScript (ES6+) |
| **Icons & Typography** | Font Awesome 6, Google Fonts (Outfit, Plus Jakarta Sans, Space Grotesk) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Utilities** | dotenv, cors |

---

## 💻 Step-by-Step Local Setup

### 1. Prerequisites
- **Node.js** (v16.x or higher) installed. Download from [nodejs.org](https://nodejs.org/).
- *(Optional)* **MongoDB** installed locally or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string.

### 2. Install Dependencies
Open your terminal in the project root directory and run:
```bash
npm install
```

### 3. Configure Environment Variables
Create or verify `.env` in the root folder:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nexora_db
```

### 4. Start the Application
```bash
npm start
```
*(Or if developing with auto-restart: `npm run dev`)*

### 5. Access in Browser
Open your browser and navigate to:
```
http://localhost:5000
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Sample Request Body / Parameters |
|---|---|---|---|
| `GET` | `/api/events` | Retrieve all club events | None |
| `POST` | `/api/events` | Add a new event | `{ "title": "AI Summit", "date": "Nov 15", "description": "...", "category": "Workshop" }` |
| `DELETE` | `/api/events/:id` | Delete an event by ID | URL parameter `:id` |
| `POST` | `/api/register` | Register student for event | `{ "name": "Aarav", "email": "aarav@college.edu", "event": "NEXORA HACK 2026", "year": "2nd Year", "department": "CSE" }` |
| `GET` | `/api/registrations` | View all registrations | None (Admin) |
| `POST` | `/api/contact` | Submit contact message | `{ "name": "Diya", "email": "diya@college.edu", "subject": "Join", "message": "Hello!" }` |
| `GET` | `/api/contacts` | View contact messages | None (Admin) |
| `GET` | `/api/status` | System health & DB status | None |

---

## 🎓 B.Tech CSE Viva / Examination Q&A Guide

### Q1: How does the frontend communicate with the backend?
> **Answer:** The frontend uses the native JavaScript `fetch()` API with `async/await` to send asynchronous HTTP requests (`GET` and `POST`) to Express routes such as `/api/events`, `/api/register`, and `/api/contact` using JSON payloads.

### Q2: What is Mongoose and why do we use it?
> **Answer:** Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a structured schema definition, built-in validation, type casting, and query building methods to interact cleanly with MongoDB documents.

### Q3: Why is static file serving configured with `express.static()`?
> **Answer:** `app.use(express.static('public'))` instructs Express to serve all client-side assets (HTML files, CSS, JavaScript, images) directly from the `public` directory when requested by the browser.

### Q4: How is responsive design achieved without CSS frameworks like Bootstrap or Tailwind?
> **Answer:** Responsive design is implemented using modern CSS3 standards: **CSS Grid**, **Flexbox**, CSS custom properties (`var(--...)`), and **CSS Media Queries** (`@media (max-width: 768px)`) to adapt layouts for mobile, tablet, and desktop screens.

### Q5: How do the animated statistics counters work?
> **Answer:** Using JavaScript's `IntersectionObserver` API, we detect when the `.stat-card` elements scroll into the viewport. Once visible, `setInterval()` increments the counter value smoothly from 0 to the target number (`data-target`) over a set duration.

---

## 📜 License
Developed for educational and technical demonstration purposes under the **ISC License**.  
&copy; 2026 NEXORA College Technology Club. All Rights Reserved.
