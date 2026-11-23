# PRO07_0108 ブックマークアプリ（PHP・講師の見本）

1/8 の①（素材 0108-1）で使う、動画課題のブックマークアプリの講師の見本です。
登録・参照・更新・削除がそろっていて、削除の前に「消しますか？」の確かめを出します。

ログインを足した版は、隣の `PRO08_0112_bookmark_login_php` にあります（1/12 で使う）。

## 動かし方（PHP 8 の組み込みサーバー）

```bash
php setup.php      # テーブルを作り、見本のデータを 5 件入れる（最初に 1 回）
php -S localhost:8000
```

ブラウザで http://localhost:8000/select.php を開きます。

- 何も設定しなければ SQLite（`data/bookmark.sqlite`）で動きます。PHP の `pdo_sqlite` が要ります
- XAMPP の MySQL で動かすときは、`config.php` の接続先を MySQL の 3 行に入れ替え、データベース `bookmark_db` を作ってから `php setup.php`

## メモ

- 削除の確かめは `confirm()` ではなく `<dialog>` で作っています（画面に残るので、撮れる・見せやすい）
- 消すのは POST だけ（URL を開いただけで消えないように）
- フォームの CSRF 対策は入れていません（2/12 のセキュリティで扱う）
