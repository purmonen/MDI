//returns element by id
function $(id) {
    return document.getElementById(id);
}

function $c(c) {
    return document.getElementByClass(c);
}

// stringifies a number to two digits, with possible leading zero
function timePad(time) {
    return (time < 10 ? "0" : "") + time;
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