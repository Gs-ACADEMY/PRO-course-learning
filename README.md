# PRO コース 事前動画の見本コード

G's ACADEMY PRO コースの事前動画で打つコードと同じものです。動画を見ながら途中で止まったときや、途中の章から追いつきたいときに使ってください。

| フォルダ | 動画 | 中身 |
|---|---|---|
| `VIDEO_V1_vite` | V1 TypeScript のコードをブラウザで動かす | Vite（Vanilla＋TypeScript）のひな形の `src/main.ts` を書き換えた版 |
| `VIDEO_V2_next` | V2 Next.js を動かす | Next.js のプロジェクトに、/about・サーバーで動く console.log・'use client' の Counter・/state（変数と状態の違い）を足した版 |
| `VIDEO_V4_state` | V4 お天気アプリを Next.js で動かす | /weather（読み込み中・気温・失敗を状態で持つお天気の部品） |

## 使い方

1. Node.js 24 以上を入れる（`node -v` で確かめる）
2. 使いたいフォルダに移動して、`npm install` → `npm run dev`
3. 章ごとの手順と、画面・ターミナルに出るものは、各フォルダの README にあります

- `node_modules`・`.next`・`dist` は入れていません。最初に `npm install` してください
- 動画では、自分で作った作業用のフォルダでコマンドを打ちます。このリポジトリは答え合わせと追いつき用です
