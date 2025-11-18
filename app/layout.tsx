import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

// Ghoust Solid (filled) - primary font
const ghoustSolid = localFont({
  src: [
    {
      path: "../public/fonts/GhoustSolid.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-ghoust-solid",
  display: "swap",
});

// Ghoust Outline (hollow) - decorative font
const ghoustOutline = localFont({
  src: [
    {
      path: "../public/fonts/GhoustOutline.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-ghoust-outline",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotlob | Get Rollin' With Us; Fast, Tasty, Brioche Rolls - Australia",
  description: "Get rollin' with us - Our team at Hotlob are excited to bring our brioche rolls to you! An assorted of options available, check out our menu to find out what we are serving you this week! Keep an eye out for our lobster roll - seasonal menu and subject to change.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${ghoustSolid.variable} ${ghoustOutline.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="w-full max-w-[1920px] mx-auto">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
