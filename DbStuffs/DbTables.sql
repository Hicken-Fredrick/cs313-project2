CREATE SCHEMA projecttwo;

CREATE TABLE projecttwo.player (
  playerid SERIAL NOT NULL,
  playername TEXT NOT NULL UNIQUE,
  playerpw TEXT NOT NULL,
  CONSTRAINT playerkey PRIMARY KEY (playerid)
);

CREATE TABLE projecttwo.hero (
  heroid SERIAL NOT NULL,
  herohp INT NOT NULL,
  heromp INT NOT NULL,
  CONSTRAINT herokey PRIMARY KEY (heroid)
);

CREATE TABLE projecttwo.mapnodes (
  nodeid SERIAL NOT NULL,
  nodename TEXT NOT NULL,
  nodetext TEXT NOT NULL,
  nodenorth INT,
  nodesouth INT,
  nodewest INT,
  nodeeast INT,
  CONSTRAINT nodekey PRIMARY KEY (nodeid),
  CONSTRAINT northnode FOREIGN KEY (nodenorth)
   REFERENCES projecttwo.mapnodes (nodeid) MATCH SIMPLE,
  CONSTRAINT southnode FOREIGN KEY (nodesouth)
   REFERENCES projecttwo.mapnodes (nodeid) MATCH SIMPLE,
  CONSTRAINT westnode FOREIGN KEY (nodewest)
   REFERENCES projecttwo.mapnodes (nodeid) MATCH SIMPLE,
  CONSTRAINT eastnode FOREIGN KEY (nodeeast)
   REFERENCES projecttwo.mapnodes (nodeid) MATCH SIMPLE
);

CREATE TABLE projecttwo.mapevent (
  eventid SERIAL NOT NULL,
  eventaction TEXT NOT NULL,
  eventtextsuccess TEXT NOT NULL,
  eventtextfail TEXT,
  mapnodeconnection INT NOT NULL,
  eventreaction INT NOT NULL,
  eventitem INT,
  eventcheck INT,
  CONSTRAINT eventkey PRIMARY KEY (eventid),
  CONSTRAINT eventfkey FOREIGN KEY (mapnodeconnection)
   REFERENCES projecttwo.mapnodes (nodeid) MATCH SIMPLE
);

CREATE TABLE projecttwo.map (
  mapid SERIAL NOT NULL,
  mapname TEXT NOT NULL,
  mapdescription TEXT NOT NULL,
  mapstartlocation INT NOT NULL,
  CONSTRAINT mappkey PRIMARY KEY (mapid),
  CONSTRAINT nodetag FOREIGN KEY (mapstartlocation)
   REFERENCES projecttwo.mapnodes (nodeid) MATCH SIMPLE
);

CREATE TABLE projecttwo.maptonode (
  mapid INT NOT NULL,
  nodeid INT NOT NULL,
  CONSTRAINT maptag FOREIGN KEY (mapid)
   REFERENCES projecttwo.map (mapid) MATCH SIMPLE,
  CONSTRAINT nodetag FOREIGN KEY (nodeid)
   REFERENCES projecttwo.mapnodes (nodeid) MATCH SIMPLE
);

CREATE TABLE projecttwo.inventory (
  invid SERIAL NOT NULL,
  invname TEXT NOT NULL,
  CONSTRAINT invkey PRIMARY KEY (invid)
);

CREATE TABLE projecttwo.itemtype (
  typeid SERIAL NOT NULL,
  typetext TEXT NOT NULL,
  typeslot INT NOT NULL,
  CONSTRAINT typekey PRIMARY KEY (typeid)
);

CREATE TABLE projecttwo.items (
  itemid SERIAL NOT NULL,
  itemname TEXT NOT NULL,
  itemdescription TEXT NOT NULL,
  itemtype INT NOT NULL,
  CONSTRAINT itemkey PRIMARY KEY (itemid),
  CONSTRAINT itemtypes FOREIGN KEY (itemtype)
   REFERENCES projecttwo.itemtype (typeid) MATCH SIMPLE
);

CREATE TABLE projecttwo.invtoitem (
  invid INT NOT NULL,
  itemid INT NOT NULL,
  CONSTRAINT invtag FOREIGN KEY (invid)
   REFERENCES projecttwo.inventory (invid) MATCH SIMPLE,
  CONSTRAINT itemtage FOREIGN KEY (itemid)
   REFERENCES projecttwo.items (itemid) MATCH SIMPLE
);

CREATE TABLE projecttwo.game (
  playerid INT NOT NULL,
  mapid INT,
  invid INT,
  heroid INT,
  currentlocation INT,
  CONSTRAINT playertag FOREIGN KEY (playerid)
   REFERENCES projecttwo.player (playerid) MATCH SIMPLE,
  CONSTRAINT maptag FOREIGN KEY (mapid)
   REFERENCES projecttwo.map (mapid) MATCH SIMPLE,
  CONSTRAINT invtag FOREIGN KEY (invid)
   REFERENCES projecttwo.inventory (invid) MATCH SIMPLE ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT herotag FOREIGN KEY (heroid)
   REFERENCES projecttwo.hero (heroid) MATCH SIMPLE ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT locationtag FOREIGN KEY (currentlocation)
   REFERENCES projecttwo.mapnodes (nodeid) MATCH SIMPLE
);