const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://yoga:U17pU4M39j7oPc2M@cluster0.kmlk0.mongodb.net/cashflow?retryWrites=true&w=majority"; 

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


function today(data){
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + data).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  return yyyy + '-' + mm;
}

async function datafilterthismonth(data){
  let read = await mongodb('read');
  let filtered = read.filter(e=>{
    if(e.tanggal > today(0)+'-'+'20' && e.tanggal < today(1)+'-'+'19' && e.pembayaran!='gopaylatter'){
      return e
    } 
  })
  return filtered
}


module.exports = { mongodb, today, datafilterthismonth }