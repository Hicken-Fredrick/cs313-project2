const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();
const user = 1;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: connectionString }); 

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/gamePage'))
  .get('/moveNorth', (req, res)=>{ 
    pool.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user, (err, result)=>{
      if(err){
        return console.error(err)
      }else{
//        console.log('location: ', JSON.stringify(result.rows))
        res.locals.location = result.rows[0].currentlocation
        console.log(res.locals.location)
        pool.query(`SELECT * FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.location, (err, result)=>{
          if(err){
            return console.error(err)
          }else{
//            console.log('location info: ', JSON.stringify(result.rows))
            res.locals.info = result.rows[0].nodetext
            res.locals.move = result.rows[0].nodenorth
            if(res.locals.move == null){
               res.send("THE WAY IS BLOCKED!")
            }else{
               pool.query(`SELECT * FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.move, (err, result)=>{
//                 console.log('location info: ', JSON.stringify(result.rows))
                 res.send(result.rows[0].nodetext)
               })
            }
          }
        })
      }
    })
  })
  .get('/moveNorth', (req, res)=>{ 
    pool.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user, (err, result)=>{
      if(err){
        return console.error(err)
      }else{
//        console.log('location: ', JSON.stringify(result.rows))
        res.locals.location = result.rows[0].currentlocation
        console.log(res.locals.location)
        pool.query(`SELECT * FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.location, (err, result)=>{
          if(err){
            return console.error(err)
          }else{
//            console.log('location info: ', JSON.stringify(result.rows))
            res.locals.info = result.rows[0].nodetext
            res.locals.move = result.rows[0].nodenorth
            if(res.locals.move == null){
               res.send("THE WAY IS BLOCKED!")
            }else{
               pool.query(`SELECT * FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.move, (err, result)=>{
//                 console.log('location info: ', JSON.stringify(result.rows))
                 res.send(result.rows[0].nodetext)
               })
            }
          }
        })
      }
    })
  })
  .get('/moveSouth', (req, res)=>{ 
    pool.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user, (err, result)=>{
      if(err){
        return console.error(err)
      }else{
//        console.log('location: ', JSON.stringify(result.rows))
        res.locals.location = result.rows[0].currentlocation
        console.log(res.locals.location)
        pool.query(`SELECT * FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.location, (err, result)=>{
          if(err){
            return console.error(err)
          }else{
//            console.log('location info: ', JSON.stringify(result.rows))
            res.locals.info = result.rows[0].nodetext
            res.locals.move = result.rows[0].nodesouth
            if(res.locals.move == null){
               res.send("THE WAY IS BLOCKED!")
            }else{
               pool.query(`SELECT * FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.move, (err, result)=>{
//                 console.log('location info: ', JSON.stringify(result.rows))
                 res.send(result.rows[0].nodetext)
               })
            }
          }
        })
      }
    })
  })
  .get('/moveWest', (req, res)=>{ 
    pool.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user, (err, result)=>{
      if(err){
        return console.error(err)
      }else{
//        console.log('location: ', JSON.stringify(result.rows))
        res.locals.location = result.rows[0].currentlocation
        console.log(res.locals.location)
        pool.query(`SELECT * FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.location, (err, result)=>{
          if(err){
            return console.error(err)
          }else{
//            console.log('location info: ', JSON.stringify(result.rows))
            res.locals.info = result.rows[0].nodetext
            res.locals.move = result.rows[0].nodewest
            if(res.locals.move == null){
               res.send("THE WAY IS BLOCKED!")
            }else{
               pool.query(`SELECT * FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.move, (err, result)=>{
//                 console.log('location info: ', JSON.stringify(result.rows))
                 res.send(result.rows[0].nodetext)
               })
            }
          }
        })
      }
    })
  })
  .get('/moveEast', (req, res)=>{ 
    pool.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user, (err, result)=>{
      if(err){
        return console.error(err)
      }else{
//        console.log('location: ', JSON.stringify(result.rows))
        res.locals.location = result.rows[0].currentlocation
        console.log(res.locals.location)
        pool.query(`SELECT * FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.location, (err, result)=>{
          if(err){
            return console.error(err)
          }else{
//            console.log('location info: ', JSON.stringify(result.rows))
            res.locals.info = result.rows[0].nodetext
            res.locals.move = result.rows[0].nodeeast
            if(res.locals.move == null){
               res.send("THE WAY IS BLOCKED!")
            }else{
               pool.query(`SELECT * FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.move, (err, result)=>{
//                 console.log('location info: ', JSON.stringify(result.rows))
                 res.send(result.rows[0].nodetext)
               })
            }
          }
        })
      }
    })
  })
  //always last
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  
//  async function getLocation(req, res, next) {
//    await pool.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user, (err, result)=>{
//      if(err){
//        return console.error(err)
//      }else{
//        console.log('location: ', JSON.stringify(result.rows))
//        res.locals.location = result.rows[0].currentlocation
//        console.log(res.locals.location)
//      }
//    })
//    await next();
//  }
//
//  async function sendLocation(req, res) {
//    //await sleep(1000);
//    console.log(res.locals.location)
//    res.json(res.locals.location)
//    res.end()
//  }
//
//  //let sleep = require('util').promisify(setTimeout);
//
//let myFirstPromise = new Promise((resolve, reject) => {
//  // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
//  // In this example, we use setTimeout(...) to simulate async code. 
//  // In reality, you will probably be using something like XHR or an HTML5 API.
//  setTimeout( function() {
//    resolve(pool.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user, (err, result)=>{
//      if(err){
//        return console.error(err)
//      }else{
//        console.log('location: ', JSON.stringify(result.rows))
//        res.locals.location = result.rows[0].currentlocation
//        console.log(res.locals.location)
//      }
//    }))  // Yay! Everything went well!
//  }, 250) 
//}) 
//
//myFirstPromise.then((successMessage) => {
//  // successMessage is whatever we passed in the resolve(...) function above.
//  // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
//  console.log("Yay! " + successMessage) 
//});