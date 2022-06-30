const express = require('express')
var expressLayouts = require('express-ejs-layouts');
const { mongo } = require('mongoose');
const app = express()
// const Data = require('./mongoose.js')
const {today, datafilterthismonth, filtercolor, mongodb} = require('./public/js/mongodb.js');
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
  let data = await datafilterthismonth(0)
  // let data = await Data.find()
  // console.log(data);
  res.render('index2', {
    layout: 'main-layout2',
    title: 'budget planner app',
    month: today(1),
    fulldate: today(1,'fulldate'),
    data,
    color: filtercolor,
  });
});

// add data to db
app.post('/send', (req, res) => {
  console.log(req.body);
  mongodb('create',req.body).then(res.redirect('/'));
});

// ganti bulan
app.post('/gantiBulan', async (req, res) => {
  let bulan = req.body.bulan.split('');
  bulan = bulan[5]+bulan[6]
  console.log(bulan);
  let data = await datafilterthismonth(bulan)
  console.log(data);

  // mongodb('create',req.body).then(res.redirect('/'));
});

// detele one
app.get('/delete/:id', (req, res) => {
  mongodb('delete', req.params.id).then(res.redirect('/')) 
});

app.use('/', (req, res) => {
  res.status(404)
  .send('<h1>Page not found</h1>');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
