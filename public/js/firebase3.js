let todoRef = database.ref('data1');
let month=document.querySelector('#month');
let btn1 = document.querySelector('input.submit');
let btnCancel = document.querySelector('input.cancel');
let sectionB = document.querySelectorAll('.sectionB');
let sectionD=document.querySelector('.sectionD');
let sectionC = document.querySelector('.sectionC');
let b1;
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

// get today format date
let mm=new Date().toLocaleDateString();
// change date format to YYYY-MM-DD
let changeDateFormat=(i)=>{
	let mm2=mm.split('/');
	let mm3=mm2[2]+'-'+mm2[1].padStart(2,'0')+'-'+mm2[0].padStart(2,'0');
	month.value=mm3.slice(0,7);
	let mm4=mm2[2]+'-'+(String(mm2[1]-1)).padStart(2,'0');
	if(i=='start'){
		return mm4;
	}else if(i=='end'){
		return mm3.slice(0,7);
	}else{
		return mm3;
	};
};

let month3a=changeDateFormat('start')+'-19';
let month3=changeDateFormat('end')+'-20';
tanggal.value=changeDateFormat('addbutton');

// maksimal date on this month
let maxDate4;
function maksimalDateThisMonth(){
	// let maksimalDate=new Date(year,month2,0).getDate();
	// return maksimalDate;
	let maxDate=new Date(month.value);
	maxDate.setMonth(maxDate.getMonth()+1);
	maxDate.setDate(0);
	let maxDate2=maxDate.getDate();
	maxDate4=maxDate.getFullYear()+'-'+String(maxDate.getMonth()+1).padStart(2,'0')+'-'+maxDate2;
};
maksimalDateThisMonth();

month.addEventListener('input',function(){
	let mm=month.value;
	let mm2=mm.split('-');
	let mm3=mm2[0]+'-'+(String(mm2[1]-1)).padStart(2,'0');
	month3a=mm3+'-19';
	month3=mm+'-20';

	maksimalDateThisMonth();
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
	sectionC.classList.remove('show');
	alert(deskripsi.value+' Succes');
};
// /create to firebase

// read firebase
let dataOnArray,
readAllData;
function first(){
	todoRef.on('value',(e)=>{
		dataOnArray=[];
		readAllData= e.val();
		// dataOnArray=Object.values(readAllData);
		// insert id to dataOnArray
		// Object.keys(readAllData).forEach((e)=>{
		// 	dataOnArray.push(readAllData[e]);
		// 	dataOnArray[dataOnArray.length-1].id=e;
		// });
		for(let id in readAllData){
			// readAllData[id]['id']=id;
			dataOnArray.push(readAllData[id]);
			dataOnArray[dataOnArray.length-1].id=id;
		};
		console.log(dataOnArray);
		second();
	});
};
first();

function second(){
	// let filterPerMonth2=[];
	// let filterPerMonthAngsuran2=[];
	
	// for(let id in readAllData){
	// 	if(readAllData[id].tanggal < month3 && readAllData[id].tanggal > month3a && readAllData[id].pembayaran!='gopayLatter'){
		// 		if(readAllData[id].tipe!=undefined){
			// 			let data={
				// 				deskripsi:readAllData[id].deskripsi,
				// 				harga:readAllData[id].harga,
				// 				pembayaran:readAllData[id].pembayaran,
				// 				tanggal:readAllData[id].tanggal,
				// 				tipe:readAllData[id].tipe,
				// 				id
				// 			};
				// 			filterPerMonthAngsuran2.push(data);
				// 		}else	if(readAllData[id].tipe==undefined){
					// 			filterPerMonth2.push(readAllData[id]);
					// 		};
					// 	};
					// };
					// console.log(filterPerMonth2);
					// console.log(filterPerMonthAngsuran2);
					
	let filterPerMonthAngsuran=[];
	let filterPerMonth=[];
	filterPerMonth=dataOnArray.filter(e=> {
		if(e.tanggal < month3 && e.tanggal > month3a && e.pembayaran!='gopayLatter'){
			if(e.tipe!=undefined){
				filterPerMonthAngsuran.push(e);
			}else	if(e.tipe==undefined){
				return e;
			};
		};
		// filter gopaylatter date 01 - end of month
		if(e.tanggal >= month.value+'-'+'01' && e.tanggal <= maxDate4 && e.pembayaran=='gopayLatter'){
			return e;
		};
	});

	// sorting filterPerMonth by tanggal
	filterPerMonth.sort((a,b)=>{
		return new Date(a.tanggal) - new Date(b.tanggal)
	});
	console.log(filterPerMonth);
	console.log(filterPerMonthAngsuran);

	// total harga filterPerMonth
	let totalHarga=0;
	filterPerMonth.forEach(e=>{
		totalHarga+=parseInt(e.harga);
	});
	// total harga filterPerMonthAngsuran
	filterPerMonthAngsuran.forEach(e=>{
		totalHarga+=parseInt(e.harga);
	});
	// write content to total tagihan this month
	wrapAP[1].innerHTML = 'Rp. '+ new Intl.NumberFormat().format(totalHarga);

	// write content to sectionB
	// refresh content all section
	sectionB.forEach((e)=>{
		e.innerHTML='';
	});

	let filterTagihanPerMonth=[];
	function b1p(jenisData){
		let b1p = document.createElement('p');
		b1p.innerHTML = jenisData;
		b1.append(b1p);
	};
	function writeToSection(data,section){
		data.forEach(e=>{
			b1 = document.createElement('div');
			b1.setAttribute('class','b1');
			b1.setAttribute('id',e.id);
			section.append(b1);
			
			b1p(e.pembayaran);
			b1p(e.tanggal);
			b1p(e.deskripsi);
			b1p('Rp. '+ new Intl.NumberFormat().format(e.harga));

			if(!filterTagihanPerMonth.includes(e.pembayaran)){
				filterTagihanPerMonth.push(e.pembayaran)
			};
		});
	};

	writeToSection(filterPerMonth,sectionB[0]);
	writeToSection(filterPerMonthAngsuran,sectionB[1]);

	// write content to sectionD
	sectionD.innerHTML='';
	console.log(filterTagihanPerMonth);
	let totalPerTagihan=0;
	
	filterTagihanPerMonth.forEach(e => {
		function writeContentSectionD(data){
			data.forEach(el=>{
				if(e==el.pembayaran){
					totalPerTagihan+=parseInt(el.harga);
				};
			});
		};
		writeContentSectionD(filterPerMonth);
		writeContentSectionD(filterPerMonthAngsuran);

		let d1=document.createElement('div');
		d1.setAttribute('class','wrapD1');
		let p1=document.createElement('p');
		p1.innerHTML = e + ' Total';
		d1.append(p1);
		let p2=document.createElement('p');
		p2.innerHTML = 'Rp. '+ new Intl.NumberFormat().format(totalPerTagihan);
		d1.append(p2);
		sectionD.append(d1);
		totalPerTagihan=0;
	});

		
	// sort filterPerMonth array from end index to start index
	// filterPerMonth.reverse();
	// // get month data from filterPerMonth
	// let monthData=filterPerMonth.map(e=>e.tanggal.replace(/-/g,''));
	// console.log(monthData);
	// // sort monthData
	// monthData.sort((a,b)=>b-a);
	// console.log(monthData);
	// // how to remove '-' from monthData
	// let monthData2=monthData.map(e=>e.replace(/-/g,''));
	// console.log(monthData2);
	// // sort monthData2 from small to big
	// monthData2.sort((a,b)=>a-b);
	// console.log(monthData2);
	hapusData();
};

// Delete function
let wrapB2=document.querySelector('.wrapB2');
let wrapB2Button=document.querySelectorAll('.wrapB2 Button');
let idb1=0;
let idb1Tipe;
// let b2=document.getElementsByClassName('b1');
// console.log(b2);
// let b1;
let i2;
function hapusData(){
	b1=document.querySelectorAll('.b1');
	// console.log(b1);
	b1.forEach((e)=>{
		e.addEventListener('click',()=>{
			// idb1Tipe=readAllData[e.id].tipe;
			idb1Tipe=dataOnArray.find(el=>el.id==e.id).tipe;
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
	return console.log('kilk tombol delete');
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
