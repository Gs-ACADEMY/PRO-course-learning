<?php
require_once __DIR__ . '/funcs.php';

// 保存したファイルを読む（1 行が 1 人分の回答）
$rows = [];
$file = __DIR__ . '/data/enquete.csv';
if (file_exists($file)) {
    $fp = fopen($file, 'r');
    while (($row = fgetcsv($fp, null, ',', '"', '')) !== false) {
        if (count($row) === 5) {
            $rows[] = $row;
        }
    }
    fclose($fp);
}
$rows = array_reverse($rows); // 新しい順にする

// 画面に出す値は、すべて h()（htmlspecialchars）を通す（エスケープ）
// メールアドレスは、誰でも開ける一覧には出さない
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>アンケートの結果</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="bar">
    <a class="brand" href="index.php">アンケート</a>
    <nav><a href="index.php">答える</a><a href="read.php" class="active">結果を見る</a></nav>
  </header>
  <main class="wrap">
    <h1>アンケートの結果 <small><?= count($rows) ?> 件</small></h1>
    <?php if (empty($rows)): ?>
      <p class="card note">まだ回答はありません</p>
    <?php else: ?>
      <table class="card list">
        <thead><tr><th>日時</th><th>お名前</th><th>満足度</th><th>ご意見</th></tr></thead>
        <tbody>
        <?php foreach ($rows as [$time, $name, $email, $score, $comment]): ?>
          <tr>
            <td class="date"><?= h(date('n/j H:i', strtotime($time))) ?></td>
            <td class="name"><?= h($name) ?></td>
            <td class="num"><?= h($score) ?></td>
            <td class="comment"><?= nl2br(h($comment)) ?></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </main>
</body>
</html>
