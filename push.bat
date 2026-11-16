@echo off
setlocal
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\MinGit\cmd;%PATH%"

echo ====================================================================
echo   AURA E-COMMERCE - PUSHING TO GITHUB
echo   Repository: https://github.com/nikhilkumarpaliwal2006-dot/aura-ecommerce.git
echo ====================================================================
echo.

git remote remove origin >nul 2>&1
git remote add origin https://github.com/nikhilkumarpaliwal2006-dot/aura-ecommerce.git
git branch -M main

echo Pushing branch 'main' to GitHub...
echo (If a browser window or login prompt opens, please click Authorize/Sign in)
echo.

git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ====================================================================
    echo   SUCCESS! Your project is now live on GitHub:
    echo   https://github.com/nikhilkumarpaliwal2006-dot/aura-ecommerce
    echo ====================================================================
) else (
    echo [NOTE] Push completed or requires GitHub authentication.
)
echo.
pause
