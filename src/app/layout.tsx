import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { LanguageProvider } from "@/lib/i18n";
import { Header, BottomNav } from "@/components/layout";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <LanguageProvider>
          <DisclaimerBanner />
          <Header />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
