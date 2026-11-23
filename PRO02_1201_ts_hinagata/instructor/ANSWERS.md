# 演習の答えの例（講師用・受講生には配らない）

12/1 の演習①・②の流れと、このひな形で実際に出る画面とメッセージです。
10/11 に、TypeScript 6.0.3・Vite 8.3.4 で確かめました（strict は TypeScript 6 の既定）。

## このフォルダのファイル

| ファイル | 中身 | 使い方 |
|---|---|---|
| `calc.ts` | 型を付けた計算（人数 0 で止まる・1 円未満は切り上げ） | `src/calc.js` を消して、`src/` に写す |
| `main.ts` | `Number()` で数字にして渡す版（人数 0 のときは理由を画面に出す） | `src/main.ts` に上書き |
| `janken.ts` | じゃんけんを TypeScript に移した版（近道なし・同じ手で「あいこ」） | `src/janken.js` を消して、`src/` に写す |

```bash
rm src/calc.js src/janken.js
cp instructor/calc.ts instructor/main.ts instructor/janken.ts src/
npm run build       # 近道 0（ESLint）・赤線 0。書き出しまで通る
```

`instructor/` の中で `main.ts` を開くと、1 行目の `import "./style.css";` に赤線が出ることがあります（このフォルダに `style.css` がないため）。`src/` に写すと消えます。

## 演習①

### 1. JavaScript のまま（AI が書きそうな、壊れる版）

```js
// 税込みの金額を返す（消費税 10%）
export function withTax(price) {
  return price + price * 0.1;
}

// 割り勘：1 人あたりの金額を返す
export function splitBill(total, people) {
  return total / people;
}
```

| 入力 | 画面に出る結果 |
|---|---|
| 価格 1000 | 税込み 1000100 円（`"1000" + 100` で文字がつながる） |
| 合計 3000・人数 3 | 1 人あたり 1000 円（割り算は文字を数字に直すので、たまたま合う） |
| 合計 10000・人数 3 | 1 人あたり 3333.3333333333335 円 |
| 合計 3000・人数 0（または空） | 1 人あたり Infinity 円 |

AI が最初から `Number()` を使っていて壊れないときは、上の版を渡して試してもらいます（スライドの「入力欄の値をそのまま渡す版」）。

### 2. calc.ts にして型を付ける

名前を変えただけ（型なし）だと、`calc.ts` に赤線が 3 つ出ます（ひな形の先頭のコメント 3 行を残して、上の版を書いた場合の行番号）。

```text
src/calc.ts(5,25): error TS7006: Parameter 'price' implicitly has an 'any' type.
src/calc.ts(10,27): error TS7006: Parameter 'total' implicitly has an 'any' type.
src/calc.ts(10,34): error TS7006: Parameter 'people' implicitly has an 'any' type.
```

入口と出口に `number` を付けると、赤線は `main.ts` に移ります（`npm run typecheck`）。

```text
src/main.ts(9,25): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
src/main.ts(19,26): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

- 3 点で読む：どこで（`main.ts` の 9 行目）／何が来た（string）／何を期待していた（number）
- 直し方：`main.ts` で `Number()` にして渡す（`instructor/main.ts`）

```ts
const total = withTax(Number(priceInput.value));
const each = splitBill(Number(totalInput.value), Number(peopleInput.value));
```

価格 1000 → 「税込み 1100 円」。赤線 0。

人数 0 で `Infinity` になるのは、型では見つかりません（数字どうしの割り算なので）。`instructor/calc.ts` は、人数が 0 以下なら `throw` で止めています。答えが正しいかを機械に確かめさせる「テスト」は、1/15 の特別講義で扱います。

## 演習②

### 1. 名前を変えただけで、赤線 20 本

`src/janken.js` の名前を `src/janken.ts` に変えると、`npm run typecheck` で 20 本出ます（スライド 15 の表と同じ）。

| 赤線の形 | 番号 | 本数 | 例 |
|---|---|---|---|
| 引数に型がない | TS7006 | 6 | `function judge(me, cpu)` |
| 画面の部品が null かも | TS18047・TS2531 | 9 | `'meIcon' is possibly 'null'.` |
| 文字の所に数字 | TS2322 | 3 | `document.getElementById("win").textContent = score["勝ち"];` |
| 決めていない名前で引く | TS7053 | 2 | `score[result]` |

この時点では、①の間違い（`me === cpu`）に赤線は出ません。`play(button)` の `button` が `any`（型なし）なので、`me` も `any` になり、比べる所の確かめが止まっているためです。`function play(button: HTMLButtonElement)` と型を付けると、41 行目の `if (me === cpu)` に TS2367 が出ます（50 行目にも、`forEach` から渡す値が `Element` のままだという TS2345 が出ます。`instanceof` で確かめて直す）。

### 2. AI が近道で移したとき

AI に「TypeScript に移して」とだけ頼むと、近道（`any`・`as`・`!`・`@ts-ignore`）で赤線を 0 にしてくることがあります。実演の見本 `PRO02_1201_janken_ts/src/janken.ai.ts` がその形です。

- 見つけ方：`npm run lint`（ESLint）。`janken.ai.ts` を `src/janken.ts` に入れて流すと 13 件（`!` 5・`any` 3・`as` 2・`@ts-ignore` 3。10/19 に ESLint 10.13・typescript-eslint 8.71 で確かめた）。`npm run build` も最初の ESLint で止まる。VS Code の検索（`any`・`as`・`)!`・`@ts-ignore`）でも探せる
- `const me = button.dataset.hand as any;` の ` as any` を消すと、次の赤線が出ます

```text
error TS2367: This comparison appears to be unintentional because the types 'string | undefined' and 'number' have no overlap.
```

- 3 点で読む：どこで（`me === cpu`）／何が来た（`string | undefined`。ボタンの手は文字）／何を期待（`number`。相手の手は数字）
- 直し方：`const me = Number(button.dataset.hand);`

### 3. 直した版（`instructor/janken.ts`）

- 画面の部品は `el()` の中で `if` で確かめてから返す（`!` を使わない）
- 数字は `String()` で文字にしてから画面に出す（`@ts-ignore` を使わない）
- 結果は `type Result = "勝ち" | "負け" | "あいこ"`、得点は `Record<Result, number>`
- 手のボタンは `instanceof HTMLButtonElement` で確かめてから使う（`as` を使わない）

10/11 に Chromium で、相手の手をグーに固定して確かめました：直す前はグー対グーで「あなたの負け！」、直した版は「あいこ」。

## ほかに気づいたこと（つまずき）

- `npm run dev` を動かしたまま名前を変えると、開発サーバーが古い `calc.js` を探して、画面のボタンが動かなくなることがあります（Console に 404）。`npm run dev` を止めて動かし直すか、`main.ts` を保存し直すと戻ります
- `calc.js` と `calc.ts` が両方あると、型の確かめ（tsc）は `calc.ts` を、画面（Vite）は `calc.js` を使います。`janken.js` と `janken.ts` も同じです
- AI が `calc.js` に JSDoc（`/** @param {number} price */`）を付けてきたら、`.js` のままでも `main.ts` に同じ赤線が出ます（JSDoc の型も読むため）。これも「型が教えてくれた」例として扱ってよい
- 価格によっては 1 円未満が出ます（例：99 → 108.9）。端数の扱いは、今日は深追いしない
- `Number(button.dataset.hand)` は、値がないと `NaN` になります。手を `type Hand = 0 | 1 | 2` にして確かめる形は⑤（自学自習）の課題
