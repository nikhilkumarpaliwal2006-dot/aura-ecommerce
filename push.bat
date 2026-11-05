@echo off
setlocal
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\MinGit\cmd;%PATH%"

echo ===================================================
echo   AURA E-COMMERCE - INSTANT GITHUB PUSH
echo ===================================================
echo.
echo If you haven't created a GitHub repo yet, open:
echo https://github.com/new
echo (Keep README and .gitignore unchecked)
echo.
set /p REPO_URL="Paste your GitHub Repo URL here: "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL provided.
    pause
    exit /b 1
)

echo.
echo [1/2] Linking remote repository...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo [2/2] Pushing 'main' branch to GitHub...
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ===================================================
    echo   SUCCESS! Project is live on GitHub!
    echo ===================================================
) else (
    echo Pushing completed or needs browser sign-in.
)
echo.
pause
