
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Settings,
  FolderKanban,
  Users,
  ListTodo,
} from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { getProject } from "@/services/projectService";

function ProjectDetailsContent({ projectId }) {
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        const result = await getProject(projectId);

        if (!active) return;

        if (!result) {
          setNotFound(true);
        } else {
          setProject(result);
        }
      } catch (err) {
        if (!active) return;

        console.error(err);

        setError(
          err.code === "permission-denied"
            ? "You do not have permission to access this project."
            : "Unable to load this project."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [projectId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-slate-500">
        Loading project...
      </main>
    );
  }

  if (notFound || error) {
    return (
      <main className="min-h-screen bg-slate-50 p-10">
        <h1 className="text-xl font-bold text-slate-900">
          {notFound ? "Project not found" : "Cannot open project"}
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          {notFound
            ? "This project does not exist."
            : error}
        </p>

        <Link
          href="/projects"
          className="mt-6 inline-block text-indigo-600"
        >
          Back to projects
        </Link>
      </main>
    );
  }

  const isOwner = project.ownerId === user.uid;

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-900 md:p-10">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-600"
        >
          <ArrowLeft size={17} />
          Back to Projects
        </Link>

        <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <FolderKanban size={28} />
            </div>

            <h1 className="text-3xl font-bold">
              {project.name}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-500">
              {project.description || "No description provided."}
            </p>
          </div>

          {isOwner && (
            <Link
              href={`/projects/${projectId}/settings`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold hover:bg-slate-100"
            >
              <Settings size={18} />
              Project Settings
            </Link>
          )}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Users className="mb-3 text-indigo-600" />
            <p className="text-sm text-slate-500">
              Project Members
            </p>
            <p className="mt-2 text-3xl font-bold">
              {project.memberIds?.length || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <ListTodo className="mb-3 text-indigo-600" />
            <p className="text-sm text-slate-500">
              Task Management
            </p>
            <p className="mt-2 text-sm font-medium">
              Task management will be added next.
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold">
            Project Tasks
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Tasks and assignments will appear here after
            we implement Task CRUD.
          </p>
        </section>
      </div>
    </main>
  );
}

export default function ProjectDetailsPage({ params }) {
  const { id } = use(params);

  return (
    <ProtectedRoute>
      <ProjectDetailsContent projectId={id} />
    </ProtectedRoute>
  );
}
