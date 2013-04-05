<!doctype html>
<html>
<head>
    <title>MDI</title>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="/Stylesheets/style.css">
    <link rel="stylesheet" type="text/css" href="/Stylesheets/report.css">
    <script src="/Scripts/scripts.js"></script>
</head>
<body>
<div id="wrap">
<?php require_once 'header.php'; ?>
<div id="content">
<div id="report-main">
<h1>Problem</h1>
<p>
Gröna Lund har som många andra nöjesparker ett traditionellt kösystem. 
En besökare väljer åkattraktion för att sedan ställa sig i den kö som
åkattraktionen avser. Efter en tid som beror på åkattraktionens popularitet
samt vilken dag på året det är får besökaren åka åkattraktionen en gång. 

Några problem som dyker upp vid en längre kötid följer, men vad som defineras 
som en längre kötid är inviduellt. Vi väljer att definera att efter ca 
15 minuters väntetid kan det betraktas som en lång kö.
</p>

<ul>
<li>Det är trångt och man knuffas omkring.</li>
<li>Det är jobbigt att stå i kö där det inte finns tak och solen ligger på 
en varm sommardag.</li>
<li>Det går inte att lämna sin plats för att göra ett snabbt ärende som att 
gå på toaletten för att sedan återvända till sin ursprungliga plats.</li>
</ul>

<p>
Frågan vi ställer oss är om det går att med dagens teknik lösa det 
traditionella kösystemet med ett annat datoriserat system?
</p>

<h2>Fastpass</h2>
<p>
Problemet som behöver lösas med det traditionella kösystemet är att få besökare
att vara i en kö utan att fysiskt stå i en kö. Detta har vi valt att kalla en
virtuell kö, dvs en kö som ett datorsystem hanterar. Det innebär att besökare
kan fritt röra sig i området utan att behöva ta del av nämnda problem som dyker
upp när man står i en lång kö. Det är inte alltid Fastpass behövs utan det är 
endast när det är som mest besökare eller när någon åkattraktion överstiger 
vad vi definerade som lång kötid. Det är också svårt att implementera ny teknik 
utan det måste alltid ske stegvis. Det kommer därför alltid finnas två kösystem 
(en fysisk och en virtuell) som samverkar när Fastpass är i bruk. För att det 
inte ska bli ojämnt kommer Fastpass alltid tilldelas en kvot till varje populär 
åkattraktion.
<p>

<h2>Tekniken</h2>
<p>
Datorsystemet har ett användargränssnitt mot användaren genom flera stationära 
stationer med en pekskärm. De som kan använda tjänsten måste köpa ett speciellt 
åkband eftersom det är åkbandet som identifierar besökaren i datorsystemet.
</p>

<p>
I åkbandet finns RFID-teknik, samma teknik som används i SL access kort som gör att 
besökaren kan scanna sitt åkband mot en stationär station som identifikation där 
varje åkband har ett unikt id. Detta åkband används också senare vid varje åkattraktion 
för att identifiera vem som ska få åka vid en viss tid.
För att stationerna ska ockuperas lite som möjligt kommer det även finnas en stor 
digital anslagstavla som anger nuvarande kötider för populära åkattraktioner. Tanken är 
att man vet vad man vill boka när man går till automaten så det inte blir en köbildning. 
Vi tror att varje bokning kan göras på under en minut från det att besökaren scannar in 
sitt åkband och förutsatt att besökaren vet vad han/hon vill åka.
</p>

<h2>Hur det går till att boka en tid, steg för steg</h2>
<p>
Besökaren får en överblick för vilka kötider som gäller för de populäraste 
åkattraktionerna genom en stor digital tavla som är placerad över stationerna. 
Besökaren bestämmer sig för en av åkattraktionerna och gå till en station. 
Stationen har ett enkelt och tydligt användargränssnitt som visar en bild på 
en hand som scannar sitt åkband. Besökaren gör som bilden antyder. Stationen 
ger feedback till besökaren när denne är inscannad och ger möjlighet till att 
scanna in fler besökare för samma bokning. Besökaren är ensam och fortsätter 
till nästa steg. Besökaren får nu välja den åkattraktion med hjälp av bilder 
och namn som han/hon vill åka. Besökaren väljer en av åkattraktionerna. Stationen 
anger en ungeförlig tid som besökaren kan åka åkattraktionen. Samtidigt skriver 
automaten ut ett kvitto med samma information som besökaren kan ta med sig.
Besökaren rör sig nu fritt i området tills det är dags att åka åkattraktionen. 
Exempelvis går besökaren och äter. Vid utsatt tid går besökaren till den 
valda åkattraktionen och scannar sitt åkband för att sedan passera spärren och 
få känslan av att åka åkattraktionen utan att stå i en kö.
</p>

<h2>Problem med Fastpass</h2>
<p>
Det största problemet med Fastpass är hur man ska boka flera biljetter samtidigt. 
När Fastpass byggs måste man tänka på hur det ska fungera när en småbarnsfamilj 
ska boka biljetter - ska alla behöva boka en egen biljett eller ska det gå att boka 
flera biljetter på ett Fastpass? Eftersom Fastpass ska vara lätt för alla att använda  är det viktigt att lösningen är simpel. 
</p>

<p>
Respektive person scannar in sitt åkband alla hamnar under samma bokning.
Köpa ett grupp-Fastpass (denna mer inriktad för småbarnsfamiljer).
</p>

<p>
Problemet med grupp-Fastpass är att alla personer bokas upp till köer, 
och även om man implementerar en lösning till det (innebär att man kan 
ta bort individuella personer från bokningslistan) betyder detta att 
hela familjen alltid behöver vara tillsammans - barn X med pappa kan 
inte åka en attraktion samtidigt som barn Y åker en annan med mamma.
Detta problem är lite svårt att lösa men på grund av de problem som 
kan uppstå vid ett grupp-Fastpass är det effektivare att alla scannar 
sitt egen Fastpass innan bokningarna sker - på detta sätt slipper man 
problemen som uppstår när en familjemedlem måste på toaletten eller liknande.
</p>

<p>
Ett annat problem som togs upp tidigare är att undvika längre kötider vid 
Fastpass-stationerna av folk som är osäkra och bara ska kolla på kötiderna. 
Det är då tänkt att en större digital display ska visa information om tiderna 
(på samma sätt som SJ visar information om tågtider) för de populäraste åkattraktionerna. 
På detta sätt hoppas vi inte att det bildas några köer vid stationerna.
</p>

<h2>Målgruppen</h2>
<p>
Den specificerade målgruppen är inriktad till alla turister som reser till Gröna Lund - 
med extra fokus på svenska turister. Anledningen att idén är mer inriktad till svenskar 
är på grund av att det är mycket fler turister som kommer från andra delar av sverige 
till Gröna Lund än utifrån landet. Fastpass är riktat mot ungdomar och medelåldriga 
personer; det viktiga är att personerna ska är bekväma med pekskärmsinriktade system 
och användargränssnitt. Det läggs en stor tyngd på att användargränssnittet ska vara 
enkelt med lite text och istället använda bilder för att det ska gå snabbt och att 
köbildningen ska hållas till ett minimum.
</p>
</div>

</div>
</div>
</body>
</html>