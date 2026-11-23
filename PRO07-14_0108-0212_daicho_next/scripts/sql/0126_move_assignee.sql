-- 依頼 4（1/26）：担当者（名前の文字）を、担当の表（Assignment）へ移す
-- 必ずコピーのデータベースで先に試す：CREATE DATABASE daicho_copy TEMPLATE daicho;
-- 流し方：psql "接続文字列" -f scripts/sql/0126_move_assignee.sql

\echo '1. 移す前に数える'
SELECT (SELECT count(*) FROM "Project") AS 案件,
       (SELECT count(*) FROM "Project" WHERE assignee IS NOT NULL) AS 担当,
       (SELECT count(*) FROM "Report") AS 日報;

\echo '2. 移す（担当者の名前で、社員の表と突き合わせる）'
INSERT INTO "Assignment" ("projectId", "staffId")
  SELECT p.id, s.id FROM "Project" p JOIN "Staff" s ON s.name = p.assignee;

\echo '3. 移した後に数える'
SELECT (SELECT count(*) FROM "Project") AS 案件,
       (SELECT count(*) FROM "Assignment") AS 担当,
       (SELECT count(*) FROM "Report") AS 日報;
