import { getUser } from "@/lib/session";
import { amountGuardOn, canEditAmount } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { log } from "@/lib/log";

type Ctx = RouteContext<"/api/projects/[id]">;

const forbidden = () => Response.json({ error: "この役割では金額を変えられません" }, { status: 403 });

// 案件の見積金額を変える受け口（「金額を更新」のボタンが呼ぶ。2/12）
export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const path = `/api/projects/${id}`;
  const user = await getUser(req);
  if (!user) {
    log("warn", { path, status: 401, userId: null, message: "not signed in" });
    return Response.json({ error: "ログインしてください" }, { status: 401 });
  }

  // 何をしてよいか：画面でボタンを隠しても、ここで止める。
  // はじめは「通さない」にしておく。確かめる途中でエラーが起きても、止まる側に倒す
  let ok = false;
  try {
    ok = await canEditAmount(user, Number(id));
  } catch (e) {
    console.error(e);
  }
  if (amountGuardOn() && !ok) {
    log("warn", { path, status: 403, userId: user.id, message: "this role cannot change the amount" });
    return forbidden();
  }

  const body = (await req.json().catch(() => null)) as { amount?: unknown } | null;
  const amount = body?.amount;
  if (typeof amount !== "number" || !Number.isInteger(amount) || amount < 0) {
    log("warn", { path, status: 400, userId: user.id, message: "amount must be a whole number of yen" });
    return Response.json({ error: "金額は 0 以上の整数（円）で送ってください" }, { status: 400 });
  }
  const project = await prisma.project
    .update({ where: { id: Number(id) }, data: { amount }, select: { id: true, amount: true } })
    .catch(() => null); // 番号の案件がないとき
  if (!project) {
    log("warn", { path, status: 404, userId: user.id, message: "project not found" });
    return Response.json({ error: "その番号の案件はありません" }, { status: 404 });
  }
  log("info", { path, status: 200, userId: user.id, message: `amount changed to ${amount}` });
  return Response.json(project);
}
