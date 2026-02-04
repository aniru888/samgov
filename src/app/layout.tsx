import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DisclaimerBanner } from "@/components/disclaimer-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SamGov - Karnataka Welfare Scheme Guide",
  description:
    "Understand Karnataka government welfare scheme eligibility and troubleshoot rejections. Not affiliated with any government agency.",
  keywords: [
    "Karnataka",
    "welfare schemes",
    "Gruha Lakshmi",
    "eligibility",
    "government benefits",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DisclaimerBanner />
        {children}
      </body>
    </html>
  );
}
