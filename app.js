import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import bodyParser from 'body-parser';
import { pbAuth } from './utils/pocketbase/pb-auth.js';
import { pb } from './utils/pocketbase/pb-auth.js';
import { pbDatabase, generateDate, filtercolor } from './utils/pocketbase/pb-database.js';

const PORT = process.env.PORT || 8100
const app = express()

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
 // Parses json, multi-part (file), url-encoded
app.use(bodyParser.json())


// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

app.post('/oauth2-redirect', async (req,res) => {
  console.log("🚀 ~ file: app.js:42 ~ app.post ~ oauthProcessingRoute:")
  let record = req.body
  console.log("🚀 ~ file: app.js:43 ~ app.post ~ record:", record)
  // login & create cookies function
  let login = await pbAuth('login',record,req,res)
  if(!login){
    req.flash('frOauth2',true)
    return res.redirect('/login')
  } 
  return res.redirect('/')
});

app.get('/login' ,(req,res)=>{
  console.log('app.use./login');
  let errMsg=req.flash('errMsg')[0]
  console.log("🚀 ~ file: app.js:55 ~ app.get ~ errMsg:", errMsg)
  let errMsgFrOauth2=req.flash('frOauth2')[0]
  if(!errMsg) return res.redirect('/')
  if(errMsgFrOauth2){
    req.flash('errMsg', errMsg)
  }
  
  res.render('login', {
    layout: 'main-login',
    jsfile: 'login',
    cssfile: 'login',
    title: 'login',
    errMsg,
  })
})

app.get('/logout', async (req,res)=>{
  let token=req.cookies.pb_auth
  let logout=await pbAuth('logout', token)
  if(!logout) return res.send('logout FAILED')
  res.clearCookie('pb_auth');
  res.clearCookie('id_user1');
  res.redirect('/login')
})

app.use('/', async (req, res, next) => {
  let path = req.path
  const cookieValue = req.cookies.pb_auth;

  if(path=='/favicon.ico') return
  if(path=='/gantiBulan') return next()
  
  console.log("🚀 ~ file: app.js:51 ~ app.use ~ path:", path)
  
  if(!cookieValue) {
    req.flash('errMsg','login');
    return res.redirect('/login');
  }
  // (async ()=>{
    let cookieCheck = await pbAuth('cek', cookieValue, req, res)
    if(!cookieCheck) return res.redirect('/logout')
  // })()

  // redirect to permitted paths
  let userPath = req.flash('path')[0]
  if(userPath != 'all'){
    if(path!='/'){
      return next()
    }
    return res.redirect(`${userPath}`)
  }

  next()
});

app.post('/records', async (req,res)=>{
  let collection = req.query.collection
  let filter = req.query.filter
  console.log("🚀 ~ file: app.js:114 ~ app.post ~ filter:", filter)
  const records = await pb.collection('budget_data').getFullList({
    filter: `${filter}`,
  });

  res.json(records)
})

app.get('/user2',async (req,res)=>{
  let msg=req.flash('msg');
  let reqGantiBulan = req.flash('date')[0]
  console.log("🚀 ~ file: app.js:124 ~ app.get ~ reqGantiBulan:", reqGantiBulan)
  let month = generateDate('yyyy-mm');
  let fulldate = generateDate('yyyy-mm-dd');
  if(reqGantiBulan){
    month = `${reqGantiBulan.tahun}-${reqGantiBulan.bulan}`
  }
  let data = await pbDatabase('read',month,req,res,'april')
  // console.log("🚀 ~ file: app.js:131 ~ app.get ~ data:", data)

  res.render('index3', {
    layout: 'main-layout2',
    title: 'budget planner app',
    month,
    msg,
    fulldate,
    data,
    color: filtercolor,
    totalCimb: 10000,
    totalGopayLatter: 10000,
  });
})


app.get('/', async (req, res) => {
  let msg=req.flash('msg');
  let reqGantiBulan = req.flash('date')[0]
  console.log("🚀 ~ file: app.js:112 ~ app.get ~ reqGantiBulan:", reqGantiBulan)
  let month = generateDate('yyyy-mm');
  let fulldate = generateDate('yyyy-mm-dd');
  if(reqGantiBulan){
    month = `${reqGantiBulan.tahun}-${reqGantiBulan.bulan}`
  }
  let data = await pbDatabase('read',month,req,res,'')
  // console.log("🚀 ~ file: app.js:118 ~ app.get ~ data:", data)
  console.log("🚀 ~ file: app.js:119 ~ app.get ~ READ DATA DONE!")
  // return 
  // let data = await datafilterthismonth(bulan[0],tahun[0],readDBS[0]) 
  res.render('index2', {
    layout: 'main-layout2',
    title: 'budget planner app',
    month,
    msg,
    fulldate,
    data,
    color: filtercolor,
    totalCimb: 10000,
    totalGopayLatter: 10000,
  });
});

// add data to db
app.post('/send', async (req, res) => {
  console.log(req.body);
  let add=await pbDatabase('create',req.body,req)
  if(add) req.flash('msg',`add data succces ${req.body.pembayaran}`)
  res.redirect('/');
});

// ganti bulan
app.post('/gantiBulan', (req, res) => {
  let bulan = req.body.bulan.split('-')[1];
  let tahun = req.body.bulan.split('-')[0];
  req.flash('date', {bulan,tahun});
  res.redirect('/')
});

// delete one data
app.get('/delete', async (req, res) => {
  let record = await pbDatabase('delete', {id : req.query.id})

  res.redirect('/'); 
});

// edit one data
app.post('/edit', async (req,res)=>{
  req.flash('bulan', req.query.bulan.split('-')[1]);
  req.flash('tahun', req.query.bulan.split('-')[0]);
  let datas = req.body
  datas.id=req.query.id
  
  let record = await pbDatabase('update', datas)
  res.redirect('/')
});

// logout
app.use('/', (req, res) => {
  console.log(`app.use/ PAGE NOT FOUND!!!!`);
  res.status(404)
  .send('<h1>Page not found</h1>');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})