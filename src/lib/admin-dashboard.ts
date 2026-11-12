import "server-only";
import { ensureDb } from "~/lib/mongodb";
import Course from "~/models/course";
import DiagnosticSubmission from "~/models/diagnostic-submission";
import DiagnosticTest from "~/models/diagnostic-test";
import FormSubmission from "~/models/form-submission";
import TutorApplication from "~/models/tutor-application";
import type { AdminDashboardStats } from "~/types/admin-dashboard";

export async function loadAdminDashboard(): Promise<AdminDashboardStats> {
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
  return {
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
}
