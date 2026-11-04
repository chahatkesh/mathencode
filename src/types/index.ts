export interface FormSubmission {
  _id: string;
  name: string;
  email: string;
  contactNumber: string;
  countryCode?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export type TutorApplicationStatus =
  "pending" | "reviewing" | "interviewed" | "accepted" | "rejected";

export interface TutorApplicationRecord {
  _id: string;
  name: string;
  email: string;
  contactNumber: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  status: TutorApplicationStatus;
}

export type CourseAccent =
  "primary" | "secondary" | "purple" | "accent" | "orange";

export interface CourseColorScheme {
  gradient: string;
  accent: CourseAccent;
  bg: string;
  border: string;
}

export interface MarketingCourse {
  id: string;
  publicId: number;
  slug: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  group: string;
  highlights: string[];
  colorScheme: CourseColorScheme;
  objectives: string[];
  prerequisites: string;
  schedule: string;
  nextStart: string;
  hasDiagnosticTest: boolean;
}

export interface AdminCourse extends MarketingCourse {
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosticQuestionPublic {
  id: string;
  prompt: string;
  options: string[];
}

export interface DiagnosticTestPublic {
  id: string;
  title: string;
  instructions: string;
  timeLimitMinutes: number;
  questions: DiagnosticQuestionPublic[];
}

export interface DiagnosticQuestionAdmin extends DiagnosticQuestionPublic {
  correctIndex: number;
  explanation: string;
}

export interface DiagnosticTestAdmin {
  id: string;
  courseId: string;
  title: string;
  instructions: string;
  timeLimitMinutes: number;
  published: boolean;
  questions: DiagnosticQuestionAdmin[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminTestCourseSummary {
  id: string;
  publicId: number;
  title: string;
  level: string;
  visible: boolean;
}

export interface AdminTestListItem {
  course: AdminTestCourseSummary;
  test: null | {
    id: string;
    title: string;
    published: boolean;
    questionCount: number;
    timeLimitMinutes: number;
    updatedAt: string;
  };
}

export interface DiagnosticResult {
  courseTitle: string;
  testTitle: string;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  percentage: number;
  durationSeconds: number;
  timeLimitMinutes: number;
}

export interface DiagnosticSubmissionSummary extends DiagnosticResult {
  id: string;
  studentName: string;
  contactNumber: string;
  country: string;
  countryCode: string;
  courseId: string;
  createdAt: string;
}

export interface DiagnosticAnswerReview {
  questionId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number | null;
  explanation: string;
  isCorrect: boolean;
}

export interface DiagnosticSubmissionDetail extends DiagnosticSubmissionSummary {
  questions: DiagnosticAnswerReview[];
}
