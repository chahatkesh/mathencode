import { AdminLoading } from "~/components/admin/admin-page";

export default function SubmissionsLoading() {
  return (
    <AdminLoading label="Loading demo requests" variant="page" columns={6} />
  );
}
