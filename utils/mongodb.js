const {MongoClient, ObjectId} = require('mongodb');
const uri = "mongodb+srv://yoga:makanyuk@cluster0.kmlk0.mongodb.net/?retryWrites=true&w=majority"; 
const fs = require('fs');
const { json } = require('express');

// Create a new MongoClient
const client = new MongoClient(uri, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = client.db('cashflow');
function mongodb(action,data,data2) {
  if(action=='create'){
    // create one
    db.collection("datas").insertOne(
      data, (err, result) => {
        if (err) {
          return console.log("Unable to insert user");
        }
        console.log(result)
      }
    );
  }else if(action=='read'){
    // read all
    return db.collection('datas').find({}).toArray()
  }else if(action=='delete'){
    // delete one
    db.collection("datas").deleteOne(
      {_id: ObjectId(data)}, (err, result) => {
        if (err) {
          return console.log("Unable to delete user");
        }
        console.log(result)
      }
    );
  }else if(action=='edit'){
    db.collection("datas").updateOne(
      {
        _id: ObjectId(data)
      },
      {
        $set: data2
      }
    )
  }
}

function today(data,tahun){
  let today = new Date();
  let yyyy = today.getFullYear();
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let dd = String(today.getDate()).padStart(2, '0');

  if(data==0){ // special chase for pick month in januari
    // console.log(data);
    return `${tahun-1}-12`
  };
  if(data=='fulldate'){
    return yyyy + '-' + mm + '-' + dd;
  };
  if(data=="startMonth"){
    return yyyy + '-' + mm;
  };
  console.log('mongodb.today');
  return `${tahun}-${String(data).padStart(2,'0')}`
}

let dataKredit;
async function datafilterthismonth(bulan,tahun,readDBS,kredit){
  console.log('mongodb.dftm.kreditVal.'+Boolean(kredit));
  if(kredit) return dataKredit;

  console.log('mongodb.dftm.bulan.'+Boolean(bulan));
  console.log('mongodb.dftm.readData.'+readDBS);

  let read;
  if(readDBS=='cloud'){ // readDBS > true itu alur dari edit & delete data jadi jgn di generate bulan dan tahun dibawah krn akan membaca bulan saat ini
    read = await mongodb('read');
    console.log('mongodb.dftm.readMOngoCloud');
    
    try{
      await fs.writeFileSync('data/database.json', JSON.stringify(read));
    } catch(err){
      console.error(err);
    };
    console.log('mongodb.dftm.writtenToLocalDBS');
    if(!bulan){ //bulan kosong atau false saat refresh, baru buka halaman, delete & add data
      bulan = today("startMonth").split('-')[1] //generate data yyyy-mm saat ini dan ambil data bulanny saja
      tahun = today("startMonth").split('-')[0] //generate data yyyy-mm saat ini dan ambil data tahun saja
    }
  }else{
    read = fs.readFileSync('data/database.json', 'utf-8');
    read = JSON.parse(read);
    console.log('mongodb.dftm.read dbs local');
    if(!bulan){
      console.log('mongodb.dftm.!bulan1');
      bulan = today("startMonth").split('-')[1] //generate data yyyy-mm saat ini dan ambil data bulanny saja
      tahun = today("startMonth").split('-')[0] //generate data yyyy-mm saat ini dan ambil data tahun saja
    }
  };
  
  let startDate = today(bulan-1,tahun);
  let endDate = today(bulan,tahun);
  console.log(tahun+' & '+bulan);
  console.log(`mongodb.dftm.start end date > ${startDate} > ${endDate}`);

  let filtered = read.filter(e=>{
    if(e.tanggal > `${startDate}-19` && e.tanggal < `${endDate}-20` && e.pembayaran=='cimb' && e.pembayaran!='kredit'){
      return e
    }
  })

  // filter gopaylatter , debit, gopay
  let gopayLatter = read.filter(e=>{
    if(e.tanggal > `${endDate}-00` && e.tanggal < endDate+'-'+'32' && (e.pembayaran=='gopaylatter' || e.pembayaran=='debit' || e.pembayaran=='gopay')){
      return e
    } 
  })

    // filter mega
  let mega = read.filter(e=>{
    if(e.tanggal > `${startDate}-22` && e.tanggal < `${endDate}-23` && e.pembayaran=='mega'){
      return e
    } 
  })

  // filter kredit
  dataKredit = read.filter(e=>{
    if(e.tanggal > `${endDate}-00` && e.tanggal < endDate+'-'+'32' && e.pembayaran=='kredit'){
      return e
    } 
  })

  let allFilteredData = [...filtered,...gopayLatter,...mega]

  // sort alldata from new to old
  allFilteredData.sort((a,b)=>{
		return new Date(b.tanggal) - new Date(a.tanggal)
	});

  return allFilteredData
}

// total pengeluaran
function totalPerBulan(data,user){
  let jumlah=0;
  if(user=='all'){
    data.forEach(e => {
      jumlah+=parseInt(e.harga)
    });
  };
  if(user=='yoga'){
    data.forEach(e=>{
      if(e.user=='Yoga'){
        jumlah+=parseInt(e.harga)
      }
    })
  };
  if(user=='reysa'){
    data.forEach(e=>{
      if(e.user=='Reysa'){
        jumlah+=parseInt(e.harga)
      }
    })
  };
  if(user=='cimb'){
    data.forEach(el => {
      if(el.pembayaran=='cimb')  {
        jumlah+=Number(el.harga)
      }
    });
  }
  if(user=='gopaylatter'){
    data.forEach(el => {
      if(el.pembayaran=='gopaylatter')  {
        jumlah+=Number(el.harga)
      }
    });
  }
  return jumlah
}


function filtercolor(data){
  if(data=='cimb') return ['red',...data[0]];
  if(data=='mega') return ['yellow',...data[0]];
  if(data=='debit') return ['blue',...data[0]]
	if(data=='gopay') return ['green',...data[0]]
  if(data=="gopaylatter") return ['lime','GL']
  if(data=="kredit") return ['cyan','K']
}

// generate random _sid for cookies
function randomSid(){
  const sid = [];
  const length = 36;
  
  for(let i=0;i<=length;i++){
    const alphabet = "1234567890abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;':\",./<>?";
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    sid.push(letter);
  };
  return sid.join('');
}

// add new token to lokal user database
function addNewToken(token){
  let userToken=fs.readFileSync('data/user.json', 'utf-8');
  userToken=JSON.parse(userToken);
  let newToken={
    value: token,
    time: new Date().getTime()
  }
  userToken[0].token.push(newToken)
  fs.writeFileSync('data/user.json', JSON.stringify(userToken))
}

// find expired token by time
function expiredToken(opr,cookie){
  let user = fs.readFileSync('data/user.json','utf-8');
  user=JSON.parse(user);
  let token=user[0].token;
  if(opr=='logout') {
    let newListToken=token.filter((el)=>{
      return el.value!=cookie 
    })
    user[0].token=newListToken
  };
  if(opr=='login'){
    let newListToken=token.filter((val)=>{
      return val.time > (new Date().getTime() - 24*60*60*1000)
    })
    console.log("🚀 ~ file: mongodb.js:234 ~ newListToken ~ newListToken:", newListToken)
    user[0].token=newListToken
  };
  fs.writeFileSync('data/user.json', JSON.stringify(user));
  console.log('mongodb>user token lokal dbs updated');
}

// find token by token value
function findTokenVal(res,next,cookieValue){
  let user = fs.readFileSync('data/user.json','utf-8');
  user=JSON.parse(user)
  
  let token= user[0].token.find((el)=>{
    return el.value==cookieValue
  })
  if(!token || token.time < new Date().getTime() - 24*60*60*1000) return res.redirect('/login')
  console.log('mongodb>findTokenVal>notyet login');
  return next()
}

module.exports = { findTokenVal,expiredToken,today, datafilterthismonth, filtercolor, mongodb, totalPerBulan, randomSid, addNewToken }

