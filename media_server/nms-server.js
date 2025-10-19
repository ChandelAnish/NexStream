// nms-server.js
const NodeMediaServer = require('node-media-server');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

// Create media directories
const mediaRoot = './media';
const dirs = ['live', 'hls', 'dash', 'thumbnails'];
dirs.forEach(dir => {
  const dirPath = path.join(mediaRoot, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Store active streams
const activeStreams = new Map();

// Transcoding profiles
const transcodingProfiles = [
  {
    name: '360p',
    videoBitrate: '800k',
    audioBitrate: '96k',
    size: '640x360',
    fps: 30
  },
  {
    name: '720p',
    videoBitrate: '2500k',
    audioBitrate: '128k',
    size: '1280x720',
    fps: 30
  },
  {
    name: '1080p',
    videoBitrate: '5000k',
    audioBitrate: '192k',
    size: '1920x1080',
    fps: 30
  }
];

// NMS Configuration
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    mediaroot: mediaRoot,
    allow_origin: '*',
    api: true
  },
  trans: {
    ffmpeg: process.env.FFMPEG_PATH || 'ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=5:hls_flags=delete_segments]',
        hlsKeep: false,
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
        dashKeep: false
      }
    ]
  },
  auth: {
    play: false,
    publish: false,
    secret: 'your-secret-key-here'
  }
};

const nms = new NodeMediaServer(config);

// Stream event handlers
nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  
  // Extract stream key from path
  const streamKey = StreamPath.split('/').pop();
  
  // Store stream info
  activeStreams.set(streamKey, {
    id,
    streamKey,
    streamPath: StreamPath,
    startTime: Date.now(),
    viewers: 0
  });
  
  // Start transcoding after a delay
  setTimeout(() => startTranscoding(streamKey), 3000);
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  
  // Clean up stream info
  const streamKey = StreamPath.split('/').pop();
  activeStreams.delete(streamKey);
  
  // Stop transcoding
  stopTranscoding(streamKey);
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  
  // Update viewer count
  const streamKey = StreamPath.split('/').pop();
  const stream = activeStreams.get(streamKey);
  if (stream) {
    stream.viewers++;
  }
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  
  // Update viewer count
  const streamKey = StreamPath.split('/').pop();
  const stream = activeStreams.get(streamKey);
  if (stream && stream.viewers > 0) {
    stream.viewers--;
  }
});

// Transcoding management
const activeTranscodings = new Map();

function startTranscoding(streamKey) {
  console.log(`Starting transcoding for stream: ${streamKey}`);
  
  const inputPath = `rtmp://localhost:1935/live/${streamKey}`;
  const processes = [];
  
  // Create HLS directory for this stream
  const hlsDir = path.join(mediaRoot, 'hls', streamKey);
  if (!fs.existsSync(hlsDir)) {
    fs.mkdirSync(hlsDir, { recursive: true });
  }
  
  // Create master playlist
  const masterPlaylist = createMasterPlaylist(streamKey, transcodingProfiles);
  fs.writeFileSync(path.join(hlsDir, 'master.m3u8'), masterPlaylist);
  
  // Start transcoding for each profile
  transcodingProfiles.forEach(profile => {
    const outputDir = path.join(hlsDir, profile.name);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const command = ffmpeg(inputPath)
      .inputOptions([
        '-analyzeduration', '1000000',
        '-probesize', '1000000'
      ])
      .outputOptions([
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-tune', 'zerolatency',
        '-c:a', 'aac',
        '-ar', '44100',
        '-ac', '2',
        '-f', 'hls',
        '-hls_time', '2',
        '-hls_list_size', '5',
        '-hls_flags', 'delete_segments',
        '-hls_segment_filename', path.join(outputDir, 'segment_%03d.ts'),
        '-master_pl_name', 'master.m3u8',
        '-g', '48',
        '-keyint_min', '48',
        '-sc_threshold', '0',
        '-b:v', profile.videoBitrate,
        '-maxrate', profile.videoBitrate,
        '-bufsize', parseInt(profile.videoBitrate) * 2 + 'k',
        '-b:a', profile.audioBitrate,
        '-s', profile.size,
        '-r', profile.fps
      ])
      .output(path.join(outputDir, 'index.m3u8'))
      .on('start', (commandLine) => {
        console.log(`Spawned FFmpeg for ${profile.name}: ${commandLine}`);
      })
      .on('error', (err) => {
        console.error(`Error transcoding ${profile.name}:`, err.message);
      })
      .on('end', () => {
        console.log(`Transcoding finished for ${profile.name}`);
      });
    
    command.run();
    processes.push(command);
  });
  
  // Generate thumbnail
  const thumbnailPath = path.join(mediaRoot, 'thumbnails', `${streamKey}.jpg`);
  const thumbnailCommand = ffmpeg(inputPath)
    .outputOptions([
      '-vframes', '1',
      '-an',
      '-s', '320x180',
      '-ss', '1'
    ])
    .output(thumbnailPath)
    .on('end', () => {
      console.log(`Thumbnail generated for ${streamKey}`);
    })
    .on('error', (err) => {
      console.error('Thumbnail generation error:', err.message);
    });
  
  thumbnailCommand.run();
  processes.push(thumbnailCommand);
  
  activeTranscodings.set(streamKey, processes);
}

function stopTranscoding(streamKey) {
  console.log(`Stopping transcoding for stream: ${streamKey}`);
  
  const processes = activeTranscodings.get(streamKey);
  if (processes) {
    processes.forEach(command => {
      try {
        command.kill('SIGKILL');
      } catch (err) {
        console.error('Error killing FFmpeg process:', err.message);
      }
    });
    activeTranscodings.delete(streamKey);
  }
  
  // Clean up HLS files after a delay
  setTimeout(() => {
    const hlsDir = path.join(mediaRoot, 'hls', streamKey);
    if (fs.existsSync(hlsDir)) {
      fs.rmSync(hlsDir, { recursive: true, force: true });
      console.log(`Cleaned up HLS files for ${streamKey}`);
    }
  }, 10000);
}

function createMasterPlaylist(streamKey, profiles) {
  let playlist = '#EXTM3U\n#EXT-X-VERSION:3\n';
  
  profiles.forEach(profile => {
    const bandwidth = parseInt(profile.videoBitrate) * 1000 + parseInt(profile.audioBitrate) * 1000;
    const resolution = profile.size;
    playlist += `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\n`;
    playlist += `${profile.name}/index.m3u8\n`;
  });
  
  return playlist;
}

// API Server
const app = express();
app.use(cors());
app.use(express.json());

// Get all active streams
app.get('/api/streams', (req, res) => {
  const streams = [];
  
  // Use our activeStreams Map instead of trying to access NMS internals
  for (const [streamKey, streamInfo] of activeStreams) {
    streams.push({
      id: streamInfo.id,
      streamKey: streamInfo.streamKey,
      streamPath: streamInfo.streamPath,
      viewers: streamInfo.viewers,
      duration: Math.floor((Date.now() - streamInfo.startTime) / 1000),
      bitrate: 4000, // Default values since we're not tracking these yet
      fps: 30,
      thumbnail: `/thumbnails/${streamKey}.jpg`,
      hlsUrl: `/hls/${streamKey}/master.m3u8`
    });
  }
  
  res.json({ streams });
});

// Get specific stream info
app.get('/api/streams/:streamKey', (req, res) => {
  const { streamKey } = req.params;
  console.log(`Looking for stream: ${streamKey}`);
  
  const streamInfo = activeStreams.get(streamKey);
  
  if (!streamInfo) {
    console.log(`Stream ${streamKey} not found. Active streams:`, Array.from(activeStreams.keys()));
    return res.status(404).json({ error: 'Stream not found' });
  }
  
  res.json({
    id: streamInfo.id,
    streamKey: streamInfo.streamKey,
    streamPath: streamInfo.streamPath,
    viewers: streamInfo.viewers,
    duration: Math.floor((Date.now() - streamInfo.startTime) / 1000),
    bitrate: 4000,
    fps: 30,
    thumbnail: `/thumbnails/${streamKey}.jpg`,
    hlsUrl: `/hls/${streamKey}/master.m3u8`,
    resolutions: transcodingProfiles.map(p => ({
      name: p.name,
      url: `/hls/${streamKey}/${p.name}/index.m3u8`
    }))
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    activeStreams: activeStreams.size,
    streams: Array.from(activeStreams.keys())
  });
});

// Serve static files
app.use('/hls', express.static(path.join(mediaRoot, 'hls')));
app.use('/thumbnails', express.static(path.join(mediaRoot, 'thumbnails')));

const API_PORT = process.env.API_PORT || 3001;

// Start servers
nms.run();
console.log('Node Media Server started on port 1935');
console.log('HTTP-FLV/HLS/DASH server started on port 8000');

app.listen(API_PORT, () => {
  console.log(`API server running on port ${API_PORT}`);
  console.log('Use /api/health to check server status');
});