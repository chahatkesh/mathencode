import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import NotFoundContent from "~/components/features/not-found-content";
import DemoHelpButton from "~/components/layout/demo-help-button";
import Footer from "~/components/layout/footer";
import Navbar from "~/components/layout/navbar";
import { LAUNCH_DISMISS_SCRIPT } from "~/lib/course-launch";
import { readNextCourseLaunch } from "~/lib/public-reads";
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

export default async function NotFound() {
  const launch = await readNextCourseLaunch();

  return (
    <div
      className={`public-site ${displayFont.variable}`}
      data-launch={launch?.key}
      suppressHydrationWarning
    >
      {launch ? (
        <script dangerouslySetInnerHTML={{ __html: LAUNCH_DISMISS_SCRIPT }} />
      ) : null}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar launch={launch} />
      <main id="main-content" tabIndex={-1}>
        <NotFoundContent />
      </main>
      <Footer />
      <DemoHelpButton />
    </div>
  );
}
