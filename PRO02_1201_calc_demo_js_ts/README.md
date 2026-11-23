# PRO02_1201 税込みの計算：JavaScript のまま → TypeScript（講師の実演）

12/1 テーマⅠの実演 1・2（スライド 7・8）と、深掘りの Zod の例（スライド 10）で使う見本です。
Vite（vanilla-ts のひな形）に、ページ 3 つと Zod のテストを足しただけの、小さなプロジェクトです。

## 動かし方

```bash
npm install
npm run dev        # 画面（下の 3 ページ）
npx tsc --noEmit   # 型の確かめ（calc.ts の 4 行目で、わざと 1 つエラーになる）
npm test           # Zod の例の確かめ（講師用。12/1 の講義ではテストは扱わない。テストは 1/15）
```

| ページ（`npm run dev`） | ファイル | 中身 |
|---|---|---|
| `http://localhost:5173/` | `src/calc.js` | 実演 1：JavaScript のまま。1000 → 「税込み 1000100 円」 |
| `http://localhost:5173/ts.html` | `src/calc.ts` | 実演 2：TypeScript にした版。4 行目に、わざと赤線を残しています |
| `http://localhost:5173/fixed.html` | `src/calc_fixed.ts` | 直した版（4 行目を `Number()` にしただけ）。1000 → 「税込み 1100 円」 |

ページの上のボタンで行き来できます。Zod の例は `src/zod.test.ts` です。

## 実演 1：JavaScript のまま（スライド 7）

1. `npm run dev` で `http://localhost:5173/` を開く
2. 価格に 1000 と入れて「計算」→ 「税込み 1000100 円」。エラーは出ません（Console も空のまま）
3. `src/calc.js` を見せる。スライドの 5 行は、「計算」を押したときの処理の中（4〜8 行目）に、そのまま入っています

`calc.js` は型の確かめに入れていません（`tsconfig.json` に `allowJs` がない）。エディタでも赤線は出ません。

## 実演 2：TypeScript の赤線（スライド 8）

1. VS Code で `src/calc.ts` を開く → 4 行目の `priceInput.value` に赤線。マウスを乗せると、次のメッセージが出ます
   `Argument of type 'string' is not assignable to parameter of type 'number'.`
2. 赤線があっても、画面は動きます。`ts.html` で 1000 → 「税込み 1000100 円」（開発サーバーは型を確かめずに動かす）
3. ターミナルでも確かめる：`npx tsc --noEmit`

   ```text
   src/calc.ts:4:25 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

   4   const total = withTax(priceInput.value);
                             ~~~~~~~~~~~~~~~~


   Found 1 error in src/calc.ts:4
   ```

   `npm run build`（`tsc && vite build`）も、同じエラーで止まります。わざと残した間違いがある間は、build が通らないのが正しい動きです。
4. 直す：4 行目を `const total = withTax(Number(priceInput.value));` にして保存 → 赤線が消え、`ts.html` で 1000 → 「税込み 1100 円」
5. 実演のあとは、4 行目を元に戻してください。直した版は `src/calc_fixed.ts`（`fixed.html`）にも置いてあります

スライドの「calc.ts の 4 行目」に合わせるため、`calc.ts` は「計算」を押したときの処理（1〜6 行目）を上に、`withTax` を下（9〜11 行目）に置いています。関数は下に書いても、上から呼べます。

画面の部品を探す `el()`・`input()` は、一番下（13 行目から）に置いています。`!`（null ではないと言い切る近道）を使わず、`if` で確かめる形です（12/1 テーマⅡ「赤線を消すだけの直し方」と揃えた。10/11）。

## 深掘り：型は動くときに消える（スライド 10）

`src/zod.test.ts` に、スライドの左右を 1 本ずつ、講師の確かめ用のテストの形で入れています（スライドには出さない）。JSON の文字は、どちらも `{"price":"1000"}` です。

```bash
npx vitest run --reporter=verbose
```

```text
 ✓ src/zod.test.ts > 型だけ（すり抜ける）
 ✓ src/zod.test.ts > 動くときに確かめる（例：Zod）
```

- 型だけ：`JSON.parse(text) as Item` には赤線が出ません。`item.price + 100` が `"1000100"`（文字がつながる）になることを、テストで確かめています
- Zod：`Item.parse(...)` でエラーになって止まることを、`toThrow()` で確かめています
- 止まる様子をその場で見せるときは、2 つ目のテストの `expect(() => {` と `}).toThrow();` の 2 行を消して流します。テストが落ちて、止まった行（`Item.parse(JSON.parse(text))`）と Zod のメッセージが出ます
  - `name`：`Invalid input: expected string, received undefined`（name がない）
  - `price`：`Invalid input: expected number, received string`（文字が来た）

Zod は 4.6.5 です。書き方は Zod 4 の説明どおり `import * as z from "zod";` にしています。

## メモ（スライドのメモから）

- AI が毎回この間違いをするとは限りません。実演は、用意した壊れる版（このフォルダ）で見せます
- その場で AI に書かせて壊れなかったら「今回は当たり。でも毎回は保証されない」と言う
- 開発サーバー（`npm run dev`）は型を確かめずに動かします。確かめるのは、エディタの赤線と `npm run build`（V1 の 4 章）
- 素材 1201-2（VS Code の赤線とメッセージ）は、実演が止まったときの予備です。撮るときは `src/calc.ts` の 4 行目の赤線にマウスを乗せます
- 壊れた JSON が素通りする所は、時間があればその場で見せる（なければスライドだけで）。Zod は「例：」として出す（ほかの検証の道具でもよい）
- フォルダに `.git` は入れていません。実演のあとに `git restore` で戻したいときは、始める前に `git init` → コミットしておいてください
