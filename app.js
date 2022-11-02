const express = require('express')
var expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const { mongo, now } = require('mongoose');
const app = express()
// const Data = require('./mongoose.js')
const {today, datafilterthismonth, filtercolor, mongodb, totalPerBulan} = require('./utils/mongodb.js');
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
// use morgan
app.use(morgan('dev'));

// login page
// app.get('/login', (req, res)=>{
//   res.render('login',{
//     layout: 'main-login',
//     jsfile: 'loginpage'
//     cssfile: 'login'
//     title: 'Login | Budget Plan',
//   })
// })

let dataLogin=['yoga',0];

app.post('/loginval', (req,res) => {
  console.log(req.body);
  dataLogin[1]=Date.now()
  res.redirect('/')
});
app.use('/',(req, res, next) => {
  console.log(`app.use-${dataLogin[1]+10000}`);
  console.log(`app.use-${Date.now()}`);
  if(dataLogin[1]+1000000 > Date.now()){
    console.log('notyet login');
    return next()
  }
  res.render('login', {
    layout: 'main-login',
    jsfile: 'loginpage',
    cssfile: 'login',
    title: 'login',
  })
});

app.get('/', async (req, res) => {
  console.log(`app.get-${Date.now()}`);
  dataLogin[1]=Date.now()
 
  // let data = await Data.find()
  let bulan=req.flash('msg'); //! output berupa array 
  console.log(`bulannnnnnnnnnn ${bulan}`);
  // let load=req.flash('msg2'); //! output berupa array
  // let login=req.flash('login'); //! output berupa array
  // console.log(login);
  // console.log(login2);
  // if(!login[0] && !login2){
  //   res.redirect('/login')
  // }  
  
  let data = await datafilterthismonth(bulan.length==0? 0 : bulan[0]) 
  res.render('index2', {
    layout: 'main-layout2',
    title: 'budget planner app',
    month: today(bulan.length==0? 'startMonth' : bulan.join()),
    fulldate: today('fulldate'),
    data,
    color: filtercolor,
    totalThisMonth: totalPerBulan(data,'all'),
    totalYoga: totalPerBulan(data,'yoga'),
    totalReysa: totalPerBulan(data,'reysa')
  });
});

// app.get('/login', (req,res) => {
//   res.render('login', {
//     layout: 'main-login',
//     jsfile: 'loginpage',
//     cssfile: 'login',
//     title: 'login',
//   })
// })

// add data to db
app.post('/send', (req, res) => {
  console.log(req.body);
  mongodb('create',req.body).then(res.redirect('/'));
});

// ganti bulan
app.post('/gantiBulan', (req, res) => {
  let bulan = req.body.bulan.split('-')[1];
  // let data = await datafilterthismonth(bulan)
  // console.log(data);
  req.flash('msg', bulan);
  req.flash('msg2', '0');
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
  console.log(`app.use/`);
  res.status(404)
  .send('<h1>Page not found</h1>');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
