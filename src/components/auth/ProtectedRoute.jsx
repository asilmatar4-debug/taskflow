
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center bg-slate-50"
      >
        <p className="text-slate-500">
          Checking authentication...
        </p>
      </div>
    );
  }

  return children;
}
