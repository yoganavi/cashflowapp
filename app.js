const express = require('express')
var expressLayouts = require('express-ejs-layouts');
// const morgan = require('morgan');
const { mongo, now } = require('mongoose');
const app = express()
// const Data = require('./mongoose.js')
const { findTokenVal,expiredToken, addNewToken, today, datafilterthismonth, filtercolor, mongodb, totalPerBulan, randomSid} = require('./utils/mongodb.js');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8100

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
    secret: 'abrakadabara-secret',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post('/loginval', (req,res) => {
  console.log(req.body);
  req.session.authenticated=false;

  if(req.body.username=='yoga' && req.body.password==123){
    let sid = randomSid();
    let expiredTime=24*60*60*1000;
    res.cookie('_sid', sid, {  maxAge: expiredTime, secure: true });
    req.session.authenticated=true;
    req.session.token=sid;
    req.session.userAgent=req.headers['user-agent'];
    addNewToken(sid)
  } 
  res.redirect('/')
});

app.get('/login',(req,res)=>{
  expiredToken('login')
  console.log('app.use./login');

  res.render('login', {
    layout: 'main-login',
    jsfile: 'loginpage',
    cssfile: 'login',
    title: 'login',
  })
})

// const isAuthenticated = (req,res,next)=>{
  // if(req.session.authenticated){
  //   console.log('app.isAuthenticated.true');
  //   next()
  // } else{
  //   console.log('app.isAuthenticated.false');
  //   res.redirect('/login')
  // }
// }


app.use('/', (req, res, next) => {
  const cookieValue = req.cookies._sid;
  if(!cookieValue) return res.redirect('/login');
  
  const sessionAuth=req.session.authenticated, cookieAuth=req.session.token === cookieValue, userAgentAuth=req.session.userAgent === req.headers['user-agent'];
//! tambah req ip client yg disimpan d server agar ip client terakir terekam d server 
  console.log('app.use/.cookieValue');
  console.log(cookieValue);
  console.log(req.session.token);
  console.log(cookieAuth);
  console.log(req.session.userAgent);
  console.log(userAgentAuth);

  findTokenVal(res,next,cookieValue)
  // if( sessionAuth && cookieAuth && userAgentAuth){
  //   console.log('app.use/.notyet login');
  //   res.cookie('_sid', cookieValue, {  maxAge: 10*60*1000, secure: true });

  //   return next()
  // };
});



// app.use(bodyParser.json());

// app.post('/loginval',(req,res)=>{
//   console.log(req.body);
//   console.log(req.body.age);
//   if(req.body.age==30){
//     req.flash('validation',true)
//     console.log('/');
//     res.redirect('/');
//   }else{
//     req.flash('validation',true)
//     console.log('/login');
//     res.redirect('/login');
//   }
// });

// app.use('/',(req, res, next) => {
//   let validationn = req.flash('validation')
//   console.log("validationn");
//   console.log(Boolean(validationn[0]));
//   if(validationn[0]){
//     console.log('next');
//     return next()
//   }

//   console.log('!validation');
//   res.render('loginval', {
//     layout: 'main-login2',
//     jsfile: 'loginpage',
//     title: 'login',
//   })
// });

// app.get('/login',(req,res)=>{
//   res.render('login', {
//     layout: 'main-login',
//     jsfile: 'loginpage',
//     cssfile: 'login',
//     title: 'login',
//   })
// });

app.get('/xml',(req,res)=>{
  console.log('/xml done');
  res.json({
    nama: "prayoga",
    lokasi: "semarang"
  })
})

// sync func
app.get('/sync',(req,res)=>{
  req.flash('readData', 'cloud');
  res.redirect('/')
});

app.post('/calc', (req,res)=>{
  let spp = 2;
  res.render('calculator',{
    layout: 'main-layout',
    spp: spp,
    title: 'budget planner app',
    css: 'calculator.css',
  })
})

app.get('/', async (req, res) => {
  let bulan=req.flash('bulan'); //! output berupa array 
  let tahun=req.flash('tahun'); //! output berupa array
  let readDBS = req.flash('readData')
  console.log(`app.get/.bulan.${bulan}`);
  console.log(`app.get/.tahun.${tahun}`);
  console.log('app.get/.bulan[0].'+Boolean(bulan[0]));
  
  let data = await datafilterthismonth(bulan[0],tahun[0],readDBS[0]) 
  res.render('index2', {
    layout: 'main-layout2',
    title: 'budget planner app',
    month: today(bulan.length==0? 'startMonth' : bulan.join(),tahun),
    fulldate: today('fulldate'),
    data,
    kredit: await datafilterthismonth(null,null,null,'kredit'),
    color: filtercolor,
    totalThisMonth: totalPerBulan(data,'all'),
    totalYoga: totalPerBulan(data,'yoga'),
    totalReysa: totalPerBulan(data,'reysa'),
    totalCimb: totalPerBulan(data,'cimb'),
    totalGopayLatter: totalPerBulan(data,'gopaylatter'),
  });
});

// add data to db
app.post('/send', async (req, res) => {
  console.log('app.js>post/send '+req.body);
  console.log(req.body);
  req.flash('readData', 'cloud');

  await mongodb('create',req.body)
  res.redirect('/');
});

// ganti bulan
app.post('/gantiBulan', (req, res) => {
  let bulan = req.body.bulan.split('-')[1];
  let tahun = req.body.bulan.split('-')[0];
  req.flash('bulan', bulan);
  req.flash('tahun', tahun);
  res.redirect('/')
});

// delete one data
app.get('/delete/:id', async (req, res) => {
  console.log('app.get./delete');
  await mongodb('delete', req.params.id);
  req.flash('readData', 'cloud');
  res.redirect('/'); 
});

// edit one data
app.post('/edit/:id/:bulan', async (req,res)=>{
  console.log('app.js>edit data '+ req.params.bulan);
  console.log(req.params.id);
  req.flash('bulan', req.params.bulan.split('-')[1]);
  req.flash('tahun', req.params.bulan.split('-')[0]);
  req.flash('readData', 'cloud');
  
  await mongodb('edit',req.params.id,req.body);
  res.redirect('/')
});

// logout
app.get('/logout', (req,res)=>{
  let cookie=req.cookies._sid
  expiredToken('logout',cookie)
  res.clearCookie('_sid');
  req.session.destroy();
  res.redirect('/login')
})

app.use('/', (req, res) => {
  console.log(`app.use/`);
  res.status(404)
  .send('<h1>Page not found</h1>');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
