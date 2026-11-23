# PRO02_1201 じゃんけんを TypeScript に移す（講師の実演）

12/1 テーマⅡ「今ある JS を TS に移す」の実演（スライド 15〜17）で使う見本です。
①で見たじゃんけん（`PRO02_1201_janken`）を、TypeScript に移した版が 2 つ入っています。

| ページ（`npm run dev`） | ファイル | 中身 |
|---|---|---|
| `http://localhost:5173/ai.html` | `src/janken.ai.ts` | AI に「TypeScript に移して」とだけ頼んだ版。赤線 0・`npm run build` も通る。でも同じ手で「負け」と出る間違いが残っている |
| `http://localhost:5173/` | `src/janken.ts` | 直した版。近道（any・as・!・@ts-ignore）を使わずに赤線 0。同じ手なら「あいこ」 |
| （参考） | `before/janken.js` | 移す前の JavaScript（`PRO02_1201_janken/janken.js` と同じ） |

## 動かし方

```bash
npm install
npm run dev          # 画面（上の 2 ページ。ページの上のリンクで行き来できる）
npm run typecheck    # 型の確かめ（tsc --noEmit）。最初は 0 件
npm run lint         # 近道の確かめ（eslint .）。最初は 13 件（janken.ai.ts の近道）
npm run build        # 型の確かめ ＋ 書き出し（tsc && vite build）
```

10/11 に TypeScript 6.0.3・Vite 8.3.4 で確かめました（strict は TypeScript 6 の既定）。

## スライド 15：名前を変えただけで、赤線 20 本

`before/janken.js` を `src/janken.before.ts` という名前で写す（`cp before/janken.js src/janken.before.ts`）と、`npx tsc --noEmit` で赤線が 20 本出ます（`src/janken.ts` は直した版なので、上書きしないでください）。

| 赤線の形 | 番号 | 本数 | 直し方（`src/janken.ts` では） |
|---|---|---|---|
| 引数に型がない | TS7006 | 6 | 入口と出口に型（`me: number` など） |
| 画面の部品が null かも | TS18047・TS2531 | 9 | `el()` の中で `if` で確かめてから返す |
| 文字の所に数字 | TS2322 | 3 | `String(score["勝ち"])` |
| 決めていない名前で引く | TS7053 | 2 | `type Result = "勝ち" \| "負け" \| "あいこ"` と `Record<Result, …>` |

試したあとは、写した `src/janken.before.ts` を消してください（残すと `npm run build` が止まります）。同じ名前の変数がほかのファイルにあっても、ファイルごとに別の扱い（`moduleDetection: force`）なのでぶつかりません。

## スライド 16：赤線を消すだけの直し方 4 つ

`src/janken.ai.ts` に 4 種類とも入っています。VS Code の検索（Ctrl + Shift + F）で探します。

| 近道 | 入っている所 |
|---|---|
| `any` | 13 行目 `score: any`、31 行目・43 行目の `as any` |
| `as` | 31 行目・43 行目 |
| `!` | 8〜12 行目 `getElementById(…)!`（検索は `)!` で） |
| `@ts-ignore` | 33・35・37 行目 |

54 行目の `querySelectorAll<HTMLButtonElement>(…)` も、中身は「そう思って使う」約束です（質問が出たら、`janken.ts` の最後の `instanceof` の形を見せる）。

## スライド 17：実演の手順

1. `ai.html` を開く。VS Code で `src/janken.ai.ts` を開き、赤線が 0 なのを見せる。`npm run build` も通る
2. 同じ手が出るまで押す（3 回に 1 回くらい）→ グー対グーで「あなたの負け！」。あいこの数は 0 のまま
3. 検索で近道を探す：`any` 3 か所・`)!` 5 か所・`@ts-ignore` 3 か所
4. 43 行目 `const me = button.dataset.hand as any;` の ` as any` を消して保存 → 赤線が 3 本。`npm run build` も止まる（素材 1201-3）

   ```text
   src/janken.ai.ts:46:7 - error TS2367: This comparison appears to be unintentional because the types 'string | undefined' and 'number' have no overlap.

   46   if (me === cpu) {
            ~~~~~~~~~~

   src/janken.ai.ts:49:20 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'number'.
     Type 'undefined' is not assignable to type 'number'.

   src/janken.ai.ts:51:8 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'number'.
     Type 'undefined' is not assignable to type 'number'.

   Found 3 errors in the same file, starting at: src/janken.ai.ts:46
   ```

   （コードの引用の行は一部省いています）
5. 46 行目を 3 点で読む：どこで（`me === cpu`）／何が来た（`string | undefined`。ボタンの手は文字）／何を期待（`number`。相手の手は数字）
6. 43 行目を `const me = Number(button.dataset.hand);` にする → 3 本とも消える。遊ぶと、同じ手で「あいこ」
7. 残りの近道（`!` と `@ts-ignore`）は、直した版（`src/janken.ts`）で `el()` と `String()` に置き換えてあるのを見せる

実演のあとは、`src/janken.ai.ts` を元に戻してください（`as any` を戻す）。

10/11 に、Chromium で `Math.random` を 0.1（相手は必ずグー）にして確かめました：`ai.html` はグー対グーで「あなたの負け！」、`index.html` は「あいこ」。チョキ対グーは両方「負け」、パー対グーは両方「勝ち」。

## スライド 18：ESLint とは（10/19 に足した）

近道を手で探したあとに、同じことを ESLint に任せられるのを見せます。決まりは `eslint.config.js`（演習のひな形と同じ）。

```bash
npm run lint
```

```text
src/janken.ai.ts
   8:16  error  Forbidden non-null assertion                 @typescript-eslint/no-non-null-assertion
   （9〜12 行目も同じ。! が 5 か所）
  13:14  error  Unexpected any. Specify a different type     @typescript-eslint/no-explicit-any
  31:37  error  Do not use any type assertions               @typescript-eslint/consistent-type-assertions
  31:79  error  Unexpected any. Specify a different type     @typescript-eslint/no-explicit-any
  33:3   error  Use "@ts-expect-error" instead of "@ts-ignore", as "@ts-ignore" will do nothing if the following line is error-free  @typescript-eslint/ban-ts-comment
   （35・37 行目も同じ）
  43:14  error  Do not use any type assertions               @typescript-eslint/consistent-type-assertions
  43:37  error  Unexpected any. Specify a different type     @typescript-eslint/no-explicit-any

✖ 13 problems (13 errors, 0 warnings)
```

- 手で見つけた 11 か所（`any` 3・`!` 5・`@ts-ignore` 3）に、`as` の 2 か所（31・43 行目）が加わって 13 件
- 直した版（`src/janken.ts`）は 0 件
- この見本の `npm run build` には ESLint を入れていません（スライド 17 で「型の確かめも build も通るのに、間違いが残る」を見せるため）。演習のひな形（`PRO02_1201_ts_hinagata`）の `npm run build` は `eslint . && tsc && vite build` で、近道があると最初に止まります
- `@ts-ignore` のメッセージは `@ts-expect-error` を勧めますが、この決まりでは `@ts-expect-error` も止まります
- 10/19 に ESLint 10.13・typescript-eslint 8.71、Node.js 22・24・26 で確かめました

## メモ

- `Number(button.dataset.hand)` は、`data-hand` がない・数字でないときに `NaN` になります。手を `type Hand = 0 | 1 | 2` にして確かめる形は、12/1 の⑤（自学自習）の課題です
- 素材 1201-3 の作り方：`samples/_tools/shoot_janken.py`（上の 4 の出力を、1 件目と最後の行だけ切り出して絵にする）
