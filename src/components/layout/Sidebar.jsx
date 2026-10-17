
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white p-5">
      <Link href="/dashboard" className="mb-12 flex items-center gap-3">
        <div className="rounded-xl bg-indigo-600 p-2 text-white">
          <Workflow size={25} />
        </div>
        <span className="text-2xl font-bold text-slate-900">
          TaskFlow
        </span>
      </Link>

      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </p>

      <nav className="space-y-2">
        {navigation.map(({ label, href, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(`${href}/`));

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

      <div className="mt-auto border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
            U
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">
              Demo User
            </p>
            <p className="truncate text-xs text-slate-500">
              demo@taskflow.app
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled
          title="Available after Firebase authentication is connected"
          className="mt-3 flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400"
        >
          <LogOut size={18} />
          Logout (coming soon)
        </button>
      </div>
    </aside>
  );
}
