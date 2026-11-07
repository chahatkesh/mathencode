import { AdminLoading } from "~/components/admin/admin-page";

export default function TestSubmissionsLoading() {
  return (
    <AdminLoading label="Loading submissions" variant="page" columns={6} />
  );
}
