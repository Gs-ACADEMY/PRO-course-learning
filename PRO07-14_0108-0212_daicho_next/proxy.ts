import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// ログインの印（クッキー）がなければ、入口に戻す
// ここは「戻す」だけ。本当に誰かを確かめるのは、ページと受け口の中（サーバー）
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // ログインの画面・受け口（/api は自分で 401 を返す）・Next.js の内部のファイルは対象外
  matcher: ["/((?!login|api|_next|favicon.ico).*)"],
};
