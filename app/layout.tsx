import type { Metadata } from "next";
import { Schibsted_Grotesk, JetBrains_Mono } from "next/font/google";
import Preloader from "@/components/Preloader";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ardvix — AI Automation Systems for Indian SMBs",
  description:
    "Ardvix builds AI voice agents, WhatsApp automation, and workflow systems for real estate, solar, and clinics. Live in 2 weeks.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${schibsted.variable} ${jetbrains.variable}`}>
      <body className="antialiased">
        <Preloader />
        {children}
      </body>
    </html>
  );
}