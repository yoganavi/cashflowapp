const express = require('express')
var expressLayouts = require('express-ejs-layouts')
const app = express()
const port = process.env.port||'8080'

// use ejs as view engine
app.set('view engine', 'ejs');
// use express layouts
app.use(expressLayouts);
// use static bild in middleware files
app.use(express.static('public'));
// use url-encoded middleware
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', {
    layout: 'main-layout',
    title: 'budget planner app',
  });
});

app.use('/', (req, res) => {
  res.status(404)
  .send('<h1>Page not found</h1>');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
