"use client";

import AssessmentFlow from "@/components/therapy/AssessmentFlow";
import DashboardLayout from "@/components/DashboardLayout";

export default function AssessmentPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8">
        <AssessmentFlow />
      </div>
    </DashboardLayout>
  );
}
