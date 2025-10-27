# NexStream

> The next-gen hub for streaming, video calling, and squad communication. Fast, reliable, and built for both gamers and professionals.

![NexStream Logo](https://img.shields.io/badge/NexStream-Live-blue?style=for-the-badge&logo=video&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node Media Server](https://img.shields.io/badge/NMS-Streaming-red?style=for-the-badge&logo=node.js&logoColor=white)

A full-stack live streaming platform with HLS support, multi-resolution transcoding, and real-time video calling capabilities.

## 🚀 Features

### 🎮 For Gamers
- **Ultra-low latency streaming** - Stream your gameplay in real-time
- **Squad communication** - Crystal-clear voice chat with your team
- **Game integration** - Seamless integration with popular games
- **Stream analytics** - Track your performance and audience

### 💼 For Professionals  
- **HD Video Conferencing** - Professional-grade video meetings
- **Screen Sharing & Recording** - Share presentations and record sessions
- **Team Collaboration** - Advanced collaboration tools
- **Enterprise Security** - Bank-grade security for sensitive meetings

### 🔥 Core Features
- **P2P Calling** - Direct peer-to-peer communication
- **Group Calling** - Multi-participant video calls
- **Live Streaming** - Broadcast to unlimited viewers
- **Cross-platform** - Works on web, mobile, and desktop
- **Real-time Communication** - Instant messaging and notifications

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Material-UI, Shadcn UI, Lucide React Icons
- **State Management**: Redux Toolkit, React Context
- **Video Player**: HLS.js for live streaming
- **Video Calling**: WebRTC with PeerJS/Socket.IO
- **Animations**: Framer Motion

### Backend (Media Server)
- **Runtime**: Node.js
- **Streaming**: Node Media Server (NMS)
- **Transcoding**: FFmpeg (fluent-ffmpeg)
- **Protocol**: RTMP ingest → HLS output
- **Web Server**: Express.js
- **Real-time**: Socket.IO for chat and signaling

### Database
- **ORM**: Prisma
- **Database**: PostgreSQL

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **FFmpeg** (for local streaming) - Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH
- **PostgreSQL** (for database)
- **Media Server** (Node Media Server - included in project)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexstream.git
   cd nexstream
   ```

2. **Install Client dependencies**
   ```bash
   cd client
   npm install
   # or
   yarn install
   ```

3. **Install Media Server dependencies**
   ```bash
   cd ../media_server
   npm install
   ```

4. **Set up environment variables**

   Create `client/.env.local`:
   ```env
   # API and Media Server URLs
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_MEDIA_URL=http://localhost:8000
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   NEXT_PUBLIC_RTMP_URL=rtmp://localhost:1935/live
   
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/nexstream
   
   # Firebase (for authentication)
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

5. **Set up database**
   ```bash
   cd ../client
   npx prisma generate
   npx prisma migrate dev
   ```

6. **Start the Media Server**
   ```bash
   cd ../media_server
   npm start
   ```
   The media server will run on:
   - RTMP: `rtmp://localhost:1935`
   - HTTP API: `http://localhost:3001`
   - HLS/DASH: `http://localhost:8000`

7. **Start the Next.js client**
   ```bash
   cd ../client
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
nexstream/
├── client/                        # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/                   # App Router
│   │   │   ├── (auth)/           # Auth routes
│   │   │   │   ├── sign-in/
│   │   │   │   ├── sign-up/
│   │   │   │   └── forgot-password/
│   │   │   ├── (user)/           # Protected routes
│   │   │   │   ├── dashboard/
│   │   │   │   ├── stream/
│   │   │   │   │   ├── [streamKey]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── videoCalling/
│   │   │   │       ├── [roomName]/
│   │   │   │       └── page.tsx
│   │   │   ├── api/              # API routes
│   │   │   └── page.tsx          # Landing page
│   │   ├── components/           # React components
│   │   ├── contexts/             # Auth & Signal contexts
│   │   ├── lib/                  # Utils & Prisma
│   │   └── store/                # Redux store
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── media_server/                 # Node Media Server
│   ├── nms-server.js            # RTMP → HLS conversion
│   ├── media/                   # Generated media files
│   │   ├── hls/                 # HLS chunks (.ts + .m3u8)
│   │   ├── thumbnails/          # Stream thumbnails
│   │   └── ...
│   └── package.json
│
└── readme.md
```

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--cyan-500: #06b6d4
--purple-500: #8b5cf6
--pink-500: #ec4899

/* Background */
--gray-900: #111827
--gray-800: #1f2937
--black: #000000

/* Gradients */
background: linear-gradient(135deg, from-gray-900 via-gray-800 to-black)
```

### Typography
- **Headings**: Inter/System font, bold weights
- **Body**: Inter/System font, regular weights
- **Gradients**: Cyan to purple text gradients for emphasis

## 🔧 Available Scripts

### Client (Next.js)
```bash
cd client

npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Media Server
```bash
cd media_server

npm start            # Start media server
npm run dev          # Start with nodemon
```

## 🌐 Deployment

### Frontend (Client)
**Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

### Backend (Media Server)
The media server needs to be deployed separately as it requires persistent connection for RTMP streams.

**Options:**
- **VPS**: DigitalOcean, Linode, AWS EC2
- **Docker**: Use provided Docker configuration
- **Cloud Run**: Google Cloud Run for serverless (requires configuration)

**Environment Setup on Server:**
```bash
# Install FFmpeg
apt-get install ffmpeg

# Install Node.js dependencies
npm install

# Start media server
npm start
```

## 📱 Routes

### Public Routes
| Route | Description |
|-------|-------------|
| `/` | Landing page with live streams |
| `/sign-in` | User authentication |
| `/sign-up` | User registration |

### Protected User Routes (`(user)` group)
| Route | Description |
|-------|-------------|
| `/dashboard` | User dashboard (authenticated) |
| `/stream` | Browse and manage streams |
| `/stream/[streamKey]` | Watch live stream |
| `/videoCalling` | Video calling interface |
| `/videoCalling/[roomName]` | Join video call room |

## 🔐 Authentication

The app uses Firebase Authentication with React Context:
- **Firebase Auth** - Email/password and social login
- **AuthContext** - Global authentication state
- **Middleware** - Route protection
- **Protected Routes** - User-specific content
- **Session Management** - Persistent login state

## 🎥 Streaming Architecture

### How it Works

1. **Streamer** (Local PC)
   - Downloads streaming script from the website
   - Script uses FFmpeg to capture screen/audio
   - Sends RTMP stream to media server

2. **Media Server** (Node Media Server)
   - Receives RTMP stream on port 1935
   - Transcodes into multiple resolutions (360p, 720p, 1080p)
   - Generates HLS chunks (.ts files) and playlists (.m3u8)
   - Provides API for stream metadata

3. **Viewers** (Browser)
   - Browse live streams via HLS.js player
   - Adaptive bitrate streaming
   - Real-time stream updates

### Streaming Flow

```
Streamer (FFmpeg) 
  → RTMP (rtmp://localhost:1935/live/{streamKey})
  → Media Server (transcodes to HLS)
  → Viewers (http://localhost:8000/hls/{streamKey}/master.m3u8)
```

### Available Scripts (Media Server)

```bash
npm start       # Start media server
npm run dev     # Start with nodemon (auto-reload)
```

## 🎬 Animations

Powered by Framer Motion:
- Page transitions
- Component entrance animations
- Hover and interaction effects
- Scroll-triggered animations
- Loading states

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style
- Use TypeScript for all new files
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized
- **Bundle Size**: Analyzed and optimized
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting

## 🔒 Security

- HTTPS enforced in production
- CSP headers configured
- XSS protection
- CSRF tokens
- Input validation and sanitization
- Rate limiting on API routes

## 🐛 Troubleshooting

### Common Issues

**1. Installation Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Build Errors**
```bash
# Check TypeScript errors
npm run type-check

# Check for ESLint issues
npm run lint
```

**3. Environment Variables**
Make sure all required environment variables are set in `client/.env.local`:

```env
# Required for Client
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MEDIA_URL=http://localhost:8000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_RTMP_URL=rtmp://localhost:1935/live
DATABASE_URL=postgresql://...
```

**4. FFmpeg Not Found**
```bash
# Windows
# Download from https://ffmpeg.org/download.html
# Add FFmpeg to system PATH

# Verify installation
ffmpeg -version
```

## 📞 Support

- **Documentation**: [docs.nexstream.com](https://docs.nexstream.com)
- **Discord**: [Join our community](https://discord.gg/nexstream)
- **Email**: support@nexstream.com
- **GitHub Issues**: [Report bugs](https://github.com/yourusername/nexstream/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Node Media Server](https://github.com/illuspas/Node-Media-Server) - Media streaming server
- [FFmpeg](https://ffmpeg.org/) - Multimedia framework
- [HLS.js](https://github.com/video-dev/hls.js/) - HTTP Live Streaming
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Firebase](https://firebase.google.com/) - Authentication and backend
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Socket.IO](https://socket.io/) - Real-time communication
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management

---

<div align="center">
  <p>Made with ❤️ by the NexStream Team</p>
  <p>
    <a href="https://nexstream.com">Website</a> •
    <a href="https://docs.nexstream.com">Docs</a> •
    <a href="https://discord.gg/nexstream">Discord</a>
  </p>
</div>