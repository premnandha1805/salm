# Smart Academic Leave Manager (SALM)

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Python](https://img.shields.io/badge/Backend-FastAPI-009688)
![React](https://img.shields.io/badge/Frontend-Next.js-black)

> **SALM** is a next-generation academic utility designed to streamline leave management for universities. It bridges the gap between students and faculty through AI-powered categorization, real-time analytics, and a seamless responsive interface.

---

## Table of Contents
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Demo Access](#demo-access)
- [Contributing](#contributing)

---

## Key Features

### For Students
*   **AI-Enhanced Applications**: Leaves are automatically categorized (Medical, Personal, Academic) using smart text analysis.
*   **Predictive Analytics**: The **"Smart Impact Card"** forecasts attendance percentages *before* you apply, warning you if you risk falling below the 75% threshold.
*   **Live Balance Tracking**: Visual indicators show real-time deduction of leave balances.
*   **Notification Integration**: Receive instant email updates when your request is approved or rejected.

### For Faculty
*   **Centralized Command Center**: A unified dashboard to granularly review all incoming requests.
*   **Rapid Decision Making**: One-click Approve/Reject actions with optimistic UI updates.
*   **Feedback Loops**: Custom "Rejection Modals" allow faculty to provide specific reasons for denial.
*   **Visual Calendar**: A monthly view of approved leaves to plan academic schedules effectively.

---

## System Architecture

```mermaid
graph TD
    User[User (Student/Faculty)] -->|HTTPS| Frontend[Next.js Frontend]
    Frontend -->|REST API + JWT| Backend[FastAPI Backend]
    Backend -->|SQLAlchemy| DB[(PostgreSQL Database)]
    Backend -->|SMTP| Email[Email Service]
    
    subgraph "Backend Services"
        Auth[Auth Service]
        Leave[Leave Manager]
        Predictor[Attendance Predictor]
        Notify[Notification Service]
    end
    
    Backend --- Auth
    Backend --- Leave
    Backend --- Predictor
    Backend --- Notify
```

---

## Technology Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | Next.js 14 | React framework for server-rendered UI |
| **Styling** | Tailwind CSS | Utility-first CSS for modern, glassmorphic designs |
| **Backend** | FastAPI | High-performance Python framework |
| **Database** | PostgreSQL | Robust relational database |
| **Auth** | JWT (Jose) | Secure stateless authentication |
| **Icons** | Lucide React | Clean, consistent iconography |

---

## Getting Started

### Prerequisites
*   Node.js v18+
*   Python 3.10+
*   PostgreSQL installed and running locally

### 1. Database Setup
```sql
CREATE DATABASE leave_db;
-- Ensure your postgres user has full privileges
```

### 2. Backend Configuration
```bash
cd backend
python -m venv venv
# Activate Virtual Env (Windows)
.\venv\Scripts\activate
# Install Dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose[cryptography] passlib
# Run Server
uvicorn app.main:app --reload
```
> The backend runs on `http://127.0.0.1:8000`

### 3. Frontend Configuration
```bash
cd frontend
npm install
npm run dev
```
> The application runs on `http://localhost:3000`

---

## Project Structure

```bash
salm/
├── backend/
│   ├── app/
│   │   ├── routes/         # API Routes (Auth, Leaves)
│   │   ├── models.py       # SQLAlchemy Database Models
│   │   ├── schemas.py      # Pydantic Response Schemas
│   │   ├── auth_utils.py   # JWT Implementation
│   │   └── main.py         # Application Entry Point
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── login/          # Authentication Pages
    │   ├── student/        # Student Dashboard modules
    │   └── faculty/        # Faculty Dashboard modules
    ├── components/         # Shared UI Components (Navbar, Cards)
    └── lib/                # API Wrappers
```

---

## Demo Access

Use the following credentials to explore the system:

| Role | Email | Password |
|------|-------|----------|
| **Student** | `prem@student.com` | `123` |
| **Faculty** | `faculty@college.edu` | `admin` |

---

## Contributing

We welcome contributions! Please fork the repository and submit a Pull Request.
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">Made with ❤️ by the SALM Engineering Team</p>
