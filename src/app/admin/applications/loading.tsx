import { AdminLoading } from "~/components/admin/admin-page";

export default function ApplicationsLoading() {
  return (
    <AdminLoading
      label="Loading tutor applications"
      variant="page"
      columns={6}
    />
  );
}
