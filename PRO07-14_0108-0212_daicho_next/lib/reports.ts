import { prisma } from "@/lib/prisma";

/** 日報を 1 件取る（どの案件の日報かも一緒に）。なければ null */
export async function getReport(id: number) {
  if (!Number.isInteger(id)) return null;
  return prisma.report.findUnique({
    where: { id },
    include: { project: { select: { id: true, title: true } } },
  });
}
