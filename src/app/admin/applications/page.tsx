import { ProtectedRoute } from "~/components/admin";
import { AdminLoading } from "~/components/admin/admin-page";
import TutorApplications from "~/components/features/tutor-applications";

const pending = (
  <AdminLoading label="Loading tutor applications" variant="page" columns={6} />
);

export default function ApplicationsPage() {
  return (
    <ProtectedRoute pending={pending}>
      <TutorApplications />
    </ProtectedRoute>
  );
}
