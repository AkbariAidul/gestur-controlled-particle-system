@echo off
echo Starting Gesture Particle System...
echo.
echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 5 /nobreak >nul
echo [2/2] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
echo.
echo ========================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to open browser...
pause >nul
start http://localhost:3000
