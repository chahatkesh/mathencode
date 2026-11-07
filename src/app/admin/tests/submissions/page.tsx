import { ProtectedRoute } from "~/components/admin";
import { AdminLoading } from "~/components/admin/admin-page";
import AdminTestSubmissions from "~/components/features/admin-test-submissions";

export default function TestSubmissionsPage() {
  return (
    <ProtectedRoute
      pending={
        <AdminLoading label="Loading submissions" variant="page" columns={6} />
      }
    >
      <AdminTestSubmissions />
    </ProtectedRoute>
  );
}
