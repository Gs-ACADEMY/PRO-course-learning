# PRO05_1218 メモ帳の Firestore 版（講師の見本・実演用）

12/18 テーマⅡ「Firestore でサーバーなしに共有」の実演（スライド「メモを左右の窓で共有する」）と、素材 1218-4 で使う見本です。

- 12/15 のメモ帳リファクタ版（`PRO04_1215_memo_next`）の保存先を、localStorage から Firestore に替えたものです
- 替えたのは 3 か所だけです
  - `lib/firebase.ts` … Firebase の設定値（名札）を貼り、Firestore につなぐ
  - `components/MemoBoard.tsx` … `onSnapshot` で `memos` を見張り（ほかの窓で足したメモも届く）、足すときは `addDoc` で書くだけ
  - `app/page.tsx` … 説明の 1 行
- 部品の形（入力・一覧・1 件の表示）は 12/15 版と同じです
- 受講生は手を動かしません（実演だけ。宿題なし）

## 動かし方

1. Firebase コンソールで、実演用のプロジェクトに Firestore のデータベースを作る（場所は asia-northeast1 など）
2. プロジェクトにウェブアプリを登録し、「SDK の設定と構成」の「構成」を `lib/firebase.ts` の `firebaseConfig` に貼る
3. Firestore の［ルール］に `firestore.rules` の中身を貼って［公開］（期限の日付は講義の日に合わせる）
4. 動かす

```bash
npm install
npm run dev     # http://localhost:3000
```

5. ブラウザの窓を 2 つ左右に並べて同じ URL を開き、左で足したメモが右にもすぐ出ることを見せる。コンソールの［データ］を開くと、`memos` にメモが 1 件ずつ入っている

## 気をつけること

- 設定値は秘密ではありません（どのプロジェクトにつなぐかの名札）。守りはセキュリティルールです（12/18 のスライド「設定値と、セキュリティルール」）
- `firestore.rules` は期限まで誰でも読み書きできるルールです。講義が終わったら、`if` を `false` にして閉じます
- 撮影の前後で、データ（`memos`）は消してかまいません
