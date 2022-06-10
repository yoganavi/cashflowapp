// form select init
function forminit(){
	var elems = document.querySelector('select');
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
var elem = document.querySelectorAll('.modal');
var modalInstance = M.Modal.init(elem, {
	startingTop: '0%',
	endingTop: '25%',
	opacity: 0.2,
});
// date picker
document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelector('.datepicker');
	var instances = M.Datepicker.init(elems, {
		autoClose: true,
		format: 'yyyy-mm-dd',
	});
});

// collapsible init
document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.collapsible');
	var instances = M.Collapsible.init(elems, {});
});
 
	
