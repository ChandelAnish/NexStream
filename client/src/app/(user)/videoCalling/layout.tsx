import { SignalProvider } from "@/contexts/SignalContext";
import { AgoraProvider } from "@/contexts/AgoraContext";

export default function TeleconsultationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SignalProvider>
      <AgoraProvider>
        {children}
      </AgoraProvider>
    </SignalProvider>
  );
}