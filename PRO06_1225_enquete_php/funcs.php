<?php
// 日時を日本の時間で記録する
date_default_timezone_set('Asia/Tokyo');

// 画面に出す文字を安全にする（エスケープ。XSS 対策）
function h($str)
{
    return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8');
}

// 値を CSV の 1 行にする（「,」「"」や改行が入っても崩れないように、"" で囲む）
function csv_line($values)
{
    $cells = [];
    foreach ($values as $value) {
        $cells[] = '"' . str_replace('"', '""', $value) . '"';
    }
    return implode(',', $cells) . "\n";
}
