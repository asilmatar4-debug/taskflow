
"use client";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

import {
  getProject,
  updateProject,
  deleteProject,
} from "@/services/projectService";

function SettingsContent({ projectId }) {
    const [deleting, setDeleting] = useState(false);

async function handleDelete() {
  const confirmed = window.confirm(
    "Are you sure you want to delete this project? This action cannot be undone."
  );

  if (!confirmed) return;

  setDeleting(true);
  setError("");

  try {
    await deleteProject(projectId);
    router.replace("/projects");
  } catch (err) {
    setError(err.message || "Unable to delete project.");
  } finally {
    setDeleting(false);
  }
}
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        const project = await getProject(projectId);

        if (!active) return;

        if (!project || project.ownerId !== user.uid) {
          setAccessDenied(true);
          return;
        }

        setName(project.name);
        setDescription(project.description || "");
      } catch (err) {
        if (!active) return;

        setError(
          err.code === "permission-denied"
            ? "Access denied."
            : "Could not load project."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [projectId, user.uid]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    try {
      await updateProject(projectId, name, description);
      router.push(`/projects/${projectId}`);
    } catch (err) {
      setError(err.message || "Unable to update project.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="p-10 text-slate-500">
        Loading project settings...
      </p>
    );
  }

  if (accessDenied || error && !name) {
    return (
      <main className="p-10">
        <h1 className="text-xl font-bold">
          {accessDenied ? "Access denied" : "Error"}
        </h1>
        <p className="mt-3 text-slate-500">
          {accessDenied
            ? "Only the project owner can manage settings."
            : error}
        </p>
        <Link href="/projects" className="mt-4 inline-block text-indigo-600">
          Back to Projects
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-900 md:p-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-600"
        >
          <ArrowLeft size={17} />
          Back to Project
        </Link>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h1 className="text-2xl font-bold">
            Project Settings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Update your project information.
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
                required
                minLength={3}
                maxLength={80}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                maxLength={1000}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
          <div className="mt-10 border-t border-slate-200 pt-8">
  <h2 className="text-lg font-bold text-red-600">
    Danger Zone
  </h2>

  <p className="mt-2 text-sm text-slate-500">
    Deleting a project is permanent. Projects containing
    tasks cannot be deleted.
  </p>

  <button
    type="button"
    onClick={handleDelete}
    disabled={deleting}
    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
  >
    <Trash2 size={18} />
    {deleting ? "Deleting..." : "Delete Project"}
  </button>
</div>
        </div>
      </div>
    </main>
  );
}

export default function ProjectSettingsPage({ params }) {
  const { id } = use(params);

  return (
    <ProtectedRoute>
      <SettingsContent projectId={id} />
    </ProtectedRoute>
  );
}
