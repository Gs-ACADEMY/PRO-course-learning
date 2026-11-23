// 鍵の置き場：鍵は .env.local に書き、受け口（サーバー）の中だけで読む
// 返すのは「鍵が入っているか」だけ。鍵そのものは返さない
export async function GET() {
  const key = process.env.AI_API_KEY;
  return Response.json({ hasKey: Boolean(key) });
}
