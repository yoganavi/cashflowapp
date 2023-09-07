// const e = require("connect-flash");

let pilihbulan=	document.querySelector('.seca[data-bulan]'),
forms =	document.querySelector('[data-modal] form'), // forms add & edit
inputs =	document.querySelectorAll('[data-modal] form input'),
formselect =	document.querySelectorAll('[data-formselect]'),
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
		formselect[0].value=e.name;
		forminit();
		forms.action='/send';
		forms.querySelector('button i').innerText='add' // submit button on modal
		modalInstance.open();
	})
});
 
// delete section
daftardata.forEach((el,i) => {
	el.addEventListener('click', function() {
		actionbtn[i].lastElementChild.href='/delete/'+el.id;
		let datas = el.querySelectorAll('[data-secb-value]')
		edit(i,datas,el.id,0)
		edit(i,datas,el.id,1)
		console.log(datas);
	})
});

actionbtn.forEach(el => {
	el.lastElementChild.addEventListener('click',(el1)=>{
		let Promt=prompt('ketik: setuju')
		if(Promt!='setuju'){
			el1.preventDefault()
			console.log(formAddEdit.querySelector("#harga").value)

			return alert('coba lagi')
		}
		loading();
	})
});

// edit data section
function edit(index,datas,id,oprt){
	actionbtn[index].children[oprt].addEventListener('click',()=>{
		formselect[0].value=datas[0].innerHTML // select pembayaran
		formselect[1].value=datas[4].innerText // select user
		forminit();
		inputs[0].value = datas[3].innerText // tanggal
		inputs[1].value = datas[2].innerHTML // deskripsi
		inputs[2].value = datas[1].innerHTML.slice(4).replace(/,/g, "") // harga
		if(oprt==0) {
			forms.action=`/edit/${id}/${pilihbulan.children[0].value}`;
		}else{
			forms.action=`/send`;
		} 
		M.updateTextFields()
		forms.querySelector('button i').innerText='edit' // submit button on modal
		modalInstance.open();
	})
}

// loading func
function loading(srcBtn){
	if(srcBtn && forms.querySelector('#harga').value=='') return // validasi input harga harus isi dan dari edit dan add, jika dari tombol lainnya input harga pasti kosong
	let containerLoad = document.querySelector('[data-conload]')
	modalInstance.close();
	containerLoad.classList.remove('hide');
}

// !temporary for development
// modalInstance2.open()