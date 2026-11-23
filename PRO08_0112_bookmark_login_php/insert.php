<?php
require_once __DIR__ . '/funcs.php';
login_check();

// 1. 受け取る（サーバーでも確かめる）
$title = trim($_POST['title'] ?? '');
$url = trim($_POST['url'] ?? '');
$comment = trim($_POST['comment'] ?? '');
if ($title === '' || !filter_var($url, FILTER_VALIDATE_URL)) {
    exit('名前と URL を正しく入れてください');
}

// 2. 登録する（登録した人も一緒に入れる）
$pdo = db_conn();
$stmt = $pdo->prepare('INSERT INTO bookmarks (user_id, title, url, comment, created_at) VALUES (:user_id, :title, :url, :comment, :created_at)');
$stmt->execute([
    ':user_id' => $_SESSION['user_id'],
    ':title' => $title,
    ':url' => $url,
    ':comment' => $comment,
    ':created_at' => date('Y-m-d H:i:s'),
]);

// 3. 一覧へ
redirect('select.php');
