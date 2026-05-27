import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mystiq",
  description: "Mystiq is an anonymous messaging platform where people can receive honest messages, connect through curiosity, and spark meaningful conversations.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}

          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
