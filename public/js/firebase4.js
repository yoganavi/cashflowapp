// const e = require("connect-flash");

let pilihbulan=	document.querySelector('.seca[data-bulan]'),
forms =	document.querySelector('[data-modal] form'), // forms add & edit
inputs =	document.querySelectorAll('[data-modal] form input'),
formselect =	document.querySelectorAll('[data-formselect]'),
floatingbtn =	document.querySelectorAll('[data-floatbtn]'),
daftardata = document.querySelectorAll('[data-secb]>li'),
actionbtn = document.querySelectorAll('[data-secb-button]') // edit & delete button

let selectTipePembayaran = $("select[data-formselect][name=tipe]")[0];
let divPembayaran = document.querySelectorAll("[data-select-pembayaran]")
let selectPembayaran = document.querySelectorAll("select[data-pembayaran]")

// pilih bulan
pilihbulan.addEventListener('input', function() {
	pilihbulan.submit();
	// window.open("/")
});

// add data section
floatingbtn.forEach(e => {
	e.addEventListener('click', function() {
		forms.reset();
		// formselect[0].value=e.name;
		forminit();
		forms.action='/send';
		forms.querySelector('button i').innerText='add' // submit button on modal
		modalInstance.open();
	})
});
 
// delete section
daftardata.forEach((el,i) => {
	el.addEventListener('click', function() {
		actionbtn[i].lastElementChild.href=`/delete?id=${el.id}`;
		let datas = el.querySelectorAll('[data-secb-value]')
		let tipePembayaran = el.dataset.pembayaran
		edit(i,datas,el.id,0,tipePembayaran) // for edit operation
		edit(i,datas,el.id,1,tipePembayaran) // for duplicate operation
	})
});

actionbtn.forEach(el => {
	el.lastElementChild.addEventListener('click',(el1)=>{
		let Promt=confirm('delete data??')
		if(!Promt){
			el1.preventDefault()
			return
		}
		loading();
	})
});

// edit data section
function edit(index,datas,id,oprt,tipe){
	actionbtn[index].children[oprt].addEventListener('click',()=>{
		formselect[0].value=tipe // select tipe pembayaran
		formselect[1].value=datas[0].innerText // select pemabayaran
		
		forminit();
		inputs[0].value = datas[3].innerText // tanggal
		inputs[1].value = datas[2].innerHTML // deskripsi
		inputs[2].value = datas[1].innerHTML.slice(4).replace(/,/g, "") // harga

		// define oprt 0=edit, 1=duplicate
		if(oprt==0) {
			forms.action=`/edit?id=${id}&bulan=${pilihbulan.children[0].value}`;
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

function postDatas(){
	let datas = {
		month : pilihbulan.lastElementChild.value,
	}
	console.log(pilihbulan.lastElementChild.value);
}

console.log($("select[data-formselect][name=tipe]")[0]);

// form select tipe pembayaran  
// selectTipePembayaran.onchange=(el)=>{
// 	console.log(selectTipePembayaran.value);
// 	divPembayaran.forEach(el => {
// 		el.classList.add('d-none')
// 	});
// 	selectPembayaran.forEach(el => {
// 		el.removeAttribute('disabled')
// 	});

// 	if(selectTipePembayaran.value=='debet' || selectTipePembayaran.value=='kredit' ){
// 		divPembayaran[0].classList.remove('d-none')
// 		selectPembayaran[1].setAttribute('disabled','')
// 	}
// 	if(selectTipePembayaran.value=='cc'){
// 		divPembayaran[1].classList.remove('d-none')
// 		selectPembayaran[0].setAttribute('disabled','')
// 	}
// }

console.log(selectPembayaran);