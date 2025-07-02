# WorkSmart Time Management System

A modern, full-stack time management and productivity dashboard built with Next.js, React, Tailwind CSS, Prisma, and PostgreSQL. Includes check-in, document management, and GenAI-powered features.

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Set up your database:**
   - Ensure PostgreSQL is running locally.
   - Configure your `.env` with your database URL.
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev
     ```
3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

---

# Technical Documentation

## Architecture Overview

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM, PostgreSQL
- **Authentication:** Cookie-based JWT, middleware-protected routes
- **GenAI Features:** Mocked GenAI endpoints for document analysis, suggestions, and natural language search
- **File Uploads:** Handled via API routes, stored in `/public/uploads`

### Key Technical Decisions

- **App Directory Routing:** Modular pages for dashboard, check-in, documents, and GenAI features
- **Prisma ORM:** Type-safe database access and migrations
- **Middleware Auth:** Secure, scalable route protection using JWT cookies
- **Component Design:** Reusable, accessible React components for all UI features
- **Mock GenAI:** Easily swappable for real AI APIs in the future

### Architecture Diagram

> _[Add diagram here if available]_

- Dashboard layout with sidebar navigation
- API routes for check-ins, documents, GenAI
- Database models: User, CheckIn, Document

### GenAI Implementation Approach

- **Endpoints:** `/api/genai/analyze-document`, `/api/genai/suggest-workflow`, `/api/genai/nls`
- **Mock Logic:** Simulates document analysis, workflow suggestions, and natural language search
- **Extensible:** Replace mock logic with real AI APIs as needed

---

# Product Documentation

## Product Vision

### Problem Definition & User Needs

- Teams need a unified platform to track work hours, manage documents, and leverage AI for productivity insights.
- Users want easy check-in/out, document uploads, and actionable suggestions.

### Solution Approach & Key Features

- **Check-In System:** Log work hours, activities, and department
- **Document Management:** Upload, categorize, and track status of documents
- **GenAI Features:**
  - Document analysis (extract key info)
  - Workflow suggestions (next steps)
  - Natural language search (ask about documents/check-ins)
- **Dashboard:** Visualize productivity stats, recent activity, and trends
- **Authentication:** Secure login/logout, protected routes

### GenAI Feature Design & Benefits

- **Automated Insights:** AI analyzes documents for key data and anomalies
- **Smart Suggestions:** AI recommends next steps for document workflows
- **Natural Language Search:** Users can ask questions in plain English
- **Productivity Boost:** Less manual work, more actionable information

## User Guide

### 1. Login & Authentication

- Go to `/login` and enter your credentials
- Secure cookie-based session; logout from the dashboard

### 2. Dashboard

- View productivity stats, recent check-ins, and document activity
- Navigate using the sidebar to Check-In, Documents, or GenAI

### 3. Check-In System

- Log your work hours, activities, and department
- View and edit your check-in history

### 4. Document Management

- Upload files (purchase orders, quotes, etc.)
- Assign type and status; link to check-ins if needed
- Download or update document status

### 5. GenAI Features

- **Analyze Document:** Extracts key info from uploaded files
- **Suggest Workflow:** Recommends next steps for a document
- **Natural Language Search:** Ask questions like "Show all approved purchase orders from last month"

---

## Contributing & Extending

- Add new GenAI endpoints by extending `/api/genai/`
- Add new database models in `prisma/schema.prisma` and run migrations
- Update UI components in `src/components/`

---

## License

MIT
