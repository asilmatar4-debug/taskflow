
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { createProject } from "@/services/projectService";

function NewProjectForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      await createProject(user.uid, name, description);
      router.push("/projects");
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not create project.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-900 md:p-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to Projects
        </Link>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-9">
          <h1 className="text-2xl font-bold">
            Create New Project
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Give your project a name and describe its purpose.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="projectName"
                className="mb-2 block text-sm font-semibold"
              >
                Project Name
              </label>

              <input
                id="projectName"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={3}
                maxLength={80}
                placeholder="e.g. Website Redesign"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold"
              >
                Description (optional)
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                maxLength={1000}
                rows={5}
                placeholder="What is this project about?"
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-3">
              <Link
                href="/projects"
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                <Save size={17} />
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function NewProjectPage() {
  return (
    <ProtectedRoute>
      <NewProjectForm />
    </ProtectedRoute>
  );
}
