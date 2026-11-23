# 12/8 Next.js のひな形（自分のプロジェクトの始まり）

12/8 の講義（React + Next.js）で、自分のプロジェクトを作るためのひな形です。
このあとの講義の演習と依頼は、ここから作ったプロジェクトに足していきます。

- 中身は `create-next-app@16.4.0` の推奨の既定（TypeScript・ESLint・Tailwind CSS・App Router）から、Cache Components だけを外したものです
- 画面は、見出しが 1 つあるだけです。部品は演習で作ります

Node.js は 24 以上を使ってください。事前動画 V1 で 24 を入れていれば大丈夫です。

## 自分のプロジェクトを作る

1. このフォルダ（`PRO03_1208_next_hinagata`）を、フォルダごとコピーします。貼り付けるのは `pro-course` の外（いつも作業しているフォルダなど）。名前は `my-project` に変えます
   - Windows はエクスプローラー、Mac は Finder でコピーと貼り付けができます
   - `pro-course` の中に置くと、`pro-course` の Git と自分の Git がぶつかります
2. VS Code で `my-project` を開き、ターミナルで次を打ちます

   ```bash
   npm install
   npm run dev
   ```

   ターミナルに出る http://localhost:3000 を、ブラウザで開きます
3. `app/page.tsx` の見出しの「なまえ」を、自分の名前に書き換えて保存します。すぐに画面が変わります
4. 最初のコミットをします。ここが、このプロジェクトの 1 つ目の保存点です

   ```bash
   git init
   git add .
   git commit -m "12/8 のひな形から作った"
   ```

`npm install` の最後に出る警告（`vulnerabilities`・`npm audit fix --force`・`install-scripts` など）は、気にしなくて大丈夫です。`npm audit fix --force` は打たないでください。道具の版が大きく変わり、動かなくなることがあります。

## 中身

| ファイル | 中身 |
|---|---|
| `app/page.tsx` | ページ。ここから部品を組みます |
| `components/` | 部品の置き場。1 ファイルに 1 部品。いまは空です |
| `app/layout.tsx` | 全ページの枠。今は触りません |
| `app/globals.css` | Tailwind CSS の読み込みと、色・文字の決まり |
| `package.json` | 使う道具とコマンドの一覧。今は読むだけです |
| `next.config.ts` | Next.js の設定。Cache Components は使っていません |
| `AGENTS.md` | AI の道具向けの説明。`npm run dev` が書き足すので、このままにします |

止めるときは、ターミナルで Ctrl + C。次に開くときは、`my-project` に入ってから `npm run dev` です。
