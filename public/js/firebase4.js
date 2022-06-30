let pilihbulan=	document.querySelector('.seca[data-bulan]'),
forms =	document.querySelector('[data-modal] form'),
inputs =	document.querySelectorAll('[data-modal] form input'),
formselect =	document.querySelector('[data-modal] form select'),
floatingbtn =	document.querySelectorAll('[data-floatbtn] ul li a'),
daftardata = document.querySelectorAll('[data-secb]>li'),
editdeletebtn = document.querySelectorAll('[data-secb-button]');

pilihbulan.addEventListener('input', function() {
	pilihbulan.submit();
	// window.open("/")
});
floatingbtn.forEach(e => {
	e.addEventListener('click', function() {
		forms.reset();
		formselect.value=e.name;
		forminit()
		modalInstance[0].open()
	})
});

console.log(inputs);

daftardata.forEach((el,i) => {
	el.addEventListener('click', function() {
		editdeletebtn[i].lastElementChild.href='/delete/'+el.id;
	})
});
