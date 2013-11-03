<div id="header">
	<div id="nav">
		<a href="index.php" id="index-link">Bakgrund</a>
		<a href="problem.php" id="problem-link">Problem</a>
		<a href="prototype.php" id="prototype-link">Prototyp</a>
		<a href="http://gruppk2.blogspot.se/" target="_blank">Blogg</a>
	</div>
</div>

<?php
$pages = explode('/', $_SERVER['PHP_SELF']);
$page = explode('.', $pages[count($pages)-1]);
$page = $page[0];
echo "<script>selectLink('$page')</script>";
?>