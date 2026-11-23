# PRO04_1215 メモ帳リファクタ版（講師の見本）

12/15 の素材 1215-1（PC で足したメモが、スマホには出ない）で使う、メモ帳を React と Next.js で書き直した講師の見本です。

- `create-next-app@16.4.0` の推奨の既定（TypeScript・Tailwind CSS・App Router）で作り、ページと部品だけ書き換えています
- 部品は 12/8 のスライドと同じ 4 つです
  - `components/MemoBoard.tsx` … 状態（メモの配列）を持つ。保存（localStorage）もここ
  - `components/MemoForm.tsx` … 1　入力
  - `components/MemoList.tsx` … 2　一覧
  - `components/MemoItem.tsx` … 3　1 件の表示
- データはこの端末の、このブラウザの中（localStorage）だけ。PC で足したメモは、スマホには出ません

## 動かし方

```bash
npm install
npm run dev     # http://localhost:3000
```

スマホで開くときは、PC とスマホを同じ Wi-Fi につなぎ、`npm run dev` の表示にある Network の URL を開きます。

## メモ

- `next.config.ts` は 12/8 のひな形（`PRO03_1208_next_hinagata`）と同じく、create-next-app の既定から Cache Components を外しています（10/13）
