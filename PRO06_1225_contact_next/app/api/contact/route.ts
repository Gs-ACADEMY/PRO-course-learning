type Contact = { name: string; email: string; message: string };
const inbox: Contact[] = [];            // 今日はメモリに置く
export async function POST(req: Request) {
  const body = await req.json();          // 受け取る
  const checkOn = process.env.CONTACT_CHECK !== "off"; // 実演用：.env.local の CONTACT_CHECK=off で外す
  if (checkOn && (!body.name || !body.message)) { // 確かめる
    return Response.json(
      { error: "名前と内容は必須です" }, { status: 400 });
  }
  inbox.push(body);                       // 保存する
  console.log("受け取った:", body);
  return Response.json({ ok: true });     // 返す
}

// 演習の続き（任意）：受け取った問い合わせを、新しい順に返す（ログインはまだないので、誰でも見られる）
export async function GET() {
  return Response.json([...inbox].reverse());
}
