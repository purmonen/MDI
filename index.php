<?php
//get page request

$pages = array('about', 'report', 'prototype');

$page = 'about';
if (isset($_GET['page'])) {
    $page = $_GET['page'];
}

//compose filename
if (!in_array($page, $pages)) {
    echo 'Burn in hell hacker!';
    exit;
}

require_once 'top.php';
require_once $page . '.php';
echo "<script>selectLink('$page')</script>"; 
require_once 'bottom.php';
?>
