"use strict";

//This function is called when the protoype page is loaded.
//It sets up the environment, creating a ticket machine and a group of customers.
window.onload = function() {

    window.ticketMachine = new TicketMachine();
    ticketMachine.showStart();
    ticketMachine.setLanguage('swedish');

    window.customers = {
        'Sami': new Customer('Sami'),
        'Simon': new Customer('Simon'),
        'Henri': new Customer('Henri'),
        'Paul': new Customer('Paul'),
        'Mattias': new Customer('Mattias'),
        'Lukas': new Customer('Lukas')
    };

    window.customer = null;

    //Loads the customers into the drop-down list
    var e = $('customers-list');
    for (var name in customers) {
        customers[name].useTicketMachine(ticketMachine);
        var option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        e.appendChild(option);
    }
    changeCustomer();
    ticketMachine.updateAttractions();
    ticketMachine.updateClock();

	setInterval("ticketMachine.updateClock()", 1000);
}

//Change the current customer
function changeCustomer() {
    customer = window.customers[$('customers-list').value];
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
    
    this.setLanguage = function(language) {
        if (this.ticket) {
        	this.ticket.language = window.languages[language]
        }
        this.ticketMachine.setLanguage(language);
        this.updateScreen();
    }


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
    };

    //Exit the use of the ticketMachine
    this.exit = function() {
        this.ticketMachine.reset();
    };

    //Update the Customer information visible on screen
    this.updateScreen = function() {
        $('customer-ticket').textContent = (this.ticket ? this.ticket.toString(1) : 'Ingen');
    };
}

//Ticket machine class
function TicketMachine() {
    //The id's of the pages that can be shown on the ticket machine screen
    this.pages = [
        'start', 'attractions', 'confirm-ticket', 
        'remove-ticket', 'show-ticket'
    ];

    //The attractions for which the ticket machine can book you a ticket
    this.attractions = [
        new Attraction('Eclipse'),
        new Attraction('Fritt fall'),
        new Attraction('Insane'),
        new Attraction('Jetline'),
        new Attraction('Vilda musen')
    ];

    //A list of customers currently using the ticket machine
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
        this.customers.forEach(function(c) {
            var p = document.createElement('p');
            p.className = 'customer';
            p.textContent = c.name;
            e.appendChild(p);
        });
    };

    //A customer can only be scanned once and only when the start page is visible
    this.scan = function(customer) {
        if (this.page !== 'start' || contains(this.customers, customer)) {
            return;
        }
        this.addCustomer(customer);
        if (customer.ticket) {
            this.show('remove-ticket');
            this.updateRemoveTicketText();
        }
    };
    
    this.updateRemoveTicketText = function() {
        $('remove').textContent = this.language['ask-unbook'] + ' ' +
                                   customer.ticket.toString(1) + '?';
    }

    //Adds a customer to the list of customers currently using the machine
    this.addCustomer = function(customer) {
        this.customers.push(customer);
        this.showCustomers();
    };

    //Removes a customer from the list of customers currently using the machine
    this.removeCustomer = function(index) {
        //If ticket is booked, you can't remove yourself
        if (this.page === 'show-ticket') {
            return;
        }
        this.customers.splice(index, 1);
        this.showCustomers();
        if (!this.customers.length) {
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
        if (!this.customers.length) {
            // If no customer uses the machine, don't proceed.
            return;
        }
        this.show('attractions');
    };

    //Creates the ticket that might be booked for display
    this.showConfirmPage = function(attraction) {
        this.ticket = new Ticket(this.attractions[attraction], this.language);
        this.show('confirm-ticket');
        this.updateConfirmPage();
    };
    
    this.updateConfirmPage = function() {
        $('confirm').textContent = this.language['ask-book'] + ' ' + this.ticket.toString(this.customers.length) + '?';
    }

    this.showTicket = function() {
        this.show('show-ticket');
        $('show').textContent = 'Du har bokat ' + this.ticket.toString(this.customers.length) + '.';
    };
    
    this.updateShowTicketPage = function() {
		$('show').textContent = this.language['you-have-booked'] + ' ' + this.ticket.toString(this.customers.length);
    };

    this.hasTicket = function() {
        return this.ticket !== null && this.page === 'show-ticket';
    };

    //Gives away a ticket to all customers currently using the machine
    //and then resets.
    this.getTicket = function() {
        var self = this;
        this.customers.forEach(function(c) {
            c.ticket = self.ticket;
        });
        this.reset();
    };

    //Shows the page on it's screen
    this.show = function(page) {
        this.page = page;
        this.pages.forEach(function(p) {
            var e = $(p);
            e.style.display = (p === page ? 'block' : 'none');
        });
    };

    // Updates the attractions on screen since the queueing times changes
    this.updateAttractions = function() {
        var e = $('insert-attractions');
        e.textContent = '';
        var tm = this;
        this.attractions.forEach(function(a, i) {
            var p = document.createElement('p');
            p.className = 'button';
            p.onclick = function() { window.customer.selectAttraction(i); };
            p.textContent = tm.attractions[i].toString()
            e.appendChild(p);
        });
    };

    // Updates the clock on the ticket machine screen 
    this.updateClock = function() {
        var date = new Date();
        $('clock').textContent = timePad(date.getHours()) + ':' + timePad(date.getMinutes());

        // Update queue times
        if (date.getSeconds() % 8 === 0) {   
            this.attractions.forEach(function(a) {
                if (Math.random() * 2 >= 1)
                    ++a.queueTime;
                if (a.queueTime > 0 && Math.random() * 2 >= 1)
                    --a.queueTime;
            });
            this.updateAttractions();
        }
    };

    //Exits the ticket machine
    this.reset = function() {
        this.ticket = null;
        this.customers = new Array();
        this.showStart();
    };

    this.setLanguage = function(language) {
        this.language = languages[language];
        var text = [
            'start-header', 'start-text', 'attraction-header',
            'confirm-ticket-header', 'show-ticket-header',
            'remove-ticket-header', 'exit', 'remove-yes',
            'remove-no', 'confirm-yes', 'confirm-no', 'take-ticket'
        ];
        
        for (var i = 0; i < text.length; i++) {
	        $(text[i]).textContent = this.language[text[i]];
        }
        
        if (this.ticket) {
            this.ticket.language = this.language;
			this.updateConfirmPage();
			this.updateShowTicketPage();
        }
        if (this.page === 'remove-ticket') {
			this.updateRemoveTicketText();
		}
    };
}

var englishDictionary = {
    'start-header': 'Welcome',
    'start-text': 'Scan one or more bands with the scanner below, and click on the screen to proceed.',
    'attraction-header': 'Pick attraction',
    'ticket-text': 'one ticket to %1 valid from %2 to %3',
    'tickets-text': '%1 tickets to %2 valid from %3 to %4',
    'confirm-ticket-header': 'Confirm',
    'ask-book': 'Do you want to book ',
    'ask-unbook': 'You have already booked one ticket. Do you wish to unbook:',
    'you-have-booked': 'You have booked',
    'exit': 'Exit',
    'show-ticket-header': 'Tickets',
    'remove-ticket-header': 'Unbook',
    'remove-yes': 'Yes',
    'remove-no': 'No',
    'confirm-yes': 'Yes',
    'confirm-no': 'No',
    'take-ticket': 'Take your tickets.',
    'none': 'none'
};

var swedishDictionary = {
    'start-header': 'Välkommen',
    'start-text': 'Scanna av ett eller flera åkband med scannern nedanför och klicka på skärmen för att fortsätta.',
    'attraction-header': 'Välj attraktion',
    'confirm-ticket-header': 'Bekräfta',
    'ticket-text': 'en biljett till %1 giltig mellan %2 och %3',
    'tickets-text': '%1 biljetter till %2 giltiga mellan %3 och %4',
    'ask-book': 'Vill du boka ',
    'ask-unbook': 'Du har redan bokat en biljett. Vill du avboka:',
    'you-have-booked': 'Du har bokat',
    'exit': 'Avsluta',
    'show-ticket-header': 'Biljetter',
    'remove-ticket-header': 'Avboka',
    'remove-yes': 'Ja',
    'remove-no': 'Nej',
    'confirm-yes': 'Ja',
    'confirm-no': 'Nej',
    'take-ticket': 'Ta dina biljetter.',
    'none': 'ingen'
};

//Handle languages
window.languages = {
    'english': englishDictionary,
    'swedish': swedishDictionary
};

//Ticket class
function Ticket(attraction, language) {
    this.attraction = attraction;
    var date = new Date();
    date.setMinutes(date.getMinutes() + attraction.queueTime);
    this.startTime = timePad(date.getHours()) + ':' + timePad(date.getMinutes());
    this.endTime = timePad(date.getHours() + 1) + ':' + timePad(date.getMinutes());
    this.language = language;
    
    this.toString = function(num) {
        if (num > 1) {
            return this.language['tickets-text'].
            replace('%1', num).
            replace('%2', this.attraction.name).
            replace('%3', this.startTime).
            replace('%4', this.endTime);
        }
        return this.language['ticket-text'].
        replace('%1', this.attraction.name).
        replace('%2', this.startTime).
        replace('%3', this.endTime);
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
