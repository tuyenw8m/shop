import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import AppContent from "./client-layout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          <AppContent>{children}</AppContent>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "thanhquan",
};
