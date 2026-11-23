// 任意課題の例：400 と 422 を使い分け、二重送信を 1 件にする受け口
// 画面（app/contact/page.tsx）からは呼んでいない。curl や Console で試す

type Contact = { name: string; email: string; message: string; receivedAt: number };
const inbox: Contact[] = []; // こちらもメモリに置く（再起動で消える）

export async function POST(req: Request) {
  // 受け取る：JSON として読めなければ 400
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON として読めません" }, { status: 400 });
  }

  // 確かめる（形）：項目がなければ 400
  const { name, email, message } = (body ?? {}) as Record<string, unknown>;
  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return Response.json({ error: "name・email・message の 3 つの項目が要ります" }, { status: 400 });
  }
  const contact = { name: name.trim(), email: email.trim(), message: message.trim() };
  if (!contact.name || !contact.message) {
    return Response.json({ error: "名前と内容は必須です" }, { status: 400 });
  }

  // 確かめる（中身）：形は正しいが、決まりに合わなければ 422
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    return Response.json({ error: "メールの形ではありません" }, { status: 422 });
  }
  if (contact.name.length > 50 || contact.message.length > 1000) {
    return Response.json({ error: "長すぎます（名前は 50 文字、内容は 1000 文字まで）" }, { status: 422 });
  }

  // 二重送信：同じ中身が 60 秒以内に続いたら、2 件目は保存しない（返事は ok のまま）
  const last = inbox[inbox.length - 1];
  if (
    last &&
    last.name === contact.name &&
    last.email === contact.email &&
    last.message === contact.message &&
    Date.now() - last.receivedAt < 60 * 1000
  ) {
    console.log("同じものが続いたので、1 件にした:", contact);
    return Response.json({ ok: true, duplicate: true });
  }

  // 保存する・返す
  inbox.push({ ...contact, receivedAt: Date.now() });
  console.log("受け取った（v2）:", contact);
  return Response.json({ ok: true });
}
