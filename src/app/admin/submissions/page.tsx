import FormSubmissions from "~/components/features/form-submissions";
import { ProtectedRoute } from "~/components/admin";
import { AdminLoading } from "~/components/admin/admin-page";

const pending = (
  <AdminLoading label="Loading demo requests" variant="page" columns={6} />
);

export default function SubmissionsPage() {
  return (
    <ProtectedRoute pending={pending}>
      <FormSubmissions />
    </ProtectedRoute>
  );
}
