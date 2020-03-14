require('dotenv').config();
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: connectionString }); 

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/gamePage'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
