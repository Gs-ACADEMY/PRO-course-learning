<?php
require_once __DIR__ . '/funcs.php';
$error = isset($_GET['error']);
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ログイン｜ブックマーク</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="bar"><span class="brand">ブックマーク</span></header>
  <form method="post" action="login_act.php" class="card login">
    <h1>ログイン</h1>
    <?php if ($error): ?><p class="error">ログイン ID かパスワードが違います</p><?php endif; ?>
    <label>ログイン ID<input type="text" name="login_id" required autocomplete="username"></label>
    <label>パスワード<input type="password" name="password" required autocomplete="current-password"></label>
    <button type="submit" class="btn primary">ログイン</button>
  </form>
</body>
</html>
