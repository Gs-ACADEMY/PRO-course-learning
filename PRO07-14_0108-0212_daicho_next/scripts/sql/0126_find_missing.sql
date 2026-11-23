-- 移せなかった担当者を探す（社員の表に、同じ名前がない行）
SELECT p.id, p.title, p.assignee
  FROM "Project" p
  LEFT JOIN "Staff" s ON s.name = p.assignee
 WHERE p.assignee IS NOT NULL AND s.id IS NULL
 ORDER BY p.id;
