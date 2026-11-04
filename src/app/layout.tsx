import type { Metadata, Viewport } from "next";
import { Reddit_Sans } from "next/font/google";
import "~/env";
import "~/styles/globals.css";

const redditSans = Reddit_Sans({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-reddit-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "MathEncode",
    template: "%s · MathEncode",
  },
  description:
    "Personalized math coaching that makes learning easy for grades K–12.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={redditSans.variable}>
      <body className="min-h-screen bg-white font-sans text-dark antialiased">
        {children}
      </body>
    </html>
  );
}
