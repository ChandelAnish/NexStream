// app/api/download-script/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const streamKey = searchParams.get('key') || generateStreamKey();

  const scriptContent = `@echo off
echo ========================================
echo    Live Streaming Script
echo    Stream Key: ${streamKey}
echo ========================================
echo.

REM Check if FFmpeg is available
where ffmpeg >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: FFmpeg is not installed or not in PATH
    echo.
    echo Please install FFmpeg from: https://ffmpeg.org/download.html
    echo After installation, add FFmpeg to your system PATH
    echo.
    pause
    exit /b 1
)

echo FFmpeg found successfully!
echo.
echo ========================================
echo    STREAMING OPTIONS
echo ========================================
echo.
echo 1. Stream Full Screen (Recommended)
echo 2. Stream Specific Window
echo 3. Stream with Webcam Overlay
echo 4. Custom Settings
echo.
set /p choice="Select option (1-4): "

REM Set common parameters
set STREAM_KEY=${streamKey}
set RTMP_URL=rtmp://localhost:1935/live/%STREAM_KEY%
set FPS=30
set QUALITY=medium

if "%choice%"=="1" goto FULLSCREEN
if "%choice%"=="2" goto WINDOW
if "%choice%"=="3" goto WEBCAM
if "%choice%"=="4" goto CUSTOM
goto FULLSCREEN

:FULLSCREEN
echo.
echo Starting full screen capture...
echo Stream will be available at: http://localhost:3000/stream/%STREAM_KEY%
echo.
echo Press Ctrl+C to stop streaming
echo.

ffmpeg -f gdigrab -framerate %FPS% -i desktop ^
    -f dshow -i audio="Stereo Mix" ^
    -c:v libx264 -preset %QUALITY% -tune zerolatency ^
    -pix_fmt yuv420p -r %FPS% ^
    -g 60 -keyint_min 60 -sc_threshold 0 ^
    -b:v 4000k -maxrate 4500k -bufsize 9000k ^
    -c:a aac -ar 44100 -b:a 128k ^
    -f flv "%RTMP_URL%"

goto END

:WINDOW
echo.
echo Position your mouse over the window you want to stream
echo and note the window title from the taskbar
echo.
set /p window_title="Enter window title: "
echo.
echo Starting window capture for: %window_title%
echo Stream will be available at: http://localhost:3000/stream/%STREAM_KEY%
echo.
echo Press Ctrl+C to stop streaming
echo.

ffmpeg -f gdigrab -framerate %FPS% -i title="%window_title%" ^
    -f dshow -i audio="Stereo Mix" ^
    -c:v libx264 -preset %QUALITY% -tune zerolatency ^
    -pix_fmt yuv420p -r %FPS% ^
    -g 60 -keyint_min 60 -sc_threshold 0 ^
    -b:v 3000k -maxrate 3500k -bufsize 7000k ^
    -c:a aac -ar 44100 -b:a 128k ^
    -f flv "%RTMP_URL%"

goto END

:WEBCAM
echo.
echo Detecting webcam devices...
ffmpeg -list_devices true -f dshow -i dummy 2>&1 | findstr /C:"DirectShow video devices" /C:"DirectShow audio devices" /C:"  \""
echo.
set /p webcam="Enter webcam device name (or press Enter for default): "
if "%webcam%"=="" set webcam="Integrated Camera"

echo.
echo Starting screen + webcam capture...
echo Stream will be available at: http://localhost:3000/stream/%STREAM_KEY%
echo.
echo Press Ctrl+C to stop streaming
echo.

ffmpeg -f gdigrab -framerate %FPS% -i desktop ^
    -f dshow -i video="%webcam%" ^
    -f dshow -i audio="Stereo Mix" ^
    -filter_complex "[1:v]scale=320:240[webcam];[0:v][webcam]overlay=W-w-10:H-h-10[output]" ^
    -map "[output]" -map 2:a ^
    -c:v libx264 -preset %QUALITY% -tune zerolatency ^
    -pix_fmt yuv420p -r %FPS% ^
    -g 60 -keyint_min 60 -sc_threshold 0 ^
    -b:v 4500k -maxrate 5000k -bufsize 10000k ^
    -c:a aac -ar 44100 -b:a 128k ^
    -f flv "%RTMP_URL%"

goto END

:CUSTOM
echo.
echo ========================================
echo    CUSTOM STREAMING SETTINGS
echo ========================================
echo.
set /p resolution="Enter resolution (e.g., 1920x1080, 1280x720): "
set /p bitrate="Enter video bitrate in kbps (e.g., 3000): "
set /p fps_custom="Enter FPS (e.g., 30, 60): "
set /p preset="Enter encoding preset (ultrafast/superfast/veryfast/faster/fast/medium): "

echo.
echo Starting custom stream...
echo Resolution: %resolution%
echo Bitrate: %bitrate%kbps
echo FPS: %fps_custom%
echo Preset: %preset%
echo.
echo Stream will be available at: http://localhost:3000/stream/%STREAM_KEY%
echo.
echo Press Ctrl+C to stop streaming
echo.

ffmpeg -f gdigrab -framerate %fps_custom% -i desktop ^
    -f dshow -i audio="Stereo Mix" ^
    -c:v libx264 -preset %preset% -tune zerolatency ^
    -pix_fmt yuv420p -r %fps_custom% ^
    -s %resolution% ^
    -g 60 -keyint_min 60 -sc_threshold 0 ^
    -b:v %bitrate%k -maxrate %bitrate%k -bufsize %bitrate%k ^
    -c:a aac -ar 44100 -b:a 128k ^
    -f flv "%RTMP_URL%"

goto END

:END
echo.
echo ========================================
echo Stream ended
echo ========================================
pause`;

  // Return the script as a downloadable file
  return new NextResponse(scriptContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-bat',
      'Content-Disposition': `attachment; filename="stream_${streamKey}.bat"`,
    },
  });
}

function generateStreamKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < 8; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}