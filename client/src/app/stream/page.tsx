"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stream {
  id: string;
  streamKey: string;
  viewers: number;
  duration: number;
  bitrate: number;
  fps: number;
  thumbnail: string;
  hlsUrl: string;
}

export default function HomePage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamKey, setStreamKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/streams`);
        if (!response.ok) {
          throw new Error("Failed to fetch streams");
        }
        const data = await response.json();
        setStreams(data.streams);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load streams");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreams();
    const interval = setInterval(fetchStreams, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60); // Use Math.floor for seconds too

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const generateStreamKey = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";
    for (let i = 0; i < 8; i++) {
      key += chars[Math.floor(Math.random() * chars.length)];
    }
    return key;
  };

  const downloadStreamingScript = () => {
    const key = streamKey || generateStreamKey();
    setStreamKey(key);

    const scriptVersion = "V9_INTERLEAVE_FIX"; // Updated version marker

    // --- START OF SCRIPT CONTENT ---
    const scriptContent = `@echo off
setlocal enabledelayedexpansion
echo ========================================
echo   Live Streaming Script
echo   Stream Key: ${key}
echo   SCRIPT VERSION: ${scriptVersion}
echo ========================================
echo.

REM Check if FFmpeg is available
where ffmpeg >nul 2>1
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
echo   STREAMING OPTIONS
echo ========================================
echo.
echo 1. Stream a Monitor (Video Only)
echo 2. Stream a Monitor (With Audio)
echo.
set /p choice="Select option (1-2): "

REM Set common parameters
set STREAM_KEY=${key}
    set RTMP_URL=${process.env.NEXT_PUBLIC_RTMP_URL}/%STREAM_KEY%
set FPS=30
set QUALITY=medium

if "%choice%"=="1" goto STREAM_MONITOR_NO_AUDIO
if "%choice%"=="2" goto STREAM_MONITOR_WITH_AUDIO
goto STREAM_MONITOR_NO_AUDIO

:STREAM_MONITOR_NO_AUDIO
echo.
echo Detecting monitors...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Add-Type -AssemblyName System.Windows.Forms; $i=0; [System.Windows.Forms.Screen]::AllScreens | ForEach-Object { $i++; Write-Output ('{0},{1},{2},{3},{4}' -f $i, $_.Bounds.X, $_.Bounds.Y, $_.Bounds.Width, $_.Bounds.Height) }" > "%TEMP%\\monitors.tmp" 2>nul
set /a count=0
for /f "usebackq tokens=1-5 delims=," %%a in ("%TEMP%\\monitors.tmp") do (
    set /a count+=1
    echo %%a. Monitor %%a (%%dx%%e at %%b,%%c)
)
if %count% LSS 1 (
    echo ERROR: No monitors were detected, or PowerShell failed.
    if exist "%TEMP%\\monitors.tmp" del "%TEMP%\\monitors.tmp"
    pause
    goto END
)
if %count% EQU 1 (
    echo Only one monitor found, selecting automatically.
    set "monitor_choice=1"
) else (
    echo.
    set /p monitor_choice="Select a monitor to stream (1-%count%): "
)
set "is_valid="
for /l %%N in (1,1,%count%) do (
    if "%monitor_choice%"=="%%N" set "is_valid=1"
)
if not defined is_valid set "monitor_choice=1"
for /f "usebackq tokens=1-5 delims=," %%a in ("%TEMP%\\monitors.tmp") do (
    if "%%a"=="%monitor_choice%" (
        set "OFFSET_X=%%b"
        set "OFFSET_Y=%%c"
        set "VIDEO_WIDTH=%%d"
        set "VIDEO_HEIGHT=%%e"
    )
)
echo.
set /p SCALE_PERCENT="Enter display scaling percentage (e.g., 100, 125) [default: 100]: "
if "%SCALE_PERCENT%"=="" set "SCALE_PERCENT=100"
set /a "VIDEO_WIDTH=!VIDEO_WIDTH! * %SCALE_PERCENT% / 100"
set /a "VIDEO_HEIGHT=!VIDEO_HEIGHT! * %SCALE_PERCENT% / 100"
set "VIDEO_SIZE=!VIDEO_WIDTH!x!VIDEO_HEIGHT!"
del "%TEMP%\\monitors.tmp"
if not defined OFFSET_X goto END

echo.
echo Starting screen capture (VIDEO ONLY) for Monitor @ !OFFSET_X!,!OFFSET_Y! [!VIDEO_SIZE!]...
    echo Stream will be available at: ${process.env.NEXT_PUBLIC_SERVER_URL}/stream/%STREAM_KEY%
echo.
echo Press Ctrl+C to stop streaming
echo.
ffmpeg -f gdigrab -framerate %FPS% -offset_x !OFFSET_X! -offset_y !OFFSET_Y! -video_size !VIDEO_SIZE! -i desktop ^
    -vf "format=pix_fmts=yuv420p" ^
    -c:v libx264 -preset %QUALITY% -tune zerolatency ^
    -r %FPS% ^
    -g 60 -keyint_min 60 -sc_threshold 0 ^
    -b:v 4000k -maxrate 4500k -bufsize 9000k ^
    -f flv "%RTMP_URL%"
goto END

:STREAM_MONITOR_WITH_AUDIO
echo.
echo Detecting monitors...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Add-Type -AssemblyName System.Windows.Forms; $i=0; [System.Windows.Forms.Screen]::AllScreens | ForEach-Object { $i++; Write-Output ('{0},{1},{2},{3},{4}' -f $i, $_.Bounds.X, $_.Bounds.Y, $_.Bounds.Width, $_.Bounds.Height) }" > "%TEMP%\\monitors.tmp" 2>nul
set /a count=0
for /f "usebackq tokens=1-5 delims=," %%a in ("%TEMP%\\monitors.tmp") do (
    set /a count+=1
    echo %%a. Monitor %%a (%%dx%%e at %%b,%%c)
)
if %count% LSS 1 (
    echo ERROR: No monitors were detected, or PowerShell failed.
    if exist "%TEMP%\\monitors.tmp" del "%TEMP%\\monitors.tmp"
    pause
    goto END
)
if %count% EQU 1 (
    echo Only one monitor found, selecting automatically.
    set "monitor_choice=1"
) else (
    echo.
    set /p monitor_choice="Select a monitor to stream (1-%count%): "
)
set "is_valid="
for /l %%N in (1,1,%count%) do (
    if "%monitor_choice%"=="%%N" set "is_valid=1"
)
if not defined is_valid set "monitor_choice=1"
for /f "usebackq tokens=1-5 delims=," %%a in ("%TEMP%\\monitors.tmp") do (
    if "%%a"=="%monitor_choice%" (
        set "OFFSET_X=%%b"
        set "OFFSET_Y=%%c"
        set "VIDEO_WIDTH=%%d"
        set "VIDEO_HEIGHT=%%e"
    )
)
echo.
set /p SCALE_PERCENT="Enter display scaling percentage (e.g., 100, 125) [default: 100]: "
if "%SCALE_PERCENT%"=="" set "SCALE_PERCENT=100"
set /a "VIDEO_WIDTH=!VIDEO_WIDTH! * %SCALE_PERCENT% / 100"
set /a "VIDEO_HEIGHT=!VIDEO_HEIGHT! * %SCALE_PERCENT% / 100"
set "VIDEO_SIZE=!VIDEO_WIDTH!x!VIDEO_HEIGHT!"
del "%TEMP%\\monitors.tmp"
if not defined OFFSET_X goto END

REM Set audio device to the exact name found by FFmpeg
set "audio_device=Stereo Mix (Realtek(R) Audio)"

echo.
echo Starting screen capture with audio (Stereo Mix) for Monitor @ !OFFSET_X!,!OFFSET_Y! [!VIDEO_SIZE!]...
    echo Stream will be available at: ${process.env.NEXT_PUBLIC_SERVER_URL}/stream/%STREAM_KEY%
echo.
echo Press Ctrl+C to stop streaming
echo.

REM *** FIX: Video smoothness with audio - prevent audio from blocking video encoding ***
ffmpeg -rtbufsize 1500M -f gdigrab -framerate %FPS% -offset_x !OFFSET_X! -offset_y !OFFSET_Y! -video_size !VIDEO_SIZE! -i desktop ^
    -f dshow -audio_buffer_size 100 -i audio="!audio_device!" ^
    -c:v libx264 -preset %QUALITY% -tune zerolatency ^
    -pix_fmt yuv420p ^
    -r %FPS% ^
    -g 60 -keyint_min 60 -sc_threshold 0 ^
    -b:v 4000k -maxrate 4500k -bufsize 9000k ^
    -c:a aac -ar 44100 -b:a 128k ^
    -shortest ^
    -max_interleave_delta 0 ^
    -avoid_negative_ts make_zero ^
    -fflags +genpts+igndts ^
    -f flv "%RTMP_URL%"
goto END

:END
echo.
echo ========================================
echo Stream ended
echo ========================================
pause`;
    // --- END OF SCRIPT CONTENT ---

    const blob = new Blob([scriptContent], { type: "application/x-bat" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stream_${key}.bat`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowKeyModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Live Streams</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={downloadStreamingScript}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                <span>Start Streaming</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Stream Downloaded!
            </h2>
            <div className="bg-gray-900 rounded p-4 mb-4">
              <p className="text-gray-400 text-sm mb-2">Your Stream Key:</p>
              <p className="text-xl font-mono text-blue-400">{streamKey}</p>
            </div>
            <div className="space-y-2 text-gray-300 mb-6">
              <p>✓ Streaming script downloaded</p>
              <p>✓ Run the .bat file to start streaming</p>
              <p>✓ Your stream will appear here automatically</p>
            </div>
            <div className="bg-yellow-900 bg-opacity-50 border border-yellow-700 rounded p-3 mb-4">
              <p className="text-yellow-300 text-sm">
                <strong>Audio Setup:</strong> The &quot;With Audio&quot; option defaults
                to <strong>&quot;Stereo Mix&quot;</strong> for system audio. To enable
                Stereo Mix: Right-click sound icon → Sounds → Recording tab →
                Right-click empty space → Show Disabled Devices → Enable Stereo
                Mix.
              </p>
            </div>
            <button
              onClick={() => setShowKeyModal(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white mt-4">Loading streams...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            <p>Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && streams.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-24 w-24 text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-white mb-2">
              No Live Streams
            </h2>
            <p className="text-gray-400 mb-8">
              Be the first to start streaming!
            </p>
            <button
              onClick={downloadStreamingScript}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              <span>Download Streaming Script</span>
            </button>
          </div>
        )}

        {streams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {streams.map((stream) => (
              <Link
                key={stream.id}
                href={`/stream/${stream.streamKey}`}
                className="group block bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition"
              >
                <div className="relative aspect-video bg-gray-900">
                  <img
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${stream.thumbnail}`}
                    alt={`Stream ${stream.streamKey}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      // You could also set a placeholder image here
                      // target.src = "/placeholder-image.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded text-xs font-semibold text-white">
                    LIVE
                  </div>

                  <div className="absolute bottom-2 left-2 flex items-center text-white text-sm">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {stream.viewers} watching
                  </div>

                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                    {formatDuration(stream.duration)}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">
                    {stream.streamKey}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-400">
                    <span>{Math.round(stream.bitrate / 1000)} kbps</span>
                    <span>{stream.fps} FPS</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Quick Start Guide
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Prerequisites
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start">
                  <span className="text-blue-500 font-bold mr-2">•</span>
                  <div>
                    <p className="font-semibold">FFmpeg Installation</p>
                    <p className="text-sm text-gray-400">
                      Download from ffmpeg.org and add to PATH
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 font-bold mr-2">•</span>
                  <div>
                    <p className="font-semibold">NMS Server</p>
                    <p className="text-sm text-gray-400">
                      Must be running on port 1935
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 font-bold mr-2">•</span>
                  <div>
                    <p className="font-semibold">Audio Setup (Optional)</p>
                    <p className="text-sm text-gray-400">
                      Enable &quot;Stereo Mix&quot; for system audio (now default)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                How to Stream
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start">
                  <span className="text-green-500 font-bold mr-2">1.</span>
                  <p>Click &quot;Start Streaming&quot; to download the script</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 font-bold mr-2">2.</span>
                  <p>Run the downloaded .bat file</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 font-bold mr-2">3.</span>
                  <p>
                    Choose your streaming option and select a monitor if
                    prompted
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 font-bold mr-2">4.</span>
                  <p>Your stream appears here automatically!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-900 rounded">
            <h4 className="text-sm font-semibold text-gray-400 mb-2">
              Server Configuration
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">RTMP URL:</span>
                <span className="text-gray-300 ml-2">
                  {process.env.NEXT_PUBLIC_RTMP_URL}
                </span>
              </div>
              <div>
                <span className="text-gray-500">HLS Output:</span>
                <span className="text-gray-300 ml-2">360p, 720p, 1080p</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}