# 🚆 Railway Safety System

A modern web application built with **Next.js**, **TypeScript**, and **Tailwind CSS** to enhance the safety and monitoring of railway operations. This system features real-time GPS tracking, live train status visualization, delay reporting, and administrative dashboards to assist in proactive railway management.

---

## ⚙️ Tech Stack

- **Frontend Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Package Manager:** pnpm
- **APIs:** Built using Next.js serverless functions
- **UI Components:** Custom + likely [shadcn/ui](https://ui.shadcn.dev/)

---

## 🚀 Features

✅ Live GPS Tracker for trains  
✅ Real-time train delay reporting  
✅ Admin dashboard for railway system health  
✅ Booking and status management components  
✅ Notifications and analytics section  
✅ Fully responsive & modern UI  

---

## 📁 Project Structure

```bash
Railway_Safety_System/
├── app/                            # Main application directory (Next.js App Router)
│   ├── api/                        # API route handlers (serverless functions)
│   │   ├── auth/                   # Authentication routes
│   │   ├── gps/                    # GPS tracking routes
│   │   ├── train-stream/           # Live data stream
│   │   └── trains/                 # Train-related API endpoints
│   ├── page.tsx                    # Main landing page
│   ├── layout.tsx                  # Root layout for the app
│   ├── globals.css                 # Global styles
│   └── loading.tsx                # Loading skeleton or fallback
│
├── components/                     # Reusable React UI components
│   ├── live-train-map.tsx         # Live map visualizing train positions
│   ├── train-status.tsx           # Train status display
│   ├── gps-tracker-demo.tsx       # Demo component for GPS
│   ├── booking-form.tsx           # Ticket booking form
│   ├── admin-section.tsx          # Admin dashboard area
│   ├── analytics-section.tsx      # Analytics and reports
│   ├── notification-center.tsx    # Notification system
│   └── system-health.tsx          # Monitor system health and alerts
│
├── public/                         # Static assets (images, icons, etc.)
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.mjs             # PostCSS configuration
├── tsconfig.json                  # TypeScript configuration
├── middleware.ts                  # Middleware logic (e.g., auth, logging)
├── package.json                   # Project metadata and scripts
└── pnpm-lock.yaml                 # Dependency lock file for pnpm
```

---

## 🧑‍💻 Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) (Install with `npm i -g pnpm`)

---

### 📦 Installation

### Clone the repository

```bash
git clone https://github.com/your-username/railway-safety-system.git
```

### Navigate into the project folder

```bash
cd Railway_Safety_System
```

### Install dependencies

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

### Open in browser

```bash
http://localhost:3000
```

---
