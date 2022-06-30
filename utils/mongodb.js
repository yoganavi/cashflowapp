const {MongoClient} = require('mongodb');

const uri = 'mongodb+srv://yoga:4TLK76yucf0QA3pQ@cluster0.kmlk0.mongodb.net/?retryWrites=true&w=majority'
const dbName = 'cashflow'

const client = new MongoClient(uri, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect((err,client)=>{
  if(err){
    return console.log('err');
  }
  const db = client.db(dbName);

  db.collection('datas').find()
  .toArray((err, result)=>{
    console.log(result)
  })
  // console.log('berhasil');
})
