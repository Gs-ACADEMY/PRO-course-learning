# PRO02_1201 TypeScript の演習のひな形（税込み・割り勘／じゃんけん）

12/1 の演習①（AI の計算を、型で守る）と演習②（じゃんけんを TS に移す）で使うひな形です。
画面はできています。演習①は計算の中身（`src/calc.js`）を AI に書かせるところから、演習②はじゃんけん（`src/janken.js`）を TypeScript に移すところから始めます。

> 講師用：配るときは `instructor/`（答えの例）を消してから、リポジトリに入れてください。この行も消してかまいません。

## 始め方

```bash
npm install
npm run dev        # 画面を開く（ターミナルに出る http://localhost:5173/ を開く）
npm run lint       # 近道（any・as・!・@ts-ignore）がないかの確かめ（中身は eslint .）
npm run build      # 近道の確かめ ＋ 型の確かめ ＋ 書き出し（中身は eslint . && tsc && vite build）
```

型の確かめだけをしたいときは `npm run typecheck`（中身は `tsc --noEmit`）です。
開発サーバー（`npm run dev`）は、型を確かめずに動かします。型を確かめるのは、エディタの赤線と `npm run build` です。
`npm run build` は、最初に ESLint が近道を探します。近道が 1 つでも残っていると、そこで止まります（`eslint.config.js` に決まりが書いてあります。見るのは `.ts` のファイルだけで、移す前の `.js` は見ません）。

| ファイル | 中身 |
|---|---|
| `index.html`・`src/main.ts`・`src/style.css` | 演習①の画面（税込み・割り勘の入力欄・ボタン・結果の表示）。入力欄の値を、計算の関数に渡しています |
| `src/calc.js` | 演習①の計算の関数（`withTax`：税込み、`splitBill`：割り勘）。中身はまだ空です。ここを AI に書かせます |
| `janken.html`・`src/janken.css` | 演習②の画面（`http://localhost:5173/janken.html`） |
| `src/janken.js` | 演習②で TypeScript に移すじゃんけん。12/1 の①で見た間違いが 1 つ入っています |
| `package.json` | 使うコマンド（`dev`・`lint`・`build`・`typecheck`） |
| `eslint.config.js` | ESLint の決まり。近道（`any`・`as`・`!`・`@ts-ignore`）を止める。コメントで決まりを外すこともできない |

最初は計算の中身が空なので、「計算」を押すと「税込み undefined 円」と出ます。

## 演習①：AI の計算を、型で守る（15 分）

1. （5 分）割り勘・税込みの計算を JS のまま AI に書かせ、入力欄から動かす（書かせるのは `src/calc.js` の中身）
2. （5 分）ファイルを .ts にして型を付け、赤線を、どこで・何が来て・何を期待したかで読む（`src/calc.js` の名前を `src/calc.ts` に変え、関数の入口と出口に `number` を付ける）
3. （5 分）赤線と、再現手順・期待した結果・実際の結果・エラー全文を AI に渡して直させ、前と後を比べる

終わりの目安：入力欄から渡しても正しい金額が出て、赤線が 0

- 壊れないときは、入力欄の値をそのまま渡す版で試す
- 赤線を `any` で黙らせない

## 演習②：じゃんけんを TS に移す（15 分）

1. （3 分）指示の型で、AI に `src/janken.js` を TypeScript へ移させる（近道は使わない、と決まりに書く）
2. （7 分）`npm run lint` で近道を探して外し、出てきた赤線を、どこで・何が来て・何を期待したかで読んで、型で直す
3. （5 分）`npm run build` が通り、同じ手で「あいこ」が出るか遊んで確かめる

終わりの目安：赤線 0・近道 0・build が通り、同じ手で「あいこ」が出る

- 近道 ＝ 赤線を消すだけの直し方：`any`・`as`・`!`・`@ts-ignore`。`npm run lint` が、行番号つきで全部出します（VS Code の検索 Ctrl + Shift + F でも探せます。`!` は `)!` で探すと見つけやすい）
- ESLint のメッセージは英語です。行番号と、行の最後の決まりの名前（`no-explicit-any` など）を読めば、どの近道かが分かります
- `@ts-ignore` のメッセージは「`@ts-expect-error` を使って」と言いますが、`@ts-expect-error` もこのひな形では止まります。型で直してください
- 移す前にコミットしておくと、いつでも戻れます
- 早く終わった人：手を `type Hand = 0 | 1 | 2` にする
- 自分のじゃんけんで試してもかまいません（`src/janken.js` の中身を入れ替える）

AI への頼み方の例（11/27 の指示の型）：

```text
目的：src/janken.js を TypeScript に移したい
決まり：このファイルだけ。動きは変えない。any・as・!・@ts-ignore は使わない
確かめ方：赤線 0・npm run build が通る・同じ手なら「あいこ」と出る
```

`src/janken.js` の名前を `src/janken.ts` に変えても、`janken.html` はそのままで動きます（Vite が `.ts` のほうを探します）。

## つまずいたら

- Node のバージョン違い（V1 の環境が動かない）→ Notion の手順の版を確かめる
- 型のエラーを `any` で黙らせない → 赤線は消えても、確かめが止まります（`npm run build` は ESLint で止まります）。`Number()` などで直します
- `// eslint-disable` のコメントを書いても、決まりは外れません（「has no effect」と出ます）
- VS Code に ESLint の拡張を入れると、近道にエディタでも波線が出ます（入れなくても、`npm run lint` と `npm run build` で分かります）
- AI が最初から `Number()` を使って壊れない → 入力欄の値をそのまま渡す版で試す
- 名前を `calc.ts`（`janken.ts`）に変えたら、画面のボタンが動かなくなった → `npm run dev` をいったん止めて（Ctrl + C）、もう一度 `npm run dev`
- `calc.js` を残したまま `calc.ts` を作らない（コピーではなく、名前を変える）→ 両方あると、画面は `calc.js` のほうを使います。`janken.js` と `janken.ts` も同じです
- Git のリポジトリになっていないとき（zip で受け取ったときなど）は、最初に `git init` → `git add .` → `git commit -m "ひな形"` をしておくと、いつでも戻れます
