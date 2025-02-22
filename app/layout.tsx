import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NostrProvider } from "./contexts/NostrContext";
import Header from "./components/Header";

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
      <body className={`${inter.className} min-h-screen bg-gray-950 text-gray-100`}>
        <NostrProvider>
          <Header />
          {children}
        </NostrProvider>
      </body>
    </html>
  );
}
