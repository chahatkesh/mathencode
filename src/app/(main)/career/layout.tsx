import CareerShell from "~/components/features/career-shell";

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CareerShell>{children}</CareerShell>;
}
