import { Suspense } from "react";
import TutorsClient from "./TutorsClient";

export default function TutorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white text-slate-900">
          Loading tutors...
        </div>
      }
    >
      <TutorsClient />
    </Suspense>
  );
}
