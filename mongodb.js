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

// function mongo(action, data) {
//   client.connect((err,client) => {
//     if (err) {
//       return console.log("Connection Error:");
//     };
//     const db = client.db(dbName);

//     if(action=='create'){
//       // create one
//       db.collection("users").insertOne(
//         data, 
//         (err, result) => {
//           if (err) {
//             return console.log("Unable to insert user");
//           }
//           console.log(result)
//         }
//       );
//     }else if(action=='read'){
//       // read all
//       let abc;
//       db.collection("users").find().toArray(
//         (err, result) => { 
//           abc=result
//         }
//       );
//       console.log(abc);;
//     }
//   })
// }


// mongo('read')

// module.exports = { mongo }
client.connect((err,client) => {
  if (err) {
    return console.log("Connection Error:");
  };
  const db = client.db(dbName);
  
    // read all
    db.collection("users").find().toArray(
      (err, result) => {
        return result
      }
    )
});