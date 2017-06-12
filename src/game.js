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
    this.mapSections = this.game.rnd.between(6, 14); // 7680px min, 25,600 max (with +6 bonus)
    this.levelLength = 32 * 40 * this.mapSections; // Tile width * Tiles per section * sections
    this.game.world.setBounds(0, 0, this.levelLength, 720);
    
    // Add Backgrounds
    var skyRNG = this.game.rnd.between(0, 6);
    if (skyRNG < 4){
        this.skiesNormal = this.game.add.sprite(0, 0, 'skies');
        this.skiesNormal.animations.add('stand', [skyRNG], 1, true);
        this.skiesNormal.scale.setTo(1.25, 0.71); //wide, tall
        this.skiesNormal.play('stand');
        this.skiesNormal.bringToTop();
        this.skiesNormal.fixedToCamera = true;
    } else {
        this.skiesSpecial = this.game.add.sprite(0, 0, 'skies-special');
        this.skiesSpecial.animations.add('stand', [skyRNG-3], 1, true);
        this.skiesSpecial.scale.setTo(1.25, 0.71); //wide, tall
        this.skiesSpecial.play('stand');
        this.skiesSpecial.bringToTop();
        this.skiesSpecial.fixedToCamera = true;
    }
    
    // Add group for coins
    this.coins = this.game.add.group();
    this.coinsCollected = 0;
    this.coinSound = this.game.add.audio('collect');
    
    // DEBUG
    this.myDebugText = this.game.add.text(16, 16, 'score: 0', { fontSize: '16px', fill: '#FFFFFF' });
    this.myDebugText.fixedToCamera = true;
    this.myDebugText.text = '';
    
    this.createTileMap();
    
    // Add the player
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'entities');
    this.player.animations.add('stand', [3], 10, true);
    this.player.animations.add('right', [6, 7, 8, 9, 10, 11], 12, true);
    this.player.animations.add('left', [13, 14, 15, 16, 17, 18], 12, true);
    this.player.animations.add('jump-right', [4], 10, true);
    this.player.animations.add('jump-left', [12], 10, true);
    this.player.animations.add('duck', [3], 10, true);
    this.setPhysicsProperties(this.player, 100, 0, 20, 40, 24, 20);
    this.game.camera.follow(this.player);
    this.rocketOn = 'right';
    
    // Add flames for the player's rocketpack
    this.flames = this.game.add.sprite(this.player.body.x, this.player.body.y, 'entities');
    this.flames.animations.add('flames-right', [22,23,24,25], 12, true);
    this.flames.animations.add('flames-left', [26,27,28,29], 12, true);
    this.flames.animations.add('idle', [19,20,21,30,31], 8, true);
    
    // Put flames behind player
    this.player.bringToTop();
    
    // Cheap full screen tint for sunset and night. Not sure if I like this as it dulls the awesome backgrounds I made!.
    if (skyRNG == 2){
        tintmap = this.game.add.tilemap('dynamicMap', 32, 32);
        this.tintLayer = tintmap.createLayer(0);
        this.tintLayer.tint = 0x3e0058;
        this.tintLayer.alpha = 0.1;
    } else if (skyRNG == 3){
        tintmap = this.game.add.tilemap('dynamicMap', 32, 32);
        this.tintLayer = tintmap.createLayer(0);
        this.tintLayer.tint = 0x004cb3;
        this.tintLayer.alpha = 0.1;
    }
    
    // Rocketpack sounds
    this.sndRocketStart = this.game.add.audio('rocketpack-start');
    this.sndRocketRunning = this.game.add.audio('rocketpack-running');
    this.sndRocketWindup = this.game.add.audio('rocketpack-windup');
    this.sndRocketBoost = this.game.add.audio('rocketpack-boost');
    
    // Input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.globalCooldown = false;
    this.abilityCooldown = false;
    
    //UI
    this.uiTimer = 0;
    this.displayCoins = this.game.add.text(16, 64, 'score: 0', { fontSize: '16px', fill: '#FFFFFF' });
    this.displayCoins.fixedToCamera = true;
    this.displayCoins.text = 'Coins: ';
    
    // Populate map
    this.spawnCoins();
  },
  update: function() {
    this.game.physics.arcade.collide(this.player, this.theLevel);
    this.game.physics.arcade.collide(this.coins, this.theLevel);
    this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
    
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
        if (this.player.body.blocked.down){
            this.player.animations.play('left'); // Running
            this.player.body.velocity.x = RocketTux.groundSpeed * -1;
        } else if (!this.player.body.blocked.down){
            this.rocketPackIs('left'); // Flying
            this.player.body.velocity.x = RocketTux.airSpeed * -1;
        }
    } else if (this.cursors.right.isDown){
        if (this.player.body.blocked.down){
            this.player.animations.play('right');
            this.player.body.velocity.x = RocketTux.groundSpeed;
        } else if (!this.player.body.blocked.down){
            this.rocketPackIs('right'); // Flying
            this.player.body.velocity.x = RocketTux.airSpeed;
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
    
    // Ability cooldown throttled actions
    this.doPlayerAbilities();
    
    // Global cooldown throttled actions (1 sec)
    this.throttledInput();
    
    // UI Updates (Throttled using FPS)
    if (this.uiTimer > 20)
        this.uiUpdate();
        
    this.uiTimer++;
  },
  render: function() {
    //this.game.debug.bodyInfo(this.player, 10, 10);
  },
  globalCooldownStart: function(seconds){
      this.globalCooldown = true;
      this.game.time.events.add(Phaser.Timer.SECOND * seconds, this.globalReset, this);
  },
  globalReset: function(){
      this.globalCooldown = false;
  },
  throttledInput: function(){
      if (this.globalCooldown)
        return;

    // M , . keys for music volume
    if (this.game.input.keyboard.downDuration(Phaser.Keyboard.PERIOD, 1)){
        if (music.volume > 0.9)
            return;
            
        music.volume += 0.1;
        this.globalCooldownStart(1);
    } else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.COMMA, 1)){
        if (music.volume < 0.1)
            return;
            
        music.volume -= 0.1;
        this.globalCooldownStart(1);
    } else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.M, 1)){ 
        if (music.volume > 0){
            music.volume = 0; // Mute
        } else {
            music.volume = 0.5;
        }
        
        this.globalCooldownStart(1);
    }
  },
  uiUpdate: function(){ 
    this.myDebugText.text = "Ability Cooldown On: " + this.abilityCooldown + "\nGlobal Cooldown On: " + this.globalCooldown;
    this.displayCoins.text = 'Coins: ' + this.coinsCollected;
    this.uiTimer = 0;
  },
  abilityCooldownStart: function(seconds){
      this.abilityCooldown = true;
      this.game.time.events.add(Phaser.Timer.SECOND * seconds, this.abilityReset, this);
  },
  abilityReset: function(){
      this.abilityCooldown = false;
  },
  doPlayerAbilities: function(){
    if (this.abilityCooldown)
        return;
        
    // Spacebar Boost (5 second cooldown)
    if (this.game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 5)){
        this.sndRocketWindup.play();
        this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.rocketPackGo, this);
        this.abilityCooldownStart(5);
    }
  },
  rocketPackGo: function(){
    this.doExplosion(this.player.body.x, this.player.body.y + 10);
    this.rocketPackSoundOn(true, true);
    this.player.body.velocity.y = RocketTux.boostSpeed * -1;
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
        this.flames.x = this.player.body.x + 12;
        this.flames.y = this.player.body.y + 7;
        this.flames.animations.play('flames-left');
        this.player.animations.play('jump-left');
        this.rocketOn = 'left';
    } else if (stateIs == 'right'){
        // Moving right or not pressing left or right keys and falling
        this.flames.x = this.player.body.x - 64;
        this.flames.y = this.player.body.y + 8;
        this.flames.animations.play('flames-right');
        this.player.animations.play('jump-right');
        this.rocketOn = 'right';
    } else if (stateIs == 'idle'){
        this.flames.x = this.player.body.x - 28;
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
  pickRandomProperty: function(obj) {
        var result;
        var count = 0;
        for (var prop in obj)
            if (Math.random() < 1/++count)
               result = prop;
        return result;
    },
  createTileMap: function(){
        var data = '';
        var rows = ["","","","","","","","","","","","","","","","","","","","","","",""];
        
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
        for (var i = 0; i < this.mapSections; i++)
        {
            var rngSection = this.pickRandomProperty(theme);
            
            for (var j = 0; j < 23; j++) {
                rows[j] += theme[rngSection][j];
            }
        }
        
        // Consolidate the width and height into the single data variable
        for (var i = 0; i < 23; i++){
            var tmpRow = rows[i].toString();
            data += tmpRow.slice(0, -1) + "\n"; // Remove trailing comma to prevent white line of right edge of screen
        }

        //  Add data to the cache
        this.game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);

        //  Create the tile map
        this.map = this.game.add.tilemap('dynamicMap', 32, 32);
        this.map.addTilesetImage('world', 'world', 32, 32);
        
        // Set collision values on tiles
        this.map.setCollisionBetween(2881, 4096);

        //  0 is important
        this.theLevel = this.map.createLayer(0);

        //  Scroll it
        this.theLevel.resizeWorld();
    },
    spawnCoins: function (){
        var columns = this.mapSections * 40; // 32px tiles

        for (var i = 5; i < columns; i++){
            if (this.roll() > 80){
                var tilePosY = this.game.rnd.between(0, 20);
                var targetTile = this.map.getTile(i, tilePosY, this.theLevel, true);
               
                if (!targetTile) // Prevent crash if null
                    continue;
                    
                var TargetTileIndex = targetTile.index;
                var coin;
                var posX = i * 32;
                var posY = tilePosY * 32;
                
                if (TargetTileIndex != 2881){
                    coin = this.coins.create(posX, posY, 'entities');
                    coin.animations.add('spin', [36,37,38,39,40], 10, true);
                    coin.animations.play('spin');
                    coin.bringToTop();
                    this.setPhysicsProperties(coin, 300, 0, 32, 64, 0, 0);
                } else {
                    // Try again!
                    y = this.game.rnd.between(0, 20);
                    targetTile = this.map.getTile(posX, posY, this.theLevel, true).index;
                    
                    if (TargetTileIndex != 2881){
                        coin = this.coins.create(posX, posY + 16, 'entities');
                        coin.animations.add('spin', [36,37,38,39,40], 12, true);
                        coin.animations.play('spin');
                        coin.bringToTop();
                        this.setPhysicsProperties(coin, 300, 0, 32, 64, 0, 0);
                    }
                }
            }
        }
  },
  collectCoin: function(player, coin) {
    // Removes the coin from the screen
    coin.kill();

    // Give boost (prevented by pressing down arrow)
    if (this.cursors.up.isDown)
        this.player.body.velocity.y = -160;

    //  Add and update the score
    this.coinsCollected += 1;
    this.displayCoins.text = 'Coins: ' + this.coinsCollected;
    this.coinSound.play();
  },
};
