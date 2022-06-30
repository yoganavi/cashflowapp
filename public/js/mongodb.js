const { ObjectID } = require('bson');
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://yoga:4TLK76yucf0QA3pQ@cluster0.kmlk0.mongodb.net/cashflow?retryWrites=true&w=majority"; 

// Database Name
const dbName = "cashflow";
// Create a new MongoClient
const client = new MongoClient(uri, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

function mongodb(action,data) {
  return new Promise((resolve, reject) => {
    client.connect((err,client) => {
      if (err) {
        return console.log("Connection Error:");
      };
      const db = client.db(dbName);

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
          {_id: ObjectID(data)}, (err, result) => {
            if (err) {
              return console.log("Unable to delete user");
            }
            console.log(result)
          }
        );
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


function today(data,days){
  let today = new Date();
  let yyyy = today.getFullYear();
  let dd = String(today.getDate()).padStart(2, '0');
  if(typeof(data)=='string'){
    if(data.length>2){
      return `${yyyy}-${data.split('',2).join('')}`
    }
    return `${yyyy}-0${data-1}`
  };
  let mm = String(today.getMonth() + data).padStart(2, '0'); //January is 0!
  if(days){
    return yyyy + '-' + mm + '-' + dd;
  }
  return yyyy + '-' + mm;
}
// mongodb('read').then(data=>{
//   console.log(data)
// });  

async function datafilterthismonth(data){
  let read = await mongodb('read');
  
  let filtered = read.filter(e=>{
    if(e.tanggal > `${today(data)}-20` && e.tanggal < today(data+1)+'-'+'19' && e.pembayaran!='gopaylatter'){
      return e
    } 
  })
  return filtered
}
datafilterthismonth('04')
function filtercolor(data){
  if(data=='cimb'){ return ['red',...data[0]]};
  if(data=='mega'){ return ['yellow',...data[0]] };
  if(data=='debit'){ return ['blue',...data[0]] }
	if(data=='gopay' || data=="gopaylatter"){ return ['green',...data[0]] }
}

module.exports = { today, datafilterthismonth, filtercolor, mongodb }

let asd = ['cimb','mega']

// let huruf= ...asd
// console.log(filtercolor('gopay'));

// let bulan= today(0).split('');
// bulan = parseInt(bulan[5]+bulan[6])
// console.log(bulan);
// console.log(today(1));
datafilterthismonth().then((data)=>{
  // console.log(data);
}) 