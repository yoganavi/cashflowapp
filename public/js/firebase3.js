// materialize init
document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.modal'),
	elems2 = document.querySelectorAll('.sidenav');
	var instances = M.Modal.init(elems, {});
	var instances = M.Sidenav.init(elems2, {});
});

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
	}else{
		return mm3.slice(0,7);
	};
};

let month3a=changeDateFormat('start')+'-20';
let month3=changeDateFormat('end')+'-19';
// tanggal.value=year+'-'+month2+'-'+today;
console.log(month3a);
console.log(month3);


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
	// console.log(maxDate4);
};
maksimalDateThisMonth();

month.addEventListener('input',function(){
	let mm=month.value;
	let mm2=mm.split('-');
	let mm3=mm2[0]+'-'+(String(mm2[1]-1)).padStart(2,'0');
	month3a=mm3+'-20';
	month3=mm+'-19';

	maksimalDateThisMonth();
	second();
});

function monthchanger(num){
	let mm=month.value;
	let mm2=mm.split('-');
	let mm3=mm2[0]+'-'+(String(mm2[1]-1+num)).padStart(2,'0');
	let mm4=mm2[0]+'-'+(String(Number(mm2[1])+num)).padStart(2,'0');
	month3a=mm3+'-20'; // start date
	month3=mm4+'-19'; // end date
	console.log(month3a);
	console.log(month3);

	month.value=mm4;

	maksimalDateThisMonth();
	second();
};

// create to firebase
let createData = () => {
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
let dataOnArray;
function first(){
	todoRef.on('value',(e)=>{
		let readAllData= e.val();
		dataOnArray=Object.values(readAllData);
		second();
	});
};
first();

function second(){
	let filterPerMonthAngsuran=[];
	let filterPerMonth=[];
	filterPerMonth=dataOnArray.filter(e=> {
		if(e.tanggal <= month3 && e.tanggal >= month3a && e.pembayaran!='gopayLatter'){
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
	sectionC.innerHTML='';

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
};
