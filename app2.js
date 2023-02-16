const { MongoClient, ObjectId } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb+srv://yoga:makanyuk@cluster0.kmlk0.mongodb.net/?retryWrites=true&w=majority"; 

const client = new MongoClient(uri);
const dbName = client.db('yoga');
const datas = dbName.collection('datas');

function mongoDB(ops,data) {
  if(ops=='read'){
    const ctt2 = datas.find({}).toArray();
    return ctt2
  }

  if(ops=='insert'){
    datas.insertOne(
      {
        tanggal: '2023-01-11',
        pembayaran: 'debit',
        deskripsi: 'hallo',
        harga: '110000'
      }, (error,result)=>{
        if (error){
          return console.log(error);
        }
        console.log(result)
      }
    )
  }

  if(ops=="delete"){
    const deleteResult = datas.deleteMany(
    { _id: ObjectId(data) }
    );

    return deleteResult
  }
}

// mongoDB('read','')
// .then((dat)=>{
//   console.log(dat);
// })
// .finally(() => client.close());

async function coba(){
  let baca = await mongoDB('read')
  console.log(baca);
}

coba()