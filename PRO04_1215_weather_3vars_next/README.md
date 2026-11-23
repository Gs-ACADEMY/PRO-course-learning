# PRO04_1215 天気を 3 つの変数で持つ版（講師の見本）

12/15 の実演（スライド 6・9・10・15・16）で使う講師の見本です。
PRO04_1215_memo_next のメモ帳に、今の気温（Open-Meteo）を部品として足しました。状態は 3 つの変数（`loading`・`temp`・`error`）で持ちます。1 つの型にまとめる版は、12/18 の `PRO05_1218_weather_next` です。

## 12/15 のスライドとの対応

| スライド | このプロジェクト |
|---|---|
| 6 呼び方（URL → fetch → Console） | `components/WeatherCard.tsx` の `OPEN_METEO`（スライドと同じ URL） |
| 8 3 つの状態（3 つの変数で持つ） | `WeatherCard.tsx` の `useState` の 3 行（スライドと同じ） |
| 9 デモ：天気を呼んで、3 つを出す | `WeatherCard.tsx` の `load()`（スライドと同じ）と、URL を壊す行 |
| 10 失敗を前提にした呼び方 | `/api-demo`（`components/ApiDemo.tsx`・`lib/demoApi.ts`）と、わざと遅い・落ちる API（`tools/slow-api/server.mjs`） |
| 15 デモ：ブラウザに届いたコードを読む | `/key-demo`（`components/KeyDemo.tsx` のダミーの鍵） |
| 16 デモ：メモ 5 件を AI で要約 | `data/demo-memos.json`（実演用のメモ 5 件。要約そのものは作っていません） |

## 動かし方

```bash
npm install
npm run dev        # http://localhost:3000
```

スライド 10・15 の実演では、別のターミナルで「わざと遅い・落ちる API」も動かします。

```bash
npm run slow-api   # http://localhost:4010（止めるときは Ctrl + C）
```

- Node.js にはじめから入っている機能だけで動きます（追加のインストールは要りません）
- ポート 4010 が使われているときは `npm run slow-api -- 4011` のように番号を変えられます。そのときは `lib/demoApi.ts` の `SLOW_API` も同じ番号に直します

## 実演の手順

### スライド 6：URL → fetch → Console

1. ブラウザで URL を開き、返ってくる JSON の形を見る
   `https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.76&current=temperature_2m`
2. http://localhost:3000 を開いた状態で、開発者ツールの Console にスライドの 6 行を打つ
3. 気温が出る

- 見本の `WeatherCard.tsx` では、URL をいったん `OPEN_METEO` に入れ、そこから `url` を作っています（予備の切り替えと、URL を壊す実演のため）。`fetch(url)` から先は、スライド 9 と同じです

### スライド 9：3 つの状態と、URL をわざと壊す

1. http://localhost:3000 を開く →「天気を読み込み中…」のあと、「今の気温」と「Weather data by Open-Meteo.com」が出る
2. `components/WeatherCard.tsx` の上の方の 2 行を入れ替える
   - `const url = process.env.NEXT_PUBLIC_WEATHER_URL || OPEN_METEO;` の頭に `//` を付ける
   - `// const url = OPEN_METEO + "XXX";` の `//` を外す
3. 保存して、ページを再読み込み →「天気を取れませんでした」と「もう一度」が出る。Network では、URL の最後が `temperature_2mXXX` の行のステータスを見る（項目の名前が違うので、400 が返るはず）
4. 終わったら 2 行を元に戻す

- `fetch` は 400 や 404 が返っても、それだけでは失敗になりません。`if (!res.ok) throw …` の行があるので、失敗の表示になります（スライド 9 の右下）
- この作業の環境からは Open-Meteo につながらないため、壊した URL に Open-Meteo が実際に何を返すか（400 になるか、Console に CORS の文字が出ないか）は確かめていません。講義の前日に一度、Network と Console を見ておいてください。どれが返っても、200 番台以外なら失敗の表示になります（つながらないときも同じ）

### スライド 10：対策のあり・なしを比べる

1. `npm run slow-api` を動かし、http://localhost:3000/api-demo を開く
2. 「遅い（8 秒）」のまま「両方を同時に呼ぶ」を押す
   - 対策あり：5.0 秒で「5 秒で打ち切り」（タイムアウト）
   - 対策なし：その間も待ち続け、8 秒で返る
3. 「ときどき落ちる」を選び、対策なし → 対策ありの順に押す
   - 対策なし：「500（相手の不調）」で終わり
   - 対策あり：「1 回目：500（相手の不調） → 1 秒待って、もう一度」のあと、2 回目で成功（再試行）
4. 「遅い（8 秒）」に戻し、左右のボタンを 3 回ずつ素早く押す
   - 対策なし：3 回とも呼ぶ（呼んだ回数 3。Network にも 3 行）
   - 対策あり：待っている間は押せない（呼んだ回数 1）。これが「回数を守る」

- 対策ありの決まり：5 秒で打ち切る／500 番台のときだけ、1 秒待って 3 回まで呼び直す／打ち切り・429 は呼び直さない／待っている間はボタンを押せない
- API の動きを選び直すと、終わった記録は消えます（待っている記録は残ります）
- 「落ちる（500）」「断られる（429）」も選べます。slow-api のターミナルに、届いた通信が 1 行ずつ出ます（タイムアウトで切られた通信は「相手が待たずに切った」）
- 「ときどき落ちる」は「2 回落ちて、3 回目に返す」をくり返します。順番がずれたら、slow-api を止めて動かし直すと 1 回目から数え直します
- URL の最後の `?n=1`・`?n=2`… は、押すたびに別の通信にするためのものです（サーバーは見ていません）。同じ URL を同時に呼ぶと、ブラウザが 1 つずつ順番に送るため、連打の比べ方が分かりにくくなります
- 呼び方のコードは `lib/demoApi.ts` の `callPlain`（対策なし）と `callWithCare`（対策あり）です。スライドの 1 行（`AbortSignal.timeout(5000)`）もここにあります
- `AbortSignal.timeout` が使えるブラウザの範囲は、講義の前日に MDN で確かめる（スライド 10 のメモ）

### スライド 15：ブラウザに届いた鍵を探す

`components/KeyDemo.tsx` に、ダミーの鍵 `DUMMY-KEY-0000-not-a-real-key` を書いています。本物の鍵ではありません。本物の鍵は、この見本にも、映す画面にも入れません。

1. `npm run slow-api` を動かし、http://localhost:3000/key-demo を開く
2. 開発者ツール → Sources（ソース）。全体を検索（Ctrl + Shift + F、Mac は ⌘ + ⌥ + F）して `DUMMY-KEY` と打つ → 見つかる
   - `npm run dev` のときは、元のファイル（`components/KeyDemo.tsx`）の形で見えます。コメントもそのままです
   - 本番の形（`npm run build` → `npm start`）でも、縮められた JS（`_next/static/chunks/…js`）の中に見つかります。「公開しても同じ」と見せるときはこちら
3. Network を開いてから「鍵つきで呼ぶ」を押す → 行の名前が `ok?key=DUMMY-KEY-0000-not-a-real-key`。鍵が URL に入ると、Network の行にもそのまま出ます
4. 画面には鍵を出していないのに、開発者ツールでは見つかる、と伝える

- slow-api のターミナルにも、鍵の入った URL がそのまま残ります（URL に入れた鍵は、相手のサーバーの記録にも残る）
- `NEXT_PUBLIC_` の注意（スライド 14）：名前が `NEXT_PUBLIC_` で始まる設定値は、`.env.local` に書いても、ビルドのときにブラウザ向けの JS に埋め込まれます。鍵をこの名前にすると、`KeyDemo.tsx` に直接書いたのと同じで、Sources で見つかります。AI が「`NEXT_PUBLIC_` を付ければ動きます」と言ったら、それは鍵を配る指示です
  - この見本の `NEXT_PUBLIC_WEATHER_URL`（下の「メモ」）は URL なので、ブラウザに配っても困りません

### スライド 16：実演用のメモ 5 件

`data/demo-memos.json` に、実演用のメモ 5 件（本文と日付）を入れています。人や会社の名前は入れていません。急ぎのものが 2 件（今日の 17 時まで・今日中）、金曜までのものが 1 件、急がないものが 2 件です。

http://localhost:3000 を開き、開発者ツールの Console に次を貼り付けると、メモ帳に 5 件入ります。**いまのメモは置き換わります。**

<!-- memos-snippet -->
```js
localStorage.setItem("memos", JSON.stringify([
  { id: "demo-1", text: "金曜の発表のスライドを直す。グラフを 1 枚足す", createdAt: "2026-12-14T09:20:00.000Z" },
  { id: "demo-2", text: "牛乳と卵とパンを買う", createdAt: "2026-12-14T12:05:00.000Z" },
  { id: "demo-3", text: "急ぎ：今日の 17 時までに、請求書の金額を確かめて返事をする", createdAt: "2026-12-14T23:40:00.000Z" },
  { id: "demo-4", text: "来月の勉強会で話すテーマを 3 つ考える", createdAt: "2026-12-15T00:15:00.000Z" },
  { id: "demo-5", text: "明日の朝 9 時の打ち合わせの部屋を、今日中に予約する", createdAt: "2026-12-15T01:30:00.000Z" }
]));
location.reload();
```

- Chrome は、Console に初めて貼り付けるときに止めることがあります。表示に従って `allow pasting` と打ってから、もう一度貼ります
- 要約そのもの（AI の API を呼ぶ所）は、この見本には入っていません。使う AI のサービスがまだ決まっていないためです。決まったら、鍵は講師の環境の、ブラウザに届かない所に置きます（スライド 16）

## 素材の撮り方

### 1215-2 Network の行（スライド 11）

1. `.env.local` がないこと（本物の Open-Meteo を呼ぶこと）を確かめてから、`npm run dev`
2. Chrome で http://localhost:3000 を開き、開発者ツール → Network。絞り込みの欄に `open-meteo` と打つ
3. 再読み込みして `forecast?latitude=…` の行を開き、Headers でステータス 200、Response で JSON が見える所を撮る

- `npm run dev` では行が 2 つ出ます（下の「メモ」）。1 行で撮りたいときは `npm run build` → `npm start`

### 1215-3 Sources のダミーの鍵（スライド 15）

1. 上の「スライド 15」の 1〜2 をして、検索の結果と、鍵の所が色付きで見える画面を撮る
2. 元のファイルの形で撮るなら `npm run dev`（コメントの「ダミーの文字列で、本物の鍵ではない」も写る）。縮められた JS で撮るなら `npm run build` → `npm start`
3. 撮ったあと、本物の鍵が写っていないことを確かめる（この見本にはダミーしかありません）

## Open-Meteo の利用条件

- 鍵なしで使えます。無料で使えるのは非商用だけで、1 日 1 万回未満。出典の表示が要ります（スライド 6）
- 10/10 に確かめた内容です。講義の前日に、もう一度確かめてください（open-meteo.com/en/terms・open-meteo.com/en/licence）
- 出典は、成功の表示の中に「Weather data by Open-Meteo.com」（open-meteo.com へのリンク）として出しています

## メモ

- 既定の lint は、`useEffect` の中で `load()` を呼ぶ行を error にします（`react-hooks/set-state-in-effect`）。12/8 の「最初に 1 回読む」形のまま使うため、`WeatherCard.tsx` のこの 1 行だけ外しています（`MemoBoard.tsx` と同じやり方）
- `npm run dev` では、画面を開いたときに天気を 2 回呼びます。React の Strict Mode が、確かめのために最初の処理を 2 回動かすためです。本番の形（`npm run build` → `npm start`）では 1 回です
- 予備（確かめ用）：`.env.local` に `NEXT_PUBLIC_WEATHER_URL=http://localhost:4010/ok` と書き、`npm run slow-api` を動かしてから `npm run dev` し直すと、Open-Meteo の代わりに slow-api を呼びます。会場で Open-Meteo につながらないときにも使えます。ふだんは書きません。撮影の前には消します
- slow-api が返す中身は、10/11 08:30 に取った Open-Meteo の実際の返り値です（`tools/slow-api/open-meteo_2026-10-11T0830.json`）。12/18 の見本の URL で取ったので、気温のほかに天気の番号と最高・最低も入っています
- 開発者ツールで「キャッシュを無効にする」に印を付けていると、`npm run dev` のときだけ、Console に「server caches disabled」という Next.js の注意が出ます。見本の不具合ではありません
- `next.config.ts` などの設定と、メモ帳の部分（`components/Memo*.tsx`）は PRO04_1215_memo_next と同じです
