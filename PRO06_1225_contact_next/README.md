# PRO06_1225 問い合わせの受け口を足した版（講師の見本）

12/25 の実演（スライド 8〜10・14〜16）と素材 1225-2 で使う、12/8 から育てている講師の Next.js です。
`PRO05_1218_weather_next`（メモ帳＋お天気）に、問い合わせのページと受け口を足しています。

使っているもの：Next.js 16.4.0 ／ React 19.3.0（12/18 の見本と同じ。`package-lock.json` もそのまま）

## 12/25 のスライドとの対応

| スライド | このプロジェクト |
|---|---|
| 8 受け口の置き場 | 画面 `app/contact/page.tsx`（/contact）と、受け口 `app/api/contact/route.ts`（/api/contact） |
| 9 受け口の形 | `app/api/contact/route.ts` の `POST`。スライドのコードに、実演の切り替えを 1 行足したもの（下の「スライドと違う所」） |
| 10 画面から送る | `app/contact/page.tsx` の `send` の中の `fetch`（スライドと同じ） |
| 11 演習の続き：一覧 | 同じ `route.ts` の `GET`。http://localhost:3000/api/contact を開くと、受け取った問い合わせが新しい順に出る |
| 14 画面を通さずに送る | フォームの `required`（画面のチェック）と、`.env.local` の `CONTACT_CHECK=off`（受け口の確かめを外す） |
| 15 HTTP を生のまま読む | `curl -i`（下の「スライド 15：curl で送る」） |
| 15 二重送信・任意課題 | 画面：送っている間はボタンを止める（`page.tsx` の `sending`）／受け口：`app/api/contact-v2/route.ts` |
| 16 鍵の置き場 | `.env.example`（`AI_API_KEY=ここに鍵`）と `app/api/key-check/route.ts`（`const key = process.env.AI_API_KEY;`） |

## 動かし方

```bash
npm install
npm run dev     # http://localhost:3000
```

- http://localhost:3000/contact が問い合わせのページです（トップの右上の「お問い合わせ」からも行けます）
- 受け取った問い合わせは、サーバーのメモリに置いているだけです。`npm run dev` を止めると消えます（1/8 にデータベースへ移す）

## 確かめの切り替え（スライド 14 の実演）

`.env.example` を `.env.local` にコピーし、`# CONTACT_CHECK=off` の先頭の `#` を消すと、受け口の確かめが外れます（台帳の見本の `AMOUNT_GUARD="off"` と同じ考え方）。

```bash
cp .env.example .env.local     # PowerShell でも同じ
```

| `.env.local` | Console から空のまま送ると |
|---|---|
| `CONTACT_CHECK=off` | `{ok: true}`。空の問い合わせが 1 件増える（確かめが画面にしかない受け口） |
| 書かない（いつもはこちら） | 400 と `{error: '名前と内容は必須です'}`。何も増えない |

- `.env.local` を書き換えて保存すると、`npm run dev` が自分で読み直します（ターミナルに `Reload env: .env.local` と出る）。止めなくて大丈夫です。読み直すと、メモリの問い合わせは消えます
- `npm run build` → `npm start` で動かすときは、`.env.local` を書き換えたら `npm start` をやり直します（ビルドし直しは要りません）
- コメントで切り替えてもかまいません。`route.ts` の 6〜9 行目（確かめる）を選んで Ctrl + /（Mac は Cmd + /）。書き換えて保存したときも、メモリの問い合わせは消えます

## スライドと違う所（route.ts）

スライド 9 のコードに、切り替えの 1 行（5 行目）を足し、確かめの if（6 行目）に `checkOn &&` を足しています。型・コメント・メッセージ・返事は、スライドと同じです。最後に、演習の続きの `GET` を足しています。

```ts
  const checkOn = process.env.CONTACT_CHECK !== "off"; // 実演用：.env.local の CONTACT_CHECK=off で外す
  if (checkOn && (!body.name || !body.message)) { // 確かめる
```

スライドとまったく同じ形で見せたいときは、5 行目を消し、6 行目を `if (!body.name || !body.message) {      // 確かめる` に戻します（そのときの切り替えはコメントで）。

## 実演の手順

### スライド 10：送って、ターミナルと Network の 2 か所で確かめる

1. `npm run dev` のターミナルを、見える所に置く
2. Chrome で http://localhost:3000/contact を開き、開発者ツール（F12）の Network を開く（「Fetch/XHR」で絞ると見やすい）
3. 名前・メール・相談したいことを入れて「送る」
4. ターミナルに `受け取った: { name: '…', email: '…', message: '…' }` が出る（サーバーのログ。ブラウザの Console には出ない）
5. Network の `contact` の行を開く：Headers に `200`、Payload に送った値、Response に `{"ok":true}`。画面の下にも「返事：200 {"ok":true}」と出ます

### スライド 14：画面を通さずに送る

1. 空のまま「送る」を押す → 画面が止める（`required`。「このフィールドを入力してください」）
2. `.env.local` を `CONTACT_CHECK=off` にして保存
3. 開発者ツールの Console に、スライド 14 のコードを貼って Enter

   ```js
   await fetch("/api/contact", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ name: "", email: "", message: "" }),
   }).then((r) => r.json());
   ```

   → `{ok: true}`。ターミナルに `受け取った: { name: '', email: '', message: '' }`。http://localhost:3000/api/contact を開くと、空の 1 件が見える
4. `.env.local` の `CONTACT_CHECK=off` を消して（または先頭に `#`）保存し、同じコードをもう一度（Console で ↑ キーを押すと前のコードが出る）
   → `{error: '名前と内容は必須です'}`。Network では `400`。何も増えない

- Console は、自分のページ（localhost:3000）を開いた状態で使います。別のサイトのページの Console からは止められます（12/15 の話）
- Chrome で初めて Console に貼り付けるときは、警告が出て貼り付けられません。画面の指示どおりの言葉（英語の画面なら `allow pasting`）を入れて Enter してから貼ります

### スライド 15：curl で送る（HTTP を生のまま読む）

mac ／ Linux ／ Git Bash：

```bash
curl -i -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"","message":""}'
```

Windows の PowerShell（1 行で）：

```powershell
'{"name":"","email":"","message":""}' | curl.exe -i -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" --data-binary "@-"
```

- `curl` とだけ書くと、Windows に最初から入っている PowerShell（5.1）では別の命令（Invoke-WebRequest）が動きます。`curl.exe` と書きます
- JSON の `"` は、`-d '…'` で渡すと PowerShell の版によって消えたり残ったりして、受け口に正しく届きません。上のように `|`（パイプ）で渡すと、版によらず届きます（`--data-binary "@-"` は「パイプで来たものを送る」の意味）
- PowerShell 5.1 では、パイプで日本語を送ると「?」に変わることがあります。空の値なら気にしなくて大丈夫です
- Git Bash（Git for Windows に入っている）なら、mac と同じ書き方で送れます

10/11 にこの見本で取った返事（`npm run dev`、確かめあり。`npm start` でも同じ）：

```
HTTP/1.1 400 Bad Request
vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
content-type: application/json
Date: Sun, 11 Oct 2026 05:13:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Transfer-Encoding: chunked

{"error":"名前と内容は必須です"}
```

スライド 15 の 4 行（1 行目・`content-type`・空行・中身）は、この中にそのまま入っています。スライドは「一部」なので、`vary`・`Date` など 5 行を省いています。

### スライド 16：鍵の置き場

1. `.env.local` に `AI_API_KEY=ここに鍵`（`.env.example` をコピーしたまま）
2. http://localhost:3000/api/key-check を開く → `{"hasKey":true}`。返すのは「鍵が入っているか」だけで、鍵そのものは返しません
3. 鍵は `app/api/key-check/route.ts` の中（サーバー）だけで読んでいます。開発者ツールの Sources で「ここに鍵」を探しても出てきません（ブラウザに届いていない）

- 注意：`NEXT_PUBLIC_` で始まる名前にすると、`npm run build` のときにブラウザ向けのコードへ値が書き込まれ、誰でも見られます。鍵には付けません
- この見本は AI の API を呼びません（鍵が入っているかを返すだけ）
- `.env.local` は Git に上げません（`.gitignore` の `.env*`）。上げてよいのは、値の入っていない `.env.example` だけです

## 任意課題の例（app/api/contact-v2/route.ts）

スライド 15 の任意課題「400 と 422 を使い分け、二重送信を防ぐ」の例です。画面からは呼んでいません。curl か Console で `/api/contact-v2` に送ります（画面から試すときは、`page.tsx` の `"/api/contact"` を `"/api/contact-v2"` に変える）。

| 送るもの | 返事 |
|---|---|
| JSON として読めない（例：`{name:`） | 400 `JSON として読めません` |
| 項目がない（例：`message` がない・文字でない） | 400 `name・email・message の 3 つの項目が要ります` |
| 名前か内容が空（スライド 14 と同じもの） | 400 `名前と内容は必須です` |
| メールの形でない（例：`abc`） | 422 `メールの形ではありません` |
| 長すぎる（名前 51 文字以上・内容 1001 文字以上） | 422 `長すぎます（名前は 50 文字、内容は 1000 文字まで）` |
| 同じ中身が 60 秒以内にもう一度 | 200 `{"ok":true,"duplicate":true}`（2 件目は保存しない） |

- 分け方は、スライド 15 のメモのとおり「形が壊れている＝400、中身が決まりに合わない＝422」です。空の名前・内容は、スライド 9 の受け口と同じく 400 にしています
- スライド 9 の受け口（`/api/contact`）に JSON でないものを送ると、`req.json()` で失敗して 500 になります（表の「受け口のコードの不具合」）。v2 はそこを 400 で返します

## 素材 1225-2 の撮り方

スライド 10 の右（実演が止まったときの予備）です。Network とターミナルを並べて撮ります。

1. `npm run dev` を動かしたターミナルと Chrome を、横に並べる
2. Chrome で http://localhost:3000/contact を開き、開発者ツールの Network を開く（Fetch/XHR で絞る）
3. 例の値で送る：名前「テスト」、メール `test@example.com`、相談したいこと「見積もりの相談です」（実在の人の名前は使わない）
4. Network の `contact` の行を開いて Payload（送った値）を出す。返事の `{"ok":true}` は、Response のタブか、画面の下の「返事：200 {"ok":true}」で見せる
5. ターミナルの `受け取った: { name: 'テスト', … }` が見える状態で撮る

## つまずき（スライドのメモから）

- 11/27 の HTML ファイルから送ると止められる：fetch で送ると、別のサイト扱いで止められます（Console に赤い CORS のエラー。受け口には届かない）。form の action に受け口を書いて送ると、届きはしますが JSON ではないので 500 になります。フォームは Next.js のページに作ります
- 問い合わせが消えた：メモリに置いているので、`npm run dev` を止める・`route.ts` を書き換えて保存する・`.env.local` を書き換える、のどれでも消えます。正常です（1/8 にデータベースへ）
- `console.log` が見つからない：受け口の `console.log` は、ブラウザの Console ではなく、`npm run dev` のターミナルに出ます（デバッグ③サーバー）
- Console から送ると止められる：自分のページ（localhost:3000）を開いて送ります
- PowerShell の curl が動かない：`curl.exe` と書き、JSON はパイプで渡します（上の「スライド 15：curl で送る」）
- AI が作った受け口は、確かめが画面の側にしかないことがあります：画面を通さずに空で送って、400 で止まるか確かめます

## 足した・変えたファイル（12/18 の見本から）

- 足した：`app/contact/page.tsx`・`app/api/contact/route.ts`・`app/api/contact-v2/route.ts`・`app/api/key-check/route.ts`・`.env.example`
- 変えた：`app/page.tsx`（右上に「お問い合わせ」へのリンク）・`.gitignore`（`.env.example` だけは Git に上げる）・この README

## メモ

- Route Handler と環境変数の書き方は、Next.js の版で変わることがあります。10/11 に Next.js 16.4.0 で確かめました（`npm run lint`・`npm run build`・`npm run dev`・`npm start`）。講義の前日にもう一度確かめます
- `next.config.ts` は 12/8 のひな形（`PRO03_1208_next_hinagata`）と同じく、Cache Components を外しています（10/13）。この設定では、GET だけの受け口（`key-check`）も開くたびに動くので、`.env.local` の値をそのまま読めます（`npm run build` の一覧で `ƒ`。確かめ済み）
- `GET /api/contact` は、ログインがまだないので誰でも見られます（メールアドレスも）。公開する前に外すか、1/12 のログインの後ろに置きます
- メモ帳とお天気の部分（`components/`・`lib/weather.ts`）は 12/18 の見本と同じです
