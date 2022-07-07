const express = require('express')
var expressLayouts = require('express-ejs-layouts');
const { mongo } = require('mongoose');
const app = express()
// const Data = require('./mongoose.js')
const {today, datafilterthismonth, filtercolor, mongodb, totalPerBulan} = require('./public/js/mongodb.js');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const PORT = process.env.PORT || 3000

// use ejs as view engine
app.set('view engine', 'ejs');
// use express layouts
app.use(expressLayouts);
// use static bild in middleware files
app.use(express.static('public'));
// use url-encoded middleware
app.use(express.urlencoded({ extended: true }));
// konfigurasi flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get('/', async (req, res) => {
  // let data = await Data.find()
  let bulan=req.flash('msg'); //! output berupa array > string harus di join
  let data = await datafilterthismonth(bulan.length==0? 0 : bulan.join('')) 

  res.render('index2', {
    layout: 'main-layout2',
    title: 'budget planner app',
    month: today(bulan.length==0? 1 : bulan.join('')+1),
    fulldate: today(1,'fulldate'),
    data,
    color: filtercolor,
    totalThisMonth: totalPerBulan(data)
  });
});

// add data to db
app.post('/send', (req, res) => {
  console.log(req.body);
  mongodb('create',req.body).then(res.redirect('/'));
});

// ganti bulan
app.post('/gantiBulan', (req, res) => {
  let bulan = req.body.bulan.split('');
  bulan = bulan[5]+bulan[6]
  // console.log(bulan);
  // let data = await datafilterthismonth(bulan)
  // console.log(data);
  req.flash('msg', bulan);
  res.redirect('/')
});

// detele one
app.get('/delete/:id', (req, res) => {
  mongodb('delete', req.params.id).then(res.redirect('/')) 
});

// edit one
app.post('/edit/:id', (req,res)=>{
  console.log(req.params.id);
  console.log(req.body);
  mongodb('edit',req.params.id,req.body).then(res.redirect('/')) 
})

app.use('/', (req, res) => {
  res.status(404)
  .send('<h1>Page not found</h1>');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
