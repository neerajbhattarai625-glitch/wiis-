#!/bin/bash

# Kill background processes on exit
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

echo "Starting Waste Management System (Local)..."

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 not found."
    exit 1
fi

# Check for Node
if ! command -v node &> /dev/null; then
    echo "Error: Node.js not found."
    exit 1
fi

# Install Backend Dependencies
echo "Installing Backend Dependencies..."
cd backend
python3 -m pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies."
    exit 1
fi

# Initialize DB (if needed) - this is handled by startup event in main.py, 
# but we need to make sure the DB exists first.
# We assume the user has created 'waste_management' database.

# Start Backend
echo "Starting Backend..."
python3 -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

cd ..

# Install Frontend Dependencies
echo "Installing Frontend Dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

# Start Frontend
echo "Starting Frontend..."
npm run dev &
FRONTEND_PID=$!

echo "Application is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop."

wait
