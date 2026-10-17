
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/authService";

import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  LogOut,
  Workflow,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: ListTodo,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const displayName = user?.displayName || "TaskFlow User";
  const email = user?.email || "";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await logoutUser();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Unable to sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white p-5">

      {/* Logo */}
      <Link
        href="/dashboard"
        className="mb-12 flex items-center gap-3"
      >
        <div className="rounded-xl bg-indigo-600 p-2 text-white">
          <Workflow size={25} />
        </div>

        <span className="text-2xl font-bold text-slate-900">
          TaskFlow
        </span>
      </Link>

      {/* Navigation */}
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </p>

      <nav className="space-y-2">
        {navigation.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" &&
              pathname.startsWith(`${href}/`));

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={19} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto border-t border-slate-100 pt-5">

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">

          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
            {avatarLetter}
          </div>

          {/* User Information */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {displayName}
            </p>

            <p className="truncate text-xs text-slate-500">
              {email}
            </p>
          </div>
        </div>

        {/* Logout Error */}
        {logoutError && (
          <p
            role="alert"
            className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-600"
          >
            {logoutError}
          </p>
        )}

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut size={18} />

          {loggingOut ? "Signing out..." : "Logout"}
        </button>

      </div>
    </aside>
  );
}
