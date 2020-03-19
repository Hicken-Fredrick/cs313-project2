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
  .get('/', (req, res) => {
    (async () => {
      const client = await pool.connect()
        try {
          //verify the users current location
          var result = await client.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user)
          console.log('location: ', JSON.stringify(result.rows))
          
          //save the location of the player then call the node they are on to output start text
          res.locals.locationNum = result.rows[0].currentlocation
          console.log('location: ', res.locals.locationNum)
          result = await client.query(`SELECT nodename, nodetext FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.locationNum)
          
          //send data back in with page render to let player know where they are on start
          res.render('pages/gamePage', {locName: result.rows[0].nodename, locText: result.rows[0].nodetext})
        } finally {
          //release client
          client.release()
        }
      })().catch(err => console.log(err.stack))
  })
//handle the move north button call
  .get('/moveNorth', (req, res)=>{ 
    (async () => {
      const client = await pool.connect()
      try {
        //verify the users current location
        var result = await client.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user)
        console.log('location: ', JSON.stringify(result.rows))
          
        //save the location of the player
        res.locals.locationNum = result.rows[0].currentlocation
        console.log('location: ', res.locals.locationNum)
        result = await client.query(`SELECT nodenorth FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.locationNum)
        res.locals.move = result.rows[0].nodenorth
          
        //check if move is possible
        if(res.locals.move == null){
          //unable to move, send back failure message
          res.send({locName:"Blocked", locText: "The way is shut. It was made by those who are Dead, and the Dead keep it, until the time comes. The way is shut."})
        }else{
          //move is possible, move player and get info
          client.query(`UPDATE projecttwo.game SET currentlocation = ` + res.locals.move + ` WHERE playerid  = ` + user)
          result = await client.query(`SELECT nodename, nodetext FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.move)
            
          //send back data on where the player moved to
          res.send({locName:result.rows[0].nodename, locText: result.rows[0].nodetext})
        }
      }finally {
        //release client
        client.release()
      }
    })().catch(err => console.log(err.stack))
 })
//handle the move south button call
  .get('/moveSouth', (req, res)=>{ 
    (async () => {
      const client = await pool.connect()
      try {
        //verify the users current location
        var result = await client.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user)
        console.log('location: ', JSON.stringify(result.rows))
          
        //save the location of the player
        res.locals.locationNum = result.rows[0].currentlocation
        console.log('location: ', res.locals.locationNum)
        result = await client.query(`SELECT nodesouth FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.locationNum)
        res.locals.move = result.rows[0].nodesouth
          
        //check if move is possible
        if(res.locals.move == null){
          //unable to move, send back failure message
          res.send({locName:"Blocked", locText: "The way is shut. It was made by those who are Dead, and the Dead keep it, until the time comes. The way is shut."})
        }else{
          //move is possible, move player and get info
          client.query(`UPDATE projecttwo.game SET currentlocation = ` + res.locals.move + ` WHERE playerid  = ` + user)
          result = await client.query(`SELECT nodename, nodetext FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.move)
            
          //send back data on where the player moved to
          res.send({locName:result.rows[0].nodename, locText: result.rows[0].nodetext})
        }
      }finally {
        //release client
        client.release()
      }
    })().catch(err => console.log(err.stack))
  })
//handle the move west button call
  .get('/moveWest', (req, res)=>{ 
    (async () => {
      const client = await pool.connect()
      try {
        //verify the users current location
        var result = await client.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user)
        console.log('location: ', JSON.stringify(result.rows))
          
        //save the location of the player
        res.locals.locationNum = result.rows[0].currentlocation
        console.log('location: ', res.locals.locationNum)
        result = await client.query(`SELECT nodewest FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.locationNum)
        res.locals.move = result.rows[0].nodewest
          
        //check if move is possible
        if(res.locals.move == null){
          //unable to move, send back failure message
          res.send({locName:"Blocked", locText: "The way is shut. It was made by those who are Dead, and the Dead keep it, until the time comes. The way is shut."})
        }else{
          //move is possible, move player and get info
          client.query(`UPDATE projecttwo.game SET currentlocation = ` + res.locals.move + ` WHERE playerid  = ` + user)
          result = await client.query(`SELECT nodename, nodetext FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.move)
            
          //send back data on where the player moved to
          res.send({locName:result.rows[0].nodename, locText: result.rows[0].nodetext})
        }
      }finally {
        //release client
        client.release()
      }
    })().catch(err => console.log(err.stack))
  })
//handle the move east button call
  .get('/moveEast', (req, res)=>{ 
    (async () => {
      const client = await pool.connect()
      try {
        //verify the users current location
        var result = await client.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user)
        console.log('location: ', JSON.stringify(result.rows))
          
        //save the location of the player
        res.locals.locationNum = result.rows[0].currentlocation
        console.log('location: ', res.locals.locationNum)
        result = await client.query(`SELECT nodeeast FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.locationNum)
        res.locals.move = result.rows[0].nodeeast
          
        //check if move is possible
        if(res.locals.move == null){
          //unable to move, send back failure message
          res.send({locName:"Blocked", locText: "The way is shut. It was made by those who are Dead, and the Dead keep it, until the time comes. The way is shut."})
        }else{
          //move is possible, move player and get info
          client.query(`UPDATE projecttwo.game SET currentlocation = ` + res.locals.move + ` WHERE playerid  = ` + user)
          result = await client.query(`SELECT nodename, nodetext FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.move)
            
          //send back data on where the player moved to
          res.send({locName:result.rows[0].nodename, locText: result.rows[0].nodetext})
        }
      }finally {
        //release client
        client.release()
      }
    })().catch(err => console.log(err.stack))
  })
  //always last
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))