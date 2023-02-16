const {MongoClient, ObjectId} = require('mongodb');
const uri = "mongodb+srv://yoga:makanyuk@cluster0.kmlk0.mongodb.net/?retryWrites=true&w=majority"; 
// mongodb+srv://yoga:<password>@cluster0.kmlk0.mongodb.net/?retryWrites=true&w=majority

// Database Name
let dbName;
function chosedb(data){
  dbName=data
}
// chosedb('cashflow')

// Create a new MongoClient
const client = new MongoClient(uri, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});


function mongodb(action,data,data2) {
  return new Promise((resolve, reject) => {
    client.connect((err,client) => {
      if (err) {
        return console.log("Connection Error:");
      };
      const db = client.db('cashflow');
      
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
        db.collection('datas').find()
          .toArray((err, result)=>{
            resolve(result)
          })
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
    })
  })
}
// let mongoread = new Promise((resolve, reject) => {
//     mongo('read').then(data=>{
//       tanggal=[];
//       data.forEach(e => {
//         tanggal.push(e.harga)
//       });
//       resolve(tanggal)
//     })
//   })

// async function mongoread(){
//   let data = await mongo('read'),
//   tanggal=[];
//   data.forEach(e => {
//     tanggal.push(e.harga);
//   });
//   return tanggal
// }

function today(data,tahun){
  let today = new Date();
  let yyyy = today.getFullYear();
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let dd = String(today.getDate()).padStart(2, '0');
  // if(typeof(data)=='string'){
  //   if(data.length>2){
  //     return `${yyyy}-${data.split('',2).join('')}`
  //   }
  //   if(data=='01'){
  //     console.log(data-1);
  //     return `${yyyy-1}-12`
  //   }
  //   console.log(data-1);
  //   return `${yyyy}-${String(data-1).padStart(2,'0')}`
  // };

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
  console.log('object');
  return `${tahun}-${String(data).padStart(2,'0')}`
}

let read;
async function datafilterthismonth(data,tahun,readData,kredit){
  console.log(Boolean(readData));
  if(data==0 || readData){ // data bulan 0 karena halaman baru dibuka / refresh 
    console.log('readalldata');
    read = await mongodb('read');
    if(!readData){ // readData > true itu alur dari edit data jadi jgn di generate bulan dan tahun dibawah krn akan membaca bulan saat ini
      data = today("startMonth").split('-')[1] //generate data yyyy-mm saat ini dan ambil data bulanny saja
      tahun = today("startMonth").split('-')[0] //generate data yyyy-mm saat ini dan ambil data tahun saja
    }
  };
  console.log('not readalldata');
  console.log(data);
  console.log(tahun);
  let startDate = today(data-1,tahun);
  let endDate = today(data,tahun);
  console.log(`start end date > ${startDate} > ${endDate}`);

  let filtered = read.filter(e=>{
    if(e.tanggal > `${startDate}-19` && e.tanggal < `${endDate}-20` && e.pembayaran!='gopaylatter' && e.pembayaran!='debit' && e.pembayaran!='mega' && e.pembayaran!='kredit'){
      return e
    }
  })

  // filter gopaylatter & debit
  let gopayLatter = read.filter(e=>{
    if(e.tanggal > `${endDate}-00` && e.tanggal < endDate+'-'+'32' && (e.pembayaran=='gopaylatter' || e.pembayaran=='debit')){
      return e
    } 
  })

  // filter kredit
  let dataKredit = read.filter(e=>{
    if(e.tanggal > `${endDate}-00` && e.tanggal < endDate+'-'+'32' && e.pembayaran=='kredit'){
      return e
    } 
  })
  
  // filter mega
  let mega = read.filter(e=>{
    if(e.tanggal > `${startDate}-22` && e.tanggal < `${endDate}-23` && e.pembayaran=='mega'){
      return e
    } 
  })

  let allFilteredData = [...filtered,...gopayLatter,...mega]

  // sort data from new to old
  allFilteredData.sort((a,b)=>{
		return new Date(b.tanggal) - new Date(a.tanggal)
	});

  if(kredit) return dataKredit

  return allFilteredData
}

// datafilterthismonth(0)

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


module.exports = { today, datafilterthismonth, filtercolor, mongodb, totalPerBulan }

let asd = ['cimb','mega']

// let huruf= ...asd
// console.log(filtercolor('gopay'));

// let bulan= today(0).split('');
// bulan = parseInt(bulan[5]+bulan[6])
// console.log(bulan);
// console.log(today(1));
// datafilterthismonth().then((data)=>{
//   console.log(data);
// }) 