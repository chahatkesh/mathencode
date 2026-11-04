import { Suspense } from "react";
import { ProtectedRoute } from "~/components/admin";
import AdminTestSubmissions from "~/components/features/admin-test-submissions";

export default function TestSubmissionsPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="flex flex-1 items-center justify-center text-sm text-dark/70">
            Loading submissions
          </div>
        }
      >
        <AdminTestSubmissions />
      </Suspense>
    </ProtectedRoute>
  );
}
