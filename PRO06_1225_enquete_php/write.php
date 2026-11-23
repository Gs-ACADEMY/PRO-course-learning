<?php
require_once __DIR__ . '/funcs.php';

// ① 受け取る：$_POST で、送られた値を受け取る
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$score = $_POST['score'] ?? '';
$comment = trim($_POST['comment'] ?? '');

// ② 確かめる：空でないか・形は正しいかを見る
$errors = [];
if (empty($name)) {
    $errors[] = 'お名前を入れてください';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'メールアドレスを正しく入れてください';
}
if (!in_array($score, ['1', '2', '3', '4', '5'], true)) {
    $errors[] = '満足度を 1〜5 から選んでください';
}

// ③ 保存する：ファイルに書いて残す（確かめを通ったときだけ）
if (empty($errors)) {
    $row = [date('Y-m-d H:i:s'), $name, $email, $score, $comment];
    file_put_contents(__DIR__ . '/data/enquete.csv', csv_line($row), FILE_APPEND | LOCK_EX);
}

// ④ 返す：結果のページを返す
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>アンケート</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="wrap">
  <?php if (empty($errors)): ?>
    <h1>ありがとうございました</h1>
    <p class="card note"><?= h($name) ?> さんの回答を保存しました。</p>
    <a class="btn primary" href="read.php">結果を見る</a>
  <?php else: ?>
    <h1>送れませんでした</h1>
    <ul class="card note errors">
      <?php foreach ($errors as $error): ?><li><?= h($error) ?></li><?php endforeach; ?>
    </ul>
    <a class="btn" href="index.php">入力にもどる</a>
  <?php endif; ?>
  </main>
</body>
</html>
