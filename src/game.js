var RocketTux = RocketTux || {};
 
RocketTux.Game = function(){};
 
RocketTux.Game.prototype = {
  create: function() {
    this.game.renderer.setTexturePriority(['world']);
    
    var pickSong = Math.floor(Math.random() * RocketTux.songs.length)
    music = this.game.add.audio(RocketTux.songs[pickSong]);
    music.loop = true;
    music.play();

    // Set world bounds
    var levelLength = 32 * this.game.rnd.between(125, 500); // 4000 min, 16000 max
    this.game.world.setBounds(0, 0, levelLength, 720);
    
    var rng = this.roll(); 

    //  Add Background
    var showSun = false;
    this.background = this.game.add.bitmapData(levelLength, 720);
    this.background.addToWorld();
    if (rng > 50){
        this.drawBackdrop(0x11315c, 0x48b6cd, levelLength); // Day
        if (rng > 90)
            showSun = true;
    } else {
        this.drawBackdrop(0x000000, 0x11315c, levelLength); // Night
        if (rng < 10)
            showSun = true;
    } 
    
    // DEBUG
    this.myDebugText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FF0000' });
    this.myDebugText.fixedToCamera = true;
    this.myDebugText.text = pickSong; //RocketTux.snow1.g[0];
    
    this.createTileMap(levelLength);
    
  },
  update: function() {
      
  },
  roll: function() {
    return this.game.rnd.between(0, 100);
  },
  drawBackdrop: function(top, bottom, levelLength){
    var out = [];
    var y = 0;

    for (var i = 0; i < 360; i++){
        var c = Phaser.Color.interpolateColor(top, bottom, 360, i);
        this.background.rect(0, y, levelLength, y+2, Phaser.Color.getWebRGB(c));
        out.push(Phaser.Color.getWebRGB(c));
        y += 2;
    }
  },
  createTileMap: function(levelLength){
    var sections = levelLength / 32 / 10; // Screen Pixels / Tile Width Px / Section Width
    var data = '';
    var row1,row2,row3,row4,row5,row6,row7,row8,row9,row10,row11,row12,row13,row14,row15,row16,row17,row18,row19,row20,row21,row22,row23;
    row1=row2=row3=row4=row5=row6=row7=row8=row9=row10=row11=row12=row13=row14=row15=row16=row17=row18=row19=row20=row21=row22=row23=''; // Prevents white line on left of screen
    
    // Minus 1 from every value, because Tiled starts tiling at 1 and Phaser maps images starting at 0.
    var tmpNumber;
    var tmpString = '';
    for (var i = 0; i < 23; i++){
        var tmpArray = RocketTux.candyland1[i].split(",")
            
        // Convert to numbers
        for(var j=0; j<tmpArray.length; j++) { tmpArray[j] = +tmpArray[j]; }
        
        for (var k = 0; k < 10; k++){
            tmpNumber = tmpArray[k];
            
            if (tmpNumber == undefined)
                tmpNumber = 0;
            
            if (tmpNumber > 0)
                tmpNumber -= 1;
                
            tmpString += tmpNumber + ",";
        }

        RocketTux.candyland1[i] = tmpString; // save corrected numbers
        
        if (i == 0)
            this.myDebugText.text = "       " + RocketTux.candyland1[i];
        
        tmpNumber = 0;
        tmpString = '';
    }

    // Generate the width of the map
    for (var i = 0; i < sections; i++)
    {
        row1 += RocketTux.candyland1[0];
        row2 += RocketTux.candyland1[1];
        row3 += RocketTux.candyland1[2];
        row4 += RocketTux.candyland1[3];
        row5 += RocketTux.candyland1[4];
        row6 += RocketTux.candyland1[5];
        row7 += RocketTux.candyland1[6];
        row8 += RocketTux.candyland1[7];
        row9 += RocketTux.candyland1[8];
        row10 += RocketTux.candyland1[9];
        row11 += RocketTux.candyland1[10];
        row12 += RocketTux.candyland1[11];
        row13 += RocketTux.candyland1[12];
        row14 += RocketTux.candyland1[13];
        row15 += RocketTux.candyland1[14];
        row16 += RocketTux.candyland1[15];
        row17 += RocketTux.candyland1[16];
        row18 += RocketTux.candyland1[17];
        row19 += RocketTux.candyland1[18];
        row20 += RocketTux.candyland1[19];
        row21 += RocketTux.candyland1[20];
        row22 += RocketTux.candyland1[21];
        row23 += RocketTux.candyland1[22];
    }
    
    // Consolidate the width and height into the single data variable
    data += row1 + "\n";
    data += row2 + "\n";
    data += row3 + "\n";
    data += row4 + "\n";
    data += row5 + "\n";
    data += row6 + "\n";
    data += row7 + "\n";
    data += row8 + "\n";
    data += row9 + "\n";
    data += row10 + "\n";
    data += row11 + "\n";
    data += row12 + "\n";
    data += row13 + "\n";
    data += row14 + "\n";
    data += row15 + "\n";
    data += row16 + "\n";
    data += row17 + "\n";
    data += row18 + "\n";
    data += row19 + "\n";
    data += row20 + "\n";
    data += row21 + "\n";
    data += row22 + "\n";
    data += row23 + "\n";

    //  Add data to the cache
    this.game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);

    //  Create the tile map
    map = this.game.add.tilemap('dynamicMap', 32, 32);
    map.addTilesetImage('world', 'world', 32, 32);
    
    // Set collision values on tiles
    map.setCollisionBetween(0, 128);

    //  0 is important
    var theLevel = map.createLayer(0);

    //  Scroll it
    theLevel.resizeWorld();

    },
};
