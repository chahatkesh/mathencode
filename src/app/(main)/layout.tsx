import JsonLd from "~/components/seo/json-ld";
import DemoHelpButton from "~/components/layout/demo-help-button";
import Footer from "~/components/layout/footer";
import Navbar from "~/components/layout/navbar";
import {
  jsonLdGraph,
  organizationJsonLd,
  publicSiteMetadata,
  websiteJsonLd,
} from "~/lib/seo";

export const metadata = publicSiteMetadata;

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd data={jsonLdGraph([organizationJsonLd(), websiteJsonLd()])} />
      <Navbar />
      {children}
      <Footer />
      <DemoHelpButton />
    </>
  );
}
