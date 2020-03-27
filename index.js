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
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .get('/', startUp)
//handle the move north button call
  .get('/moveNorth', getLocation, moveAndSend)
//handle the move south button call
  .get('/moveSouth', getLocation, moveAndSend)
//handle the move west button call
  .get('/moveWest', getLocation, moveAndSend)
//handle the move east button call
  .get('/moveEast', getLocation, moveAndSend)

//always last
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

async function startUp (req, res){
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
}

async function getLocation (req, res, next) {
  //get client
  const client = await pool.connect()
  
  //verify the users current location
  var result = await client.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user)
  console.log('location: ', JSON.stringify(result.rows))

  //save the location of the player
  res.locals.locationNum = result.rows[0].currentlocation
  console.log('location: ', res.locals.locationNum)
  result = await client.query(`SELECT node` + req.query.direction + ` FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.locationNum)
  
  //check for facing
  switch(req.query.direction) {
    case 'north':
      res.locals.move = result.rows[0].nodenorth
      break;
    case 'south':
      res.locals.move = result.rows[0].nodesouth
      break;
    case 'east':
      res.locals.move = result.rows[0].nodeeast
      break;
    case 'west':
      res.locals.move = result.rows[0].nodewest
      break;
  }
  
  next()
}

async function moveAndSend (req, res) {
  const client = await pool.connect()
  try {
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
}