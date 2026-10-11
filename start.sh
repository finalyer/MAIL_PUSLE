#!/bin/bash
# MailPulse — Start both backend and frontend
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Stopping old instances..."
pkill -f "uvicorn app.main" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

echo "Starting backend (port 8000)..."
cd "$SCRIPT_DIR/backend"
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend
for i in {1..10}; do
  sleep 1
  if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "Backend is UP (PID $BACKEND_PID)"
    break
  fi
  echo "Waiting for backend... ($i/10)"
done

echo "Starting frontend (port 5173)..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

sleep 2
echo ""
echo "MailPulse running!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both."
wait $FRONTEND_PID
