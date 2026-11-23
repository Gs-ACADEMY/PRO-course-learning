<?php
require_once __DIR__ . '/funcs.php';

// 1. 受け取る（サーバーでも確かめる）
$title = trim($_POST['title'] ?? '');
$url = trim($_POST['url'] ?? '');
$comment = trim($_POST['comment'] ?? '');
if ($title === '' || !filter_var($url, FILTER_VALIDATE_URL)) {
    exit('名前と URL を正しく入れてください');
}

// 2. 登録する（値はプレースホルダーで渡す）
$pdo = db_conn();
$stmt = $pdo->prepare('INSERT INTO bookmarks (title, url, comment, created_at) VALUES (:title, :url, :comment, :created_at)');
$stmt->execute([
    ':title' => $title,
    ':url' => $url,
    ':comment' => $comment,
    ':created_at' => date('Y-m-d H:i:s'),
]);

// 3. 一覧へ
redirect('select.php');
