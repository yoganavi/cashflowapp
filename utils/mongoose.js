const mongoose = require("mongoose");
// Connection to db
const uri = "mongodb+srv://yoga:U17pU4M39j7oPc2M@cluster0.kmlk0.mongodb.net/cashflow?retryWrites=true&w=majority"; 
mongoose.connect( uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// make schema
const Data = mongoose.model('Data', {
  pembayaran: {
    type: String,
    required: true,
  },
  tanggal: {
    type: String,
    required: true,
  },
  harga: {
    type: String,
    required: true,
  },
  deskripsi:{
    type: String,
    required: true,
  }
});

const data = new Data({
  pembayaran: "mega",
  tanggal: "2022-06-03",
  harga: "75000",
  deskripsi: "makan",
});

module.exports = Data;


async function urut(){
  await data.save()
  Data.find().then(data=>console.log(data))  
}
urut()
// console.log(Data.find().then(data=>console.log(data)));








