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
$pdo->exec('DROP TABLE IF EXISTS users');
$pdo->exec("CREATE TABLE users (
    id {$id},
    name VARCHAR(64) NOT NULL,
    login_id VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
)");
$pdo->exec("CREATE TABLE bookmarks (
    id {$id},
    user_id INT NOT NULL,
    title VARCHAR(128) NOT NULL,
    url VARCHAR(256) NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL
)");

// 見本のアカウント（パスワードはハッシュにしてしまう）
$users = [['山田', 'yamada'], ['佐藤', 'sato'], ['鈴木', 'suzuki']];
$stmt = $pdo->prepare('INSERT INTO users (name, login_id, password_hash) VALUES (:name, :login_id, :hash)');
foreach ($users as [$name, $login_id]) {
    $stmt->execute([':name' => $name, ':login_id' => $login_id, ':hash' => password_hash('pass1234', PASSWORD_DEFAULT)]);
}

// 見本のブックマーク（山田さん以外の分も入れておく）
$rows = [
    [1, 'MDN Web Docs', 'https://developer.mozilla.org/ja/', 'HTML と CSS で迷ったら最初に見る', '2026-12-26 10:12:00'],
    [2, 'PHP マニュアル', 'https://www.php.net/manual/ja/', '関数の引数と戻り値を確かめる', '2026-12-27 21:40:00'],
    [3, 'サバイバル TypeScript', 'https://typescriptbook.jp/', '型の書き方の辞書', '2026-12-28 09:05:00'],
    [1, 'Pro Git（日本語）', 'https://git-scm.com/book/ja/v2', 'ブランチの章をもう一度読む', '2027-01-04 20:18:00'],
    [2, 'PostgreSQL 文書', 'https://www.postgresql.jp/document/', 'SELECT の書き方', '2027-01-06 22:31:00'],
    [3, 'OWASP Top 10', 'https://owasp.org/Top10/ja/', 'ログインの次に読む', '2027-01-09 08:47:00'],
];
$stmt = $pdo->prepare('INSERT INTO bookmarks (user_id, title, url, comment, created_at) VALUES (:user_id, :title, :url, :comment, :created_at)');
foreach ($rows as [$uid, $title, $url, $comment, $at]) {
    $stmt->execute([':user_id' => $uid, ':title' => $title, ':url' => $url, ':comment' => $comment, ':created_at' => $at]);
}
echo "アカウント " . count($users) . " 人と、ブックマーク " . count($rows) . " 件を入れました\n";
