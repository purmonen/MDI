<div id="prototype-left">
    <h1>Prototyp</h1>
    <p>Den här prototypen visar upp hur biljettautomaten fungerar. Tanken
    med användargränssnittet är att det ska vara enkelt. Det ska finnas få
    saker som användaren behöver funder över eller kan göra fel. I normalfallet
    besöker man nöjesfältet i sällskap med andra och bokar åkattraktioner tillsammans.
    För att snabba upp processen finns stöd för multibokning.</p>
    <h2>Scenario</h2>
    <p>Föreställ dig att vi har ett gäng pojkar som besöker nöjesfältet. Hur ska
    de gå tillväga för att boka biljetter till olika åkattraktioner?</p>
    <p><span class="attribute">Namn:</span><select id="customers-list" onchange="changeCustomer()"></select></p>
    <p><span class="attribute">Biljett:</span> <span id="customer-ticket"></span></p>
</div>

<div id="prototype-right">
<div id="kiosk">
<div id="kiosk-screen">
    <p id="clock"></p>
    <div id="start" onclick="customer.start()">
        <h1 id="start-header"></h1>
        <p id="start-text"></p>
        <p class="center"><img src="Images/arm.jpg" alt="Picture of how to scan" height="200"></p>
    </div>

    <div id="attractions">
        <h1 id="attraction-header"></h1>
        <div id="insert-attractions"></div>
        <p class="button negative" onclick="customer.exit()"><span class="single">Avsluta</span></p>
    </div>

    <div id="confirm-ticket">
        <h1 id="confirm-ticket-header"></h1>
        <p id="confirm"></p>
        <p id="confirm-yes" class="button" onclick="customer.bookTicket()"><span class="single">Ja</span></p>
        <p id="confirm-no" class="button negative" onclick="customer.cancelBook()"><span class="single">Nej</span></p>       
    </div>

    <div id="show-ticket">
        <h1 id="show-ticket-header"></h1>
        <p id="show"></p>
        <p>Använd biljettuttaget.</p>
    </div>

    <div id="remove-ticket">
        <h1 id="remove-ticket-header"></h1>
        <p id="remove"></p>
        <p id="remove-no" class="button" onclick="customer.unbookTicket()"><span class="single">Ja</span></p>
        <p id="remove-yes" class="button negative" onclick="customer.cancelUnbook()"><span class="single">Nej</span></p>
    </div>

    <div id="customers"></div> 
</div>
<div id="kiosk-scan" onclick="customer.scan()"><p id="scanner">Scanner</p></div>
<div id="kiosk-ticket" onclick="customer.getTicket()"><p id="ticket-slot">Biljett</p></div>
</div>
</div>
<script>
prototypeMain();
document.onload = setInterval("ticketMachine.updateClock()", 1000);
</script>
