# PRO コース 見本コード

G's ACADEMY PRO コースの、講義と事前動画で使う見本のコードです。

フォルダの名前は「回の番号_日付_中身」です（例：`PRO02_1201_janken` ＝ 第 2 回 12/1）。複数の回で育てて使うものは、使う回の範囲を付けています（例：`PRO07-14_0108-0212_daicho_next`）。事前動画の見本は `VIDEO_V番号_中身` です。

## 使い方

1. Node.js 24 以上を入れる（`node -v` で確かめる）
2. 使いたいフォルダに移動して、`npm install` → `npm run dev`（PHP の見本は、各フォルダの README を見てください）
3. 動かし方と、画面・ターミナルに出るものは、各フォルダの README にあります

- `node_modules`・`.next`・`dist` は入れていません。最初に `npm install` してください
- 鍵や接続先は入れていません。`.env.example` を `.env` に写して、自分の値を入れてください
- 見本の中には、説明のためにわざと間違いを残しているものがあります（各 README に書いてあります）

## 事前動画

| フォルダ | 動画 | 中身 |
|---|---|---|
| `VIDEO_V1_vite` | V1 TypeScript のコードをブラウザで動かす | Vite（Vanilla＋TypeScript）のひな形の `src/main.ts` を書き換えた版 |
| `VIDEO_V2_next` | V2 Next.js を動かす | /about・サーバーで動く console.log・'use client' の Counter・/state（変数と状態の違い） |
| `VIDEO_V4_state` | V4 お天気アプリを Next.js で動かす | /weather（読み込み中・気温・失敗を状態で持つお天気の部品） |

## 講義

| フォルダ | 使う回 | 中身 |
|---|---|---|
| `PRO01_1127_lp_hidamari` | 第 1 回 11/27 | LP 課題の見本（架空の写真館）。フォームは送り先なし |
| `PRO02_1201_janken` | 第 2 回 12/1 | じゃんけん課題の見本（JavaScript）。TypeScript に移す元のコード |
| `PRO02_1201_janken_ts` | 第 2 回 12/1 | じゃんけんを TypeScript に移した 2 版（近道で移した版／直した版） |
| `PRO02_1201_calc_demo_js_ts` | 第 2 回 12/1 | JavaScript のまま壊れる例と、TypeScript の赤線の例（`calc.ts` の 4 行目はわざとエラー） |
| `PRO02_1201_ts_hinagata` | 第 2 回 12/1 | ひな形（Vite＋TypeScript＋ESLint）。`instructor/` に答えの例 |
| `PRO03_1208_memo_js` | 第 3 回 12/8 | メモ帳課題（JavaScript・localStorage）の見本 |
| `PRO03_1208_next_hinagata` | 第 3 回 12/8 | Next.js のひな形（自分のプロジェクトの始まり） |
| `PRO04_1215_memo_next` | 第 4・5 回 | メモ帳を Next.js で書き直した版 |
| `PRO04_1215_weather_3vars_next` | 第 4 回 12/15 | 天気を 3 つの変数で持つ版。わざと遅い・落ちる API（`npm run slow-api`）と対策 |
| `PRO04_1215_zip_next` | 第 4 回 12/15 | 郵便番号から住所を出す部品（zipcloud）。打ち切る時間つきの版（/zip-timeout）も |
| `PRO05_1218_weather_next` | 第 5 回 12/18 | メモ帳にお天気（Open-Meteo）を組み込んだ版 |
| `PRO05_1218_memo_firestore_next` | 第 5 回 12/18 | メモ帳の保存先を Firestore にした版（`lib/firebase.ts` に自分の設定を貼って使う） |
| `PRO06_1225_enquete_php` | 第 6 回 12/25 | アンケートアプリ（PHP） |
| `PRO06_1225_contact_next` | 第 6 回 12/25 | 問い合わせのページと受け口（`app/api/contact/route.ts`） |
| `PRO07_0108_bookmark_php` | 第 7 回 1/8 | ブックマーク（PHP）：登録・参照・更新・削除 |
| `PRO07-08_0108-0112_daicho_hinagata` | 第 7・8 回 | 案件台帳のひな形（1/8 時点）。配布データの CSV（`data/`）入り |
| `PRO08_0112_bookmark_login_php` | 第 8 回 1/12 | ブックマーク（PHP）にログインを足した版 |
| `PRO07-14_0108-0212_daicho_next` | 第 7〜14 回 | 案件台帳（Next.js・Prisma・PostgreSQL・Better Auth）の最新版 |
| `PRO07-14_0108-0212_daicho_history.bundle` | 第 7〜14 回 | 台帳の育ち方（Git の履歴）。`git clone PRO07-14_0108-0212_daicho_history.bundle daicho-demo` で取り出し、回ごとの版はタグで切り替える |
| `PRO09_0115_shukei_monthly` | 第 9 回 1/15 | 前任者の集計のコード（不具合入り）とテスト。`instructor/` に答え |

- 台帳の 2 つ（`PRO07-08`・`PRO07-14`）は、`.env` の `DATABASE_URL` を入れてから `npm install` してください（入れる時に Prisma のコードを作るため）
