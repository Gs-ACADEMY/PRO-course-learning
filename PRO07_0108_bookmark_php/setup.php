<?php
// テーブルを作り、見本のデータを入れる（最初に 1 回だけ：php setup.php）
require_once __DIR__ . '/funcs.php';
if (!is_dir(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data');
}
$pdo = db_conn();
$driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
$id = $driver === 'mysql' ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';

$pdo->exec('DROP TABLE IF EXISTS bookmarks');
$pdo->exec("CREATE TABLE bookmarks (
    id {$id},
    title VARCHAR(128) NOT NULL,
    url VARCHAR(256) NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL
)");

$rows = [
    ['MDN Web Docs', 'https://developer.mozilla.org/ja/', 'HTML と CSS で迷ったら最初に見る', '2026-12-26 10:12:00'],
    ['PHP マニュアル', 'https://www.php.net/manual/ja/', '関数の引数と戻り値を確かめる', '2026-12-27 21:40:00'],
    ['サバイバル TypeScript', 'https://typescriptbook.jp/', '型の書き方の辞書', '2026-12-28 09:05:00'],
    ['Pro Git（日本語）', 'https://git-scm.com/book/ja/v2', 'ブランチの章をもう一度読む', '2027-01-04 20:18:00'],
    ['PostgreSQL 文書', 'https://www.postgresql.jp/document/', 'SELECT の書き方', '2027-01-06 22:31:00'],
];
$stmt = $pdo->prepare('INSERT INTO bookmarks (title, url, comment, created_at) VALUES (:title, :url, :comment, :created_at)');
foreach ($rows as [$title, $url, $comment, $at]) {
    $stmt->execute([':title' => $title, ':url' => $url, ':comment' => $comment, ':created_at' => $at]);
}
echo "テーブルを作り、" . count($rows) . " 件入れました\n";
