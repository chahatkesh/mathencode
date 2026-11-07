import { ProtectedRoute } from "~/components/admin";
import { AdminLoading } from "~/components/admin/admin-page";
import AdminTests from "~/components/features/admin-tests";

export default function TestsPage() {
  return (
    <ProtectedRoute
      pending={
        <AdminLoading label="Loading tests" variant="page" columns={5} />
      }
    >
      <AdminTests />
    </ProtectedRoute>
  );
}
