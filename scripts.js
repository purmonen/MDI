




//This function is called when the protoype page is loaded.
//It sets up the environment, creating a ticket machine and a group of customers.
function prototypeMain() {

    window.ticketMachine = new TicketMachine();
    ticketMachine.showStart();
    ticketMachine.setLanguage();
    
    window.customers = {
        'Sami': new Customer('Sami'),
        'Simon': new Customer('Simon'),
        'Henri': new Customer('Henri'),
        'Paul': new Customer('Paul'),
        'Mattias': new Customer('Mattias'),
        'Lukas': new Customer('Lukas')
    }
    
    //Loads the customers into the drop-down list
    var e = $('customers-list');
    for (var i in customers) {
        customers[i].useTicketMachine(ticketMachine);
        var option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        e.appendChild(option);
    }
    changeCustomer();
    ticketMachine.updateAttractions();
    ticketMachine.updateClock();
}

//Change the current customer
function changeCustomer() {
    customer = customers[$('customers-list').value];
    customer.updateScreen();
}

//Customer class - what you do when you click on something on the page
//is calling methods from this class.
function Customer(name) {
    this.name = name;
    this.ticket = null;
    this.ticketMachine = null;
    
    this.useTicketMachine = function(ticketMachine) {
        this.ticketMachine = ticketMachine;
    };
    
    this.scan = function() {
        this.ticketMachine.scan(this);
    };
    
    
    //Customer clicks on screen to start - ticketMachine shows attractions
    this.start = function() {
        this.ticketMachine.showAttractions();
    };
    
    //Customer clicks on an attraction - ticketMachine shows the confirm page
    this.selectAttraction = function(attraction) {
        this.ticketMachine.showConfirmPage(attraction);
    };
    
    //Customer decides to book a ticket - ticketMachine shows the ticket
    this.bookTicket = function() {
        this.ticketMachine.showTicket();
    };
    
    //Customer decides to cancel the book of a ticket
    this.cancelBook = function() {
        this.ticketMachine.showAttractions();
    };
    
    //Customer decides to unbook a ticket - ticketMachine shows the start page
    this.unbookTicket = function() {
        this.ticketMachine.showStart();
        this.ticket = null;
        this.updateScreen();
    };
    
    //Customer decides not to unbook - 
    this.cancelUnbook = function() {
        this.ticketMachine.cancelUnbook();
    };
    
    //Customer takes the ticket from the machine which can only be done
    //if the machine actually has one
    this.getTicket = function() {
        if (this.ticketMachine.hasTicket()) {
            this.ticketMachine.getTicket();
            this.updateScreen();
        }
    }
    
    //Does the customer have a ticket?
    this.hasTicket = function() {
        return this.ticket !== null;
    }   
    
    //Exit the use of the ticketMachine
    this.exit = function() {
        this.ticketMachine.reset();
    };
    
    //Update the Customer information visible on screen
    this.updateScreen = function() {
        if (this.hasTicket()) {
            $('customer-ticket').textContent = this.ticket.toString();
        } else {
            $('customer-ticket').textContent = 'Ingen';
        }
    };
}

//Ticket machine class
function TicketMachine() {
    //The id's of the pages that can be shown on the ticketMachine screen
    this.pages = [
        'start', 'attractions', 'confirm-ticket', 
        'remove-ticket', 'show-ticket'
    ];
                  
    //The attractions for which the ticketMachine can book you a ticket
    this.attractions = [
        new Attraction('Eclipse'),
        new Attraction('Fritt fall'),
        new Attraction('Insane'),
        new Attraction('Jetline'),
        new Attraction('Vilda musen')
    ];
                        
    //A list of customers currently using the ticketMachine
    this.customers = [];
    //Currently displayed page
    this.page = 'start';
    //When the ticket machine books tickets it keeps it for itself until the end
    this.ticket = null;

    
    this.language = languages['swedish'];


    //Displays the names of current customers on screen in the html-element that has id='customers'
    this.showCustomers = function() {
        var e = $('customers');
        e.textContent = '';
        var tm = this;
        for (var i in this.customers) {
            (function(i) {
                var p = document.createElement('p');
                p.className = 'customer';
                p.textContent = tm.customers[i].name;
                e.appendChild(p);
            })(i);
        }
    };
    
    //A customer can only be scanned once and only when the start page is visible
    this.scan = function(customer) {
        if (this.page !== 'start' || contains(this.customers, customer)) {
            return;
        }
        this.addCustomer(customer);
        if (customer.hasTicket()) {
            this.show('remove-ticket');
            $('remove').textContent = 'Du har redan bokat en biljett. Vill du avboka: ' + 
                                      customer.ticket.toString() + '?';
        }
    };
    
    //Adds a customer to the list of customers currently using the machine
    this.addCustomer = function(customer) {
        this.customers.push(customer);
        this.showCustomers();
    };
    
    //Removes a customer from the list of customers currently using the machine
    this.removeCustomer = function(customer) {
        //If ticket is booked, you can't remove yourself
        if (this.page === 'show-ticket') {
            return;
        }
        this.customers.splice(customer, 1);
        this.showCustomers();
        if (this.customers.length === 0) {
            this.reset();   
        }
    };
    
    //If a customer decides to cancel an unbook, he is removed and 
    //the start page is shown
    this.cancelUnbook = function() {
        this.customers.pop();
        this.showStart();
    };
    
    //A couple of 'show page' functions
    this.showStart = function() {

        this.showCustomers();
        this.show('start');
    };
    
    this.showAttractions = function() {
        if (this.customers.length > 0) { //If no customer use the machine it won't proceed
            this.show('attractions');
        }
    };
    
    //Creates the ticket that might be booked for display
    this.showConfirmPage = function(attraction) {
        this.ticket = new Ticket(this.attractions[attraction]);
        this.show('confirm-ticket');
        $('confirm').textContent = 'Vill du boka ' + this.ticket.toString(this.customers.length) + '?';
    };

    this.showTicket = function() {
        this.show('show-ticket');
        $('show').textContent = 'Du har bokat ' + this.ticket.toString(this.customers.length) + '.';
    };
    
    this.hasTicket = function() {
        return this.ticket !== null && this.page === 'show-ticket';
    };
    
    //Gives away a ticket to all customers currently using the machine
    //and then resets.
    this.getTicket = function() {
        for (i in this.customers) {
            this.customers[i].ticket = this.ticket;
        }
        this.reset();
    };
    
    //Shows the page on it's screen
    this.show = function(page) {
        this.page = page;
        for (var i in this.pages) {
            var e = $(this.pages[i]);
            if (this.pages[i] === page) {
                e.style.display = 'block';
            } else {
                e.style.display = 'none';
            }
        }
    };
    
    this.setLanguage = function() {
        var text = [
            'start-header', 'start-text', 'attraction-header',
            'confirm-ticket-header', 'show-ticket-header',
            'remove-ticket-header'
        ];
        
        for (var i = 0; i < text.length; i++) {
            this.output(text[i]);
        }
    };

    //Updates the attractions on screen since the queueing times changes
    this.updateAttractions = function() {
        var e = $('insert-attractions');
        e.textContent = '';
        var tm = this;
        for (var i = 0; i < tm.attractions.length; i++) {
            (function(i) {
                var p = document.createElement('p');
                p.className = 'button';
                p.onclick = function() { customer.selectAttraction(i); };
                p.textContent = tm.attractions[i].toString()
                e.appendChild(p);
            })(i);
        }
    }
    
    //Updates the clock on the ticketMachine screen 
    this.updateClock = function() {
        var date = new Date();
        $('clock').textContent = timePad(date.getHours()) + ':' + timePad(date.getMinutes());
    
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
    };

    //Exits the ticketMachine
    this.reset = function() {
        this.ticket = null;
        this.customers = new Array();
        this.showStart();
    };
    
    this.output = function(id) {
        $(id).textContent = this.language[id];
    };
}

var englishDictionary = {
    'start-header': 'Welcome',
    'start-text': 'Scan your band and click on the screen to proceed.',
    'attraction-header': 'Pick attraction',
    'confirm-ticket-header': 'Confirm',
    'ask-book': 'Do you want to book ',
    'ask-unbook': 'You have already booked one ticket. Do you wish to unbook ',
    'ticket': 'ticket',
    'tickets': 'tickets',
    'yes': 'Yes',
    'no': 'No',
    'exit': 'Exit',
    'show-ticket-header': 'Tickets',
    'remove-ticket-header': 'Unbook'
};

var swedishDictionary = {
    'start-header': 'Välkommen',
    'start-text': 'Scanna av ditt åkband med scannern nedanför och klicka på skärmen för att fortsätta.',
    'attraction-header': 'Välj attraktion',
    'confirm-ticket-header': 'Bekräfta',
    'ask-book': 'Vill du boka ',
    'ask-unbook': 'Du har redan bokat en biljett. Vill du avboka ',
    'ticket': 'biljett',
    'tickets': 'biljetter',
    'yes': 'Ja',
    'no': 'Nej',
    'exit': 'Avsluta',
    'show-ticket-header': 'Biljetter',
    'remove-ticket-header': 'Avboka'
};


//Handle languages
languages = {
    'english': englishDictionary,
    'swedish': swedishDictionary
};

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
    };
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


//returns element by id
function $(id) {
    return document.getElementById(id);
}

function $c(c) {
    return document.getElementByClass(c);
}

//pads time so that 1:1 -> 01:01
function timePad(time) {
    if (time < 10) {
        return "0" + time;
    }
    return time;
}

//checks if array contains data
function contains(array, data) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === data) {
            return true;
        }
    }
    return false;
}

//Selects a link from the navigation menu
function selectLink(id) {
    $(id + '-link').className = 'selected';
}