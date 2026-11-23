// 実演用：わざと遅い・落ちる API（スライド 10・15）
// Node.js にはじめから入っている機能だけで動く。起動は npm run slow-api、止めるのは Ctrl + C
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const PORT = Number(process.argv[2] || process.env.PORT || 4010);
const SLOW_MS = 8000; // slow：返すまで 8 秒待つ
const FLAKY_FAILS = 2; // flaky：2 回落ちて、3 回目に返す（これをくり返す）

// 返す中身：Open-Meteo の実際の返り値（10/11 08:30 に取ったもの）
const BODY = readFileSync(new URL("./open-meteo_2026-10-11T0830.json", import.meta.url), "utf8");

const HELP = `わざと遅い・落ちる API（実演用）
  /ok     すぐ返す（200）
  /slow   ${SLOW_MS / 1000} 秒待ってから返す（200）。?ms=20000 で待つ長さを変えられる
  /fail   落ちる（500）
  /429    断られる（429：呼びすぎ）
  /flaky  ${FLAKY_FAILS} 回落ちて（500）、${FLAKY_FAILS + 1} 回目に返す（200）。これをくり返す
  それ以外 見つからない（404）`;

let flakyCount = 0;

/** 時刻を「13:05:09」の形に */
function now() {
  return new Date().toTimeString().slice(0, 8);
}

/** エラーの中身（Open-Meteo と同じ形：error と reason） */
function errorBody(reason) {
  return JSON.stringify({ error: true, reason });
}

const server = createServer((req, res) => {
  const start = Date.now();
  const { pathname, searchParams } = new URL(req.url ?? "/", "http://localhost");

  // ほかのポートのページ（localhost:3000）からも読めるように（CORS）。結果は使い回させない
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");

  // 返して、ターミナルに 1 行残す（URL はそのまま出る。鍵が入っていれば鍵も）
  function send(status, body, type = "application/json; charset=utf-8") {
    res.writeHead(status, { "Content-Type": type });
    res.end(body);
    const sec = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`[${now()}] ${req.method} ${req.url} → ${status}（${sec} 秒）`);
  }

  if (req.method === "OPTIONS") return send(204, "");
  if (pathname === "/") return send(200, HELP, "text/plain; charset=utf-8");
  if (pathname === "/ok") return send(200, BODY);

  if (pathname === "/slow") {
    const ms = Number(searchParams.get("ms")) || SLOW_MS;
    const timer = setTimeout(() => send(200, BODY), ms);
    // 相手が待たずに切ったとき（タイムアウトなど）は、返すのをやめる
    res.on("close", () => {
      if (res.writableFinished) return;
      clearTimeout(timer);
      const sec = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`[${now()}] ${req.method} ${req.url} → 相手が待たずに切った（${sec} 秒）`);
    });
    return;
  }

  if (pathname === "/fail") return send(500, errorBody("わざと落としています（実演用）"));

  if (pathname === "/429") {
    res.setHeader("Retry-After", "60");
    return send(429, errorBody("呼びすぎです。しばらく待ってから呼んでください（実演用）"));
  }

  if (pathname === "/flaky") {
    flakyCount++;
    const n = ((flakyCount - 1) % (FLAKY_FAILS + 1)) + 1; // 1, 2, 3, 1, 2, 3 …
    if (n <= FLAKY_FAILS) return send(500, errorBody(`わざと落としています（${n} 回目）`));
    return send(200, BODY);
  }

  return send(404, errorBody("Not Found"));
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`ポート ${PORT} は使われています。別の番号で動かすときは：npm run slow-api -- ${PORT + 1}`);
    process.exit(1);
  }
  throw e;
});

server.listen(PORT, () => {
  console.log(`${HELP}\n\n動いています：http://localhost:${PORT}（止めるときは Ctrl + C）`);
});
