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
