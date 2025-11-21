@echo off
echo Starting StackIT Development Environment...
echo.

echo Installing backend dependencies...
call npm install

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo Starting both backend and frontend servers...
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:5173
echo.

start cmd /k "npm run backend"
timeout /t 3 /nobreak > nul
start cmd /k "npm run frontend"

echo.
echo Both servers are starting in separate windows...
echo Press any key to exit this window.
pause > nul