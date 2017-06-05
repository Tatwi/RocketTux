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
  pickRandomProperty: function(obj) {
        var result;
        var count = 0;
        for (var prop in obj)
            if (Math.random() < 1/++count)
               result = prop;
        return result;
    },
  createTileMap: function(levelLength){
    var sections = levelLength / 32 / 10; // Screen Pixels / Tile Width Px / Section Width
    var data = '';
    var row1,row2,row3,row4,row5,row6,row7,row8,row9,row10,row11,row12,row13,row14,row15,row16,row17,row18,row19,row20,row21,row22,row23;
    row1=row2=row3=row4=row5=row6=row7=row8=row9=row10=row11=row12=row13=row14=row15=row16=row17=row18=row19=row20=row21=row22=row23=''; // Prevents white line on left of screen

    // Pick a theme
    var theme = RocketTux.candyland;
    var rng = this.roll();
    if (rng > 95)
        var theme = RocketTux.candyland;
    if (rng > 75)
        var theme = RocketTux.candyland;
    if (rng > 50)
        var theme = RocketTux.candyland;
    if (rng > 25)
        var theme = RocketTux.candyland;
    
    // Generate the width of the map
    for (var i = 0; i < sections; i++)
    {
        var rngSection = this.pickRandomProperty(theme);
        
        row1 += theme[rngSection][0];
        row2 += theme[rngSection][1];
        row3 += theme[rngSection][2];
        row4 += theme[rngSection][3];
        row5 += theme[rngSection][4];
        row6 += theme[rngSection][5];
        row7 += theme[rngSection][6];
        row8 += theme[rngSection][7];
        row9 += theme[rngSection][8];
        row10 += theme[rngSection][9];
        row11 += theme[rngSection][10];
        row12 += theme[rngSection][11];
        row13 += theme[rngSection][12];
        row14 += theme[rngSection][13];
        row15 += theme[rngSection][14];
        row16 += theme[rngSection][15];
        row17 += theme[rngSection][16];
        row18 += theme[rngSection][17];
        row19 += theme[rngSection][18];
        row20 += theme[rngSection][19];
        row21 += theme[rngSection][20];
        row22 += theme[rngSection][21];
        row23 += theme[rngSection][22];
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
