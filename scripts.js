//This function is called when the protoype page is loaded.
//It sets up the environment, creating a ticket machine and a group of customers.
function prototypeMain() {
    ticketMachine = new TicketMachine();
    ticketMachine.show('start');
    
    customers = new Array();
    customers['Sami'] = new Customer('Sami');
    customers['Simon'] = new Customer('Simon');
    customers['Henri'] = new Customer('Henri');
    customers['Paul'] = new Customer('Paul');
    customers['Mattias'] = new Customer('Mattias');
    customers['Lukas'] = new Customer('Lukas');
    
    
    //Loads the customers into the drop-down list
    e = $('customers-list');
    for (i in customers) {
        customers[i].useTicketMachine(ticketMachine);
        e.innerHTML += '<option value="' + i + '">' + i + '</option>';
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
    }
    
    this.scan = function() {
        this.ticketMachine.scan(this);
    }
    
    
    //Customer clicks on screen to start - ticketMachine shows attractions
    this.start = function() {
        this.ticketMachine.showAttractions();
    }
    
    //Customer clicks on an attraction - ticketMachine shows the confirm page
    this.selectAttraction = function(attraction) {
        this.ticketMachine.showConfirmPage(attraction);
    }
    
    //Customer decides to book a ticket - ticketMachine shows the ticket
    this.bookTicket = function() {
        this.ticketMachine.showTicket();
    }
    
    //Customer decides to cancel the book of a ticket
    this.cancelBook = function() {
        this.ticketMachine.showAttractions();
    }
    
    //Customer decides to unbook a ticket - ticketMachine shows the start page
    this.unbookTicket = function() {
        this.ticketMachine.showStart();
        this.ticket = null;
        this.updateScreen();
    }
    
    //Customer decides not to unbook - 
    this.cancelUnbook = function() {
        this.ticketMachine.cancelUnbook();
    }
    
    //Customer takes the ticket from the machine which can only be done
    //if the machine actually has one
    this.getTicket = function() {
        if (ticketMachine.hasTicket()) {
            ticketMachine.getTicket();
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
    }
    
    //Update the Customer information visible on screen
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
    //The id's of the pages that can be shown on the ticketMachine screen
    this.pages = ['start', 'attractions', 'confirm-ticket', 
                  'remove-ticket', 'show-ticket'];
                  
    //The attractions for which the ticketMachine can book you a ticket
    this.attractions = [new Attraction('Eclipse'),
                        new Attraction('Fritt fall'),
                        new Attraction('Insane'),
                        new Attraction('Jetline'),
                        new Attraction('Vilda musen')];
                        
    //A list of customers currently using the ticketMachine
    this.customers = new Array();
    //Currently displayed page
    this.page = 'start';
    //When the ticket machine books tickets it keeps it for itself until the end
    this.ticket = null;

    //Displays the names of current customers on screen in the html-element that has id='customers'
    this.showCustomers = function() {
        var e = $('customers');
        e.innerHTML = '';
        for (i in this.customers) {
            e.innerHTML += '<p class="customer negative" onclick="ticketMachine.removeCustomer(' + i + ')">' 
                         + this.customers[i].name + '</p>';
        }
    }
    
    //A customer can only be scanned once and only when the start page is visible
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
    
    //Adds a customer to the list of customers currently using the machine
    this.addCustomer = function(customer) {
        this.customers.push(customer);
        this.showCustomers();
    }
    
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
    }
    
    //If a customer decides to cancel an unbook, he is removed and 
    //the start page is shown
    this.cancelUnbook = function() {
        this.customers.pop();
        this.showStart();
    }
    
    //A couple of 'show page' functions
    this.showStart = function() {
        this.showCustomers();
        this.show('start');
    }
    
    this.showAttractions = function() {
        if (this.customers.length > 0) { //If no customer use the machine it won't proceed
            this.show('attractions');
        }
    }
    
    //Creates the ticket that might be booked for display
    this.showConfirmPage = function(attraction) {
        this.ticket = new Ticket(ticketMachine.attractions[attraction]);
        this.show('confirm-ticket');
        $('confirm').innerHTML = 'Vill du boka ' + this.ticket.toString(this.customers.length) + '?';
    }

    this.showTicket = function() {
        this.show('show-ticket');
        $('show').innerHTML = 'Du har bokat ' + this.ticket.toString(this.customers.length) + '.';
    }
    
    this.hasTicket = function() {
        return this.ticket !== null && this.page === 'show-ticket';
    }
    
    //Gives away a ticket to all customers currently using the machine
    //and then resets.
    this.getTicket = function() {
        for (i in this.customers) {
            this.customers[i].ticket = this.ticket;
        }
        this.reset()
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

    //Updates the attractions on screen since the queueing times changes
    this.updateAttractions = function() {
        var e = $('insert-attractions');
        e.innerHTML = '';
        for (index in ticketMachine.attractions) {
             e.innerHTML += '<p class="button" onclick="customer.selectAttraction(' + index + ')">' + 
                            ticketMachine.attractions[index].toString() + '</p>'; 
        }
    }
    
    //Updates the clock on the ticketMachine screen 
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

    //Exits the ticketMachine
    this.reset = function() {
        this.ticket = null;
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


//returns element by id
function $(id) {
    return document.getElementById(id);
}

//pads time so that 1:1 -> 01:01
function timePad(time) {
    return (time < 10) ? "0" + time : time;
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

//Selects a link from the navigation menu
function selectLink(id) {
    $(id + '-link').className = 'selected';
}