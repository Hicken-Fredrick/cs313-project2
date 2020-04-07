INSERT INTO projecttwo.player (playername, playerpw)
 VALUES ('meroko', 'password');
 
INSERT INTO projecttwo.hero (herohp, heromp)
 VALUES (5, 5);
 
INSERT INTO projecttwo.mapnodes (nodename, nodetext)
 VALUES ('Dungeon Entrance', 'A dark and stale dungeon lies around you with passages leading in every direction. Time to explore, and find the secrets within.');
 
INSERT INTO projecttwo.mapnodes (nodename, nodetext)
 VALUES ('Dungeon Exterior', 'Your small party awaits, strangley the dungeon would only let yourself enter.');
 
INSERT INTO projecttwo.mapnodes (nodename, nodetext)
 VALUES ('Northern Tunnel', 'The first steps into the northern tunnel, a very slight glimmer can be seen within the deepest reaches.');
 
INSERT INTO projecttwo.mapnodes (nodename, nodetext)
 VALUES ('Northern Tunnel', 'Further into the northern tunnel you can make out the shimmer, it is the glint of polished metal.');
 
INSERT INTO projecttwo.mapnodes (nodename, nodetext)
 VALUES ('Alter Room', 'An alter lays withing the center of the room, a sword lies embedded in a strange mechanism. In the hilt lies an empty socket with the barest fragments of a red gemstone.');
 
INSERT INTO projecttwo.mapnodes (nodename, nodetext)
 VALUES ('Western Tunnel', 'Traveling to the west you see strange blue flowers, that illuminate this path greater than any other.');
 
INSERT INTO projecttwo.mapnodes (nodename, nodetext)
 VALUES ('Western Tunnel', 'Further into the western tunnel it seems to grow more and more cold, however you can see now the tunnel turning north into a room with some glowing item.');
 
INSERT INTO projecttwo.mapnodes (nodename, nodetext)
 VALUES ('Western Gem Room', 'The blue gemstone that lies within the center of the room glows brilliantly, although it is cold it light feels soothing, a calming sensation of peace fills you.');
 
INSERT INTO projecttwo.mapnodes (nodename, nodetext)
 VALUES ('Eastern Tunnel', 'Traveling east the darkness looms over you, it is difficulte to travel by sight and you resort to running your hand along the wall as you move.');
 
INSERT INTO projecttwo.mapnodes (nodename, nodetext)
 VALUES ('Eastern Tunnel', 'The further in you travel the darker it gets, and yet to your north you can see a faint red light glowing in the pitch dark, there is also a slight breeze coming from the wall you are running your hand upon.');
 
INSERT INTO projecttwo.mapnodes (nodename, nodetext)
 VALUES ('Eastern Gem Room', 'The red gemstone that lies within the center glows only slightly but you can almost feel the ferocity it eminates, a calling to battle.');
 
UPDATE projecttwo.mapnodes 
  SET nodenorth = 1 
  WHERE nodeid = 2;
  
UPDATE projecttwo.mapnodes 
  SET nodesouth = 1 
  WHERE nodeid = 3;
  
UPDATE projecttwo.mapnodes 
  SET nodenorth = 4 
  WHERE nodeid = 3;
  
UPDATE projecttwo.mapnodes 
  SET nodesouth = 3,
  nodenorth = 5
  WHERE nodeid = 4;
  
UPDATE projecttwo.mapnodes 
  SET nodesouth = 4 
  WHERE nodeid = 5;
  
UPDATE projecttwo.mapnodes 
  SET nodeeast = 1,
  nodewest = 7
  WHERE nodeid = 6;
  
UPDATE projecttwo.mapnodes 
  SET nodeeast = 6,
  nodenorth = 8
  WHERE nodeid = 7;
  
UPDATE projecttwo.mapnodes 
  SET nodesouth = 7 
  WHERE nodeid = 8;
  
UPDATE projecttwo.mapnodes 
  SET nodewest = 1,
  nodeeast = 10
  WHERE nodeid = 9;
  
UPDATE projecttwo.mapnodes 
  SET nodewest = 9,
  nodenorth = 11
  WHERE nodeid = 10;
  
UPDATE projecttwo.mapnodes 
  SET nodesouth = 10
  WHERE nodeid = 11;
  
UPDATE projecttwo.mapnodes 
  SET nodenorth = 3,
  nodesouth = 2,
  nodeeast = 9,
  nodewest = 6
  WHERE nodeid = 1;

INSERT INTO projecttwo.map (mapname, mapdescription, mapstartlocation)
 VALUES ('Test', 'Output Test', 1);
 
INSERT INTO projecttwo.maptonode (mapid, nodeid)
 VALUES 
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5),
  (1, 6),
  (1, 7),
  (1, 8),
  (1, 9),
  (1, 10),
  (1, 11);
  
INSERT INTO projecttwo.inventory (invname) 
  VALUES ('Merokos Inventory');
  
INSERT INTO projecttwo.itemtype (typetext, typeslot)
  VALUES ('Tool', 1);
  
INSERT INTO projecttwo.itemtype (typetext, typeslot)
  VALUES ('Weapon', 2);
  
INSERT INTO projecttwo.itemtype (typetext, typeslot)
  VALUES ('Hidden', 3);
  
INSERT INTO projecttwo.items (itemname, itemdescription, itemtype)
  VALUES ('Rope', 'A strong, long length, of rope that would be perfect for climbing.', 1);
  
INSERT INTO projecttwo.items (itemname, itemdescription, itemtype)
  VALUES ('Red Gem', 'A strange gem that seems to glow eminate a soft red glow from within.', 1);
  
INSERT INTO projecttwo.items (itemname, itemdescription, itemtype)
  VALUES ('Blue Gem', 'A strange gem that seems to glow eminate a soft blue glow from within.', 1);
  
INSERT INTO projecttwo.items (itemname, itemdescription, itemtype)
  VALUES ('Inserted Red Gem', 'Red gem was inserted.', 3);
  
INSERT INTO projecttwo.items (itemname, itemdescription, itemtype)
  VALUES ('Inserted Blue Gem', 'Blue gem was inserted.', 3);
  
INSERT INTO projecttwo.items (itemname, itemdescription, itemtype)
  VALUES ('Sword', 'A rather worn weapon, but the blade is still sharp enough for defense.', 2);
  
INSERT INTO projecttwo.mapevent (eventaction, eventtextsuccess, eventtextfail, mapnodeconnection, eventreaction, eventitem, eventcheck)
 VALUES ('Pickup Blue Gem', 'Strangely the blue gem, while creating a chilling feeling doesnt get any stronger as you pick it up and place it within you bag.', 'You already collected this gem, all that remains is an empty alter.', 8, 1, 3, 5);
 
INSERT INTO projecttwo.mapevent (eventaction, eventtextsuccess, eventtextfail, mapnodeconnection, eventreaction, eventitem, eventcheck)
 VALUES ('Pickup Red Gem', 'Getting closer and closer to the red gem the feelings it stirs within you grow stronger. Finally gripping it you feel as though no power could stand before you, slipping it into your bag it takes a force of will you let it go.', 'You already collected this gem, all that remains is an empty alter.', 11, 1, 2, 4);
 
INSERT INTO projecttwo.mapevent (eventaction, eventtextsuccess, eventtextfail, mapnodeconnection, eventreaction, eventitem, eventcheck)
 VALUES ('Insert Blue Gem', 'Inserting the blue gem within the socket you feel a moment of sadness and forgiveness. This causes you a moment of confusion, however as the blue gem slides fully into slot you see metal spikes slide from the blade crushing the blue gem. Immediatly the red gems presence floods you with vengence and ferocity.', 'Searching through your bage you find no such item, maybe you left it behind, or it was all a trick of the mind.', 5, 2, 5, 3);
 
INSERT INTO projecttwo.mapevent (eventaction, eventtextsuccess, eventtextfail, mapnodeconnection, eventreaction, eventitem, eventcheck)
 VALUES ('Insert Red Gem', 'An unspeakable feeling of joy floods you as you slide the red gem into the slot. The sword begins to glow faintly and the mechanism can be heard creaking.', 'Searching through your bage you find no such item, maybe you left it behind, or it was all a trick of the mind.', 5, 2, 4, 2);
 
INSERT INTO projecttwo.mapevent (eventaction, eventtextsuccess, eventtextfail, mapnodeconnection, eventreaction, eventitem, eventcheck)
 VALUES ('Draw Blade', 'The red gem restored to the center of the blade, the mechnism seems to be forced back. Gripping the hilt the same feeling you had while holding the red gems fills you, and you pull the blade free. Tossing your old blade aside, you sheathe your new blade upon your hip.', 'The blade refuses to budge, it seems you are unable to draw it as of now.', 5, 3, 6, 4);
 
INSERT INTO projecttwo.mapevent (eventaction, eventtextsuccess, eventtextfail, mapnodeconnection, eventreaction, eventitem, eventcheck)
 VALUES ('Investigate Breeze', 'Investigating the source of the breeze you cant seem to find anything of use, and pushing on the wall it has no give to it.', NULL, 10, 5, NULL, NULL);
 
INSERT INTO projecttwo.mapevent (eventaction, eventtextsuccess, eventtextfail, mapnodeconnection, eventreaction, eventitem, eventcheck)
 VALUES ('Leave', 'You call your party to you, and make to leave. The glowing red sword hanging at your hip, nothing would stand in your way. The first thing to get was gold, by any means necessary.', 'This place is accursed, you have seen it and you have felt it. You leave the place behind the world is better of not having any dealing with what lies dormant within.', 2, 4, 6, NULL);
  
INSERT INTO projecttwo.game (playerid, mapid, invid, heroid, currentlocation)
  VALUES (1, 1, 1, 1, 1);