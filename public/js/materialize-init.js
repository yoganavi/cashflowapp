// form select init
function forminit(){
	var elems = document.querySelectorAll('select');
	var formInstances = M.FormSelect.init(elems, {});
}
document.addEventListener('DOMContentLoaded', function() {
	forminit();
});

// floating btn init
document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.fixed-action-btn');
	var instances = M.FloatingActionButton.init(elems, {	});
});

// modals init
var elem = document.querySelector('#modal1');
var modalInstance = M.Modal.init(elem, {
	startingTop: '0%',
	endingTop: '20%',
	opacity: 0.2,
});
// modals navbar pemasukan
var elem1 = document.querySelector('#modal2');
var modalInstance1 = M.Modal.init(elem1, {
	startingTop: '0%',
	endingTop: '20%',
	opacity: 0.2,
});
// modals navbar summary
var elem2 = document.querySelector('#modal3');
var modalInstance2 = M.Modal.init(elem2, {
	startingTop: '0%',
	endingTop: '20%',
	opacity: 0.2,
});

// date picker
document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelector('.datepicker');
	var instances = M.Datepicker.init(elems, {
		autoClose: true,
		format: 'mmmm yyyy', // Display format
    yearRange: [1900, 2100], // Year range
    showClearBtn: true, // Clear button
	});
});

// collapsible init
document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.collapsible');
	var instances = M.Collapsible.init(elems, {});
});

// navbar
document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.sidenav');
	var instances = M.Sidenav.init(elems, {});
});
