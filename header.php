<div id="header">
	<div id="nav">
		<a href="/" id="index-link">Bakgrund</a>
		<a href="/report/problem" id="report-link">Rapport</a>
		<a href="/prototype" id="prototype-link">Prototyp</a>
		<a href="http://gruppk2.blogspot.se/" target="_blank">Blogg</a>
	</div>
</div>

<?php
$pages = explode('/', $_SERVER['PHP_SELF']);
foreach ($pages as $page) {
    $page = explode('.', $page);
    $page = $page[0];
	echo "<script>selectLink('$page')</script>";
}
?>