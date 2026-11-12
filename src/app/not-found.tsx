import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import NotFoundContent from "~/components/features/not-found-content";
import DemoHelpButton from "~/components/layout/demo-help-button";
import Footer from "~/components/layout/footer";
import Navbar from "~/components/layout/navbar";
import "~/styles/public.css";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page is not part of MathEncode.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className={`public-site ${displayFont.variable}`}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <NotFoundContent />
      </main>
      <Footer />
      <DemoHelpButton />
    </div>
  );
}
