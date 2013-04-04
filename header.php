<div id="header">
	<div id="nav">
		<a href="/" id="index-link">Bakgrund</a>
		<a href="/problem" id="problem-link">Problem</a>
		<a href="/prototype" id="prototype-link">Prototyp</a>
		<a href="http://gruppk2.blogspot.se/" target="_blank">Blogg</a>
	</div>
</div>

<?php
$pages = explode('/', $_SERVER['PHP_SELF']);
$page = explode('.', $pages[1]);
$page = $page[0];
echo "<script>selectLink('$page')</script>";
?>