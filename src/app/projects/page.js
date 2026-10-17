
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FolderKanban, RefreshCw } from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { getUserProjects } from "@/services/projectService";

function ProjectsContent() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const results = await getUserProjects(user.uid);
      setProjects(results);
    } catch (err) {
      console.error(err);
      setError("Unable to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="min-w-0 flex-1">
        <Header title="Projects" />

        <div className="mx-auto max-w-7xl space-y-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Your Projects</h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your projects and collaborate with your team.
              </p>
            </div>

            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={18} />
              New Project
            </Link>
          </div>

          {loading ? (
            <div role="status" className="rounded-2xl bg-white p-8 text-slate-500">
              Loading projects...
            </div>
          ) : error ? (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-red-700">{error}</p>
              <button
                onClick={loadProjects}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-700"
              >
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <FolderKanban
                size={42}
                className="mx-auto text-indigo-500"
              />
              <h3 className="mt-4 text-lg font-bold">
                No projects yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Create your first project to get started.
              </p>
              <Link
                href="/projects/new"
                className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Create Project
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                >
                  <FolderKanban
                    size={26}
                    className="mb-5 text-indigo-600"
                  />

                  <h3 className="text-lg font-bold">
                    {project.name}
                  </h3>

                  <p className="mt-2 line-clamp-3 min-h-12 text-sm text-slate-500">
                    {project.description || "No description"}
                  </p>

                  <p className="mt-5 text-xs font-medium text-indigo-600">
                    {project.ownerId === user.uid
                      ? "Project Owner"
                      : "Team Member"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <ProjectsContent />
    </ProtectedRoute>
  );
}
