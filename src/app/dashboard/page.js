
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  FolderKanban,
  ListTodo,
  Clock3,
  CheckCircle2,
} from "lucide-react";

const stats = [
  { title: "Total Projects", value: "3", icon: FolderKanban },
  { title: "Total Tasks", value: "12", icon: ListTodo },
  { title: "In Progress", value: "5", icon: Clock3 },
  { title: "Completed", value: "7", icon: CheckCircle2 },
];

export default function DashboardPage() {
  return (
     <ProtectedRoute>
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="min-w-0 flex-1">
        <Header title="Dashboard" />

        <div className="mx-auto max-w-7xl space-y-8 p-6">
          <div>
            <h2 className="text-xl font-bold">
              Workspace Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track your projects and tasks in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold">Recent Projects</h3>
            <p className="mt-2 text-sm text-slate-500">
              Your project list will appear here after we connect Firebase.
            </p>
          </section>
        </div>
      </main>
    </div>
  </ProtectedRoute>);
}
