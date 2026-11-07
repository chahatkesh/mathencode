"use client";

import { AdminErrorState } from "~/components/admin/admin-page";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <AdminErrorState
      message="This page could not be loaded. Your saved data has not changed."
      onRetry={reset}
    />
  );
}
