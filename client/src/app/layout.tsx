import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import CssBaseline from "@mui/material/CssBaseline";

export const metadata: Metadata = {
  title: "NexStream",
  description: "NexStream is the next-gen hub for streaming, video calling, and squad communication. Fast, reliable, and built for both gamers and everyday users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* FIX: Removed "overflow-hidden" from the body's className.
        This class was preventing the entire page from scrolling.
      */}
      <body className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative">
        {/* Animated gradient background */}
        <div className="fixed inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20 animate-pulse pointer-events-none"></div>
        
        {/* Grid pattern overlay */}
        <div 
          className="fixed inset-0 opacity-[0.02] pointer-events-none" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.4'%3e%3ccircle cx='30' cy='30' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
          }}
        ></div>
        
        {/* Floating elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-2 h-2 bg-cyan-500/30 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-20 w-1 h-1 bg-purple-500/30 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 left-20 w-1.5 h-1.5 bg-pink-500/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/3 right-10 w-1 h-1 bg-blue-500/30 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-green-500/30 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-yellow-500/20 rounded-full animate-bounce"></div>
        </div>

        <StoreProvider>
          <CssBaseline />
          <AuthProvider>
            {/* This relative div ensures children appear above the fixed background elements */}
            <div className="relative z-10">
              {children}
            </div>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}