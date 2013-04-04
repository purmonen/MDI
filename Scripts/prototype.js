/*jslint browser:true */

(function () {
    'use strict';

    var customers, customer, languages, ticketMachine;

    //Handle languages
    languages = {};

    languages.english = {
        'start-header': 'Welcome',
        'start-text': 'Scan your wristband according to the image',
        'attractions-header': 'Pick attraction',
        'ticket-text': 'one ticket to %1 valid from %2 to %3',
        'tickets-text': '%1 tickets to %2 valid from %3 to %4',
        'confirm-ticket-header': 'Confirm',
        'ask-book': 'Do you want to book',
        'ask-unbook': 'Do you wish to unbook?',
        'you-have-booked': 'You have booked',
        'exit': 'Exit',
        'show-ticket-header': 'Tickets',
        'remove-ticket-header': 'Unbook',
        'remove-yes': 'Yes',
        'remove-no': 'No',
        'confirm-yes': 'Yes',
        'confirm-no': 'No',
        'take-ticket': 'Use the ticket slot.',
        'none': 'none',
        'attractions-text': 'You may also scan in more persons',
        'start-progress': '1. Scan wristband',
        'attractions-progress': '2. Pick attractions',
        'confirm-ticket-progress': '3. Book ticket',
        'show-ticket-progress': '4. Take ticket',
        'visitors': 'Number of persons: ',
        'name': 'Name: ',
        'time': 'Quetime: ',
        'height': 'Min height: ',
        'invalid-pass-header': 'Invalid',
        'invalid-pass-text': 'This pass has expired. It was: ',
        'valid-through': 'Valid until '
    };

    languages.swedish = {
        'start-header': 'Välkommen',
        'start-text': 'Scanna av ditt åkband enligt bilden',
        'attractions-header': 'Välj attraktion',
        'confirm-ticket-header': 'Bekräfta',
        'ticket-text': 'en biljett till %1 giltig mellan %2 och %3',
        'tickets-text': '%1 biljetter till %2 giltiga mellan %3 och %4',
        'ask-book': 'Vill du boka',
        'ask-unbook': 'Vill du avboka?',
        'you-have-booked': 'Du har bokat',
        'exit': 'Avsluta',
        'show-ticket-header': 'Biljetter',
        'remove-ticket-header': 'Avboka',
        'remove-yes': 'Ja',
        'remove-no': 'Nej',
        'confirm-yes': 'Ja',
        'confirm-no': 'Nej',
        'take-ticket': 'Använd biljettuttaget.',
        'none': 'ingen',
        'attractions-text': 'Du kan också scanna in fler personer',
        'start-progress': '1. Scanna åkband',
        'attractions-progress': '2. Välj attraktion',
        'confirm-ticket-progress': '3. Boka biljett',
        'show-ticket-progress': '4. Hämta biljett',
        'visitors': 'Antal personer: ',
        'name': 'Namn: ',
        'time': 'Kötid: ',
        'height': 'Minlängd: ',
        'invalid-pass-header': 'Ogiltig',
        'invalid-pass-text': 'Det här åkbandet har gått ut. Den var: ',
        'valid-through': 'Giltig t.o.m. '
    };

    function updateCustomers() {
        var name;
        for (name in customers) {
            if (customers.hasOwnProperty(name)) {
                customers[name].updateTicket();
            }
        }
    }

    //returns element by id
    function $(id) {
        return document.getElementById(id);
    }

    // stringifies a number to two digits, with possible leading zero
    function timePad(time) {
        return (time < 10 ? "0" : "") + time;
    }

    //checks if array contains data
    function contains(array, data) {
        var i;
        for (i = 0; i < array.length; i += 1) {
            if (array[i] === data) {
                return true;
            }
        }
        return false;
    }

    function removeClass(id, className) {
        var e = $(id),
            re = new RegExp('\\b' + className + '\\b');
        e.className = e.className.replace(re, '').trim();
    }

    function Pass(expireDate) {
        this.toString = function (language) {
            if (language === 'undefined') {
                language = languages.swedish;
            }
            return language['valid-through'] + 
                timePad(expireDate.getMonth() + 1) + '-' +
                timePad(expireDate.getDate()) + '-' +
                expireDate.getFullYear() + ' ' +
                timePad(expireDate.getHours()) + ':00';
        };

        this.hasExpired = function () {
            if (expireDate.getTime() < new Date().getTime()) {
                return true;
            }
            return false;
        };
    }

    //Customer class - what you do when you click on something on the page
    //is calling methods from this class.
    function Customer(name, pass) {
        this.name = name;
        this.ticket = null;
        this.pass = pass;

        this.setStatus = function (status) {
            var e = $(this.name + '-div');
            if (status) {
                e.className += ' ' + status;
            } else {
                e.className = 'customer-div';
            }
        };

        //Update the Customer information visible on screen
        this.updateTicket = function() {
            $(this.name + '-customer-ticket').textContent = (this.ticket ?
                    this.ticket.toString() : 'Ingen');
        };
    }

    // Attraction class
    function Attraction(name, height) {
        this.name = name;
        this.height = height;
        //Generates a random queue time between 15 and 75
        this.queueTime = Math.round(10 + Math.random() * 60);

        this.formatName = function() {
            return this.name.split(' ').join('').toLowerCase();
        };

        this.toString = function() {
            return this.name + '\n' + this.queueTime + 'min\n' + this.height + 'cm';
        };
    }

    //Ticket class
    function Ticket(attraction) {
        var date = new Date();
        date.setMinutes(date.getMinutes() + attraction.queueTime);
        this.startTime = timePad(date.getHours()) + ':' +
            timePad(date.getMinutes());
        this.endTime = timePad(date.getHours() + 1) + ':' +
            timePad(date.getMinutes());
        this.attraction = attraction;

        this.toString = function(language, num) {
            if (typeof language === 'undefined') {
                language = languages.swedish;
            }
            if (typeof num === 'undefined') {
                num = 1;
            }
            if (num === 1) {
                return language['ticket-text'].
                    replace('%1', this.attraction.name).
                    replace('%2', this.startTime).
                    replace('%3', this.endTime);
            }
            return language['tickets-text'].
                replace('%1', num).
                replace('%2', this.attraction.name).
                replace('%3', this.startTime).
                replace('%4', this.endTime);
        };
    }

    //Change the current customer
    function changeCustomer(selectedName) {
        if (customer) {
            removeClass(customer.name + '-div', 'selected');
        }
        customer = customers[selectedName];
        customer.setStatus('selected');

    }

    function createCustomers() {
        var name, target, div, p, span, select, validDate;

        validDate = new Date();
        validDate.setHours(validDate.getHours() + 24);
        customers = {
            'Sami': new Customer('Sami', new Pass(validDate)),
            'Simon': new Customer('Simon', new Pass(validDate)),
            'Henri': new Customer('Henri', new Pass(validDate)),
            'Paul': new Customer('Paul', new Pass(validDate)),
            'Mattias': new Customer('Mattias', new Pass(validDate)),
            'Lukas': new Customer('Lukas', new Pass(new Date()))
        };

        select = function () {
            var index = name;
            return function () {
                changeCustomer(index);
            };
        };

        target = $('prototype-left');
        for (name in customers) {
            if (customers.hasOwnProperty(name)) {
                div = document.createElement('div');
                div.onclick = select();
                div.id = name + '-div';
                div.className = 'customer-div';
                p = document.createElement('p');
                span = document.createElement('span');
                span.className = 'attribute';
                span.textContent = 'Namn: ';
                p.appendChild(span);
                span = document.createElement('span');
                span.className = 'customer-name';
                span.textContent = name;
                p.appendChild(span);
                div.appendChild(p);
                p = document.createElement('p');
                span = document.createElement('span');
                span.className = 'attribute';
                span.textContent = 'Fastpass: ';
                p.appendChild(span);
                span = document.createElement('span');
                span.textContent = customers[name].pass.hasExpired() ? 
                    'ogiltig' : 'giltig';
                p.appendChild(span);
                div.appendChild(p);
                p = document.createElement('p');
                span = document.createElement('span');
                span.className = 'attribute';
                span.textContent = 'Biljett: ';
                p.appendChild(span);
                span = document.createElement('span');
                span.id = name + '-customer-ticket';
                span.textContent = 'Ingen';
                p.appendChild(span);
                div.appendChild(p);
                target.appendChild(div);
            }
        }
    }

    //Ticket machine class
    function TicketMachine() {
        var that = this,
            page = 'start',
            customers = [],
            attractions = [
                new Attraction('Fritt fall', 140),
                new Attraction('Insane', 140),
                new Attraction('Jetline', 140),
                new Attraction('Katapulten', 140),
                new Attraction('Eclipse', 120),
                new Attraction('Vilda musen', 120),
                new Attraction('Lyktan', 100),
                new Attraction('Tuff tuff', 0)
            ],
            ticket = null,
            language = languages.swedish;

        function createImage(id, attraction) {
            $(id).style.backgroundImage = 'url(/Images/' + attraction + '.jpg)';
        }

        function updateConfirmPage() {
            var attraction = ticket.attraction;

            $('attraction-name').textContent = language.name;
            $('attraction-time').textContent = language.time;
            $('attraction-height').textContent = language.height;

            $('attraction-name-value').textContent = attraction.name;
            $('attraction-time-value').textContent = attraction.queueTime + 'min';
            $('attraction-height-value').textContent = attraction.height + 'cm';

            $('confirm').textContent = 
                language['ask-book'] + ' ' +
                ticket.toString(language, customers.length) + '?';
        }

        function updateShowTicketPage() {
            $('show').textContent = language['you-have-booked'] + ' ' +
                                    ticket.toString(language, customers.length);
        }

        //Shows the page on it's screen
        function show(p) {
            if (page === 'remove-ticket' || page === 'invalid-pass') {
                $('start-progress').className = 'progress';
            } else {
                $(page + '-progress').className = 'progress';
            }
            if (p === 'remove-ticket' || p === 'invalid-pass') {
                $('start-progress').className = 'progress selected';
            } else {
                $(p + '-progress').className = 'progress selected';
            }

            $(page).style.display = 'none';
            $(p).style.display = 'block';
            page = p;
        }

        // Updates the attractions on screen since the queueing times changes
        function createAttractions() {
            var e, button, text, name, time, height, image, split, info;
            e = $('insert-attractions');
            e.textContent = '';
            attractions.forEach(function(a, i) {
                button = document.createElement('div');
                button.id = a.formatName() + '-div';
                button.className = 'image-button';
                text = document.createElement('div');
                text.className = 'attraction-text';
                name = document.createElement('p');
                time = document.createElement('p');
                height = document.createElement('p');
                name.textContent = a.name;
                name.className = 'attraction-name';
                time.textContent = a.queueTime + 'min';
                height.textContent = a.height + 'cm';
                text.appendChild(name);
                text.appendChild(time);
                text.appendChild(height);
                time.id = a.formatName() + '-time';
                button.appendChild(text);
                image = document.createElement('div');
                image.className = 'attraction-image';
                image.style.backgroundImage = 'url("/Images/' + 
                    a.formatName() + '.jpg")';
                button.appendChild(image);
                button.onclick = function() { that.showConfirmPage(i); };
                e.appendChild(button);
            });
        }

        function updateAttractions() {
            attractions.forEach(function(a) {
                if (Math.random() * 2 >= 1) {
                    a.queueTime += 1;
                }
                if (a.queueTime > 0 && Math.random() * 2 >= 1) {
                    a.queueTime -= 1;
                }
                var div = $(a.formatName() + '-div');
                if (a.queueTime < 20) {
                    div.style.backgroundColor = '#0f0';
                } else if (a.queueTime < 40) {
                    div.style.backgroundColor = '#ff0';
                } else {
                    div.style.backgroundColor = 'orange';
                }
                $(a.formatName() + '-time').textContent = a.queueTime + 'min';
            });
        }

        // Updates the clock on the ticket machine screen 
        function updateClock() {
            var date = new Date();
            $('clock').textContent = timePad(date.getHours()) + ':' + 
                timePad(date.getMinutes());
            if (date.getSeconds() % 8 === 0) {
                updateAttractions();
            }
        }

        function updateInvalidPassPage() {
            var pass = customers[customers.length - 1].pass;
            $('invalid-pass-text').textContent =
                language['invalid-pass-text'] + pass.toString(language);
        }

        function updateRemoveTicketText() {
            $('remove').textContent =
                language['you-have-booked'] + ': ' +
                customer.ticket.toString(language) + '. ' +
                language['ask-unbook'];
        }

        function updateAttractionsPage() {
            $('attractions-text').textContent =
                language.visitors + customers.length.toString() + '. ' +
                language['attractions-text'];
        }

        this.showTicket = function() {
            show('show-ticket');
            updateShowTicketPage();
        };

        //Gives away a ticket to all customers currently using the machine
        //and then resets.
        this.getTicket = function() {
            if (page !== 'show-ticket') {
                return;
            }
            customers.forEach(function(c) {
                c.ticket = ticket;
                c.updateTicket();
            });
            this.reset();
        };

        //A customer can only be scanned once and only when the start page is visible
        this.scan = function(customer) {
            if ((page !== 'start' && page !== 'attractions') ||
                    contains(customers, customer)) {
                return;
            }
            customers.push(customer);
            if (customer.pass.hasExpired()) {
                this.showInvalidPass();
                return;
            }
            if (customer.ticket) {
                this.showRemoveTicket();
                updateRemoveTicketText();
            } else if (customers.length > 0) {
                customer.setStatus('scanned');
                this.showAttractions();
            }
        };

        this.showInvalidPass = function () {
            updateInvalidPassPage();
            show('invalid-pass');
            setTimeout(function() {
                customers.pop();
                if (customers.length > 0) {
                    that.showAttractions();
                } else {
                    that.showStart();
                }
            }, 4000);
        };

        this.unbookTicket = function() {
            var customer = customers[customers.length - 1];
            customer.ticket = null;
            customer.setStatus('scanned');
            customer.updateTicket();
            this.showAttractions();
        };

        this.showRemoveTicket = function() {
            show('remove-ticket');
            createImage('remove-image',
                customers[customers.length - 1].ticket.attraction.formatName());
        };

        //If a customer decides to cancel an unbook, he is removed and 
        //the start page is shown
        this.cancelUnbook = function() {
            customers.pop();
            if (customers.length > 0) {
                this.showAttractions();
            } else {
                this.showStart();
            }
        };

        //A couple of 'show page' functions
        this.showStart = function() {
            show('start');
        };

        this.showAttractions = function() {
            if (!customers.length) {
                // If no customer uses the machine, don't proceed.
                return;
            }
            updateAttractionsPage();
            show('attractions');
        };

        //Creates the ticket that might be booked for display
        this.showConfirmPage = function(attraction) {
            attraction = attractions[attraction];
            ticket = new Ticket(attraction, language);
            createImage('confirm-image', attraction.formatName());
            show('confirm-ticket');
            updateConfirmPage(attraction);
        };


        //Exits the ticket machine
        this.reset = function () {
            customers.forEach(function (c) {
                removeClass(c.name + '-div', 'scanned');
            });
            ticket = null;
            customers = [];
            that.showStart();
            that.setLanguage('swedish');
        };

        this.setLanguage = function(l) {
            var text, i;

            language = languages[l];
            text = [
                'start-header', 'start-text', 'attractions-header',
                'confirm-ticket-header', 'show-ticket-header',
                'remove-ticket-header', 'exit', 'remove-yes',
                'remove-no', 'confirm-yes', 'confirm-no', 'take-ticket',
                'start-progress', 'attractions-progress',
                'confirm-ticket-progress', 'show-ticket-progress',
                'invalid-pass-header', 'invalid-pass-text'
            ];

            for (i = 0; i < text.length; i += 1) {
                $(text[i]).textContent = language[text[i]];
            }
            updateAttractionsPage();
            if (page === 'invalid-pass') {
                updateInvalidPassPage();
            }
            if (ticket) {
                updateConfirmPage();
                updateShowTicketPage();
            }
            if (page === 'remove-ticket') {
                updateRemoveTicketText();
            }
        };

        (function init() {
            that.showStart();
            that.setLanguage('swedish');
            createAttractions();
            updateAttractions();
            updateClock();
            setInterval(function () {
                updateClock();
            }, 1000);
        }());
    }

    function addEvents() {
        $('kiosk-scan').onclick = function () {
            ticketMachine.scan(customer);
        };
        $('kiosk-ticket').onclick = function () {
            ticketMachine.getTicket();
        };
        $('swedish-flag').onclick = function () {
            ticketMachine.setLanguage('swedish');
        };
        $('english-flag').onclick = function () {
            ticketMachine.setLanguage('english');
        };
        $('remove-no').onclick = function () {
            ticketMachine.cancelUnbook();
        };
        $('remove-yes').onclick = function () {
            ticketMachine.unbookTicket();
        };
        $('confirm-no').onclick = function () {
            ticketMachine.showAttractions();
        };
        $('confirm-yes').onclick = function () {
            ticketMachine.showTicket();
        };
        $('exit').onclick = function () {
            ticketMachine.reset();
        };
    }
    
    function test() {
        var ticket;
        assertEquals(customer.ticket, null);
        
        assertEquals($(customer.name + '-div').className, 
            'customer-div selected');
        
        //Scan and exit
        ticketMachine.scan(customer);
        assertEquals($(customer.name + '-div').className,
            'customer-div selected scanned');
        ticketMachine.reset();
        assertEquals($(customer.name + '-div').className,
            'customer-div selected');
        assertEquals(customer.ticket, null);

        //Book a single ticket
        ticketMachine.scan(customer);
        assertEquals($(customer.name + '-div').className,
           'customer-div selected scanned');
        ticketMachine.showConfirmPage(0);
        ticketMachine.showTicket();
        ticketMachine.getTicket();
        assertEquals($(customer.name + '-div').className,
            'customer-div selected');
        assertEquals(customer.ticket.constructor, Ticket);
        
        //Decide not to unbook
        ticket = customer.ticket;
        ticketMachine.scan(customer);
        ticketMachine.cancelUnbook();
        assertEquals(customer.ticket, ticket);
        
        //Decide to unbook
        ticket = customer.ticket;
        ticketMachine.scan(customer);
        ticketMachine.unbookTicket();
        ticketMachine.reset();
        assertEquals(customer.ticket, null);
        
        //Book multiple tickets
        ticketMachine.scan(customer);
        changeCustomer('Simon');
        assertEquals($(customer.name + '-div').className,
            'customer-div selected');
        assertEquals(customer.ticket, null);
        ticketMachine.scan(customer);
        assertEquals($(customer.name + '-div').className,
           'customer-div selected scanned');
        ticketMachine.showConfirmPage(0);
        ticketMachine.showTicket();
        ticketMachine.getTicket();
        ticket = customer.ticket;
        assertEquals(ticket.constructor, Ticket);
        changeCustomer('Sami');
        assertEquals(customer.ticket, ticket);
    }
    
    function assertEquals(a, b) {
        var stack, lines, i, line;
        if (a !== b) {
            stack = new Error().stack.split(/\n/g);
            lines = ''
            for (i = 0; i < stack.length; i++) {
                line = stack[i].split(/:/g);
                lines += line[line.length - 1] + ', ';
            }
            console.log('Test failed at lines ' + lines + '' +
                a + ' was not equal to ' + b + '.');
        }
        return a === b;
    }

    //This function is called when the protoype page is loaded.
    //It sets up the environment, creating a ticket machine and a group of customers.
    window.onload = function() {
        ticketMachine = new TicketMachine();
        createCustomers();
        changeCustomer('Sami');
        addEvents();
    };
}());