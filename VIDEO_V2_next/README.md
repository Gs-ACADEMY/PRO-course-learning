# 事前動画 V2「Next.js を動かす」の見本

`npx create-next-app@16 my-app --yes --no-cache-components` で作ったプロジェクト（12/8 のひな形と同じ設定）に、動画の章で足すものを入れた形です。
途中の章から追いつきたい人は、`npm install` → `npm run dev` → http://localhost:3000 から始めてください。

- 作った版：Next.js 16.4・React 19.3。Node.js 24 で動くことを確かめています
- 動画では、プロジェクトの名前を next-app にしています（V1 の Vite の my-app と重ならないように）。この見本の package.json の name は my-app のままです
- `node_modules` と `.next` は入れていません

## 動画の札（ここで動画を止めて、手元でやってみましょう）と、この見本

| 動画のページ | 見る人がやること | この見本で確かめるには |
|---|---|---|
| 9「プロジェクトを作る」 | `npx create-next-app@16 next-app --yes --no-cache-components` → `cd next-app` → `npm run dev` → `app/page.tsx` の見出しを自分の名前に | 空の作業用フォルダでそのまま打つ（見本は使わない） |
| 10「フォルダが URL になる」 | `app/about/page.tsx` を作り、/about を開く | 見本にある。http://localhost:3000/about |
| 11「画面はサーバーで作られる」 | `console.log` をターミナルとブラウザの Console で探す。ページのソースで見出しを見つける | 見本の `app/page.tsx`（表の第 3 章） |
| 12「'use client' の部品」 | Counter を置く。`'use client'` を消したときのエラーと、押したときに出る所 | 見本の `components/Counter.tsx`（表の第 4 章。消したら戻す） |
| 13「変数を変えても、画面は変わらない」 | /state で変数 a と状態 b を押し、Console と画面を見比べる | 見本の `app/state/page.tsx`（表の第 5 章） |
| 15「ブラウザにしかないもの」 | わざと最初に localStorage を読んでエラーを出し、消して add と useEffect に書く | 見本の Counter に 1 行足す → 消す（表の第 6 章） |

Windows の VS Code のターミナル（PowerShell）で npm が「スクリプトの実行が無効」で止まったら、コマンドプロンプトで打つか、`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`（聞かれたら Y。V1 の第 1 章と同じ）

## 章ごとの手順

| 章 | やること | 見る所 |
|---|---|---|
| 第 2 章 | `app/about/page.tsx` を作る | http://localhost:3000/about が開く（フォルダの名前が URL になる） |
| 第 3 章 | `app/page.tsx` の `console.log("page.tsx を動かした")` | ターミナルに出る。ブラウザの Console には「Server」の札付きで出る（開発中だけ）。ページのソース（Ctrl + U）に見出しの文字が入っている |
| 第 4 章 | `components/Counter.tsx` の 1 行目 `"use client";` を消してみる → 戻す | 消すと「You're importing a module that depends on `useState` into a React Server Component module」のエラー。戻すと動く。押したあとの `Counter を動かした 1` はブラウザの Console だけに出る |
| 第 5 章 | /state（`app/state/page.tsx`）の「変数 a」→「状態 b」を押す | 変数 a：Console の `a は 1`・`a は 2` は増えるが、ボタンの数字は 0 のまま。状態 b：ブラウザの Console に `部品を動かした {a: 0, b: 1}` が出て、ボタンの数字が変わる（部品の関数が頭から動き直し、a は毎回 0 に戻る）。開いたときは、ターミナルにも `部品を動かした { a: 0, b: 0 }` が出る（'use client' の部品も、最初の画面はサーバーで作るため） |
| 第 6 章 | `useState(0)` の前に `const saved = localStorage.getItem("count");` を足してみる → 消す | ターミナルに `ReferenceError: localStorage is not defined`（サーバーには localStorage がない）。`useEffect` の中の「表示のあと」はブラウザの Console だけに出る |

## 注意

- 見本の Counter は第 6 章の useEffect まで入れた形なので、`"use client";` を消すと、ターミナルのエラーは `useEffect` と `useState` の 2 つ出る（動画の第 4 章の時点の Counter は useState だけなので、`useState` の 1 つ）
- 開発中は、確かめのために部品を 2 回動かすので、ブラウザの Console に同じ行が 2 回出ることがあります（Strict Mode）
- ESLint を入れていると、/state の `a = a + 1` に「Cannot reassign variable after render completes … Consider using state instead.」のエラーが出ます。わざと見せている間違いです（状態を使って、と教えてくれている）。`npm run lint` もこの行の 2 件（Cannot modify local variables after render completes／Cannot reassign variable after render completes）で止まります
- Node.js 26 では、第 6 章のエラーの文が `TypeError: Cannot read properties of undefined (reading 'getItem')` になります（直し方は同じ）
