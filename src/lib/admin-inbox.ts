import "server-only";
import { ensureDb } from "~/lib/mongodb";
import { inboxWindow, parseInboxPage, type InboxPage } from "~/lib/inbox-page";
import FormSubmission from "~/models/form-submission";
import TutorApplication from "~/models/tutor-application";
import type {
  FormSubmission as FormSubmissionRecord,
  TutorApplicationRecord,
  TutorApplicationStatus,
} from "~/types";

const TUTOR_STATUSES = new Set<TutorApplicationStatus>([
  "pending",
  "reviewing",
  "interviewed",
  "accepted",
  "rejected",
]);

function iso(value?: Date | string) {
  if (!value) return new Date(0).toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? new Date(0).toISOString()
    : date.toISOString();
}

type LeanForm = {
  _id: { toString(): string };
  name: string;
  email: string;
  contactNumber: string;
  countryCode?: string;
  country?: string;
  message?: string;
  goals?: string;
  expectations?: string;
  sourceCourse?: string;
  kind?: string;
  contacted?: boolean;
  createdAt?: Date | string;
};

type LeanApplication = {
  _id: { toString(): string };
  name: string;
  email: string;
  contactNumber: string;
  subject: string;
  message?: string;
  isRead?: boolean;
  status?: string;
  createdAt?: Date | string;
};

function toForm(item: LeanForm): FormSubmissionRecord {
  return {
    _id: item._id.toString(),
    name: item.name,
    email: item.email,
    contactNumber: item.contactNumber,
    countryCode: item.countryCode,
    country: item.country ?? "",
    message: item.message ?? "",
    goals: item.goals ?? "",
    expectations: item.expectations ?? "",
    sourceCourse: item.sourceCourse ?? "",
    kind: item.kind === "mentorship" ? "mentorship" : "demo",
    createdAt: iso(item.createdAt),
    contacted: item.contacted === true,
  };
}

function toApplication(item: LeanApplication): TutorApplicationRecord {
  const status = TUTOR_STATUSES.has(item.status as TutorApplicationStatus)
    ? (item.status as TutorApplicationStatus)
    : "pending";
  return {
    _id: item._id.toString(),
    name: item.name,
    email: item.email,
    contactNumber: item.contactNumber,
    subject: item.subject,
    message: item.message ?? "",
    createdAt: iso(item.createdAt),
    isRead: item.isRead === true,
    status,
  };
}

export async function listFormSubmissions(
  requestedPage: number,
): Promise<InboxPage<FormSubmissionRecord>> {
  await ensureDb("form-submissions");
  const total = await FormSubmission.countDocuments();
  const window = inboxWindow(total, requestedPage);
  const items = await FormSubmission.find()
    .sort({ createdAt: -1 })
    .skip(window.skip)
    .limit(window.pageSize)
    .lean<LeanForm[]>();
  return {
    items: items.map(toForm),
    page: window.page,
    pageSize: window.pageSize,
    total: window.total,
    pageCount: window.pageCount,
  };
}

export async function listTutorApplications(
  requestedPage: number,
): Promise<InboxPage<TutorApplicationRecord>> {
  await ensureDb("tutor-applications");
  const total = await TutorApplication.countDocuments();
  const window = inboxWindow(total, requestedPage);
  const items = await TutorApplication.find()
    .sort({ createdAt: -1 })
    .skip(window.skip)
    .limit(window.pageSize)
    .lean<LeanApplication[]>();
  return {
    items: items.map(toApplication),
    page: window.page,
    pageSize: window.pageSize,
    total: window.total,
    pageCount: window.pageCount,
  };
}

export function inboxPageFromSearch(value: string | null) {
  return parseInboxPage(value);
}
