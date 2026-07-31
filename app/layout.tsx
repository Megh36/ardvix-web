import type { Metadata, Viewport } from "next";
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

const title = "Ardvix — AI Automation Systems for Indian SMBs";
const description =
  "Ardvix builds AI voice agents, WhatsApp automation, and workflow systems for real estate, solar, and clinics. Live in 2 weeks.";

export const metadata: Metadata = {
  metadataBase: new URL("https://ardvix.com"),
  title,
  description,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title,
    description,
    url: "https://ardvix.com",
    siteName: "Ardvix",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0E",
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