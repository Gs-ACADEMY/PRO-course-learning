<?php
require_once __DIR__ . '/funcs.php';
$_SESSION = [];
session_destroy();
redirect('login.php');
