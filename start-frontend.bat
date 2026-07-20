@echo off
title MiniMart Frontend
cd /d "%~dp0frontend"

if not exist node_modules (
    echo ============================================
    echo First-time setup - installing frontend packages.
    echo This can take a few minutes, please wait.
    echo ============================================
    call npm install
)

echo.
echo ============================================
echo Frontend is starting at http://localhost:3000
echo Keep this window open. Do not close it.
echo ============================================
echo.
call npm run dev
pause
