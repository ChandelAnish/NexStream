import { SignalProvider } from "@/contexts/SignalContext";

export default function TeleconsultationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SignalProvider>{children}</SignalProvider>;
}
