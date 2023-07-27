const { MongoClient, ObjectId } = require("mongodb");
const fs = require('fs')

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
  setTimeout(() => {
    console.log('wait');
  }, 5000);
  let baca = await mongoDB('read')
  console.log(baca);
  console.log('done');
}

const pass = [];
const length = 36;

for(let i=0;i<=length;i++){
  const alphabet = "1234567890abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;':\",./<>?";
  const letter = alphabet[Math.floor(Math.random() * alphabet.length)];

  pass.push(letter)
}

console.log(pass.join(''));


let user = fs.readFileSync('data/user.json','utf-8');
user=JSON.parse(user)
let token=user[0].token
console.log(token);
let newListToken=token.filter((val)=>{
  return val.time > 1688477941534
})
console.log(newListToken);
user[0].token=newListToken
console.log(user[0]);

let cari = token.find(el=>el.value==`0er[e.k1_p'bvke*j)*wjs)!+#"vvrx?hzjyh`)
console.log(cari);

// let passJoin=pass.join('')
// let token2 = {
//   value: passJoin,
//   time: new Date().getTime() 
// }
// user[0].token.push(token2)
// console.log(user[0].token);
// fs.writeFileSync('data/user.json', JSON.stringify(user));

// const fruits = ["apple", "banana", "orange"];
// const fruitsString = fruits.join('');

// console.log(fruitsString);