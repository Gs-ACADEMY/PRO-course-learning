<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>アンケート</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="bar">
    <a class="brand" href="index.php">アンケート</a>
    <nav><a href="index.php" class="active">答える</a><a href="read.php">結果を見る</a></nav>
  </header>
  <main class="wrap">
    <h1>アンケートにご協力ください</h1>
    <!-- 必須の印（required）は付けていない。空で送ると、write.php の確かめが働くのが見える -->
    <form method="post" action="write.php" class="card form">
      <label>お名前<input type="text" name="name"></label>
      <label>メールアドレス<input type="email" name="email" placeholder="you@example.com"></label>
      <fieldset class="score">
        <legend>満足度（5 がいちばん満足）</legend>
        <label><input type="radio" name="score" value="1">1</label>
        <label><input type="radio" name="score" value="2">2</label>
        <label><input type="radio" name="score" value="3">3</label>
        <label><input type="radio" name="score" value="4">4</label>
        <label><input type="radio" name="score" value="5">5</label>
      </fieldset>
      <label>ご意見（なくてもかまいません）<textarea name="comment" rows="4"></textarea></label>
      <button type="submit" class="btn primary">送信する</button>
    </form>
  </main>
</body>
</html>
