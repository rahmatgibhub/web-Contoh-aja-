import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
