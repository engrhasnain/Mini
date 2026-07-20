@echo off
title MiniMart Backend
cd /d "%~dp0backend"

if not exist .venv (
    echo ============================================
    echo First-time setup - installing backend packages.
    echo This can take a minute or two, please wait.
    echo ============================================
    python -m venv .venv
    call ".venv\Scripts\activate.bat"
    pip install -r requirements.txt
) else (
    call ".venv\Scripts\activate.bat"
)

echo.
echo ============================================
echo Backend is starting at http://127.0.0.1:8000
echo Keep this window open. Do not close it.
echo ============================================
echo.
uvicorn app.main:app --host 127.0.0.1 --port 8000
pause
