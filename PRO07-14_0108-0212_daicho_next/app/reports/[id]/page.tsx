import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ReportView from "@/components/ReportView";
import { auth } from "@/lib/auth";

// 日報を 1 件開く画面（中身は受け口 /api/reports/[id] から読む）
export default async function ReportPage({ params }: PageProps<"/reports/[id]">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const { id } = await params;

  return (
    <>
      <AppHeader name={session.user.name} role={session.user.role} />
      <main className="mx-auto w-full max-w-3xl px-6 py-6">
        <h1 className="mb-4 text-xl font-bold">日報 No.{id}</h1>
        <ReportView id={id} />
      </main>
    </>
  );
}
