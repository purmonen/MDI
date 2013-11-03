<!doctype html>
<html>
<head>
    <title>MDI</title>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="Stylesheets/style.css">
    <link rel="stylesheet" type="text/css" href="Stylesheets/prototype.css">
    <script src="Scripts/scripts.js"></script>
    <script src="Scripts/prototype.js?version=1.0"></script>
</head>
<body>
<div id="prototype-wrap">
<?php require_once 'header.php'; ?>
<div id="content">

<div id="prototype-left">
<h1>Prototypen</h1>
<p>Information om prototypen finns tillgänglig <a href="#prototype-description">nedan</a>.</p>
</div>

<div id="prototype-right">
<div id="kiosk">
<div id="kiosk-screen">

    <p id="clock"></p>
    <div id="progress">
        <p id="start-progress" class="progress"></p>
        <p id="attractions-progress" class="progress"></p>
        <p id="confirm-ticket-progress" class="progress"></p>
        <p id="show-ticket-progress" class="progress"></p>
    </div>
    
    <div id="languages">
		<img class="button" id="swedish-flag" src="Images/swedish_flag.jpg" width="50" alt="Swedish flag">
		<img class="button" id="english-flag" src="Images/english_flag.gif" width="50" alt="English flag">
	</div>

    <div id="start">
        <h1 id="start-header"></h1>
        <p id="start-text"></p>
        <p class="center">
            <img src="Images/arm.jpg" id="arm-image" alt="Picture of how to scan" height="220">
        </p>
    </div>
    
    <div id="attractions">
        <h1 id="attractions-header"></h1>
        <p id="attractions-text"></p>
        <div id="insert-attractions"></div>
        <p id="exit" class="button negative">Avsluta</p>
    </div>
    
    <div id="confirm-ticket">
        <h1 id="confirm-ticket-header"></h1>
        <div id="confirm-wrap">
            <div id="confirm-info">
                <p><span id="attraction-name" class="bold"></span><span id="attraction-name-value"></span></p>
                <p><span id="attraction-time" class="bold"></span><span id="attraction-time-value"></span></p>
                <p><span id="attraction-height" class="bold"></span><span id="attraction-height-value"></span></p>
            </div>
            <p id="confirm-image"></p>
        </div>
        <p id="confirm"></p>
        <div class="yes-no-div">
            <p id="confirm-no" class="button negative"></p>
            <p id="confirm-yes" class="button positive"></p>
        </div>
    </div>
    
    <div id="show-ticket">
        <h1 id="show-ticket-header"></h1>
        <div class="center">
        <p id="show"></p>
        <p id="take-ticket"></p>
        <p class="center">
            <img src="Images/tickets.jpg" alt="Picture of where to take your tickets." height="160">
        </p>
        </div>
    </div>
    
    <div id="remove-ticket">
        <h1 id="remove-ticket-header"></h1>
        <div class="center">
        <p id="remove"></p>
        <p id="remove-image"></p>
        <div class="yes-no-div">
            <p id="remove-no" class="button negative"></p>
            <p id="remove-yes" class="button positive"></p>
        </div>
        </div>
    </div>
    
	<div id="invalid-pass">
	    <h1 id="invalid-pass-header"></h1>
	    <div id="invalid-pass-text" class="center"></div>
	    <img src="Images/error.jpg" id="error-image"></img>
	</div>
	
</div>
<div id="kiosk-scan"><p id="scanner">Scanner</p></div>
<div id="kiosk-ticket"><p id="ticket-slot">Biljettuttag</p></div>
</div>
</div>


<div id="prototype-description">
<h1>Hur man använder prototypen</h1>
<div class="text-center">
<p>Till vänster om biljettautomaten finns ett gäng besökare på på Gröna Lund.
Man byter besökare genom att klicka på dem. Tanken är att man ska kunna
sätta sig in i hur besökaren går tillväga för att använda sig av systemet.</p>
<h2>Bokningsprocessen - Steg för steg</h2>
<p class="bold">1. Scanna åkband</p> 
<p>Steg ett i bokningsprocessen är att man ska scanna av sitt åkband.
Det görs i prototypen genom att man klickar på scannern.
Startskämen består av en instruktion om vad man ska göra för att påbörja
bokningsprocessen och en bild som illustrerar hur man går tillväga för att scanna
av åkbandet. Scannar man av ett giltigt åkband kommer man vidare till steg två
i bokningsprocessen, har man ett ogiltigt åkband möts man av ett felmeddelande som
förklarar att åkbandet är ogiltigt.</p>
<p class="bold">2. Välj attraktion</p>
<p>Steg två i processen som är att välja attraktion. På skärmen får man se de attraktioner 
som finns tillgängliga för bokning och information om respektive attraktion. Man får se namn 
och bil på attraktionerna samt hur långa kötiderna är och hur lång man måste vara för att få åka.</p>
<p class="bold">3. Boka biljett</p>
<p>Det tredje steget i processen är biljettbokning. Man har valt en attraktion och får
välja om man vill boka en biljetten. På skärmen upprepas informationenen om attraktionen
som fanns med på den tidigare skärmen för att användaren inte ska behöva komma ihåg information
från skärm till skärm. Trycker man på nej-knappen kommer man tillbaka till steg två. Trycker man
på ja-knappen kommer man vidare till steg fyra.</p>
<p class="bold">4. Hämta biljett</p>
<p class="progress-step">Steg fyra är det sista steget och består av att att hämtar ut biljetten i biljettuttaget genom
att klicka på biljettuttaget. När man gjort det återgår biljettautomaten till sitt ursprungstillstånd</p>
<h2>Övriga funktioner</h2>
<p class="bold">Multibokning</p>
<p>Vanligtvis befinner man sig på ett nöjesfält i sällskap av andra. Därför är det naturligt att tillåta
fler personer att boka biljett samtidigt för att msinska tidsåtgången i bokningsprocessen. Biljettautomaten
meddelar vid valet av attraktion att man har möjlighet att scanna in fler personer. Väljer man en ny 
person och scannar in den kommer personen att scannas in och antalet personer kommer att att öka med ett.</p>
<p class="bold">Flera språk</p>
<p>Gröna Lund besöks av besökare från olika länder. För att göra biljettautomaten användbar för alla
behöver man stödja flera språk. I prototypen finns det stöd för Svenska och Engelska, vilka är de två
viktigaste språken för nöjesfältet. Man väljer språk genom att klicka på flaggan som korresponderar mot
det språk man vill ha och funktionaliteten finns tillgänglig under hela bokningsprocessen.</p>
<p>
<p class="bold">Stegvisare</p>
<p>Högst upp på biljettautomatens skärm finns en stegvisare som visar på vilket av stegen i
processen man befinner sig på. Syftet är att ge användaren en överblick över
bokningsprocessen och ge användaren en känsla av kontroll och trygghet</p>
<h2>Designmål</h2>
<p class="bold">Användarvänlig</p>
<p>Tanken är att system ska kunna användas av alla. För att uppnå det gäller det att biljetautomaterna
är enkla att använda. Processen består av fyra steg och två klick där varje skärm är försedd med tydliga
instruktioner och den information användaren behöver för att ta sig igenom processen.</p>
<p class="bold">Snabb process</p>
<p>Det är viktigt att processen är snabb för att undvika köbildning vid automaterna. För att uppnå det
har vi gjort processen kort och enkel. Funktioner som multibokning gör dessutom att bokningen av flera
personer går ännu snabbbare.</p>
<p class="bold">Tillgänglig för alla</p>
<p>Beslutet att använda stationära biljettautomater för bokning motiveras till stor del av idén att
alla ska kunna använda systemet. En smartphone-variant hade gjort att majoriteten av besökarna inte hade
kunnat utnyttja systemet. Det känns inte naturligt att införa ett nytt, avancerat och potentiellt dyrt
system som kräver att besökarna tar med sig dyra elektroniska apparater(smartphones) för att kunna 
använda sig av systemet.</p>
</div>
</div>


</div>
</div>
</body>
</html>