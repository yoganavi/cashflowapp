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
  pembayaran: "gopay",
  tanggal: "2020-06-05",
  harga: "30000",
  deskripsi: "belanja",
});

module.exports = Data;

data.save()








