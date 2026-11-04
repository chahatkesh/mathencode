import type { Metadata, Viewport } from "next";
import { Reddit_Sans } from "next/font/google";
import "~/env";
import { HOME_TITLE, SITE_DESCRIPTION, SITE_NAME, siteOrigin } from "~/lib/seo";
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
  themeColor: "#ffffff",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  applicationName: SITE_NAME,
  title: {
    default: HOME_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME, url: siteOrigin() }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "400x400" }],
    apple: [{ url: "/favicon.png", type: "image/png", sizes: "400x400" }],
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
