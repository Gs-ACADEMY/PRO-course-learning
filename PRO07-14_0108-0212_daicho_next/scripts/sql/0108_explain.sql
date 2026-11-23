-- 1/8 の任意課題の見本：状態で絞る一覧にインデックスを張り、EXPLAIN で前と後を比べる
-- 本物の台帳では流さない。コピーのデータベースを作って、そちらで流す
--   psql -d postgres -c "CREATE DATABASE daicho_explain TEMPLATE daicho;"
--   psql -d daicho_explain -f scripts/sql/0108_explain.sql
-- 自分の台帳でインデックスを張るときは、schema.prisma の Project に
--   @@index([status, updatedAt(sort: Desc)])
-- と書いて、マイグレーションで反映する（ここの CREATE INDEX と同じものができる）

\echo '1. 30 件では差が見えないので、練習用の案件を 10 万件足す（コピーのデータベースだけ）'
INSERT INTO "Project" ("title", "status", "amount", "updatedAt")
SELECT '練習用の案件 ' || g,
       (ARRAY['SURVEY','ESTIMATING','CONTRACTED','IN_PROGRESS','DONE','INVOICED'])[1 + g % 6]::"Status",
       (g % 50) * 10000,
       now() - make_interval(mins => g)
FROM generate_series(1, 100000) AS g;
ANALYZE "Project";

\echo ''
\echo '2. インデックスなし：見積中を、更新が新しい順に 20 件'
EXPLAIN ANALYZE
SELECT * FROM "Project" WHERE "status" = 'ESTIMATING' ORDER BY "updatedAt" DESC LIMIT 20;

\echo ''
\echo '3. インデックスを張る（状態と更新日時の順）'
CREATE INDEX "Project_status_updatedAt_idx" ON "Project" ("status", "updatedAt" DESC);

\echo ''
\echo '4. インデックスあり：同じ問い合わせ'
EXPLAIN ANALYZE
SELECT * FROM "Project" WHERE "status" = 'ESTIMATING' ORDER BY "updatedAt" DESC LIMIT 20;

\echo ''
\echo '見る所：2 は Seq Scan（全部の行を見る）、4 は Index Scan（索引をたどる）。最後の Execution Time を比べる'
