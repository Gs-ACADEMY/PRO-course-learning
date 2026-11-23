import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import MonthlyCard from "@/components/MonthlyCard";
import ProjectTable from "@/components/ProjectTable";
import StatusFilter from "@/components/StatusFilter";
import SummaryCard from "@/components/SummaryCard";
import { auth } from "@/lib/auth";
import { parseStatus } from "@/lib/filter";
import { shiftMonth, thisMonthLabel } from "@/lib/monthly";
import { canSeeAmount, canSeeSummary } from "@/lib/permissions";

export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const query = await searchParams;
  const status = parseStatus(query.status);

  // 依頼 2：月の作業人数（?month=2027-01。なければ今月）
  const m = typeof query.month === "string" && /^\d{4}-\d{2}$/.test(query.month) ? query.month : thisMonthLabel();
  const href = (label: string) => `/projects?month=${label}${status ? `&status=${status}` : ""}`;

  return (
    <>
      <AppHeader name={session.user.name} role={session.user.role} />
      <main className="mx-auto w-full max-w-6xl px-6 py-6">
        <h1 className="mb-4 text-xl font-bold">案件の一覧</h1>
        <section className="mb-6 flex items-center gap-6 rounded-xl bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200">
          <MonthlyCard month={m} />
          <nav className="ml-auto flex gap-3 text-sm">
            <Link href={href(shiftMonth(m, -1))} className="text-sky-700 underline">← 前の月</Link>
            <Link href={href(shiftMonth(m, 1))} className="text-sky-700 underline">次の月 →</Link>
          </nav>
        </section>
        {canSeeSummary(session.user.role) && <SummaryCard />}
        <StatusFilter status={status} month={m} />
        {/* 金額の列は、金額を見てよい役割のときだけ出す（画面の側の分け方） */}
        <ProjectTable status={status} canSeeAmount={canSeeAmount(session.user.role)} />
      </main>
    </>
  );
}
