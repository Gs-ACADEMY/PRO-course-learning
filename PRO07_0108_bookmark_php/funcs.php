<?php
require_once __DIR__ . '/config.php';

// 画面に出す文字を安全にする（XSS 対策）
function h($str)
{
    return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8');
}

// データベースにつなぐ
function db_conn()
{
    try {
        $pdo = new PDO(DB_DSN, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        exit('データベースにつながりません：' . $e->getMessage());
    }
}

// 別のページへ移る
function redirect($file_name)
{
    header('Location: ' . $file_name);
    exit();
}
