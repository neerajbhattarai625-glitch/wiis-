# Waste Management System - Local Setup

This project is a React + FastAPI application for smart waste management, using PostgreSQL for data persistence.

## Prerequisites

Before running the application, ensure you have the following installed:

*   **Python:** 3.9 or higher
*   **Node.js:** 18 or higher
*   **PostgreSQL:** Must be installed and running.
    *   Create a database named `waste_management`.
    *   Default configuration assumes `postgresql+asyncpg://user:password@localhost/waste_management`.
    *   If your credentials differ, update `backend/database.py` or set the `DATABASE_URL` environment variable.

## Quick Start

1.  **Run the startup script:**

    ```bash
    ./run.sh
    ```

    This script will automatically:
    *   Install Python dependencies (backend).
    *   Install Node.js dependencies (frontend).
    *   Start the Backend server on `http://localhost:8000`.
    *   Start the Frontend server on `http://localhost:5173`.

## Manual Setup

If you prefer to run services manually:

### Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the server:
    ```bash
    uvicorn main:app --reload
    ```
    API Docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### Frontend

1.  Navigate to the root directory (where `package.json` is located):
    ```bash
    npm install
    ```
2.  Run the dev server:
    ```bash
    npm run dev
    ```
    The app will be available at [http://localhost:5173](http://localhost:5173).

## Features

*   **Role-based Access:** Citizen, Collector, Admin.
*   **Smart Features:** AI waste classification (mock), Blockchain rewards (mock).
*   **Tech Stack:** React, FastAPI, PostgreSQL, SQLAlchemy.

## Deployment

### Vercel (Frontend)

1.  **Push your code** to a Git repository (GitHub/GitLab).
2.  **Import the project** in Vercel.
3.  Vercel should automatically detect **Vite**.
4.  **Environment Variables:**
    *   Set `VITE_API_URL` to your production backend URL (e.g., `https://your-backend.onrender.com`).
5.  **Deploy!**

*Note: The `vercel.json` file is configured to handle client-side routing.*

### Backend Deployment

The backend is a standard FastAPI application with PostgreSQL.
*   **Database:** Use a managed PostgreSQL (Supabase, Neon, AWS RDS).
*   **Hosting:** Deploy to platforms like Render, Railway, or AWS.
*   **Environment Variables:**
    *   `DATABASE_URL`: Connection string to your production database.
