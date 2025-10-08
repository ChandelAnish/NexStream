import NodeMediaServer from 'node-media-server';

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30,
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './media',
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg', // check your path (run "which ffmpeg")
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags:
          '[hls_time=6:hls_list_size=6:hls_flags=delete_segments]',
        dash: false,
        vc: 'libx264',
        ac: 'aac',
        r: 30,
        // create multiple renditions
        args: [
          ['-vf', 'scale=w=1920:h=1080', '-b:v', '5000k', '-preset', 'veryfast', '-profile:v', 'main', '-g', '60'],
          ['-vf', 'scale=w=1280:h=720', '-b:v', '3000k', '-preset', 'veryfast', '-profile:v', 'main', '-g', '60'],
          ['-vf', 'scale=w=854:h=480', '-b:v', '1500k', '-preset', 'veryfast', '-profile:v', 'main', '-g', '60'],
        ],
      },
    ],
  },
};

const nms = new NodeMediaServer(config);
nms.run();
