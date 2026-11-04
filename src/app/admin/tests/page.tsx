import { ProtectedRoute } from "~/components/admin";
import AdminTests from "~/components/features/admin-tests";

export default function TestsPage() {
  return (
    <ProtectedRoute>
      <AdminTests />
    </ProtectedRoute>
  );
}
