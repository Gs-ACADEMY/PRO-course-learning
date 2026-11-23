# 事前動画 V1「TypeScript のコードをブラウザで動かす」の見本

`npm create vite@latest` で作ったひな形（Vanilla → TypeScript）の `src/main.ts` だけを書き換えたものです。
動画で打つコードと同じです。途中の章から追いつきたい人は、このフォルダで `npm install` → `npm run dev` から始めてください。

- 作った版：create-vite 9.3・Vite 8.3・TypeScript 6.0。Node.js 24 で動くことを確かめています
- `node_modules` と `dist` は入れていません

## 動画の札（ここで動画を止めて、手元でやってみましょう）と、この見本

| 動画のページ | 見る人がやること | 確かめ方 |
|---|---|---|
| 7「Node.js と npm」 | `node -v`（24 以上か） | 見本は使わない。ターミナルで `node -v`・`npm -v` |
| 8「nodejs.org の画面」 | 24 を入れて、ターミナルと VS Code を開き直す | 同上 |
| 9「Vite の始め方」 | `npm create vite@latest` → my-app → Vanilla → TypeScript → Yes → http://localhost:5173 に Vite の画面 | 空の作業用フォルダでそのまま打つ（見本は使わない）。追いつくだけなら、このフォルダで `npm install` → `npm run dev` |
| 16「確かめの問い」 | 答える。余裕があれば、自分のじゃんけんを `main.ts` に移す | じゃんけんは受講生のもの（見本にはない） |

Windows の VS Code のターミナル（PowerShell）で npm が「スクリプトの実行が無効」で止まったら、コマンドプロンプトで打つか、`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`（聞かれたら Y。V1 の第 1 章と同じ）

## 章ごとの手順

| 章 | やること | 見る所 |
|---|---|---|
| 第 1 章 | GitHub の設定で使ったターミナル（Windows はコマンドプロンプト、Mac はターミナル）で `node -v`。入っていないか 24 より小さければ、https://nodejs.org/ja/download で 24 の LTS を入れ、ターミナルと VS Code を開き直して `node -v`・`npm -v` | どちらも数字が出る（`node -v` は v24 か、それより大きい）。Windows の VS Code のターミナル（PowerShell）で npm が「スクリプトの実行が無効」で止まったら `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`（聞かれたら Y）。コマンドプロンプトでは起きない |
| 第 2 章 | 作業用のフォルダで `npm create vite@latest` → 名前 my-app → Vanilla → TypeScript →「Install with npm and start now?」で Yes（初めてなら `Ok to proceed?` に y）→ ブラウザで http://localhost:5173 を開く → `package.json` の `scripts` を開く | Vite の画面が出たら、準備は完了（ここまでで講義に参加できる）／`"dev": "vite"`・`"build": "tsc && vite build"`（npm run dev の正体） |
| 第 3 章 | `npm run dev` → http://localhost:5173 → 開発者ツールの Network で `main.ts` を開く → `style.css` の色を 1 か所変えて保存（あとで戻す） | 届いた中身から `: number` と `<HTMLDivElement>` が消えている／保存したとき、main.ts はターミナルに `page reload`（ページごと読み込み直す）、style.css は `hmr update`（読み込み直さずに差し替える） |
| 第 4 章 | 4 行目を `const price: number = "1200"` に変える | エディタは赤線、画面は「合計 1200500 円」で動く。`npm run build` は止まる |
| 第 5 章 | 4 行目を戻して `npm run build` → `dist` を開く → `npm run preview`（http://localhost:4173） | `dist/assets/index-○○.js` の中は `合計 1700 円`（型が消え、足し算も済んでいる） |

## 第 4 章で出るエラー（VS Code のターミナル）

```
src/main.ts:4:7 - error TS2322: Type 'string' is not assignable to type 'number'.

4 const price: number = "1200"
        ~~~~~

Found 1 error in src/main.ts:4
```

- どこで：`src/main.ts` の 4 行目／何が来て：string（文字）／何を期待：number（数字）
- 開発サーバー（`npm run dev`）は型を外して動かすだけで、確かめません。確かめるのはエディタの赤線と `npm run build`（中の `tsc`）です
