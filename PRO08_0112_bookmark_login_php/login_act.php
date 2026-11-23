<?php
require_once __DIR__ . '/funcs.php';

$login_id = $_POST['login_id'] ?? '';
$password = $_POST['password'] ?? '';

$pdo = db_conn();
$stmt = $pdo->prepare('SELECT * FROM users WHERE login_id = :login_id');
$stmt->execute([':login_id' => $login_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// パスワードはハッシュと照らし合わせる（元の文字は保存していない）
if (!$user || !password_verify($password, $user['password_hash'])) {
    redirect('login.php?error=1');
}

// ログインの印を作り直してから、誰かを覚える
session_regenerate_id(true);
$_SESSION['user_id'] = $user['id'];
$_SESSION['name'] = $user['name'];
redirect('select.php');
