import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NostrProvider } from "./contexts/NostrContext";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aurora",
  description: "Phoenix Node Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#030404] text-gray-100`}>
        <NostrProvider>
          <div className="flex h-screen overflow-hidden">
            <div className="relative overflow-visible z-10">
              <Sidebar />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden relative z-0">
              <TopNav />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </NostrProvider>
      </body>
    </html>
  );
}
