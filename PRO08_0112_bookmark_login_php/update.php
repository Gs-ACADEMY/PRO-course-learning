<?php
require_once __DIR__ . '/funcs.php';
login_check();

$id = (int)($_POST['id'] ?? 0);
$title = trim($_POST['title'] ?? '');
$url = trim($_POST['url'] ?? '');
$comment = trim($_POST['comment'] ?? '');
if ($id <= 0 || $title === '' || !filter_var($url, FILTER_VALIDATE_URL)) {
    exit('名前と URL を正しく入れてください');
}

$pdo = db_conn();
$stmt = $pdo->prepare('UPDATE bookmarks SET title = :title, url = :url, comment = :comment WHERE id = :id');
$stmt->execute([':title' => $title, ':url' => $url, ':comment' => $comment, ':id' => $id]);
redirect('select.php');
