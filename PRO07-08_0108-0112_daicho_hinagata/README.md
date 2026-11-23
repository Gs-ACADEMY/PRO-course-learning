# 案件台帳のひな形（1/8 時点）

第 7 回（1/8）の講義で作った案件台帳の、1/8 の時点のひな形です。
1/12 からは、このリポジトリを元に依頼に取り組みます。PR と CI の設定も入っています（使い始めるのは 1/15 から）。

- 1/8 の演習①（テーブルを作り、案件 30 件を一覧に出す）と演習②（状態で絞り込む）まで入っています
- 演習が終わらなかった人も、ここから依頼 1 に入れます

使っているもの：Next.js 16.4 ／ Prisma 7.10 ／ PostgreSQL ／ Vitest 5

Node.js は 24 以上を使ってください。事前動画 V1 で 24 を入れていれば大丈夫です。22 では `npm install` のたびに `package-lock.json` が書き換わります。CI は Node.js 24 で動きます。

## 動かし方

```bash
cp .env.example .env      # DATABASE_URL に、冬休みに作った無料枠の接続文字列を入れる
npm install               # 最後に prisma generate も走る
npx prisma migrate deploy # テーブルを作る（prisma/migrations の SQL を当てる）
npx prisma db seed        # 配布データ（案件 30・日報 50・問い合わせ 30）を入れる
npm run dev               # http://localhost:3000 → 案件の一覧へ
```

- 演習で自分のテーブルを作ったデータベースとは、別のデータベースを使ってください。同じデータベースだとテーブルの名前がぶつかり、`migrate deploy` が止まります
- 接続文字列は秘密です。`.env` は Git に上げません（`.gitignore` に入っています）
- `npx prisma db seed` は、3 つの表を空にしてから入れ直します。何度流しても同じ番号になりますが、自分で足した行も消えます
- データベースの中身は `npm run db:studio`（Prisma Studio）で見られます

## 中身

| ファイル | 中身 |
|---|---|
| `prisma/schema.prisma` | データの形（状態 6 つ・問い合わせ・案件・日報） |
| `prisma/migrations/` | データベースに当てる SQL（1/8 の形） |
| `prisma/seed-data.ts` | 配布データの中身（案件 30・日報 50・問い合わせ 30） |
| `prisma/seed.ts` | 配布データをデータベースに入れる（`npx prisma db seed`） |
| `app/projects/page.tsx` | 案件の一覧の画面。データベースを読む所（絞り込みと並べ替え） |
| `components/StatusFilter.tsx` | 状態を選ぶ所と、出ている件数 |
| `components/ProjectTable.tsx` | 一覧の表 |
| `lib/filter.ts` | URL の `?status=` の値を、絞り込む状態に直す |
| `lib/filter.test.ts` | `lib/filter.ts` のテスト（Vitest） |
| `vitest.config.mts` | テストの設定（テストでも `@/` を使えるようにする） |
| `lib/status.ts` | 状態の日本語の名前（6 つ） |
| `lib/prisma.ts` | データベースにつなぐ所 |
| `data/*.csv` | 配布データの CSV（下に説明があります） |
| `scripts/export-csv.ts` | `prisma/seed-data.ts` から CSV を作り直す（`npm run data:csv`） |
| `.github/workflows/ci.yml` | CI の設定（型チェックとテスト） |
| `.github/pull_request_template.md` | PR の説明のひな形 |

## 一覧の画面（/projects）

- 案件を、更新が新しい順に出します（件名・状態・担当者・見積金額・更新日時）
- 状態を選んで「絞り込む」を押すと、`/projects?status=ESTIMATING` のように開き直し、その状態の案件だけを出します。「すべて」で元に戻ります
- 右上の「N 件」は、画面に出ている行の数です。データベースの行の数と合うかを確かめられます

```sql
SELECT count(*) FROM "Project" WHERE status = 'ESTIMATING';  -- 見積中は 6 件
```

- `next.config.ts` は 12/8 のひな形と同じく、create-next-app の既定から Cache Components を外しています。案件の一覧は URL の `?status=` を読むので、開くたびにデータベースを読みます
- URL もログインも読まずにデータベースを読むページを足すと、`npm run build` のときのデータのまま固まります。そのときは、ページの最初に `await connection();`（`import { connection } from "next/server";`）を書きます

## 配布データの CSV（data/）

演習①で取り込んだ配布データと同じ中身です（`prisma/seed-data.ts` から作っています）。

| ファイル | 行 | 列 |
|---|---|---|
| `data/projects.csv` | 30 | `id`・`title`（件名）・`status`（状態の英語の名前）・`status_label`（状態の日本語の名前）・`amount`（見積金額。空は、まだ見積もりを出していない）・`assignee`（担当者）・`inquiry_id`（問い合わせ番号）・`updated_at`（更新日時） |
| `data/reports.csv` | 50 | `id`・`project_id`（案件番号）・`date`（作業した日）・`workers`（人数）・`note`（内容） |
| `data/inquiries.csv` | 30 | `id`・`name`（お客さんの名前）・`body`（問い合わせの中身）・`created_at`（受けた日時） |

- 文字コードは UTF-8 で、1 行目は列の名前です。日時は日本時間（末尾の `+09:00`）で書いています
- Excel でダブルクリックして開くと、文字化けします。Excel の「データ」→「テキストまたは CSV から」で開き、「元のファイル」が「65001: Unicode (UTF-8)」になっているのを確かめてから読み込んでください
- `prisma/seed-data.ts` を変えたときは、`npm run data:csv` で作り直します

## 依頼 1 の出し方（1/12）

自分のリポジトリは、配られたテンプレートのリポジトリから作ります（GitHub の「Use this template」）。手元に clone して、上の「動かし方」で動かします。

リポジトリは **Public（公開）** で作ります。1/15 から、ほかの受講生が PR を読んでコメントし合うためです。公開なので、次の 2 つを守ってください。

- 鍵（API キーなど）・パスワード・秘密の値は、コードに書かず `.env` に置きます（`.env` で始まるファイルはリポジトリに入りません。`.env.example` だけは値を入れずに入れます）。見本のユーザーを作るシードのパスワードも同じです
- 一度 push した鍵は、あとで消しても履歴に残ります。押してしまったら、その鍵を作り直してください。GitHub は決まった形式の鍵なら push の時点で止めてくれますが、全部は止まりません

依頼 1 は、手元で作ってコミットし、GitHub の自分のリポジトリに push して出します（提案会①で、動く画面と試す手順 3 つの結果を見せます）。
push すると、main でも CI（型チェックとテスト）が自動で動きます。CI の説明は 1/15 です。それまでは ✓ か ✗ が付いても、提出には関係ありません。

## PR と CI の使い方（1/15 から）

依頼 2 からは、GitHub の PR で出します。CI（型チェックとテスト）が通ることが、提出の条件です（1/15 の特別講義「テストとコードの品質」で説明します）。

決まりは 4 つです（1/15 のテーマⅡ「チームで直す：Git の運用」）。

- 1 つの依頼に、1 つのブランチ。main には直接コミットしない
- テストのコミットを先に（直す前は落ち、直したら通る。見る人がその順で確かめられる）
- コミットは意味のある 1 つずつ（何をしたかを 1 行で書ける大きさ）
- AI の変更は、コミットの前に差分を読む（読めない差分はコミットしない）

1. 依頼 1 で使った自分のリポジトリで、main を最新にします（`git switch main` → `git pull`）
2. ブランチで作ります（main はそのまま）
   ```bash
   git switch -c irai-2
   ```
3. 前任者の集計を直さずにそのまま入れ、直す前のテストを書いて、先にコミットします。この時点ではテストが落ちたままで大丈夫です（ファイル名とメッセージは例）
   ```bash
   git add lib/monthly.ts
   git commit -m "前任者の集計を、そのまま入れる（まだ直さない）"
   npm test            # 月末・月またぎのテストが落ちるのを確かめる
   git add lib/monthly.test.ts
   git commit -m "直す前に、月末と月またぎのテストを書く（いまは落ちる）"
   ```
4. 直したら、手元で確かめ、差分を読んでからコミットします。直すごとに 1 つずつコミットします
   ```bash
   npm run typecheck   # 型チェック
   npm test            # テスト（全部通る）
   git diff            # 変えた理由・消えた処理・境界の値を見る
   git add lib/monthly.ts
   git commit -m "月末を直す"
   ```
5. push して、GitHub で PR を出します
   ```bash
   git push -u origin irai-2
   ```
6. PR の説明には、ひな形（やったこと／AI に任せた所／自分で確かめた所）が最初から入っています。`<!-- -->` の中のヒントを読んで埋めてください
7. PR を出すと CI が動き、型チェックとテストを自動で確かめます。PR の画面の下に ✓ か ✗ が付きます
8. ✗ が付いたら、「Details」でどこで止まったかを見て直し、同じブランチに push し直します。PR はそのままで、CI がもう一度動きます
9. ほかの受講生の PR に 2 コメント書きます（良い所 1 つ・確かめたい所 1 つ。見る所は、変えた理由・消えた処理・境界の値）

- main が先に進んでいたら、先に取り込んでから PR を更新します（`git switch main` → `git pull` → `git switch irai-2` → `git merge main`）。同じ所を直していて衝突したら、両方の意図を読んで直します（AI に任せきりにしない）
- 任意課題：main を保護し、CI が通らない PR をマージできないようにする（GitHub のルールセット。設定の画面は GitHub Docs で確かめる）
- CI はデータベースにつなぎません。テストは、データベースを使わない関数（`lib/filter.ts` のようなもの）に書きます
- `lib/filter.test.ts` のように名前を `〜.test.ts` にすると、`npm test` で動きます

## 担当者の列について

案件の「担当者」（`assignee`）は、名前をそのまま文字で入れています。講師の判断で、この台帳では残している列です。この列は、あとの回で見直します。
