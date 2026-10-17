
"use client";

import { Bell, Search } from "lucide-react";

export default function Header({ title = "Dashboard" }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
      <div>
        <p className="text-sm text-slate-500">
          Welcome to your workspace
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-400 md:flex">
          <Search size={17} />
          <span className="text-sm">Task search coming soon</span>
        </div>

        <div className="rounded-xl border border-slate-200 p-2.5 text-slate-400">
          <Bell size={19} />
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
          U
        </div>
      </div>
    </header>
  );
}
