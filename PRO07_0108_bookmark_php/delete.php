<?php
require_once __DIR__ . '/funcs.php';

// 消すのは POST だけ（URL を開いただけで消えないように）
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('select.php');
}
$id = (int)($_POST['id'] ?? 0);
$pdo = db_conn();
$stmt = $pdo->prepare('DELETE FROM bookmarks WHERE id = :id');
$stmt->execute([':id' => $id]);
redirect('select.php');
