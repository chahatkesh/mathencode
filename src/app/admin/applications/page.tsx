import { ProtectedRoute } from "~/components/admin";
import TutorApplications from "~/components/features/tutor-applications";

export default function ApplicationsPage() {
  return (
    <ProtectedRoute>
      <TutorApplications />
    </ProtectedRoute>
  );
}
