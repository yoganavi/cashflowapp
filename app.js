const express = require('express')
var expressLayouts = require('express-ejs-layouts');
const { mongo } = require('mongoose');
const app = express()
// const Data = require('./mongoose.js')
const {mongodb, mongoread, today, datafilterthismonth} = require('./public/js/mongodb.js');
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
  let data = await datafilterthismonth('read')
  // let data = await Data.find()
  console.log(data);
  res.render('index2', {
    layout: 'main-layout2',
    title: 'budget planner app',
    today: today(1),
    data,
  });
});

// get data from form
app.post('/form', (req, res) => {
  mongo('create',req.body);
  res.redirect('/');
  // res.send('success');
});

app.post('/cobaya', (req, res) => {
  console.log(req.body); 
  // res.redirect('/');
});

app.use('/', (req, res) => {
  res.status(404)
  .send('<h1>Page not found</h1>');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
