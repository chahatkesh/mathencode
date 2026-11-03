import FormSubmissions from "~/components/features/form-submissions";
import { ProtectedRoute } from "~/components/admin";

export default function SubmissionsPage() {
  return (
    <ProtectedRoute>
      <FormSubmissions />
    </ProtectedRoute>
  );
}
