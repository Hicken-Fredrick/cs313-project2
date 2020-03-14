require('dotenv').config();
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const user = 1;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: connectionString }); 

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/gamePage'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
  .get('/moveNorth', (req, res)=>{
    pool.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user, (err, result)=>{
        if(err){
            return console.error(err);
        }else{
            console.log('person: ', JSON.stringify(result.rows))
            res.json(result.rows)
        }
    })
  })