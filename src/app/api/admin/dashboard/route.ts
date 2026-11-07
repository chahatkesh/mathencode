import { jsonOk, requireAdmin, serverError } from "~/lib/http";
import { ensureDb } from "~/lib/mongodb";
import Course from "~/models/course";
import DiagnosticSubmission from "~/models/diagnostic-submission";
import DiagnosticTest from "~/models/diagnostic-test";
import FormSubmission from "~/models/form-submission";
import TutorApplication from "~/models/tutor-application";
import type { AdminDashboardStats } from "~/types/admin-dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    await ensureDb("Admin dashboard");
    const [
      demoRequests,
      nonContactedRequests,
      tutorApplications,
      pendingApplications,
      courses,
      tests,
      publishedTests,
      diagnosticSubmissions,
      unseenSubmissions,
    ] = await Promise.all([
      FormSubmission.countDocuments(),
      FormSubmission.countDocuments({ contacted: { $ne: true } }),
      TutorApplication.countDocuments(),
      TutorApplication.countDocuments({
        $or: [{ status: "pending" }, { status: { $exists: false } }],
      }),
      Course.countDocuments(),
      DiagnosticTest.countDocuments(),
      DiagnosticTest.countDocuments({ published: true }),
      DiagnosticSubmission.countDocuments(),
      DiagnosticSubmission.countDocuments({ seen: { $ne: true } }),
    ]);
    const data: AdminDashboardStats = {
      demoRequests,
      nonContactedRequests,
      tutorApplications,
      pendingApplications,
      courses,
      tests,
      publishedTests,
      diagnosticSubmissions,
      unseenSubmissions,
      updatedAt: new Date().toISOString(),
    };
    const response = jsonOk(data);
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  } catch (error) {
    return serverError(error, "Error loading admin dashboard");
  }
}
