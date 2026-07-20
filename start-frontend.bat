@echo off
title MiniMart Frontend
cd /d "%~dp0frontend"

node --version > "%TEMP%\minimart_nodecheck.txt" 2>&1

findstr /b /c:"v" "%TEMP%\minimart_nodecheck.txt" >nul
if errorlevel 1 goto :no_node

del "%TEMP%\minimart_nodecheck.txt" >nul 2>&1
goto :node_ok

:no_node
del "%TEMP%\minimart_nodecheck.txt" >nul 2>&1
echo ============================================
echo Node.js is not installed on this computer yet.
echo.
echo Fastest fix - open Command Prompt and run:
echo   winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
echo.
echo Or install manually from https://nodejs.org/ (LTS version).
echo.
echo Then restart the computer and double-click this file again.
echo ============================================
pause
exit /b 1

:node_ok
if not exist "node_modules\.bin\next.cmd" (
    echo ============================================
    echo Installing frontend packages.
    echo This can take a few minutes, please wait.
    echo ============================================
    call npm install
)

if not exist "node_modules\.bin\next.cmd" (
    echo ============================================
    echo Something went wrong installing the frontend packages.
    echo Scroll up to see the actual error from npm above.
    echo ============================================
    pause
    exit /b 1
)

echo.
echo ============================================
echo Frontend is starting at http://localhost:3000
echo Keep this window open. Do not close it.
echo ============================================
echo.
call npm run dev
pause
