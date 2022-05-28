const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://yoga:U17pU4M39j7oPc2M@cluster0.kmlk0.mongodb.net/cashflow?retryWrites=true&w=majority"; 

// Database Name
const dbName = "cashflow";
// Create a new MongoClient
const client = new MongoClient(uri, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

function mongo(action,data) {
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

module.exports = { mongo }

mongo('read').then(result=>{
  let ab=[]
  result.forEach(e => {
    // console.log(e.harga);
    ab.push(e.harga)
  });
  return ab
})