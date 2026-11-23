<?php
require_once __DIR__ . '/funcs.php';
$pdo = db_conn();
$rows = $pdo->query('SELECT * FROM bookmarks ORDER BY created_at DESC')->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ブックマーク一覧</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="bar">
    <a class="brand" href="select.php">ブックマーク</a>
    <nav><a href="index.php">登録</a><a href="select.php" class="active">一覧</a></nav>
  </header>
  <main class="wrap">
    <h1>ブックマーク一覧 <small><?= count($rows) ?> 件</small></h1>
    <table class="card list">
      <thead><tr><th>登録日</th><th>名前</th><th>コメント</th><th></th></tr></thead>
      <tbody>
      <?php foreach ($rows as $r): ?>
        <tr>
          <td class="date"><?= h(date('n/j', strtotime($r['created_at']))) ?></td>
          <td><a href="<?= h($r['url']) ?>" target="_blank" rel="noopener"><?= h($r['title']) ?></a></td>
          <td class="comment"><?= h($r['comment']) ?></td>
          <td class="ops">
            <a class="btn small" href="detail.php?id=<?= h($r['id']) ?>">編集</a>
            <button type="button" class="btn small danger js-delete" data-id="<?= h($r['id']) ?>" data-title="<?= h($r['title']) ?>">削除</button>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </main>

  <!-- 消す前の確かめ -->
  <dialog id="confirm" class="dialog">
    <form method="post" action="delete.php">
      <p class="dialog-title">消しますか？</p>
      <p class="dialog-body">「<span id="confirm-name"></span>」を消します。<br>消したら、もう見られません。</p>
      <input type="hidden" name="id" id="confirm-id">
      <div class="dialog-buttons">
        <button type="button" class="btn" id="confirm-cancel">やめる</button>
        <button type="submit" class="btn danger">消す</button>
      </div>
    </form>
  </dialog>
  <script>
    const dialog = document.getElementById("confirm");
    document.querySelectorAll(".js-delete").forEach((button) => {
      button.addEventListener("click", () => {
        document.getElementById("confirm-id").value = button.dataset.id;
        document.getElementById("confirm-name").textContent = button.dataset.title;
        dialog.showModal();
      });
    });
    document.getElementById("confirm-cancel").addEventListener("click", () => dialog.close());
  </script>
</body>
</html>
