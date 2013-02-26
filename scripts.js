function simulateTicketMachine() {
    ticketMachine = new TicketMachine();
    ticketMachine.show('start');
    
    customers = new Array();
    customers['Sami'] = new Customer('Sami');
    customers['Simon'] = new Customer('Simon');
    customers['Henri'] = new Customer('Henri');
    customers['Paul'] = new Customer('Paul');
    customers['Mattias'] = new Customer('Mattias');
    customers['Lukas'] = new Customer('Lukas');
    
    e = $('customers-list');
    for (i in customers) {
        customers[i].useTicketMachine(ticketMachine);
        e.innerHTML += '<option value="' + i + '">' + i + '</option>';
    }
    changeCustomer();
    ticketMachine.updateAttractions();
    ticketMachine.updateClock();
}

function changeCustomer() {
    customer = customers[$('customers-list').value];
    customer.updateScreen();
}

//Customer class
function Customer(name) {
    this.name = name;
    this.ticket = null;
    this.ticketMachine = null;
    
    this.useTicketMachine = function(ticketMachine) {
        this.ticketMachine = ticketMachine;
    }
    
    this.scan = function() {
        this.ticketMachine.scan(this);
    }
    
    this.start = function() {
        this.ticketMachine.showAttractions();
    }
    
    this.selectAttraction = function(attraction) {
        this.ticketMachine.showConfirmPage(attraction);
    }
    
    this.bookTicket = function() {
        this.ticketMachine.showTicket();
    }
    
    this.unbookTicket = function() {
        this.ticketMachine.showStart();
        this.ticket = null;
        this.updateScreen();
    }
    
    this.cancelUnbook = function() {
        this.ticketMachine.cancelUnbook();
    }
    
    this.cancelBook = function() {
        this.ticketMachine.showAttractions();
    }
    
    this.getTicket = function() {
        if (ticketMachine.hasTicket()) {
            ticketMachine.getTicket();
            this.updateScreen();
        }
    }
    
    this.hasTicket = function() {
        return this.ticket !== null;
    }   
    
    this.exit = function() {
        this.ticketMachine.exit();
    }
    
    this.updateScreen = function() {
        if (this.hasTicket()) {
            $('customer-ticket').innerHTML = this.ticket.toString();
        } else {
            $('customer-ticket').innerHTML = 'Ingen';
        }
    }
}

//Ticket machine class
function TicketMachine() {
    //The id's of the pages that can be shown on the ticket machine screen
    this.pages = ['start', 'attractions', 'confirm-ticket', 
                  'remove-ticket', 'show-ticket'];
    //The attractions for which the ticket machine can book a ticket
    this.attractions = [new Attraction('Eclipse'),
                        new Attraction('Fritt fall'),
                        new Attraction('Insane'),
                        new Attraction('Jetline'),
                        new Attraction('Vilda musen')];
    this.customers = new Array();
    this.page = 'start';
    this.ticket = null;
    
    this.showCustomers = function() {
        var e = $('customers');
        e.innerHTML = '';
        for (i in this.customers) {
            e.innerHTML += '<p class="customer negative" onclick="ticketMachine.removeCustomer(' + i + ')">' 
                         + this.customers[i].name + '</p>';
        }
    }
    
    this.scan = function(customer) {
        if (this.page !== 'start' || contains(this.customers, customer)) {
            return;
        }
        this.addCustomer(customer);
        if (customer.hasTicket()) {
            this.show('remove-ticket');
            $('remove').innerHTML = 'Du har redan bokat en biljett. Vill du avboka: ' + 
                                    customer.ticket.toString() + '?';
        }
    }
    
    this.addCustomer = function(customer) {
        assertNotEquals(null, customer);
        this.customers.push(customer);
        this.showCustomers();
    }
    
    this.removeCustomer = function(customer) {
        assertNotEquals(null, customer);
        //If ticket is booked, you can't remove yourself
        if (this.page === 'show-ticket') {
            return;
        }
        this.customers = remove(this.customers, customer);
        this.showCustomers();
        if (this.customers.length === 0) {
            this.exit();   
        }
    }
    
    this.cancelUnbook = function() {
        this.customers.pop();
        this.showStart();
    }
    
    this.showStart = function() {
        this.showCustomers();
        this.show('start');
    }
    
    this.showAttractions = function() {
        if (this.customers.length > 0) {
            this.show('attractions');
        }
    }
    
    this.showConfirmPage = function(attraction) {
        this.ticket = new Ticket(ticketMachine.attractions[attraction]);
        this.show('confirm-ticket');
        $('confirm').innerHTML = 'Vill du boka ' + this.ticket.toString(this.customers.length) + '?';
    }
    
    this.showTicket = function() {
        this.show('show-ticket');
        $('show').innerHTML = 'Du har bokat ' + this.ticket.toString(this.customers.length);
    }

    this.hasTicket = function() {
        return this.ticket !== null && this.page === 'show-ticket';
    }
    
    this.getTicket = function() {
        for (i in this.customers) {
            this.customers[i].ticket = this.ticket;
        }
        this.ticket = null;
        this.customers = new Array();
        this.showStart();
    }
    
    //Shows the page on it's screen
    this.show = function(page) {
        this.page = page;
        for (i in this.pages) {
            var e = $(this.pages[i]);
            if (this.pages[i] === page) {
                e.style.display = 'block';
            } else {
                e.style.display = 'none';
            }
        }
    }

    this.updateAttractions = function() {
        var e = $('insert-attractions');
        e.innerHTML = '';
        for (index in ticketMachine.attractions) {
             e.innerHTML += '<p class="button" onclick="customer.selectAttraction(' + index + ')">' + 
                            ticketMachine.attractions[index].toString() + '</p>'; 
        }
    }
    
    this.updateClock = function() {
        var date = new Date();
        $('clock').innerHTML = timePad(date.getHours()) + ':' + timePad(date.getMinutes());
    
        //Update queue times
        if (date.getSeconds() % 8 === 0) {   
            for (i in ticketMachine.attractions) {
                var attraction = this.attractions[i];
                attraction.queueTime += Math.round(Math.random())
                if (attraction.queueTime > 0) {
                    this.attractions[i].queueTime -= Math.round(Math.random())
                }
            }
            this.updateAttractions();
        }
    }

    this.exit = function() {
        this.customers = new Array();
        this.showStart();
    }
}

//Ticket class
function Ticket(attraction) {
    this.attraction = attraction;
    var date = new Date();
    date.setMinutes(date.getMinutes() + attraction.queueTime);
    this.startTime = timePad(date.getHours()) + ':' + timePad(date.getMinutes());
    this.endTime = timePad(date.getHours() + 1) + ':' + timePad(date.getMinutes());

    this.toString = function(num) {
        if (num === 1 || typeof(num) === 'undefined') {
            return 'en biljett till ' + this.attraction.name + ' giltig från ' + 
                   this.startTime + ' till ' + this.endTime;
        }
        
        return num + 'st biljetter till ' + this.attraction.name + ' giltiga från ' + 
               this.startTime + ' till ' + this.endTime;
    }
}

//Attraction class
function Attraction(name) {
    this.name = name;
    //Generates a random queue time between 15 and 75
    this.queueTime = Math.round(15 + Math.random() * 60);
    
    this.toString = function() {
        return this.name + ' ' + this.queueTime + 'min';
    }
    
    
}






//--------------------------------------------------------------------------------




//Some useful stuff
function assertEquals(x, y) {
    if (x !== y) {
        var errorStack = (new Error).stack.split(":");
        var line = errorStack[errorStack.length-1];
        $('assert').innerHTML += '<p>Line  ' + line + ': ' + x + ' was not equal to ' + y + '</p>';
    }
}

function assertNotEquals(x, y) {
    if (x === y) {
        var errorStack = (new Error).stack.split(":");
        var line = errorStack[errorStack.length-1];
        $('assert').innerHTML += '<p>Line  ' + line + ': ' + x + ' was not equal to ' + y + '</p>';
    }
}

function test() {
    t = new TicketMachine();
    c1 = new Customer();
    c2 = new Customer();
    c1.useTicketMachine(t);
    assertEquals(false, c1.hasTicket());

    c1.selectAttraction(0);
    c1.bookTicket();
    assertEquals(true, c1.hasTicket());
    c1.unbookTicket();
    c1.assertEquals(false, c1.hasTicket());
}

//returns element by id
function $(id) {
    return document.getElementById(id);
}

function timePad(time) {
    return (time < 10) ? "0" + time : time;
}

//removes element at index from array
function remove(array, index) {
    var newArray = new Array();
    for (i in array) {
        if (i != index) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}

//checks if array contains data
function contains(array, data) {
    for (i = 0; i < array.length; i++) {
        if (array[i] === data) {
            return true;
        }
    }
    return false;
}

function selectLink(id) {
    $(id + '-link').className = 'selected';
}