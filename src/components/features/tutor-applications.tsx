"use client";

import { useEffect, useState } from "react";
import type { TutorApplicationRecord } from "~/types";
import {
  Users,
  Mail,
  Phone,
  Clock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";

const TutorApplications = () => {
  const [applications, setApplications] = useState<TutorApplicationRecord[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/tutor-applications");
      const result = await response.json();

      if (result.success) {
        setApplications(result.data);
      } else {
        setError("Failed to fetch applications");
      }
    } catch (fetchError) {
      console.error("Error fetching tutor applications:", fetchError);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      try {
        const response = await fetch("/api/tutor-applications");
        const result = (await response.json()) as {
          success?: boolean;
          data?: TutorApplicationRecord[];
        };

        if (cancelled) return;

        if (result.success && result.data) {
          setApplications(result.data);
        } else {
          setError("Failed to fetch applications");
        }
      } catch (fetchError) {
        console.error("Error fetching tutor applications:", fetchError);
        if (!cancelled) setError("Network error occurred");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadApplications();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateReadStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/tutor-applications/${id}/read`, {
        method: "PATCH",
      });

      if (response.ok) {
        fetchApplications(); // Refresh the list
      }
    } catch (err) {
      console.error("Error updating read status:", err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/tutor-applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchApplications(); // Refresh the list
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "interviewed":
        return "bg-purple-100 text-purple-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={fetchApplications}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-dark">
            Tutor Applications
          </h1>
          <p className="text-dark/70">Manage and review tutor applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-600">
              No Applications Yet
            </h3>
            <p className="text-gray-500">
              Tutor applications will appear here when submitted.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className={`rounded-xl border-l-4 bg-white p-6 shadow-md ${
                  !application.isRead
                    ? "border-l-primary bg-primary/5"
                    : "border-l-gray-300"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-bold text-white">
                      {application.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-dark">
                        {application.name}
                      </h3>
                      <p className="text-sm text-dark/60">
                        Applied{" "}
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateReadStatus(application._id)}
                      className={`rounded-lg p-2 transition-colors ${
                        application.isRead
                          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                      title={
                        application.isRead ? "Mark as unread" : "Mark as read"
                      }
                    >
                      {application.isRead ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>

                    <div
                      className={`flex items-center space-x-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(application.status)}`}
                    >
                      {getStatusIcon(application.status)}
                      <span className="capitalize">{application.status}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-dark/80">{application.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-dark/80">
                        {application.contactNumber}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span className="text-dark/80">
                        Subject: {application.subject}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-dark/80">
                        {new Date(application.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="mb-2 text-sm font-medium text-dark/80">
                    Message:
                  </h4>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="leading-relaxed text-dark/80">
                      {application.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(application._id, "reviewing")}
                    className="rounded-lg bg-blue-100 px-4 py-2 text-sm text-blue-800 transition-colors hover:bg-blue-200"
                  >
                    Mark Reviewing
                  </button>
                  <button
                    onClick={() => updateStatus(application._id, "interviewed")}
                    className="bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-lg px-4 py-2 text-sm transition-colors"
                  >
                    Mark Interviewed
                  </button>
                  <button
                    onClick={() => updateStatus(application._id, "accepted")}
                    className="rounded-lg bg-green-100 px-4 py-2 text-sm text-green-800 transition-colors hover:bg-green-200"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(application._id, "rejected")}
                    className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-800 transition-colors hover:bg-red-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorApplications;
