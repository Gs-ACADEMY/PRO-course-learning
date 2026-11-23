<?php
// データベースの接続先（どちらか 1 つを使う）
// 1) SQLite（設定なしで動く。このフォルダの data/ にファイルができる）
const DB_DSN  = 'sqlite:' . __DIR__ . '/data/bookmark.sqlite';
const DB_USER = null;
const DB_PASS = null;

// 2) MySQL（XAMPP など）を使うときは、上の 3 行を消して、こちらを使う
// const DB_DSN  = 'mysql:dbname=bookmark_db;charset=utf8mb4;host=localhost';
// const DB_USER = 'root';
// const DB_PASS = '';
