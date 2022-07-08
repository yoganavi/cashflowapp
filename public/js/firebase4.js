let pilihbulan=	document.querySelector('.seca[data-bulan]'),
forms =	document.querySelector('[data-modal] form'),
inputs =	document.querySelectorAll('[data-modal] form input'),
formselect =	document.querySelector('[data-modal] form select'),
floatingbtn =	document.querySelectorAll('[data-floatbtn] ul li a'),
daftardata = document.querySelectorAll('[data-secb]>li'),
actionbtn = document.querySelectorAll('[data-secb-button]') // edit & delete button

// pilih bulan
pilihbulan.addEventListener('input', function() {
	pilihbulan.submit();
	// window.open("/")
});

// add data section
floatingbtn.forEach(e => {
	e.addEventListener('click', function() {
		forms.reset();
		formselect.value=e.name;
		forminit();
		forms.action='/send';
		forms.querySelector('button i').innerText='add' // submit button on modal
		modalInstance[0].open();
	})
});

// delete section
daftardata.forEach((el,i) => {
	el.addEventListener('click', function() {
		actionbtn[i].lastElementChild.href='/delete/'+el.id;
		let datas = el.querySelectorAll('[data-secb-value]')
		edit(i,datas,el.id)
	})
});

// edit data section
function edit(index,datas,id){
	actionbtn[index].firstElementChild.addEventListener('click',()=>{
		formselect.value=datas[0].innerHTML // select pembayaran
		forminit();
		inputs[0].value = datas[3].innerHTML // tanggal
		inputs[1].value = datas[2].innerHTML // deskripsi
		inputs[2].value = datas[1].innerHTML.slice(4).replace(",", "") // harga
		forms.action='/edit/'+id;
		forms.querySelector('button i').innerText='edit' // submit button on modal
		modalInstance[0].open();
	})
}