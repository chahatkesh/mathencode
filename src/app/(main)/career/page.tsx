import type { Metadata } from "next";
import CareerPage from "~/components/features/career-page";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the MathEncode teaching team.",
};

export default function Page() {
  return <CareerPage />;
}
