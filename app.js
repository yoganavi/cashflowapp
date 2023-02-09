const express = require('express')
var expressLayouts = require('express-ejs-layouts');
// const morgan = require('morgan');
const { mongo, now } = require('mongoose');
const app = express()
// const Data = require('./mongoose.js')
const {today, datafilterthismonth, filtercolor, mongodb, totalPerBulan} = require('./utils/mongodb.js');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
// const http = require('http');
// setInterval(() => {
//   http.get('http://cashflowapp.yogasaja.repl.co/',(res)=>{
//           res.on('data',(chunk)=>{
//             try {
//               // optional logging... disable after it's working
//               console.log("HEROKU RESPONSE: " + chunk);
//             } catch (err) {
//                 console.log(err.message);
//             }
//           })
//       }).on('error', function(err) {
//         console.log("Error: " + err.message);
//       });
  
// }, 5000);

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
// app.use(morgan('dev'));

// login page
// app.get('/login', (req, res)=>{
//   res.render('login',{
//     layout: 'main-login',
//     jsfile: 'loginpage'
//     cssfile: 'login'
//     title: 'Login | Budget Plan',
//   })
// })

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

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
  };

  res.render('login', {
    layout: 'main-login',
    jsfile: 'loginpage',
    cssfile: 'login',
    title: 'login',
  })
});

app.get('/xml',(req,res)=>{
  res.json({
    nama: "prayoga",
    lokasi: "semarang"
  })
})

app.get('/', async (req, res) => {
  console.log(`app.get-${Date.now()}`);
  dataLogin[1]=Date.now()
 
  // let data = await Data.find()
  let bulan=req.flash('msg'); //! output berupa array 
  let tahun=req.flash('tahun'); //! output berupa array
  let forceRd = req.flash('readData')
  console.log(`bulannnnnnnnnnn ${bulan}`);
  console.log(`bulannnnnnnnnnn ${tahun}`);
  // let login=req.flash('login'); //! output berupa array
  // console.log(login);
  // console.log(login2);
  // if(!login[0] && !login2){
  //   res.redirect('/login')
  // }  
  
  let data = await datafilterthismonth(bulan.length==0? 0 : bulan[0],tahun[0],forceRd[0]) 
  res.render('index2', {
    layout: 'main-layout2',
    title: 'budget planner app',
    month: today(bulan.length==0? 'startMonth' : bulan.join(),tahun),
    fulldate: today('fulldate'),
    data,
    kredit: await datafilterthismonth(bulan.length==0? 0 : bulan[0],tahun[0],forceRd[0],true),
    color: filtercolor,
    totalThisMonth: totalPerBulan(data,'all'),
    totalYoga: totalPerBulan(data,'yoga'),
    totalReysa: totalPerBulan(data,'reysa'),
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
  let tahun = req.body.bulan.split('-')[0];
  // let data = await datafilterthismonth(bulan)

  req.flash('msg', bulan);
  req.flash('tahun', tahun);
  res.redirect('/')
});

// detele one data
app.get('/delete/:id', (req, res) => {
  mongodb('delete', req.params.id).then(res.redirect('/')) 
});

// edit one data
app.post('/edit/:id/:bulan', (req,res)=>{
  console.log(req.params.id);
  console.log(req.body);
  req.flash('msg', req.params.bulan.split('-')[1]);
  req.flash('tahun', req.params.bulan.split('-')[0]);
  req.flash('readData', true);
  
  mongodb('edit',req.params.id,req.body).then(res.redirect('/'))
});

app.use('/', (req, res) => {
  console.log(`app.use/`);
  res.status(404)
  .send('<h1>Page not found</h1>');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
