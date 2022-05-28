const express = require('express')
var expressLayouts = require('express-ejs-layouts')
const app = express()
// const Data = require('./mongoose.js')
const {mongo} = require('./mongodb.js');
const PORT = process.env.PORT || 3000

// use ejs as view engine
app.set('view engine', 'ejs');
// use express layouts
app.use(expressLayouts);
// use static bild in middleware files
app.use(express.static('public'));
// use url-encoded middleware
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  // mongo('read').then(result=>{
  //   res.send(result)
  // })
  let data = await mongo('read')
  // let data = await Data.find()
  // console.log(data);
  res.render('index', {
    layout: 'main-layout',
    title: 'budget planner app',
    data,
  });
});

// get data from form
app.post('/form', (req, res) => {
  mongo('create',req.body);
  res.redirect('/');
  // res.send('success');
});

app.use('/', (req, res) => {
  res.status(404)
  .send('<h1>Page not found</h1>');
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
