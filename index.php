<?php
//THIS STUFF SHOULD BE IGNORED FOR THIS PROJECT, IT'S JUST FOR LOGGING
require_once '../../Configuration/config.php';
if (SITE_ROOT == 'http://wproj.nada.kth.se/~purmonen/' && 
    $_SERVER['SERVER_NAME'] != 'wproj.nada.kth.se') {
    $query = '';
    if (isset($_SERVER['QUERY_STRING'])) {
        $query = $_SERVER['QUERY_STRING'];
    }
    header('location:' . SITE_ROOT . 'Public/MDI/index.php?' . $query);
    exit;
}
require_once SERVER_ROOT . 'Database/base.php';
require_once SERVER_ROOT . 'Database/log.php';
$_SERVER['QUERY_STRING'] = 'MDI: ' . $_SERVER['QUERY_STRING'];
$log = new Log_DAO();
$log->updateLog();

//THIS IS WHERE IT BEGINS
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
require_once 'bottom.php';
echo "<script>selectLink('$page')</script>"; 
?>