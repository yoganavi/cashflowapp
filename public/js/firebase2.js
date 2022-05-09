// loadingPAge
let loadingPage=document.querySelector('#loadingPage');
let banner=document.querySelector('.banner');
let blocks=document.getElementsByClassName('blocks');

for(let i=0;i<200;i++){
	banner.innerHTML+="<div class='blocks'></div>";
	// let blocks=document.querySelectorAll('.blocks');
	blocks[i].style.animationDelay= i*0.04 + 's';
};	

loadingPage.addEventListener('transitionend',()=>{
	loadingPage.style.display='none';
});
// / loadingPAge

let todoRef = database.ref('data1');
let month=document.querySelector('#month');
let btn1 = document.querySelector('input.submit');
let btnCancel = document.querySelector('input.cancel');
let sectionB = document.querySelector('.sectionB');
let sectionD=document.querySelector('.sectionD');
let sectionC = document.querySelector('.sectionC');
let addData = document.querySelector('.addData');
let pembayaran = document.querySelector('#pembayaran');
let tanggal = document.querySelector('#tanggal');
let harga = document.querySelector('#harga');
let deskripsi = document.querySelector('#deskripsi');
let wrapB1New='';
let wrapAP = document.querySelectorAll('.wrapA p');
let newDate=new Date();
let year=newDate.getFullYear();
let month2=String(newDate.getMonth()+1).padStart(2,'0');
let today=String(newDate.getDate()).padStart(2,'0');
month.value=year+'-'+month2;
tanggal.value=year+'-'+month2+'-'+today;
let month3=month.value+'-20';
let month3a=year+'-'+String(month.value.slice(5 , 7)-1).padStart(2,'0')+'-19';
// let id;

month.addEventListener('input',function(){
	month3=month.value+'-20';
	// let bulan=String(parseInt(month.value.slice(5 , 7))-1).padStart(2,'0');
	let bulan=new Date(month3).getMonth();
	let tahun=new Date(month3).getFullYear();
	bulan=(String(bulan)).padStart(2,'0');
	if(bulan=="00"){
		bulan="12";
		tahun-=1;
	};
	month3a= tahun+'-'+bulan+'-19';
	second();
});

// create to firebase
let createTodo = () => {
	let todo = {
		pembayaran: pembayaran.value,
		tanggal: tanggal.value,
		harga: harga.value,
		deskripsi: deskripsi.value,
	};
	
	todoRef.push(todo);
	// database.ref('data2/001').push(todo);
	sectionC.classList.remove('show');
	alert(deskripsi.value+' Succes');
};

// /create to firebase
console.log('111');

// read firebase

// let readAllData=new Promise(resolve => {
// 	resolve(todoRef.once('value',(e)=>{
// 		readAllData=e.val();
// 	}));
// }); 
// readAllData.then(()=>second());

let readAllData;
function first(){
	todoRef.on('value',(e)=>{
		readAllData= e.val();
		second();
	});
};
first();
		
console.log('333');
		
function second(){
	console.log('444');

	let b1;
	sectionB.innerHTML='';
	sectionD.innerHTML='';
	
	function b1p(jenisData,jenisPembayaran){
		let b1p = document.createElement('p');
		b1p.innerHTML = jenisData;
		if(jenisPembayaran==1){
			b1p.setAttribute('id','tipeBayar');
		};
		b1.append(b1p);
	};

	let datesort=[];
	let datesort2=[];
	for(let id in readAllData){
		if(readAllData[id].tanggal < month3 && readAllData[id].tanggal > month3a){
			datesort.push(readAllData[id].tanggal);
			datesort.sort();
		};
	};

	datesort.forEach(function(e){
		if(!datesort2.includes(e)){
			datesort2.push(e);
		}
	});

	let totalPerMounth=0;
	let tipeBayar2=[];
	datesort2.forEach(function(e){
		for(let id in readAllData){
			if(e == readAllData[id].tanggal){
				b1 = document.createElement('div');
				b1.setAttribute('class','b1');
				b1.setAttribute('id',id);
				sectionB.append(b1);
				
				if(!tipeBayar2.includes(readAllData[id].pembayaran)){
					tipeBayar2.push(readAllData[id].pembayaran);
				};

				b1p(readAllData[id].pembayaran,1);
				b1p(readAllData[id].tanggal);
				b1p(readAllData[id].deskripsi);
				b1p('Rp. '+ new Intl.NumberFormat().format(readAllData[id].harga));

				totalPerMounth+=Number(readAllData[id].harga);
			};
		};
	});
	wrapAP[1].innerHTML = 'Rp. '+ new Intl.NumberFormat().format(totalPerMounth);
	
	// total per tipe pembayaran
	let tipeBayar=document.querySelectorAll('#tipeBayar');
	let jumlahPerTipe=0;
	function jmlPerTipe(tipe){
		tipeBayar.forEach(function(e){
			if(e.innerText==tipe){
				jumlahPerTipe+=Number(readAllData[e.parentElement.id].harga);
			};
		});
		let wrapD1=document.createElement('div');
		wrapD1.setAttribute('class','wrapD1');
		let p1=document.createElement('p');
		p1.innerHTML = tipe + ' Total';
		wrapD1.append(p1);
		let p2=document.createElement('p');
		p2.innerHTML = 'Rp. '+ new Intl.NumberFormat().format(jumlahPerTipe);
		wrapD1.append(p2);
		sectionD.append(wrapD1);
		jumlahPerTipe=0;
	};

	console.log(tipeBayar2);
	tipeBayar2.forEach(function(e){
		jmlPerTipe(e);
	});

	// clearInterval(interval);
	loadingPage.style.opacity='0';

	hapusData();
	console.log('555');
};
// /read firebase

// Delete function
let wrapB2=document.querySelector('.wrapB2');
let wrapB2Button=document.querySelectorAll('.wrapB2 Button');
let idb1=0;
let idb1Tipe;
// let b2=document.getElementsByClassName('b1');
// console.log(b2);
let b1;
let i2;
function hapusData(){
	b1=document.querySelectorAll('.b1');
	// console.log(b1);
	b1.forEach((e)=>{
		e.addEventListener('click',()=>{
			idb1Tipe=readAllData[e.id].tipe;
			idb1=e.id;
			console.log(e);
			console.log(i2);
			if(i2=='r'){
				b1.forEach(e1=>e1.classList.remove('klik'))
				i2='a';
			}else{
				e.classList.add('klik');
				i2='r';
			};
			wrapB2.classList.toggle('show');
		});
	});
};

wrapB2Button[0].addEventListener('click',()=>{
	wrapB2.classList.remove('show');
	b1.forEach(e1=>e1.classList.remove('klik'));
	i2='a';
});

let b3=document.querySelector('.b3');
let b3button=document.querySelector('.b3 button');
let b3input=document.querySelector('#passcode');
wrapB2Button[2].addEventListener('click',()=>{
	b3input.value='';
	console.log(idb1Tipe);
	console.log(idb1);
	b3.classList.add('show');
	return console.log('777');
});

b3button.addEventListener('click',()=>{
	console.log(b3input.value);
	console.log(idb1Tipe);
	console.log(idb1);
	b3.classList.remove('show');
	if(b3input.value=='153'){
		hapusData2()
	}else{
		alert('wrong passcode')
	};
});

function hapusData2(){
	console.log(idb1Tipe);
	console.log(idb1);
	console.log(b3input.value);
	if(idb1Tipe==undefined){
		alert('DELETED!  ' + ' Rp. '+readAllData[idb1].harga+' ==> '+readAllData[idb1].deskripsi);
		todoRef.child(idb1).remove();
		wrapB2.classList.remove('show');
		// first();
		console.log('ccc');
	}else{
		alert('DELETED!  ' + ' Rp. '+readAllData[idb1].harga+' ==> '+readAllData[idb1].deskripsi+' '+idb1Tipe);

		for(let id in readAllData){
			if(readAllData[id].tipe==idb1Tipe){
				todoRef.child(id).remove();
				wrapB2.classList.remove('show');
			};
		};
	};
};
// /Delete function

// Edit section
let sectionE=document.querySelector('.sectionE');
let wrapE2button=document.querySelectorAll('.wrapE2 input');
let editPembayaran=document.querySelector('#pembayaranEdit');
let editTanggal=document.querySelector('#tanggalEdit');
let editHarga=document.querySelector('#hargaEdit');
let editDeskripsi=document.querySelector('#deskripsiEdit');

// tombol edit
let idforeditangsuran=0;
wrapB2Button[1].addEventListener('click',()=>{
	if(idb1Tipe==undefined){
		sectionE.classList.add('show');
		editPembayaran.value=readAllData[idb1].pembayaran;
		editTanggal.value=readAllData[idb1].tanggal;
		editHarga.value=readAllData[idb1].harga;
		editDeskripsi.value=readAllData[idb1].deskripsi;
	}else{
		sectionC.classList.add('show');
		pembayaran.value=readAllData[idb1].pembayaran;
		tanggal.value=readAllData[idb1].tanggal;
		harga.value=readAllData[idb1].harga;
		deskripsi.value=readAllData[idb1].deskripsi;
		lamaAngsuran.value=readAllData[idb1].tenor;
		idforeditangsuran=1;
	};
});

// tombol cancel
wrapE2button[0].addEventListener('click',()=>{
	sectionE.classList.remove('show');
});

// tombol save
wrapE2button[1].addEventListener('click',()=>{
	sectionE.classList.remove('show');
	todoRef.child(idb1).update({
		pembayaran: editPembayaran.value,
		tanggal: editTanggal.value,
		harga: editHarga.value,
		deskripsi: editDeskripsi.value,
	});
});
// /Edit section

// addData on off
addData.addEventListener('click',function(){
	sectionC.classList.toggle('show');
});
btnCancel.addEventListener('click',(e)=>{
	sectionC.classList.remove('show');
	idforeditangsuran=0;
	e.preventDefault()
});
// / addData on off

// angsuran
let lamaAngsuran=document.querySelector('#lamaAngsuran');

let createAngsuran = () =>{
	console.log('start')
	let month=new Date(tanggal.value).getMonth();
	let date=new Date(tanggal.value).getDate();
	let year=new Date(tanggal.value).getFullYear();
	let random=Math.floor((Math.random() * 10000000));

	for(let i=1; i <= lamaAngsuran.value; i++){
		let todo2 = {
			tipe: 'angsuran'+random,
			pembayaran: pembayaran.value,
			tanggal: year+'-'+(String(month+=1)).padStart(2,'0')+'-'+String(date).padStart(2,'0'),
			harga: harga.value,
			deskripsi: deskripsi.value +' (angsuran ke '+ i +' / '+lamaAngsuran.value+')',
			tenor: lamaAngsuran.value
		};
		console.log(todo2);
		if(month==12){
			month=0;
			year+=1;	
		}
		
		todoRef.push(todo2);
	};
	sectionC.classList.remove('show');
	console.log('ok2')
};
btn1.addEventListener('click',(e)=>{
	if(lamaAngsuran.value==0){
		createTodo();
	}else if(lamaAngsuran.value>1 && idforeditangsuran==0){
		createAngsuran()
	}else if(lamaAngsuran.value>1 && idforeditangsuran==1){
		console.log(idforeditangsuran);
		hapusData2();
		createAngsuran();
	};
	e.preventDefault();
})
// / angsuran
