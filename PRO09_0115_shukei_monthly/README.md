# PRO09_0115 月の作業人数の集計（前任者のコード・講師の見本）

1/15 の依頼 2「月末になると数字がおかしい」で配る、前任者が作った集計のコードです。
素材 0115-2（月末のテストが落ちた画面）もこのコードで撮っています。

## 中身

| ファイル | 配る？ | 内容 |
|---|---|---|
| `src/monthly.ts` | 配る | 集計のコード（TypeScript・約 300 行・テストなし・不具合 6 つ入り） |
| `package.json` ほか | 配る | `npm install` → `npm test` で Vitest が動く（テストはまだ 0 本） |
| `instructor/monthly.test.ts` | 配らない | スライド 11「月末のテストを 1 本書く」の実演のテスト（月末） |
| `instructor/clock.test.ts` | 配らない | スライド 12「時計を差し替えるテスト」の深掘りのテスト（時計を止める） |
| `instructor/ANSWERS.md` | 配らない | 仕込んだ不具合の答え（行番号つき） |

配るときは `instructor/` を消してから、新しく作ったリポジトリに入れてください。受講生のリポジトリは公開なので（10/12 難波）、配るリポジトリも公開になります。答え（`instructor/`）は Git の履歴にも残さないこと。

## 実演の手順（スライド 11「月末のテストを 1 本書く」）

```bash
npm install
cp instructor/monthly.test.ts src/
npm test        # 期待 3 ／ 実際 0 で落ちる
```

配った直後はテストが 0 本なので、`npm test` は「No test files found」と出て通ります（`vitest.config.ts` の `passWithNoTests`）。

## 演習の流れ（チューター向け）

③ 演習①（15 分）：`src/monthly.ts` を 8 分読み、怪しい所を 3 つメモ（行番号と、なぜ）→ 7 分で月末のテストを 1 本書いて動かす。落ちれば、不具合を再現できた印。答え（期待する値）は自分で決める

④' 演習②（10 分）：ブランチで AI に直させる（テーマⅡ「チームで直す：Git の運用」）。配るリポジトリは、main に最初のコミットがある状態にしておく

```bash
git switch -c fix/month-end           # ブランチを切る（main には直接コミットしない）
git add src/monthly.test.ts
git commit -m "月末のテストを足す"      # まだ落ちたままでよい
# AI に不具合を 1 つ直させる（条件：今あるテストは通ったまま・テストは書き換えない・集計の関数だけ）
npm test                              # 通ったら
git add src/monthly.ts
git commit -m "月末の日を 1 月に数える"
git diff main                         # 変えた理由・消えた処理・境界の値を見る
```

- AI がテストのファイルを書き換えていたら、差し戻す
- ブランチを切る前に main で作業を始めてしまったら、コミットする前に `git switch -c fix/month-end`（今の変更ごとブランチに移る）。main にコミットしてしまったら、チューターと一緒に直す
