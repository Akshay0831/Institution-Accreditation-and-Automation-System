@echo off

set backend_path=%~dp0\backend
set frontend_path=%~dp0\frontend

echo Installing backend dependencies...
cd %backend_path%
call npm install
echo Starting backend server...
start cmd /k "npm start"

echo Installing frontend dependencies...
cd %frontend_path%
call npm install
echo Starting frontend app...
start cmd /k "npm start"

@REM echo Starting backend and frontend...
@REM start cmd /k "cd %backend_path% && npm start & cd %frontend_path% && npm start"

echo App initialized and running!