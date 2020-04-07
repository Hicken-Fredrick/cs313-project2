const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();
const user = 1;
const map = 1;
const herohp = 5;
const heromp = 5;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: connectionString }); 

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())

//handle intial page call
  .get('/', startUp)

//handle new game button
  .get('/newGame', newGame, getLocation, moveAndSend)

//handle the move north button call
  .get('/moveNorth', getLocation, moveAndSend)

//handle the move south button call
  .get('/moveSouth', getLocation, moveAndSend)

//handle the move west button call
  .get('/moveWest', getLocation, moveAndSend)

//handle the move east button call
  .get('/moveEast', getLocation, moveAndSend)

//handle action calls
  .get('/action', handleAction, triggerAction)

//always last
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

/*
Gathers basic data to display current game contents
essentially this calls the last save point of the player
*/
async function startUp (req, res){
  const client = await pool.connect()
    try {
      //grab last location saved
      var result = await client.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user)
      console.log('location: ', JSON.stringify(result.rows))

      //save the location of the player then call the node they are on to output start text
      res.locals.locationNum = result.rows[0].currentlocation
      console.log('location: ', res.locals.locationNum)
      result = await client.query(`SELECT nodename, nodetext FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.locationNum)
      
      //get actions on current location
      actions = await client.query(`SELECT eventid, eventaction FROM projecttwo.mapevent WHERE mapnodeconnection = ` + res.locals.locationNum + ` ORDER BY eventid`)

      //send data back in with page render to let player know where they are on start
      res.render('pages/gamePage', {locName: result.rows[0].nodename, locText: result.rows[0].nodetext, actions: actions.rows})
    } finally {
      //release client
      client.release()
    }
}

/*
As players can only have 1 active game at a time
this function will delete the game and corresponding content
then it will create a new game and send the first response to the player
*/
async function newGame (req, res, next) {
  //get client
  const client = await pool.connect()
  try {
    //grab game data for deletion
    var result = await client.query(`SELECT heroid, invid FROM projecttwo.game WHERE playerid = ` + user)
    console.log('location: ', JSON.stringify(result.rows))

    //delete game
    client.query(`DELETE FROM projecttwo.game WHERE playerid = ` + user)
    
    //delete hero
    client.query(`DELETE FROM projecttwo.hero WHERE heroid = ` + result.rows[0].heroid)
    
    //empty inventory
    client.query(`DELETE FROM projecttwo.invtoitem WHERE invid = ` + result.rows[0].invid)
    
    //delete inventory
    client.query(`DELETE FROM projecttwo.inventory WHERE invid = ` + result.rows[0].invid)

    
    

    //now create pieces needed for new game
    var hero = await client.query(`INSERT INTO projecttwo.hero (herohp, heromp) VALUES (${herohp}, ${heromp}) RETURNING heroid`)
    var inv = await client.query(`INSERT INTO projecttwo.inventory (invname) VALUES ('Player${user} Inventory') RETURNING invid`)
    console.log(hero)
    console.log(inv)
    var newHero = Number(hero.rows[0].heroid)
    var newInv = Number(inv.rows[0].invid)
    console.log(`user = ${user} map = ${map} inv = ${newInv} hero = ${newHero}`)
    //create new game
    var game = await client.query(`INSERT INTO projecttwo.game (playerid, mapid, invid, heroid, currentlocation) VALUES (${user}, ${map}, ${newInv}, ${newHero}, 1) RETURNING currentlocation`)
    
    //new game made and called
    console.log("NEW GAME!")
    
    //move on
    next()
  }finally{
    //release client
    client.release()
  }
}

/*
Grabs data needed for movement, including current location and action events
it then sets the direction the player wished to move through the button request
*/
async function getLocation (req, res, next) {
  //get client
  const client = await pool.connect()
  
  //verify the users current location
  var result = await client.query(`SELECT currentlocation FROM projecttwo.game WHERE playerid = ` + user)
  console.log('location: ', JSON.stringify(result.rows))

  //save the location of the player
  res.locals.locationNum = result.rows[0].currentlocation
  console.log('location: ', res.locals.locationNum)
  if (req.query.direction != null) {
    result = await client.query(`SELECT node` + req.query.direction + ` FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.locationNum)
  }
  
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
    default:
      res.locals.move = res.locals.locationNum
  }
  //release client
  client.release()
  //move on
  next()
}

/*
This function grabs data about the location to make sure that the call was legitmate
after verifying the call it will pass off data to the action trigger
*/
async function handleAction (req, res, next) {
  //checkout client
  const client = await pool.connect()
  try {
    //verify the users current location
    var result = await client.query(`SELECT currentlocation, invid FROM projecttwo.game WHERE playerid = ` + user)
    console.log('location: ', JSON.stringify(result.rows))
    
    //save invid to use later if needed
    res.locals.invid = result.rows[0].invid

    //grab actions
    var actions = await client.query(`SELECT eventid, eventaction, eventtextsuccess, eventtextfail, eventreaction, eventitem, eventcheck FROM projecttwo.mapevent WHERE mapnodeconnection = ` + result.rows[0].currentlocation + ` ORDER BY eventid`)
    
    //select action called by user
    var action = {locName: "ERROR", locText: "Cannot find action called"}
    //event exists on location
    var eventExist = 0;
    actions.rows.forEach(function(act, i){
      if(actions.rows[i].eventid == req.query.id){
        res.locals.actionInfo = actions.rows[i]
        eventExist = 1;
      }
    })
    
    //send data back to user
    if(eventExist){
      next()
    }else{
      res.send({locName: "ERROR", locText: "Cannot find action called"})
      res.end()
    }

  }finally{
    //release client
    client.release()
  }
}

/*
this handles action calls and seperates them
the different cases are contained below
*/
async function triggerAction (req, res) {
  //checkout client
  const client = await pool.connect()
  try {
    /**********
    * !! EVENT REACTION KEY !!
    * 1 - ACQUIRE ITEM (check if item is already in inv)
    * 2 - CHECK FOR ITEM + EXPEND (.eventitem IS ACQUIRED .eventcheck IS NEEDED + USED)
    * 3 - CHECK FOR ITEM + DON'T EXPEND (.eventitem IS ACQUIRED .eventcheck IS NEEDED)
    * 4 - SUCCESS if/if not (IF item do X IF NOT item do Y)
    * 5 - DO NOTHING event doesn't do anythying send back text (red herring event)
    **********/
    switch(res.locals.actionInfo.eventreaction) {
      case 1:
        //DON'T HAVE ITEM OR PERMUTATION
        var inventory = await client.query(`SELECT invid, itemid FROM projecttwo.invtoitem WHERE invid = ` + res.locals.invid + ` AND (itemid = ` + res.locals.actionInfo.eventitem + ` OR itemid = ` + res.locals.actionInfo.eventcheck + `)`)

        if(inventory.rowCount > 0){
          res.send({locName: res.locals.actionInfo.eventaction, locText: res.locals.actionInfo.eventtextfail})
          res.end()
        }else{
          //GIVE PICKED UP ITEM
          client.query(`INSERT INTO projecttwo.invtoitem (invid, itemid) VALUES (` + res.locals.invid + `, ` + res.locals.actionInfo.eventitem + `)`)
          res.send({locName: res.locals.actionInfo.eventaction, locText: res.locals.actionInfo.eventtextsuccess})
          res.end()  
        }
        break;
      case 2:
        //REQUIRED ITEM CHECK
        var inventory = await client.query(`SELECT invid, itemid FROM projecttwo.invtoitem WHERE invid = ` + res.locals.invid + ` AND itemid = ` + res.locals.actionInfo.eventcheck)
        
        if(inventory.rowCount > 0){
          //GIVE PICKED UP ITEM
          client.query(`INSERT INTO projecttwo.invtoitem (invid, itemid) VALUES (` + res.locals.invid + `, ` + res.locals.actionInfo.eventitem + `)`)
          //DELETE EXPENDED ITEM
          client.query(`DELETE FROM projecttwo.invtoitem WHERE invid = ` + res.locals.invid + ` AND itemid = ` + res.locals.actionInfo.eventcheck)
          res.send({locName: res.locals.actionInfo.eventaction, locText: res.locals.actionInfo.eventtextsuccess})
          res.end()
        }else{
          res.send({locName: res.locals.actionInfo.eventaction, locText: res.locals.actionInfo.eventtextfail})
          res.end()  
        }
        break;
      case 3:
        //REQUIRED ITEM CHECK
        var inventory = await client.query(`SELECT invid, itemid FROM projecttwo.invtoitem WHERE invid = ` + res.locals.invid + ` AND itemid = ` + res.locals.actionInfo.eventcheck)
        //DON"T HAVE ALREADY
        var itemCheck = await client.query(`SELECT invid, itemid FROM projecttwo.invtoitem WHERE invid = ` + res.locals.invid + ` AND itemid = ` + res.locals.actionInfo.eventitem)
        
        if(inventory.rowCount > 0 && itemCheck.rowCount == 0){
          //GIVE PICKED UP ITEM
          client.query(`INSERT INTO projecttwo.invtoitem (invid, itemid) VALUES (` + res.locals.invid + `, ` + res.locals.actionInfo.eventitem + `)`)
          res.send({locName: res.locals.actionInfo.eventaction, locText: res.locals.actionInfo.eventtextsuccess})
          res.end()
        }else{
          res.send({locName: res.locals.actionInfo.eventaction, locText: res.locals.actionInfo.eventtextfail})
          res.end()  
        }
        break;  
      case 4:
        //IF ELSE USING ITEM AS CHECK
        var inventory = await client.query(`SELECT invid, itemid FROM projecttwo.invtoitem WHERE invid = ` + res.locals.invid + ` AND itemid = ` + res.locals.actionInfo.eventitem)
        
        if(inventory.rowCount > 0){
          res.send({locName: res.locals.actionInfo.eventaction, locText: res.locals.actionInfo.eventtextsuccess})
          res.end()
        }else{
          res.send({locName: res.locals.actionInfo.eventaction, locText: res.locals.actionInfo.eventtextfail})
          res.end()  
        }
        break;
      case 5:
        res.send({locName: res.locals.actionInfo.eventaction, locText: res.locals.actionInfo.eventtextsuccess})
        res.end()
        break;
      default:
        res.send({locName: "ERROR", locText: "Cannot find action called"})
        res.end()
        break;
    }
  }finally{
    //release client
    client.release()
  }
}

/*
This will move the player, given the data saved in location
it will then send a response about the location the player landed
*/
async function moveAndSend (req, res) {
  //get client
  const client = await pool.connect()
  
  try {
    //check if move is possible
    if(res.locals.move == null){
      //unable to move, send back failure message
      res.send({locName:"Blocked", locText: "The way is shut. It was made by those who are Dead, and the Dead keep it, until the time comes. The way is shut."})
    }else{
      //move is possible, move player and get info
      client.query(`UPDATE projecttwo.game SET currentlocation = ` + res.locals.move + ` WHERE playerid  = ` + user)
      //get desitnation info
      result = await client.query(`SELECT nodename, nodetext FROM projecttwo.mapnodes WHERE nodeid = ` + res.locals.move)
      //get action info on destination
      actions = await client.query(`SELECT eventid, eventaction FROM projecttwo.mapevent WHERE mapnodeconnection = ` + res.locals.move + ` ORDER BY eventid`)
      
      //send back data on where the player moved to
      res.send({locName:result.rows[0].nodename, locText: result.rows[0].nodetext, actions: actions.rows})
      res.end()
    }
  }catch (error) {
    console.log(error) 
  }finally{
    //release client
    client.release()
  }
}