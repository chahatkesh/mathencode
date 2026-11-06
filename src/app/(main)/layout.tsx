import { Bricolage_Grotesque } from "next/font/google";
import JsonLd from "~/components/seo/json-ld";
import "~/styles/public.css";
import DemoHelpButton from "~/components/layout/demo-help-button";
import Footer from "~/components/layout/footer";
import Navbar from "~/components/layout/navbar";
import {
  jsonLdGraph,
  organizationJsonLd,
  publicSiteMetadata,
  websiteJsonLd,
} from "~/lib/seo";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata = publicSiteMetadata;

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`public-site ${displayFont.variable}`}>
      <JsonLd data={jsonLdGraph([organizationJsonLd(), websiteJsonLd()])} />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <DemoHelpButton />
    </div>
  );
}
