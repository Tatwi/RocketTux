var RocketTux = RocketTux || {};
 
RocketTux.Game = function(){};
 
RocketTux.Game.prototype = {
  create: function() {
    this.game.renderer.setTexturePriority(['world', 'atlas']);
    this.gameOver = false;
    
    var pickSong = Math.floor(Math.random() * RocketTux.songs.length)
    music = this.game.add.audio(RocketTux.songs[pickSong]);
    music.loop = true;
    music.volume = 0.5;
    music.play();

    // Set world bounds
    this.mapSections = this.game.rnd.between(RocketTux.unlocks.levelSectionsMin, RocketTux.unlocks.levelSectionsMax); // 6400px min, 19200px max
    this.levelLength = 32 * 40 * this.mapSections; // Tile width * Tiles per section * sections
    this.game.world.setBounds(0, 0, this.levelLength, 720);
    
    // Pick theme and time of day
    this.themeOptions = RocketTux.unlocks.themes.split(',');
    this.theme = this.rollGame(this.themeOptions, RocketTux.favortieTheme); // returns string    
    this.timeOptions = RocketTux.unlocks.timesOfDay.split(',');
    this.timeOfDay = this.rollGame(this.timeOptions, RocketTux.favortieTime); // returns string
    
    // Add background for special themes or based on the time of day
    if (this.theme == 'candyland'){
        this.addBackground('skies-special', 2);
        this.timeOfDay = 'day';
    } else if (this.theme.indexOf('beach') > -1) {
        this.addBackground('skies-special', 0);
        this.timeOfDay = 'day';
    } else {
        if (this.timeOfDay == 'sunrise') {
            this.addBackground('skies', 0);
        } else if (this.timeOfDay == 'day') {
            this.addBackground('skies', 1);
        } else if (this.timeOfDay == 'sunset') {
            this.addBackground('skies', 2);
        } else if (this.timeOfDay == 'night') {
            this.addBackground('skies', 3);
        } else if (this.timeOfDay == 'supertuxDay') {
            this.addBackground('skies-special', 1);
        } else if (this.timeOfDay == 'supertuxNight') {
            this.addBackground('skies-special', 3);
        }
    }
    
    // Add group for coins
    this.coins = this.game.add.group();
    this.coinsCollected = 0;
    this.coinsInLevel = 0;
    this.coinSound = this.game.add.audio('collect');
    
    // Add group for item/powerup/info blocks 
    this.blocks = this.game.add.group();
    this.blkDangerSnd = this.game.add.audio('blk-danger');
    this.blkMiscSnd = this.game.add.audio('blk-misc');
    this.blkPowerupSnd = this.game.add.audio('blk-powerup');
    this.blkQuestSnd = this.game.add.audio('blk-quest');
    this.itemsCollected = [];
    
    
    // Add boosts
    this.boosts = Math.max(2, (Math.floor(this.mapSections / 4))) + RocketTux.bonusBoosts; // At least 2 + bonus
    
    // Hardmode
    if (RocketTux.gameMode == 'easy'){
        this.boosts = 100;
    } else if (RocketTux.gameMode == 'hard'){
        this.boosts = 1;
    }
    
    // DEBUG
    this.myDebugText = this.game.add.text(16, 16, 'score: 0', { fontSize: '16px', fill: '#FFFFFF' });
    this.myDebugText.fixedToCamera = true;
    this.myDebugText.text = '';
    
    this.createTileMap();
    
    // Add the player
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'atlas');
    this.player.anchor.setTo(.5,1);
    this.player.animations.add('stand', ['tux-stand'], 1, true);
    this.player.animations.add('duck', ['tux-duck'], 1, true);
    this.player.animations.add('hover', Phaser.Animation.generateFrameNames('tux-hover-', 0, 5), 10, true);
    this.player.animations.add('run', Phaser.Animation.generateFrameNames('tux-run-', 0, 6), 12, true);
    this.player.animations.add('fly', Phaser.Animation.generateFrameNames('tux-fly-', 0, 4), 10, true);
    this.player.animations.play('stand');
    this.facingLeft = false;
    this.ducking = false;

    this.setPhysicsProperties(this.player, RocketTux.tuxGravity, 0, 22, 44, 37, 20);
    this.game.camera.follow(this.player);

    // Rocketpack sounds
    this.sndRocketStart = this.game.add.audio('rocketpack-start');
    this.sndRocketRunning = this.game.add.audio('rocketpack-running');
    this.sndRocketWindup = this.game.add.audio('rocketpack-windup');
    this.sndRocketBoost = this.game.add.audio('rocketpack-boost');
    this.sndRocketBoostFail = this.game.add.audio('rocketpack-boost-fail');
    this.engineRunning = false;
    
    // Input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.globalCooldown = false;
    this.abilityCooldown = false;

    // Sounds
    this.sndMouseOver = this.game.add.audio('mouseover');
    this.sndWarp = this.game.add.audio('warp');
    
    // Populate map with coins, blocks, and enemies
    this.spawnEntities();
    this.game.world.bringToTop(this.blocks);
    this.game.world.bringToTop(this.coins);
    
    // Put player up front
    this.player.bringToTop();
    
    // UI Panel
    this.uiTimer = this.game.time.time + 1000;
    this.world.add(slickUI.container.displayGroup);
    this.panel;
    slickUI.add(this.panel = new SlickUI.Element.Panel(4, 8, 375, 38));

    this.btQuit;
    this.panel.add(btQuit = new SlickUI.Element.Button(0, 0, 60, 32));
    btQuit.events.onInputUp.add(this.quit, this);
    btQuit.events.onInputOver.add(this.toolTipOver, this);
    btQuit.events.onInputOut.add(this.toolTipOut, this);
    btQuit.add(new SlickUI.Element.Text(0, 0, 'Quit')).center();
    
    this.powerUpIconButton; // Needed for tooltip/removal, because Slick-UI images don't have events 
    this.panel.add(this.powerUpIconButton = new SlickUI.Element.Button(333, 0, 32, 32));
    this.powerUpIconButton.events.onInputOver.add(this.powerupToolTipOver, this);
    this.powerUpIconButton.events.onInputOut.add(this.powerupToolTipOut, this);
    this.powerUpIconButton.events.onInputUp.add(this.removePowerUp, this);
    this.powerUpIconButton.visible = false;
    this.applyPowerUp(false); // Apply powerup if there is one saved
    
    // Quest Window
    this.questPrompt;
    slickUI.add(this.questPrompt = new SlickUI.Element.Panel(8, 48, 360, 480));
    this.questPrompt.visible = false;
    this.acceptButton;
    this.questPrompt.add(this.acceptButton = new SlickUI.Element.Button(178, 420, 170, 60));
    this.acceptButton.events.onInputUp.add(this.acceptQuest, this);
    this.acceptButton.add(new SlickUI.Element.Text(0, 0, 'Accept')).center();
    this.declineButton;
    this.questPrompt.add(this.declineButton = new SlickUI.Element.Button(0, 420, 170, 60));
    this.declineButton.events.onInputUp.add(this.declineQuest, this);
    this.declineButton.add(new SlickUI.Element.Text(0, 0, 'Decline')).center();
    
    // "Adventure Bag" Panel
    this.lootPanel;
    slickUI.add(this.lootPanel = new SlickUI.Element.Panel(8, 48, 232, 210));
    var bagName;
    this.lootPanel.add(bagName = new SlickUI.Element.Text(0, 0, 'Adventure Bag'));
    bagName.centerHorizontally();
    this.lootPanel.visible = false;
    this.lootIconRowCount = 0; // Resets x position on display of items that have been collected
    
    // UI Coins
    this.displayCoins = 'Coins: ' + this.coinsCollected + "/" + this.coinsInLevel;
    this.lvlCoins; 
    this.panel.add(this.lvlCoins = new SlickUI.Element.Text(70, 0, this.displayCoins));
    
    // UI Boosts
    this.displayBoosts = 'Boosts: ' + this.boosts;
    this.lvlBoosts
    this.panel.add(this.lvlBoosts = new SlickUI.Element.Text(210, 0, this.displayBoosts));
    
  },
//==================GAME LOOP START========================
  update: function() {
    if (this.gameOver == true)
        return;
      
    this.game.physics.arcade.collide(this.player, this.theLevel);
    this.game.physics.arcade.collide(this.coins, this.theLevel);
    this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.game.physics.arcade.overlap(this.player, this.blocks, this.openBlock, null, this);
    
    // Player Movement
    if (this.cursors.right.isDown){
        if (this.facingLeft){
            this.player.scale.x = Math.abs(this.player.scale.x); // Face right
            this.facingLeft = false;
        }
        
        if (this.player.body.blocked.down){
            this.player.animations.play('run');
            this.player.body.velocity.x = RocketTux.groundSpeed;
            this.stopEngine();
        } else {
            this.player.animations.play('fly');
            this.player.body.velocity.x = RocketTux.airSpeed;
            
            if (this.cursors.up.isDown || this.cursors.down.isDown){ // Maintain altitude
                if (this.player.body.velocity.y > 0)
                    this.player.body.velocity.y = 0;
            }
            
            if (!this.engineRunning) // Play rocket pack sounds
                this.startEngine();
        }
    } else if (this.cursors.left.isDown){
        if (!this.facingLeft){
            this.player.scale.x *= -1; // Face left
        }
        
        if (this.player.body.blocked.down){
            this.player.animations.play('run');
            this.player.body.velocity.x = RocketTux.groundSpeed * -1;
            this.stopEngine();
        } else {
            this.player.animations.play('fly');
            this.player.body.velocity.x = RocketTux.airSpeed * -1;
            
            if (this.cursors.up.isDown || this.cursors.down.isDown){ // Maintain altitude
                if (this.player.body.velocity.y > 0)
                    this.player.body.velocity.y = 0;
            }
            
            if (!this.engineRunning) // Play rocket pack sounds
                this.startEngine();
        }
        
        this.facingLeft = true;
    } else {
        this.player.body.velocity.x = 0;
        this.player.scale.x = Math.abs(this.player.scale.x); // Face right
        this.facingLeft = false;
        
        if (this.player.body.blocked.down){
            if (this.cursors.down.isDown){
                this.player.animations.play('duck');
                
                if (!this.ducking){
                    this.player.body.setSize(22, 20, 37, 44); // Hitbox half height once, not every frame
                    this.ducking = true;
                }
            } else {
                this.player.animations.play('stand');
                
                if (this.ducking){
                    this.player.body.setSize(22, 44, 37, 20); // Hitbox normal height once, not every frame
                    this.ducking = false;
                }
            }
            
            this.stopEngine();
        } else {
            this.player.animations.play('hover');
            
            if (this.cursors.up.isDown || this.cursors.down.isDown){ // Maintain altitude
                if (this.player.body.velocity.y > 0)
                    this.player.body.velocity.y = 0;
            }
            
            if (!this.engineRunning) // Play rocket pack sounds
                this.startEngine();
        }
    }
    
    // Ability cooldown throttled actions
    this.doPlayerAbilities();
    
    // Global cooldown throttled actions (1 sec)
    this.throttledInput();
    
    // UI Updates (Throttled to 1 update per second)
    this.uiUpdate();
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
    } else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.B, 1)){ 
        this.toggleBag();
        this.globalCooldownStart(1);
    }
  },
  uiUpdate: function(){
    if (this.game.time.time < this.uiTimer)
        return;
        
    //this.myDebugText.text = "Ability Cooldown On: " + this.abilityCooldown + "\nGlobal Cooldown On: " + this.globalCooldown;
    this.lvlCoins.value = 'Coins: ' + this.coinsCollected + "/" + this.coinsInLevel;
    this.lvlBoosts.value = 'Boosts: ' + this.boosts;
    
    this.uiTimer = this.game.time.time + 1000;
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
        
    if (this.game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 5)){
        // Spacebar Boost (5 second cooldown)
         if (this.boosts < 1){
            this.sndRocketBoostFail.play();
            this.abilityCooldownStart(5);
            
            return;
        }
        
        if (this.cursors.down.isDown)
            return; // no boost while crouching or flying while holding down
        
        this.sndRocketWindup.play();
        this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.doBoost, this);
        this.abilityCooldownStart(5);
    } else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.CONTROL, 1)){
        // Small, single tile jump (1 second cooldown)
        if (!this.player.body.blocked.down)
            return;
        
        if (this.cursors.down.isDown)
            return;
            
        this.player.body.velocity.y = -100;
    }
  },
//___________________GAME LOOP END___________________________
  doBoost: function(){
    this.doExplosion(this.player.body.x, this.player.body.y);
    this.sndRocketBoost.play();
    this.player.body.velocity.y = RocketTux.boostSpeed * -1;
    this.boosts--;
  },
  doExplosion: function(x, y){
    this.boostBlast = this.game.add.sprite(x, y, 'atlas');
    this.boostBlast.animations.add('blast', ['explosion-0', 'explosion-1', 'explosion-0', 'explosion-2', 'explosion-3'], 10, true);
    this.boostBlast.anchor.setTo(0.4,0);
    this.boostBlast.animations.play('blast');
    this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.douseFlames, this);
  },
  douseFlames: function(){
    this.boostBlast.destroy();
  },
  startEngine: function(){
    this.sndRocketStart.play();
    this.sndRocketRunning.loopFull(1.0);
    this.sndRocketRunning.play();
    this.engineRunning = true;
  },
  stopEngine: function(){
    this.sndRocketRunning.fadeOut(333);
    this.engineRunning = false;
  },
  doParticleExplosion: function(dur, num, fn, onPlayer, x, y, size){
    // Add special effect
    var frame = this.game.cache.getFrameData("atlas").getFrameByName(fn);
    
    if (onPlayer){
        x = this.player.body.x;
        y = this.player.body.y;
    }
    
    this.emitter = this.game.add.emitter(x, y, 100);
    this.emitter.makeParticles('atlas', frame.index, num, false, false);
    this.emitter.gravity = 200;
    this.emitter.setXSpeed(-200, 200);
    this.emitter.setYSpeed(-200, 200);
    this.emitter.setScale(0.1, size, 0.1, size, 4000, Phaser.Easing.Quintic.Out);
    this.emitter.start(true, dur, null, num);
    this.game.time.events.add(dur, this.destroyEmitter, this);
  },
  destroyEmitter: function(){
    this.emitter.destroy();
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
  rollGame: function(contestants, playerFavorite){
    // Returns who had the best roll out of 100 for any number of contestants, with one possibily weighted higher than the rest.
    // contestants: An array of string value names
    // playerFavorite: One of the string values contained in contestants or 'none'

    var rolls = [];
 
    for (i = 0; i < contestants.length; i++){
    rolls[i] = this.roll();

    if (contestants[i] == playerFavorite)
      rolls[i] += 20;
    }

    var winner = 0;
    var tmpBest = rolls[0];

    for (j = 0; j < rolls.length; j++){
        if (rolls[j] > tmpBest){
          winner = j;
          tmpBest = rolls[j];
        }
    }

    return contestants[winner];
  },
  pickRandomProperty: function(obj){
        var result;
        var count = 0;
        for (var prop in obj)
            if (Math.random() < 1/++count)
               result = prop;
        return result;
  },
  addBackground: function(sprite, frame){
    this.activeBG = this.game.add.sprite(0, 0, sprite);
    this.activeBG.animations.add('stand', [frame], 1, true);
    this.activeBG.scale.setTo(1.25, 0.71); //wide, tall
    this.activeBG.width = this.game.width;
    this.activeBG.play('stand');
    this.activeBG.bringToTop();
    this.activeBG.fixedToCamera = true;  
  },
  createTileMap: function(){
        var data = '';
        var rows = ["","","","","","","","","","","","","","","","","","","","","","",""];
        var theme = RocketTux[this.theme];
        
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
        
        // debug
        //this.theLevel.alpha = 0.5;
    },
    spawnEntities: function (){
        var columns = this.mapSections * 40; // 32px tiles
        var powerup = false;
        var quest = false;

        for (var i = 5; i < columns; i++){
            if (this.roll() > 78){
                var tilePosY = this.game.rnd.between(0, 20);
                var targetTile = this.map.getTile(i, tilePosY, this.theLevel, true);
               
                if (!targetTile) // Prevent crash if null
                    continue;
                    
                var TargetTileIndex = targetTile.index;
                var posX = i * 32;
                var posY = tilePosY * 32;
                
                if (TargetTileIndex < 2881){
                    var spawnWhat = this.roll();
                    var coin;
                    var doCoin = false;
                    var block;
                    
                    if (spawnWhat > 94){
                        // Blue block grants misc item
                        block = this.blocks.create(posX, posY, 'atlas');
                        block.frameName = 'blk-misc';
                        this.setPhysicsProperties(block, 0, 0, 32, 32, 0, 0);
                    } else if (spawnWhat > 90){
                        // Orange block grants rare item and spawns an enemy or detrimental event
                        block = this.blocks.create(posX, posY, 'atlas');
                        block.frameName = 'blk-danger';
                        this.setPhysicsProperties(block, 0, 0, 32, 32, 0, 0);
                    } else if (spawnWhat > 88){
                        if (powerup == true){
                            doCoin = true;
                        } else {
                            // Purple block give a power up
                            block = this.blocks.create(posX, posY, 'atlas');
                            block.frameName = 'blk-powerup';
                            this.setPhysicsProperties(block, 0, 0, 32, 32, 0, 0);
                            powerup = true;
                        }
                    } else if (spawnWhat > 86){
                        if (quest == true){
                            doCoin = true;
                        } else {
                            // Green block offers a quest
                            block = this.blocks.create(posX, posY, 'atlas');
                            block.frameName = 'blk-quest';
                            this.setPhysicsProperties(block, 0, 0, 32, 32, 0, 0);
                            quest = true;
                        }
                    }  else {
                        doCoin = true;
                    }
                    
                    if (doCoin){
                        coin = this.coins.create(posX, posY, 'atlas');
                        coin.animations.add('spin', Phaser.Animation.generateFrameNames('coin-', 0, 5), 10, true);
                        coin.animations.play('spin');
                        this.setPhysicsProperties(coin, 0, 0, 32, 32, 0, 0);
                        this.coinsInLevel++;
                    }
                    
                    if (this.roll() > 90){
                        // Spawn an enemy here too
                    }
                }
            }
        }
  },
  collectCoin: function(player, coin) {
    // Removes the coin from the screen
    coin.kill();

    // Give boost (prevented by pressing down arrow)
    if (!this.cursors.down.isDown)
        this.player.body.velocity.y = -160;

    //  Add and update the score
    this.coinsCollected += 1;
    this.coinSound.play();
    
    if (RocketTux.powerUpActive == 'fire'){
        if (this.boosts > 4)
            return;
        
        if (this.roll() < 90)
            return;
            
        this.boosts++;
        this.blkPowerupSnd.play();
    }
  },
  openBlock: function(player, block){
    if (block.frameName == 'blk-empty')
        return;
      
    if (block.frameName == 'blk-misc'){ // Blue grants misc item
        this.blkMiscSnd.play();
        this.grantLootItem(block.frameName);
    } else if (block.frameName == 'blk-danger'){ // Orange grants rare item and spawns an enemy or detrimental event
        this.blkDangerSnd.play();
        this.grantLootItem(block.frameName);
    } else if (block.frameName == 'blk-powerup'){ // Purple give a power up
        this.blkPowerupSnd.play();
        this.applyPowerUp(true);
    } else if (block.frameName == 'blk-quest'){ // Green offers a quest
        this.blkQuestSnd.play();
        
        this.questPrompt.visible = true;
        var txt = "This is the window that opens when you get a quest. When the quest system is complete, it will be much cooler!";
        this.questPrompt.add(new SlickUI.Element.Text(4, 0, txt));        
    } 
        
    block.frameName = 'blk-empty';
  },
  acceptQuest: function(){
    this.questPrompt.visible = false;
  },
  declineQuest: function(){
    this.questPrompt.visible = false;
  },
  removePowerUp: function(){
    if (RocketTux.powerUpActive == 'none')
        return;
                
    // Reset stats
    if (this.powerUpIcon.frameName == 'pwrup-icon-star'){
        RocketTux.airSpeed -= 10;
        RocketTux.groundSpeed -= 10;
    } else if (this.powerUpIcon.frameName == 'pwrup-icon-fire'){
        RocketTux.airSpeed -= 20;
    } else if (this.powerUpIcon.frameName == 'pwrup-icon-water'){
        RocketTux.luck -= 12;
    } else if (this.powerUpIcon.frameName == 'pwrup-icon-air'){
        RocketTux.tuxGravity += 15;
    } else if (this.powerUpIcon.frameName == 'pwrup-icon-earth'){
        RocketTux.tuxGravity -= 35;
        RocketTux.luck -= 3;
    }
    
    this.powerUpIcon.destroy();
    this.powerUpIconButton.visible = false;
    this.powerupToolTipOut();
    RocketTux.powerUpActive = 'none';
    localStorage.setItem('RocketTux-powerUpActive', 'none');
  },
  applyPowerUp: function(newPwrup){
    if (newPwrup){
        // Roll for new powerup
        var pwrupNames = ['star', 'fire', 'water', 'air', 'earth'];
        var winner = this.rollGame(pwrupNames, RocketTux.favortiePowerUp); // returns string
        
        this.removePowerUp(); // Replace previous with new

        RocketTux.powerUpActive = winner;
        localStorage.setItem('RocketTux-powerUpActive', winner);
        
        // Add special effect
        this.doParticleExplosion(5000, 8, 'pwrup-obj-' + RocketTux.powerUpActive, true, 0, 0, 2)
    }
    
    var tmpPwrup = localStorage.getItem('RocketTux-powerUpActive');
    
    // Show the icon
    if (tmpPwrup != 'none') {
        this.powerUpIconButton.visible = true;
        this.powerUpIcon;
        this.panel.add(new SlickUI.Element.DisplayObject(333, -2, this.powerUpIcon = this.game.make.sprite(0, 0, 'atlas')));
        this.powerUpIcon.frameName = 'pwrup-icon-' + RocketTux.powerUpActive;
    }
    
    // Apply buff effect (when new and when loading level, rather than storing it)
    if (tmpPwrup != 'none' || newPwrup == true) {
        if (tmpPwrup == 'star'){
            RocketTux.airSpeed += 10;
            RocketTux.groundSpeed += 10;
        } else if (tmpPwrup == 'fire'){
            RocketTux.airSpeed += 20;
        } else if (tmpPwrup == 'water'){
            RocketTux.luck += 12;
        } else if (tmpPwrup == 'air'){
            RocketTux.tuxGravity -= 15;
        } else if (tmpPwrup == 'earth'){
            RocketTux.tuxGravity += 35;
            RocketTux.luck += 3;
        }
    }
    
  },
  powerupToolTipOver: function(){
    this.powerupToolTip;
    slickUI.add(this.powerupToolTip = new SlickUI.Element.Panel(16, 64, 360, 130));

    var txt; 
    
    if (RocketTux.powerUpActive == 'star'){
        txt = 'Star: Makes you fly and run faster.';
    } else if (RocketTux.powerUpActive == 'fire'){
        txt = 'Fire: Makes you fly very fast and gives you a chance to gain a boost when collecting coins (up to 5 boosts).';
    } else if (RocketTux.powerUpActive == 'water'){
        txt = 'Water: Ice Armor makes you invincible and very lucky at no cost, but the armor is consumed after one use.';
    } else if (RocketTux.powerUpActive == 'air'){
        txt = 'Air: Makes you lighter so can jump higher, boost better, and fall more slowly.';
    } else if (RocketTux.powerUpActive == 'earth'){
        txt = 'Earth: Stone Form makes you invincible and a bit more lucky, at the cost of making you much heavier.';
    }
    
    txt += " Click this icon to remove the powerup."
    
    this.powerupToolTip.add(new SlickUI.Element.Text(4, 0, txt));
    this.powerupToolTipIsOn = true;
  },
  powerupToolTipOut: function(){
    if (this.powerupToolTipIsOn)
        this.powerupToolTip.destroy();
        
    this.powerupToolTipIsOn = false;
  },
  grantLootItem: function(blockName){
    var itemNumber = RocketTux.lootgroups[this.timeOfDay][this.theme][Math.floor(Math.random() * RocketTux.lootgroups[this.timeOfDay][this.theme].length)];
    
    if (blockName == 'blk-danger'){
        if (this.roll() > 98 - RocketTux.luck)
            itemNumber = RocketTux.lootgroups.rares[Math.floor(Math.random() * RocketTux.lootgroups.rares.length)]; // Rare item
    }
    
    // Track items collected this level
    this.itemsCollected[this.itemsCollected.length] = itemNumber;

    // Add item to the loot bag
    var posY = 24 + 37 * Math.floor((this.itemsCollected.length - 1) / 6);
    
    if (this.lootIconRowCount > 5)
        this.lootIconRowCount = 0;
    
    var posX = 2 + this.lootIconRowCount * 37;
        
    this.lootPanel.add(new SlickUI.Element.DisplayObject(posX, posY, this.latestLootIcon = this.game.make.sprite(0, 0, 'atlas')));
    this.latestLootIcon.frameName = 'icon-' + itemNumber;
    
    this.lootIconRowCount++;
  },
  toggleBag: function(){
    if (this.lootPanel.visible){
        this.lootPanel.visible = false;
    } else {
        this.lootPanel.visible = true;
    }
  },
  lootToolTipShrink: function(){
    this.oldLoot.visible = false;
    this.lootPanel.width = 36;
    this.lootToolTipExpanded = false;
  },
  quit: function(){
    this.gameOver = true; // Prevent crash caused by running game loop after destroying the following objects
    this.player.destroy();
    //this.flames.destroy();
    this.theLevel.destroy();
    this.sndRocketStart.destroy();
    this.sndRocketRunning.destroy();
    this.sndRocketWindup.destroy();
    this.sndRocketBoost.destroy();
    
    this.sndWarp.play();
    music.destroy();
    slickUI.container.displayGroup.removeAll(true);
    this.coins.destroy();
    this.blocks.destroy();
    
    // Calculate bonues
    var savedCoins = parseInt(localStorage.getItem('RocketTux-myWallet'));
    var bonusCoins = Math.floor(this.coinsCollected / 10);
    
    if (this.coinsCollected == this.coinsInLevel){
        bonusCoins += 20;
        
        if (RocketTux.gameMode == 'easy'){
            bonusCoins -= 10;
        } else if (RocketTux.gameMode == 'hard'){
            bonusCoins += 25;
        }
    }
    
    var totalCoins = this.coinsCollected + bonusCoins;

    // Save data
    var newWalletValue = savedCoins + totalCoins;
    localStorage.setItem('RocketTux-myWallet', newWalletValue);
    
    // UI Show player
    this.world.add(slickUI.container.displayGroup);
    this.grats;
    slickUI.add(this.grats = new SlickUI.Element.Panel(this.game.camera.width / 2 - 180, this.game.camera.height / 2 - 150, 360, 300));
    
    this.txt = 'GREAT JOB!\n\nCoins Collected: ' + this.coinsCollected + '\nBonus Coins: ' + bonusCoins + '\n\nTotal Coins Earned:\n\n' + totalCoins;
    this.gratMessage;
    this.grats.add(this.gratMessage = new SlickUI.Element.Text(0, 0, this.txt));
    this.gratMessage.centerHorizontally();

    this.ender;
    this.grats.add(this.ender = new SlickUI.Element.Button(0, 220, 360, 72));
    this.ender.events.onInputUp.add(this.endLevel, this);
    this.ender.add(new SlickUI.Element.Text(0, 0, 'Awesome!')).center();
    
    this.add.tween(this.grats).from({alpha: 0}, 500, Phaser.Easing.Quadratic.In).start();
    this.add.tween(this.grats).from({y: this.game.camera.height + 150}, 500, Phaser.Easing.Back.InOut).start();
  },
  endLevel: function(){
    slickUI.container.displayGroup.removeAll(true);
    this.game.state.start('MainMenu', true, false); // Destroy all - yes. Clear cache - no.
  },
  toolTipOver: function(){
    this.quitToolTip;
    slickUI.add(this.quitToolTip = new SlickUI.Element.Panel(16, 64, 300, 110));
    var txt = 'Click this button to the end the level after you have collected all the coins and items that you could reach.';
    this.quitToolTip.add(new SlickUI.Element.Text(4, 0, txt));
  },
  toolTipOut: function(){
    this.quitToolTip.destroy();
  },
};
