import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

async function AdminAuthGuard({ children }) {
  // Authentication must run at request time.
  await connection();

  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return children;
}

export default function AdminDashboardLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-gray-500">
          Loading admin dashboard...
        </div>
      }
    >
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </Suspense>
  );
}
