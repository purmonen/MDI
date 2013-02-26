<?php
require_once '../../Configuration/config.php';

//Make sure the correct server is used
if (SITE_ROOT == 'http://wproj.nada.kth.se/~purmonen/' && 
    $_SERVER['SERVER_NAME'] != 'wproj.nada.kth.se') {
    $query = '';
    if (isset($_SERVER['QUERY_STRING'])) {
        $query = $_SERVER['QUERY_STRING'];
    }
    header('location:' . SITE_ROOT . 'Public/MDI3/index.php?' . $query);
    exit;
}

//For logging
require_once SERVER_ROOT . 'Database/base.php';
require_once SERVER_ROOT . 'Database/log.php';

$_SERVER['QUERY_STRING'] = 'MDI: ' . $_SERVER['QUERY_STRING'];
$log = new Log_DAO();
$log->updateLog();

//Get page request
$page = 'about';
if (isset($_GET['page'])) {
    $page = $_GET['page'];
}

$file = $page . '.php';

//Load content
require_once 'top.php';
if (file_exists($file)) {
    require_once $file;
    echo "<script>selectLink('$page')</script>";
} 
require_once 'bottom.php';
?>