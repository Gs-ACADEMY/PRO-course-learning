import AppHeader from "@/components/AppHeader";
import ProjectTable from "@/components/ProjectTable";
import StatusFilter from "@/components/StatusFilter";
import { parseStatus } from "@/lib/filter";
import { prisma } from "@/lib/prisma";

// URL の ?status= を読むので、この画面は開くたびにデータベースを読む
export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const status = parseStatus((await searchParams).status);
  const projects = await prisma.project.findMany({
    where: { status }, // 絞り込み（状態を選んでいないときは undefined で、全部）
    orderBy: { updatedAt: "desc" }, // 並べ替え（更新が新しい順）
  });

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl px-6 py-6">
        <h1 className="mb-4 text-xl font-bold">案件の一覧</h1>
        <StatusFilter status={status} count={projects.length} />
        <ProjectTable projects={projects} />
      </main>
    </>
  );
}
