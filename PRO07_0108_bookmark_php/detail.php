<?php
require_once __DIR__ . '/funcs.php';
$id = (int)($_GET['id'] ?? 0);
$pdo = db_conn();
$stmt = $pdo->prepare('SELECT * FROM bookmarks WHERE id = :id');
$stmt->execute([':id' => $id]);
$r = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$r) {
    exit('そのブックマークはありません');
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ブックマークを書き換える</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="bar">
    <a class="brand" href="select.php">ブックマーク</a>
    <nav><a href="index.php">登録</a><a href="select.php">一覧</a></nav>
  </header>
  <main class="wrap">
    <h1>ブックマークを書き換える</h1>
    <form method="post" action="update.php" class="card form">
      <input type="hidden" name="id" value="<?= h($r['id']) ?>">
      <label>名前<input type="text" name="title" required maxlength="128" value="<?= h($r['title']) ?>"></label>
      <label>URL<input type="url" name="url" required maxlength="256" value="<?= h($r['url']) ?>"></label>
      <label>コメント<textarea name="comment" rows="3"><?= h($r['comment']) ?></textarea></label>
      <button type="submit" class="btn primary">書き換える</button>
    </form>
  </main>
</body>
</html>
