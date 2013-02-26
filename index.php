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
$page = 'about';
if (isset($_GET['page'])) {
    $page = $_GET['page'];
}

//compose filename
$file = $page . '.php';

//top template
require_once 'top.php';

//load the requested page if it exists
if (file_exists($file)) {
    require_once $file;
    echo "<script>selectLink('$page')</script>";
} 

//load bottom template
require_once 'bottom.php';
?>