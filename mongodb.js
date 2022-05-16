const { MongoClient } = require("mongodb");
// Connection URI
const uri = "mongodb+srv://yoga:U17pU4M39j7oPc2M@cluster0.kmlk0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// Database Name
const dbName = "cashflow";
// Create a new MongoClient
const client = new MongoClient(uri, { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect((err,client) => {
  if (err) {
    return console.log("Connection Error:");
  }

  // console.log("Connected successfully to server");
  const db = client.db(dbName);
  
  db.collection("users").insertOne(
    {
      nama: 'erika',
      email:'erikaaaa@gmail.com'
    }, 
    (err, result) => {
      if (err) {
        return console.log("Unable to insert user");
      }
      // console.log(JSON.stringify(result.ops, undefined, 2));
      console.log(result);
    }
  );  
})


  
