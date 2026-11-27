# PRO コース 見本コード

G's ACADEMY PRO コースの、事前動画で使う見本のコードです。

フォルダの名前は `VIDEO_V番号_中身` です（例：`VIDEO_V2_next` ＝ 動画 V2）。

講義（第 1 回〜）の見本は、いったんこのリポジトリから外しています（`.gitignore` で除外）。

## 使い方

1. Node.js 24 以上を入れる（`node -v` で確かめる）
2. 使いたいフォルダに移動して、`npm install` → `npm run dev`
3. 動かし方と、画面・ターミナルに出るものは、各フォルダの README にあります

- `node_modules`・`.next`・`dist` は入れていません。最初に `npm install` してください
- 見本の中には、説明のためにわざと間違いを残しているものがあります（`VIDEO_V2_next`・`VIDEO_V4_state` の /state。各 README に書いてあります）

## 事前動画

| フォルダ | 動画 | 中身 |
|---|---|---|
| `VIDEO_V1_vite` | V1 TypeScript のコードをブラウザで動かす | Vite（Vanilla＋TypeScript）のひな形の `src/main.ts` を書き換えた版 |
| `VIDEO_V2_next` | V2 Next.js を動かす | /about・サーバーで動く console.log・'use client' の Counter・/state（変数と状態の違い） |
| `VIDEO_V4_state` | V4 お天気アプリを Next.js で動かす | /weather（読み込み中・気温・失敗を状態で持つお天気の部品） |
