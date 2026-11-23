# 事前動画 V4「お天気アプリを Next.js で動かす」の見本

12/8 のひな形と同じ設定の Next.js に、動画の章で使うページを入れた形です。`npm install` → `npm run dev` → http://localhost:3000/weather から始めてください。

- 作った版：Next.js 16.4・React 19.3。Node.js 24 で動くことを確かめています
- `node_modules` と `.next` は入れていません
- 状態の考え方（/state の変数 a と状態 b）は、事前動画 V2 の見本（`VIDEO_V2_next`）で扱います。この見本の `app/state` は残していますが、V4 の動画では使いません

## 章ごとの手順

| 章 | 開くもの | 見る所 |
|---|---|---|
| 第 1 章 | 課題のお天気アプリ（JavaScript 版） | 動かして今の動きを書き出す。textContent・innerHTML で検索し、画面を書き換えている所（読み込み中…・気温・取れなかった）に印を付ける |
| 第 2 章 | `components/Weather.tsx` の頭（"use client"・型・url）と `app/weather/page.tsx` | /weather に見出し「お天気」とボタン「今の気温を見る」が出る。動画では、部品の中をボタンだけにした途中の形から書き足していく |
| 第 3 章 | `components/Weather.tsx` の状態と `load` | 読み込み中・気温・失敗を別々の状態で持ち、書き換えていた所を setLoading・setTemp・setError に置き換える。ボタンに onClick={load} を足して押すと、開発者ツールの Network に天気の行（200）が出る（画面はまだ変わらない） |
| 第 4 章 | /weather（`return` の出し分け） | 押すと「読み込み中…」→ 気温と出典。url の `forecast` の後ろに "XXX" を足して押すと「天気を取れませんでした」。戻して押すと、エラーが消えて気温が出る（呼ぶ前に setError(false)、最後に setLoading(false)） |
| 第 5 章 | 自分のお天気アプリ（JavaScript 版・OpenWeatherMap） | 今の動きを書き出し、状態にするもの（読み込み中・気温・失敗・入力中の都市など）を決め、第 2〜4 章の順に置き換える。ひとつ動いたらコミット。この見本では確かめられない（受講生のアプリで行う）。置き換えた後の形の見本は `components/Weather.tsx` |

動画で「ここで動画を止めて、手元でやってみましょう」と出るのは、第 5 章の「自分の課題に当てはめる」だけです。第 1〜4 章は、見て流れをつかんでください。

Windows の VS Code のターミナル（PowerShell）で npm が「スクリプトの実行が無効」で止まったら、コマンドプロンプトで打つか、`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`（聞かれたら Y。V1 の第 1 章と同じ）

## 注意

- 失敗の実演：url の最後（`temperature_2m` の後ろ）に "XXX" を足しても、Open-Meteo は 200 で気温を返すので失敗になりません。`/v1/forecast` の後ろに "XXX" を足してください
- 壊すと Console に赤いエラーが出ます（わざと壊したので出てよい）
- 天気は Open-Meteo（鍵は要らない・無料は非商用まで・出典の表示が要る）。使う前に、Open-Meteo のサイトで利用条件を確かめてください
- 開発中は、部品を 2 回動かすので、Console に同じ行が 2 回出ることがあります（Strict Mode）
- `app/state` を残しているので、`npm run lint` では /state の `a = a + 1` に「Cannot reassign variable after render completes … Consider using state instead.」のエラーが出ます（V2 で見せる、わざとの間違い）
