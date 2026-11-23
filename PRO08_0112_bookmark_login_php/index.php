<?php require_once __DIR__ . '/funcs.php';
login_check(); ?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ブックマークを登録</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="bar">
    <a class="brand" href="select.php">ブックマーク</a>
    <nav><a href="index.php" class="active">登録</a><a href="select.php">一覧</a><span class="who"><?= h($_SESSION['name']) ?> さん</span><a href="logout.php">ログアウト</a></nav>
  </header>
  <main class="wrap">
    <h1>ブックマークを登録</h1>
    <form method="post" action="insert.php" class="card form">
      <label>名前<input type="text" name="title" required maxlength="128" placeholder="例：MDN Web Docs"></label>
      <label>URL<input type="url" name="url" required maxlength="256" placeholder="https://"></label>
      <label>コメント<textarea name="comment" rows="3" placeholder="なぜ残したか"></textarea></label>
      <button type="submit" class="btn primary">登録する</button>
    </form>
  </main>
</body>
</html>
