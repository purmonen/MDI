<div id="report-nav">
    <a href="/report/problem" id="problem-link">Problem</a> |<a href="/report/comparison" id="comparison-link">Jämförelse</a> |<a href="/report/method" id="method-link">Metod</a>
</div>

<?php
$pages = explode('/', $_SERVER['PHP_SELF']);
foreach ($pages as $page) {
    $page = explode('.', $page);
    $page = $page[0];
	echo "<script>selectLink('$page')</script>";
}
?>