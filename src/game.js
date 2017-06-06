var RocketTux = RocketTux || {};
 
RocketTux.Game = function(){};
 
RocketTux.Game.prototype = {
  create: function() {
    this.game.renderer.setTexturePriority(['world', 'entities']);
    
    var pickSong = Math.floor(Math.random() * RocketTux.songs.length)
    music = this.game.add.audio(RocketTux.songs[pickSong]);
    music.loop = true;
    music.volume = 0.5;
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
    this.myDebugText.text = '';
    
    this.createTileMap(levelLength);
    
    // Add the player
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'entities');
    this.player.animations.add('stand', [3], 10, true);
    this.player.animations.add('right', [6, 7, 8, 9, 10, 11], 12, true);
    this.player.animations.add('left', [13, 14, 15, 16, 17, 18], 12, true);
    this.player.animations.add('jump-right', [4], 10, true);
    this.player.animations.add('jump-left', [12], 10, true);
    this.player.animations.add('duck', [3], 10, true);
    this.setPhysicsProperties(this.player, 100, 0, 40, 40, 8, 20);
    this.game.camera.follow(this.player);
    this.rocketOn = 'right';
    
    // Add flames for the player's rocketpack
    this.flames = this.game.add.sprite(this.player.body.x, this.player.body.y, 'entities');
    this.flames.animations.add('flames-right', [22,23,24,25], 12, true);
    this.flames.animations.add('flames-left', [26,27,28,29], 12, true);
    this.flames.animations.add('idle', [19,20,21,30,31], 8, true);
    
    // Put flames behind player
    this.player.bringToTop();
    
    // Rocketpack sounds
    this.sndRocketStart = this.game.add.audio('rocketpack-start');
    this.sndRocketRunning = this.game.add.audio('rocketpack-running');
    this.sndRocketWindup = this.game.add.audio('rocketpack-windup');
    this.sndRocketBoost = this.game.add.audio('rocketpack-boost');
    
    // Input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    
  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.theLevel);
    
    //  Reset player
    this.player.body.velocity.x = 0;
    if (!this.player.body.blocked.down){ // Always on when in the air
        if (this.rocketOn == 'left'){
            this.rocketPackIs('left');
        } else if (this.rocketOn == 'right'){
            this.rocketPackIs('right');
        } else if (this.rocketOn == 'idle'){
            this.rocketPackIs('idle');
            this.player.play('stand');
        }
        this.rocketPackSoundOn(true, false);
    } else {
        this.rocketPackIs('off');
        this.rocketPackSoundOn(false, false);
    }
    
    //===========Player Input, Movement, and Animations============
    // Left/Right Keys
    if (this.cursors.left.isDown){
        this.player.body.velocity.x = -300;
        
        if (this.player.body.blocked.down){
            this.player.animations.play('left'); // Running
        } else if (!this.player.body.blocked.down){
            this.rocketPackIs('left'); // Flying
        }
    } else if (this.cursors.right.isDown){
        this.player.body.velocity.x = 300;
        
        if (this.player.body.blocked.down){
            this.player.animations.play('right');
        } else if (!this.player.body.blocked.down){
            this.rocketPackIs('right'); // Flying
        }
    } else {
         this.player.play('stand'); // On ground
         
         if (!this.player.body.blocked.down) // In air
            this.rocketPackIs('idle');
    }
        
    // Up/Down Keys
    if (this.cursors.up.isDown || this.cursors.down.isDown){
        if (this.cursors.down.isDown && this.player.body.blocked.down){
            this.player.body.velocity.x = 0;
            this.player.animations.play('duck'); // Duck when standing
        } else if (!this.player.body.blocked.down){
            if (this.player.body.velocity.y > 0)
                this.player.body.velocity.y = 0; // Hover when not moving up or down in the air
        }
            
        // Note: collectCoin() will boost the player up when this.cursors.up.isDown = true
    } else {
        this.player.body.acceleration.y = 0; // Fall
    }
    
    // Spacebar Boost (5 second cooldown)
    if (this.game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 5)){
        this.sndRocketWindup.play();
        this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.rocketPackGo, this);
    }
    
    // M , . keys for music volume
    if (this.game.input.keyboard.downDuration(Phaser.Keyboard.PERIOD, 1)){
        if (music.volume > 0.9)
            return;
            
        music.volume += 0.1;
    } else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.COMMA, 1)){
        if (music.volume < 0.1)
            return;
            
        music.volume -= 0.1;
    } else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.M, 1)){ 
        if (music.volume > 0){
            music.volume = 0; // Mute
        } else {
            music.volume = 0.5;
        }
    }
      
  },
  render: function() {
    //this.game.debug.bodyInfo(this.player, 10, 10);
  },
  rocketPackGo: function(){
    this.doExplosion(this.player.body.x, this.player.body.y + 10);
    this.rocketPackSoundOn(true, true);
    this.player.body.velocity.y = -333;
  },
  rocketPackSoundOn: function(on, boost){
    if (on){
        if (boost){
            this.sndRocketBoost.play();
            this.sndRocketRunning.loopFull(1.0);
            this.sndRocketRunning.play();
        } else {
            if (this.sndRocketRunning.isPlaying)
                return;
            
            if (!this.sndRocketStart.isPlaying)
                this.sndRocketStart.play();
                
            this.sndRocketRunning.loopFull(1.0);
            this.sndRocketRunning.play();
        }        
    } else {
        this.sndRocketRunning.fadeOut(333);
    }
  },
  rocketPackIs: function (stateIs){
    if (stateIs == 'left'){
        this.flames.x = this.player.body.x + 30;
        this.flames.y = this.player.body.y + 7;
        this.flames.animations.play('flames-left');
        this.player.animations.play('jump-left');
        this.rocketOn = 'left';
    } else if (stateIs == 'right'){
        // Moving right or not pressing left or right keys and falling
        this.flames.x = this.player.body.x - 45;
        this.flames.y = this.player.body.y + 8;
        this.flames.animations.play('flames-right');
        this.player.animations.play('jump-right');
        this.rocketOn = 'right';
    } else if (stateIs == 'idle'){
        this.flames.x = this.player.body.x - 12;
        this.flames.y = this.player.body.y + 37;
        this.flames.animations.play('idle');
        this.rocketOn = 'idle';
    } else if (stateIs == 'off'){
        this.flames.y = this.game.world.height + 128; // hide rocket pack exhaust off the screen
    }
  },
  doExplosion: function(x, y){
    this.boostBlast = this.game.add.sprite(x, y, 'entities');
    this.boostBlast.animations.add('blast', [32,33,32,34,35], 10, true);
    this.boostBlast.animations.play('blast');
    this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.douseFlames, this);
  },
  douseFlames: function(){
    this.boostBlast.destroy();
    
    //if (boostOnCooldown)
      //  boostOnCooldown = false;
  },
  setPhysicsProperties: function(entity, gravity, bounce, boundingBoxSizeX, boundingBoxSizeY, boundingBoxPosX, boundingBoxPosY){
    this.game.physics.arcade.enable(entity);
    entity.body.bounce.y = bounce;
    entity.body.gravity.y = gravity;
    entity.body.collideWorldBounds = true;
    
    if (boundingBoxSizeX > 0)
        entity.body.setSize(boundingBoxSizeX, boundingBoxSizeY, boundingBoxPosX, boundingBoxPosY);
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
    map.setCollisionBetween(896, 1022);

    //  0 is important
    this.theLevel = map.createLayer(0);

    //  Scroll it
    this.theLevel.resizeWorld();

    },
};
