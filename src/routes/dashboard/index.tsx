// /routes/dashboard/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/dashboard/")({
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});
