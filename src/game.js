var RocketTux = RocketTux || {};
 
RocketTux.Game = function(){};
 
RocketTux.Game.prototype = {
  init: function(theme, timeOfDay){
	this.theme = theme;
	this.timeOfDay = timeOfDay;
  },
  create: function() {
    this.game.clearBeforeRender = false; // Every scene always has an opaque background image that gets repainted every frame
    
    this.gameOver = false;
    
    var pickSong = Math.floor(Math.random() * RocketTux.songs.length);
    music = this.game.add.audio(RocketTux.songs[pickSong]);
    music.loop = true;
    music.volume = 0.5;
    music.play();

    // Set world bounds
    this.mapSections = this.game.rnd.between(RocketTux.unlocks.levelSectionsMin, RocketTux.unlocks.levelSectionsMax); // 6400px min, 19200px max
    this.levelLength = 32 * 40 * this.mapSections; // Tile width * Tiles per section * sections
    this.game.world.setBounds(0, 0, this.levelLength, 720);
    
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
    
    // Add group for enemies
    this.enemies = this.game.add.group();
    
    // Add boosts
    this.boosts = Math.max(3, (Math.floor(this.mapSections / 4))) + RocketTux.bonusBoosts; // At least 3 + bonus
    
    // Easy and Hard mode adjustments
    if (RocketTux.gameMode == 'easy'){
        this.boosts += 20;
    } else if (RocketTux.gameMode == 'hard'){
        this.boosts = 1;
    }
    
    this.createTileMap();
    
    // Add the player
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'atlas');
    this.player.anchor.setTo(0.5, 1);
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
    this.playerHurt = false;
    this.playerInvicible = false;
    
    // Stats that will be augmented by powerups
    this.lvlAirSpeed = RocketTux.airSpeed;
    this.lvlGroundSpeed = RocketTux.groundSpeed;
    this.lvlGravity = RocketTux.tuxGravity;
    this.lvlLuck = RocketTux.luck;

    // Rocketpack sounds
    this.sndRocketStart = this.game.add.audio('rocketpack-start');
    this.sndRocketRunning = this.game.add.audio('rocketpack-running');
    this.sndRocketWindup = this.game.add.audio('rocketpack-windup');
    this.sndRocketBoost = this.game.add.audio('rocketpack-boost');
    this.sndRocketBoostFail = this.game.add.audio('rocketpack-boost-fail');
    
    // Misc sounds
    this.sndExplosion = this.game.add.audio('explosion');
    this.sndTicking = this.game.add.audio('ticking');
    this.sndDropCoins = this.game.add.audio('coin-drop');
    this.sndCollide = this.game.add.audio('collide');
    this.sndShakeOff = this.game.add.audio('shakeoff');
    
    // Input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.globalCooldown = false;
    this.abilityCooldown = false;
    this.game.input.gamepad.start(); // Tested with Super Nintendo style USB
    this.pad1 = this.game.input.gamepad.pad1;

    // Sounds
    this.sndMouseOver = this.game.add.audio('mouseover');
    this.sndWarp = this.game.add.audio('warp');
    
    // Populate map with coins, blocks, and enemies
    this.spawnEntities();
    this.game.world.bringToTop(this.blocks);
    this.game.world.bringToTop(this.coins);
    this.game.world.bringToTop(this.enemies);
    
    // Put player up front
    this.player.bringToTop();
    
    // Apply powerup if there is one saved
    this.applyPowerUp(false);
    
    // UI
    this.uiTimer = this.game.time.time + 1000;       
    this.style = { 
		font: "24px Verdana", 
		fill: "#ffffff", align: "left",
		stroke: '#000000',
		strokeThickness: 4
	};
	
	// Coin status
	this.coinIcon = this.game.add.sprite(60, 5, 'atlas');
    this.coinIcon.fixedToCamera = true;
    this.coinIcon.frameName = 'ui-coin';
    this.uiCoinStatus = this.game.add.text(0, 0, "", this.style);
    this.uiCoinStatus.alignTo(this.coinIcon, Phaser.RIGHT_TOP, 1, 1);
    this.uiCoinStatus.fixedToCamera = true;
    this.uiCoinStatus.text = this.coinsCollected + "/" + this.coinsInLevel;
    
    // Powerup status
    this.powerUpIcon = this.game.add.sprite(6, 5, 'atlas');
    this.powerUpIcon.inputEnabled = true;
    this.powerUpIcon.events.onInputDown.add(this.removePowerUp, this);
    this.powerUpIcon.events.onInputOver.add(this.powerUpIconOver, this);
    this.powerUpIcon.events.onInputOut.add(this.powerUpIconOut, this);
    this.powerUpIcon.fixedToCamera = true;
    if (RocketTux.powerUpActive == 'none'){
		this.powerUpIcon.frameName = 'blk-empty';
	} else {
		this.powerUpIcon.frameName = 'pwrup-icon-' + RocketTux.powerUpActive;
	}
	this.powerUpIconTip = this.game.add.text(8, 56, "Click to remove powerup!", this.style);
	this.powerUpIconTip.visible = false;
	
	// Boost status
	this.boostIcon = this.game.add.sprite(175, 5, 'atlas');
    this.boostIcon.fixedToCamera = true;
    this.boostIcon.frameName = 'boost-icon';
    this.uiBoostStatus = this.game.add.text(0, 0, "", this.style);
    this.uiBoostStatus.alignTo(this.boostIcon, Phaser.RIGHT_TOP, 1, 1);
    this.uiBoostStatus.fixedToCamera = true;
    this.uiBoostStatus.text = this.boosts;
    
    // Temporary startup message
    this.doMessage("Press ESC or Start to Pause/Exit");
    
    // Pause Window
    this.makePauseScreen();
  },
  
//==================GAME LOOP START========================

  update: function() {
    if (this.gameOver == true){
        return;
	}
    
    // Collide with the tilemap
    this.game.physics.arcade.collide(this.player, this.theLevel);
    this.game.physics.arcade.collide(this.coins, this.theLevel);
    this.game.physics.arcade.collide(this.enemies, this.theLevel, this.aiUpdate, null, this);
    
    // Interact with the player
    this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
    this.game.physics.arcade.overlap(this.player, this.blocks, this.openBlock, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemies, this.aiTrigger, null, this);
    
    // Player Movement
    this.movePlayer();
    
    // Update engine sound
    if (this.player.body.blocked.down){ // Stop on landing
        this.sndRocketRunning.fadeOut(230);
    } else if (!this.sndRocketRunning.isPlaying){ // Start on first frame we notice we're not on the ground and the engine isn't already running
        if (!this.sndRocketStart.isPlaying){
            this.sndRocketStart.play();
		}
            
        this.sndRocketRunning.loopFull(1.0);
        this.sndRocketRunning.play();
    }
    
    // Ability cooldown throttled actions
    this.doPlayerAbilities();
    
    // Global cooldown throttled actions (1 sec)
    this.throttledInput();
    
    // UI Updates (Throttled to 1 update per second)
    this.uiUpdate();
  },
  movePlayer: function(){
    if (this.playerHurt){ // No input for a bit after touching a badguy or an explosion to enable a push back or "bounce" effect
        this.player.body.velocity.y += 12;
        return;
    }
    
    if (this.cursors.right.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)){
        if (this.facingLeft){
            this.player.scale.x = Math.abs(this.player.scale.x); // Face right
            this.facingLeft = false;
        }
        
        if (this.player.body.blocked.down){
            this.player.animations.play('run');
            this.player.body.velocity.x = this.lvlGroundSpeed;// RocketTux.groundSpeed;
        } else {
            this.player.animations.play('fly');
            this.player.body.velocity.x = this.lvlAirSpeed; // RocketTux.airSpeed;
            
            if (this.cursors.up.isDown || this.cursors.down.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_X) || this.pad1.isDown(Phaser.Gamepad.XBOX360_Y)){ // Maintain altitude
                if (this.player.body.velocity.y > 0){
                    this.player.body.velocity.y = 0;
                }
            }
        }
    } else if (this.cursors.left.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)){
        if (!this.facingLeft){
            this.player.scale.x *= -1; // Face left
        }
        
        if (this.player.body.blocked.down){
            this.player.animations.play('run');
            this.player.body.velocity.x = this.lvlGroundSpeed* -1; //RocketTux.groundSpeed * -1;
        } else {
            this.player.animations.play('fly');
            this.player.body.velocity.x = this.lvlAirSpeed* -1; // RocketTux.airSpeed * -1;
            
            if (this.cursors.up.isDown || this.cursors.down.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_X) || this.pad1.isDown(Phaser.Gamepad.XBOX360_Y)){ // Maintain altitude
                if (this.player.body.velocity.y > 0){
                    this.player.body.velocity.y = 0;
                }
            }
        }
        
        this.facingLeft = true;
    } else {
        this.player.body.velocity.x = 0;
        this.player.scale.x = Math.abs(this.player.scale.x); // Face right
        this.facingLeft = false;
        
        if (this.player.body.blocked.down){
            if (this.cursors.down.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)){
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
        } else {
            this.player.animations.play('hover');
            
            if (this.cursors.up.isDown || this.cursors.down.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_X) || this.pad1.isDown(Phaser.Gamepad.XBOX360_Y)){ // Maintain altitude. Y/X are swapped on XBOX360 vs. Super Nintendo.
                if (this.player.body.velocity.y > 0){
                    this.player.body.velocity.y = 0;
                }
            }
        }
    }
  },
  globalCooldownStart: function(seconds){
      this.globalCooldown = true;
      this.game.time.events.add(Phaser.Timer.SECOND * seconds, this.globalReset, this);
  },
  globalReset: function(){
      this.globalCooldown = false;
  },
  throttledInput: function(){
      if (this.globalCooldown){
        return;
      }

    // M , . keys for music volume
    if (this.game.input.keyboard.downDuration(Phaser.Keyboard.PERIOD, 1)){
        if (music.volume > 0.9){
            return;
        }
            
        music.volume += 0.1;
        this.globalCooldownStart(1);
    } else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.COMMA, 1)){
        if (music.volume < 0.1){
            return;
        }
            
        music.volume -= 0.1;
        this.globalCooldownStart(1);
    } else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.M, 1)){ 
        if (music.volume > 0){
            music.volume = 0; // Mute
        } else {
            music.volume = 0.5;
        }
        
        this.globalCooldownStart(1);
    } else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.ESC, 1) || this.pad1.justPressed(9, 20)){ // Gamepad Start
		if (this.gameOver){
			this.quit();
		} else {
			this.game.paused = !this.game.paused;
		}
	}
    
    /* Debug
    if (this.game.input.activePointer.isDown){
		this.spawnBadGuy("badguy-2", this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
		this.globalCooldownStart(1);
	} */
  },
  uiUpdate: function(){
    if (this.game.time.time < this.uiTimer){
        return;
    }

	this.uiCoinStatus.text = this.coinsCollected + "/" + this.coinsInLevel;
	this.uiBoostStatus.text = this.boosts;
	
	if (RocketTux.powerUpActive == 'none'){
		this.powerUpIcon.frameName = 'blk-empty';
	} else {
		this.powerUpIcon.frameName = 'pwrup-icon-' + RocketTux.powerUpActive;
	}
	
    this.uiTimer = this.game.time.time + 500;
  },
  aiUpdate: function(sprite, tile){
    // Run per frame for each enemy that is colliding with a tile. Checks true state on sprite.madeUpName variable and does stuff specific to the madeUpName type of enemies.
    if (sprite.walker){
        this.turnAround(sprite, 90);
        
        // Speed up again after changing directions
        if (sprite.ticking && Math.abs(sprite.body.velocity.x) < 150){
            sprite.body.velocity.x *= 1.75;
        }
    } else if (sprite.hopper){
        this.hop(sprite, tile);
    } else if (sprite.flyer){
        this.turnAround(sprite, 190);
        
        if (this.game.time.time > this.uiTimer){
            var rng = this.roll();
            sprite.body.velocity.y = -3 * rng; // Lift off
            
            if (rng > 98){
                this.blowupBadguy(sprite, 96); // Ooops!
            }
        }
    }
  },
// --- AI Actions -------
  turnAround: function(sprite, walkSpeed){
    if (sprite.body.blocked.left){
        sprite.scale.x = -1;
        sprite.x += 2; // push right to avoid re-triggering blocked.left next frame
        sprite.body.velocity.x = walkSpeed;
    } else if (sprite.body.blocked.right){
        sprite.scale.x = 1;
        sprite.x -= 2; // push left to avoid re-triggering blocked.left next frame
        sprite.body.velocity.x = walkSpeed * -1;
    } else if (Math.abs(sprite.body.velocity.x) < walkSpeed) { // Default is to face and walk left <--
        sprite.body.velocity.x = walkSpeed * -1;
        sprite.scale.x = 1;
    }
  },
  hop: function(sprite, tile){
    sprite.y -= 2; // move up to avoid re-triggering blocked.down next frame
    sprite.body.velocity.y = -160;
  },
  abilityCooldownStart: function(seconds){
      this.abilityCooldown = true;
      this.game.time.events.add(Phaser.Timer.SECOND * seconds, this.abilityReset, this);
  },
  abilityReset: function(){
      this.abilityCooldown = false;
  },
  doPlayerAbilities: function(){
    if (this.abilityCooldown){
        return;
    }
        
    if (this.game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 5) || this.pad1.justPressed(Phaser.Gamepad.XBOX360_B)){ // A/B swapped on XBOX360 vs. Super Nintendo
        // Spacebar Boost (5 second cooldown)
         if (this.boosts < 1){
            this.sndRocketBoostFail.play();
            this.abilityCooldownStart(5);
            
            return;
        }
        
        if (this.cursors.down.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)){
            return; // no boost while crouching or flying while holding down
        }
        
        this.sndRocketWindup.play();
        this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.doBoost, this);
        this.abilityCooldownStart(5);
    } else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.CONTROL, 1) || this.pad1.justPressed(Phaser.Gamepad.XBOX360_A)){
        // Small, single tile jump (1 second cooldown)
        if (!this.player.body.blocked.down){
            return;
        }
        
        if (this.cursors.down.isDown || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)){
            return;
        }
           
        this.player.body.velocity.y = -100;
    }
  },
//___________________GAME LOOP END___________________________

//==================HELPER FUNCTIONS========================

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
    //this.game.time.events.add(dur, this.destroyEmitter, this);
  },
  destroyEmitter: function(){
    this.emitter.destroy();
  },
  setPhysicsProperties: function(entity, gravity, bounce, boundingBoxSizeX, boundingBoxSizeY, boundingBoxPosX, boundingBoxPosY){
    this.game.physics.arcade.enable(entity);
    entity.body.bounce.y = bounce;
    entity.body.gravity.y = gravity;
    entity.body.collideWorldBounds = true;
    
    if (boundingBoxSizeX > 0){
        entity.body.setSize(boundingBoxSizeX, boundingBoxSizeY, boundingBoxPosX, boundingBoxPosY);
    }
  },
  roll: function() {
    return this.game.rnd.between(0, 100);
  },
  rollGame: function(contestants, playerFavorite){
    // Returns who had the best roll out of 100 for any number of contestants, with one possibily weighted higher than the rest.
    // contestants: An array of string value names
    // playerFavorite: One of the string values contained in contestants or 'none'

    var rolls = [];
    var i =0;
    var j = 0;
 
    for (i = 0; i < contestants.length; i++){
		rolls[i] = this.roll();

		if (contestants[i] == playerFavorite){
		  rolls[i] += 20;
		}
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
	for (var prop in obj){
		if (Math.random() < 1/++count){
		   result = prop;
		}
	}
	return result;
  },
  powerUpIconOver: function(){
	if (RocketTux.powerUpActive != 'none'){
        this.powerUpIconTip.visible = true;
    }
  },
  powerUpIconOut: function(){
	this.powerUpIconTip.visible = false;
  },
  doMessage: function (msg){
	var bar = this.game.add.graphics();
    bar.beginFill(0x072756, 0.4);
    bar.drawRect(0, this.game.height/2-30, this.game.width, 60);
    bar.fixedToCamera = true;
    bar.lifespan = 3400;
    this.style = { 
		font: "24px Verdana", 
		fill: "#ffffff", align: "center",
		boundsAlignH: "center", boundsAlignV: "middle",
		stroke: '#000000',
		strokeThickness: 4
	};
    var tmpMsg = this.game.add.text(0, 0, msg, this.style);
    tmpMsg.setTextBounds(0, 0, this.game.width, this.game.height);
    tmpMsg.fixedToCamera = true;
    tmpMsg.lifespan = 3000;
  },
//==================LEVEL CREATION========================

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
        var rngSection = 0;
        var sectionsUsed = "";
        var failSafe = 0;
        var i =0;
        var ii =0;
        var j =0;
        var tmpRow = "";
        
        // Generate the width of the map
        for (i = 0; i < this.mapSections; i++)
        {
            failSafe = 0;
            rngSection = this.pickRandomProperty(theme);
            
            // Prevent using the same section twice
            while (sectionsUsed.indexOf(rngSection) >= 0){
                if (failSafe > 24){
                    break; // Prevent infite loop in cases where mapSections being used > number of different sections to choose from
                }
                
                rngSection = this.pickRandomProperty(theme);
                failSafe++;
            }
            
            sectionsUsed += rngSection;
            
            for (j = 0; j < 23; j++) {
                rows[j] += theme[rngSection][j];
            }
        }
        
        // Consolidate the width and height into the single data variable
        for (i = 0; i < 23; i++){
            tmpRow = rows[i].toString();
            data += tmpRow.slice(0, -1) + "\n"; // Remove trailing comma to prevent white line of right edge of screen
        }

        //  Add data to the cache
        this.game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);

        //  Create the tile map
        this.map = this.game.add.tilemap('dynamicMap', 32, 32);
        this.map.addTilesetImage('world', 'world', 32, 32);
        
        // Set collision values on tiles
        this.map.setCollisionBetween(3072, 4096);

        //  0 is important
        this.theLevel = this.map.createLayer(0);

        //  Scroll it
        this.theLevel.resizeWorld();
        
        // debug
        //this.theLevel.alpha = 0.5;
        
        // Set collision direction on platform type tiles (inc. clouds, kites, and palm trees)
        // This would have been cleaner had I thought of it before completing 95% the art/levels lol...
        var columns = this.mapSections * 40;
        var targetTile = null;
        for (i = 0; i < columns; i++){
			for (ii = 0; ii < 23; ii++){
				targetTile = this.map.getTile(i, ii, this.theLevel, true);
				
				switch (targetTile.index){
					case 3088:
					case 3089:
					case 3090:
					case 3091:
					case 3092:
					case 3093:
					case 3094:
					case 3095:
					case 3096:
					case 3097:
					case 3116:
					case 3117:
					case 3118:
					case 3146:
					case 3147:
					case 3148:
					case 3181:
					case 3182:
					case 3183:
					case 3243:
					case 3244:
					case 3245:
					case 3246:
					case 3247:
					case 3309:
					case 3310:
					case 3311:
					case 3328:
					case 3329:
					case 3330:
					case 3331:
					case 3332:
					case 3333:
					case 3334:
					case 3335:
					case 3336:
					case 3337:
					case 3340:
					case 3341:
					case 3342:
					case 3343:
					case 3344:
					case 3345:
					case 3346:
					case 3636:
					case 3637:
					case 3638:
					case 3639:
					case 3640:
					case 3700:
					case 3701:
					case 3702:
						// setCollision(left, right, up/top, down/bottom)
						targetTile.setCollision(false, false, true, false);
						break;
					default:
						break;
				}
			}
		} 
    },
    spawnEntities: function (){
        var columns = this.mapSections * 40; // 32px tiles
        var powerup = false;
        var quest = false;
        var badguySpacer = 0;
        var tilePosY = 0;
        var targetTile = 0;
        var TargetTileIndex = 0;
        var posX = 0;
        var posY = 0;
        var spawnWhat = 1;
        var coin;
        var doCoin = false;
        var block;
        var name = "";
        var i =0;

        for (i = 5; i < columns; i++){
            if (this.roll() > 78){
                tilePosY = this.game.rnd.between(0, 20);
                targetTile = this.map.getTile(i, tilePosY, this.theLevel, true);
               
               // Prevent crash if null
                if (!targetTile){
                    continue;
                }
                    
                TargetTileIndex = targetTile.index;
                posX = i * 32;
                posY = tilePosY * 32;
                
                if (TargetTileIndex < 2881){
                    spawnWhat = this.roll();
                    coin;
                    doCoin = false;
                    block;
                    
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
                        
                        // Prevent Jumpy from overlapping a coin (all other enemies move away from their spawn points)
                        posX = posX - 64;
                    }
                    
                    if (this.roll() > 50 && badguySpacer > 6){
                        badguySpacer = 0;
                        name = RocketTux.badguyConfig[this.theme][Math.floor(Math.random() * RocketTux.badguyConfig[this.theme].length)];
                        this.spawnBadGuy(name, posX, posY);
                    }
                    
                    badguySpacer++;
                }
            }
        }
  },
  spawnBadGuy: function(name, posX, posY){
    if (name == undefined){
        return;
    }
    
    // Values
    var type = RocketTux.badguyConfig[name].type;
    var gravity = RocketTux.badguyConfig[name].gravity;
    var frames = RocketTux.badguyConfig[name].frames;
    var fps = RocketTux.badguyConfig[name].fps;
    
    name+= '-';
    
    // Spawn into one of the groups and schedule a status update
    badguy = this.enemies.create(posX, posY, 'atlas');
    badguy.animations.add('move', Phaser.Animation.generateFrameNames(name, 0, frames), fps, true);
    badguy.animations.play('move');
    badguy.anchor.setTo(0.5, 0.5);
    badguy[type] = true; // Using this Boolean value to differentiate between badguy types for simplicity/speed 
    this.setPhysicsProperties(badguy, gravity, 0, 0, 0, 0, 0);
    
    // Allow Jumpy to bounce above the screen
    if (badguy.hopper){
		badguy.body.collideWorldBounds = false;
		badguy.body.checkCollision.up = false;
	}
  },
  
//==================INTERACTION WITH PLAYER========================

  aiTrigger: function(player, badguy){
	// Thou shall not spam hurt!
    if (this.playerHurt){
        return;
    }
      
    // Use the frameName from the world.json to do character specific player interactions
    if (badguy.frameName.indexOf('badguy-1') > -1){ // Mr. Bomb
        if (badguy.ticking){
            return;
        }
        
        badguy.animations.add('ticking', ['badguy-1-3', 'badguy-1-4', 'badguy-1-5', 'badguy-1-6'], 10, true);
        badguy.animations.play('ticking');
        badguy.body.velocity.x *= 1.75;
        
        badguy.ticking = true;
        this.sndTicking.play();
        this.game.time.events.add(Phaser.Timer.SECOND * 1.5, this.blowupBadguy, this, badguy, 96);
    } else if (badguy.frameName.indexOf('badguy-3') > -1){ // Mr. Shortfuse
        this.blowupBadguy(badguy, 64);
    } else if (badguy.frameName.indexOf('badguy-2') > -1){ // Jumpy
        if (!this.playerInvicible){
            this.sndCollide.play();
        }
            
        this.hurtPlayer();
    } if (badguy.frameName.indexOf('badguy-4') > -1){ // Rocketboots
        if (badguy.ticking){
            return;
        }
        
        badguy.ticking = true;
        this.sndTicking.play();
        this.game.time.events.add(Phaser.Timer.SECOND * 1.5, this.blowupBadguy, this, badguy, 200);
    }
  },
  blowupBadguy: function(badguy, blastRadius){
    this.doExplosion(badguy.body.x, badguy.body.y);
    this.sndExplosion.play();
    badguy.kill();
    
    var x = Math.abs(this.player.x - badguy.x);
    var y = Math.abs(this.player.y - badguy.y);
    var disToPlayer = Math.sqrt(x*x + y*y);
    
    //console.log('blast radius: %s, x: %s, y: %s, hyp: %s \nPlayer y: %s \nBadguy y: %s', blastRadius, x, y, disToPlayer, this.player.y, badguy.y);
    
    if (disToPlayer > blastRadius){
        return;
    }
    
    this.hurtPlayer();
  },
  hurtPlayer: function(){
    var dir = 1;
    
    // Bounce in direction opposite of player's motion
    if (this.player.body.velocity.x > 1){
        dir = -1;
    }
      
    // Handle powerup
    if (RocketTux.powerUpActive == 'earth'){ // Invincible
        if (!this.sndShakeOff.isPlaying){ // No spam!
            this.sndShakeOff.play();
        }
            
        return;
    } else if (RocketTux.powerUpActive == 'water'){ // Invincible once
        this.sndShakeOff.play();
        this.removePowerUp();
        
        // Bounce player (prevents the enemy hitting the player again on the next frame, because he is no longer invincible)
        this.player.body.velocity.y = -200;
        this.player.body.velocity.x = 300 * dir;
        
        // Set player in hurt state
        this.playerHurt = true;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.playerOK, this);
        
        return;
    } 
    
    this.removePowerUp();
      
    // Bounce player
    this.player.body.velocity.y = -200;
    this.player.body.velocity.x = 300 * dir;
    
    // Coin explosion
    this.sndDropCoins.play();
    this.doParticleExplosion(5000, 12, 'coin-0', true, 0, 0, 0.5);
    
    // Set player in hurt state
    this.playerHurt = true;
    this.game.time.events.add(Phaser.Timer.SECOND * 0.5, this.playerOK, this);
    
    // Remove coins from wallet
    var savedCoins = parseInt(localStorage.getItem('RocketTux-myWallet'));
    
    if (savedCoins < 1){
        return;
    }
        
    var newWalletValue = Math.max(1, savedCoins - 10);
    localStorage.setItem('RocketTux-myWallet', newWalletValue);
  },
  playerOK: function(){
    this.playerHurt = false;
  },
  collectCoin: function(player, coin) {
    // Removes the coin from the screen
    coin.kill();

    // Give boost (prevented by pressing down arrow)
    if (!this.cursors.down.isDown && !this.pad1.isDown(Phaser.Gamepad.XBOX360_Y) && !this.abilityCooldown){
        this.player.body.velocity.y = -160;
	}
	
    //  Add and update the score
    this.coinsCollected += 1;
    this.coinSound.play();
    
    // Inform player
    if (this.coinsCollected == this.coinsInLevel){
		this.winner = true;
		this.doMessage("Awesome, you collected all the coins!");
	}
    
    if (RocketTux.powerUpActive == 'fire'){
        if (this.boosts > 4){
            return;
        }
        
        if (this.roll() < 90){
            return;
        }
            
        this.boosts++;
        this.blkPowerupSnd.play();
    }
  },
  openBlock: function(player, block){
    if (block.frameName == 'blk-empty'){
        return;
    }
      
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
    } 
        
    block.frameName = 'blk-empty';
  },
  removePowerUp: function(){
    if (RocketTux.powerUpActive == 'none'){
        return;
    }
              
    // Reset stats to their default values
    this.lvlGroundSpeed = RocketTux.groundSpeed;
    this.lvlAirSpeed = RocketTux.airSpeed;
    this.lvlGravity = RocketTux.tuxGravity;
    this.player.body.gravity.y = this.lvlGravity;
    this.lvlLuck = RocketTux.luck;
    this.playerInvicible = false;
    
    RocketTux.powerUpActive = 'none';
    localStorage.setItem('RocketTux-powerUpActive', 'none');
  },
  applyPowerUp: function(newPwrup){
    if (newPwrup){
        // Roll for new powerup
        var pwrupNames = ['star', 'fire', 'water', 'air', 'earth'];
        var winner = this.rollGame(pwrupNames, RocketTux.favortiePowerUp); // returns string
        
        this.removePowerUp();
		
		// Store the new powerup
        RocketTux.powerUpActive = winner;
        localStorage.setItem('RocketTux-powerUpActive', winner);
        
        // Play special effect
        this.doParticleExplosion(5000, 8, 'pwrup-obj-' + RocketTux.powerUpActive, true, 0, 0, 2);
    }
    
    var storedPwrup = localStorage.getItem('RocketTux-powerUpActive');
    
    // Bail if there isn't a powerup to apply
    if (storedPwrup == 'none') {
        return;
    }
    
    // Apply effects
    if (storedPwrup == 'star'){
		this.lvlAirSpeed += 20;
		this.lvlGroundSpeed += 75;
	} else if (storedPwrup == 'fire'){
		this.lvlAirSpeed += 40;
	} else if (storedPwrup == 'water'){
		this.lvlLuck += 12;
		this.playerInvicible = true;
	} else if (storedPwrup == 'air'){
		this.lvlGravity -= 15;
	} else if (storedPwrup == 'earth'){
		this.lvlGravity += 35;
		this.lvlLuck += 3;
		this.playerInvicible = true;
	}
        
    this.player.body.gravity.y = this.lvlGravity;  
  },
  grantLootItem: function(blockName){
    var itemNumber = RocketTux.lootgroups[this.timeOfDay][this.theme][Math.floor(Math.random() * RocketTux.lootgroups[this.timeOfDay][this.theme].length)];
    
    if (blockName == 'blk-danger'){
        if (this.roll() > 98 - this.lvlLuck){
            itemNumber = RocketTux.lootgroups.rares[Math.floor(Math.random() * RocketTux.lootgroups.rares.length)]; // Rare item
        }
    }
    
    // Track items collected this level
    this.itemsCollected[this.itemsCollected.length] = itemNumber;

    // Save item to player's inventory
    var tmpInvVal = parseInt(localStorage.getItem('RocketTux-invItem' + itemNumber));
    if (tmpInvVal > 999){tmpInvVal = 999;}
    localStorage.setItem('RocketTux-invItem' + itemNumber, tmpInvVal + 1);
  },
 
//==================PAUSE RELATED========================
  makePauseScreen: function (){
	// Full screen darken
	this.pwBgSdw = this.game.add.graphics();
    this.pwBgSdw.beginFill(0x292929, 0.8);
    this.pwBgSdw.drawRect(0, 0, this.game.width, this.game.height);
    this.pwBgSdw.fixedToCamera = true;
    this.pwBgSdw.visible = false;
    
    // Pause menu window
    var pwX = this.game.width/2-300;
    var pwY = this.game.height/2-300;
    this.pwBg = this.game.add.graphics();
    this.pwBg.beginFill(RocketTux.mainMenuColor, 1);
    this.pwBg.drawRoundedRect(pwX, pwY, 600, 600, 8);
    this.pwBg.fixedToCamera = true;
    this.pwBg.visible = false;
    this.pwBgScrnBg = this.game.add.graphics();
    this.pwBgScrnBg.beginFill(0x000000, 1);
    this.pwBgScrnBg.drawRoundedRect(pwX+40, pwY+80, 520, 410, 8);
    this.pwBgScrnBg.fixedToCamera = true;
    this.pwBgScrnBg.visible = false;
    
	// Buttons
	this.pwBtExit = this.game.add.graphics();
	this.pwBtExit.beginFill(0xE00000, 1);
	this.pwBtExit.lineStyle(3, 0x2F2F2F, 1);
	this.pwBtExit.drawRoundedRect(pwX+80, pwY+510, 140, 70, 6);
	this.pwBtExit.inputEnabled = true;
	this.pwBtExit.events.onInputDown.add(this.quit, this);
	this.pwBtExit.fixedToCamera = true;
	this.pwBtExit.visible = false;
	
	this.pwBtResume = this.game.add.graphics();
	this.pwBtResume.beginFill(0xE00000, 1);
	this.pwBtResume.lineStyle(3, 0x2F2F2F, 1);
	this.pwBtResume.drawRoundedRect(pwX+380, pwY+510, 140, 70, 6);
	this.pwBtResume.inputEnabled = true;
	this.pwBtResume.events.onInputDown.add(this.resumeBt, this);
	this.pwBtResume.fixedToCamera = true;
	this.pwBtResume.visible = false;
	
	// Text styles
	var btStyle = { 
		font: "28px Verdana", 
		fill: "#B80000", align: "left",
		stroke: '#8D0000',
		strokeThickness: 4
	};
	var screenStyle = { 
		font: "24px Verdana", 
		fill: "#01BB01", align: "center",
		boundsAlignH: "center", boundsAlignV: "top",
	};	
	
	// Exit and Resume text
	this.pwExitText = this.game.add.text(pwX+120, pwY+524, "Exit", btStyle);
	this.pwExitText.fixedToCamera = true;
	this.pwExitText.visible = false;
	this.pwReumeText = this.game.add.text(pwX+394, pwY+524, "Resume", btStyle);
	this.pwReumeText.fixedToCamera = true;
	this.pwReumeText.visible = false;
	
	// Coin summary
	this.pwScrnText = this.game.add.text(0, 0, "", screenStyle);
	this.pwScrnText.setTextBounds(pwX+40, pwY+100, 520, 500);
	this.pwScrnText.fixedToCamera = true;
	this.pwScrnText.visible = false;
	
	// Collected item icons
	this.pwItemIcons = this.game.add.group();
	var tmpIcon;
	var i = 0;
	var z = 0;
	var nwln = 0;

    for (i = 0; i < 20; i++){
		tmpIcon = this.pwItemIcons.create(pwX+60 + 50*z, pwY+394 + nwln, 'atlas');
		tmpIcon.frameName = 'blank-icon';
		tmpIcon.fixedToCamera = true;
		
		z++;
		
		if (i === 9){
			nwln = 50;
			z = 0;
		}
	}
	this.pwItemIcons.visible = false;
	
  },
  paused: function() {
	this.pwBgSdw.visible = true;
	this.pwBg.visible = true;
	this.pwBgScrnBg.visible = true;
	this.pwBtExit.visible = true;
	this.pwExitText.visible = true;
	this.pwBtResume.visible = true;
	this.pwReumeText.visible = true;
	
	var scrnMsg = "";
	
	if (this.winner){
		scrnMsg = "Success Report!\n\n";
	} else {
		scrnMsg = "Progress Report\n\n";
	}
	
	var bonus = this.calcBonusCoins();
	var totalCoins = this.coinsCollected + bonus;
	scrnMsg += "Coins Collected: " + this.coinsCollected; 
	scrnMsg += "\nBonus Coins: " + bonus;
	scrnMsg += "\n\nTotal Coins: " + totalCoins;
	scrnMsg += "\n\nItems Found:";
	
	this.pwScrnText.text = scrnMsg;
	this.pwScrnText.visible = true;
	
	// Item icons
	var i = 0;
	var numIcons = Math.min(20, this.itemsCollected.length); // There are only 20 display locations to use.
	
	for (i = 0; i < numIcons; i++){	
		this.pwItemIcons.getChildAt(i).frameName =  'icon-' + this.itemsCollected[i];
	}
	
	this.pwItemIcons.visible = true;
  },
  pauseUpdate: function() {	
	if (this.game.input.keyboard.downDuration(Phaser.Keyboard.ESC, 1) || this.pad1.justPressed(9, 20)){ // Gamepad Start
		if (this.gameOver){
			this.quit(); // Prevents a bad state where the main update function while the level exits
		} else {
			this.game.paused = !this.game.paused;
		}
	} else if (this.pad1.justPressed(8, 20)){ // Gamepad Select button
		this.quit();
	}
  },
  resumeBt: function (){
	this.game.paused = !this.game.paused;
  },
  resumed: function() {
	this.pwBgSdw.visible = false;
	this.pwBg.visible = false;
	this.pwBgScrnBg.visible = false;
	this.pwBtExit.visible = false;
	this.pwBtResume.visible = false;
	this.pwExitText.visible = false;
	this.pwReumeText.visible = false;
	this.pwScrnText.visible = false;
	this.pwItemIcons.visible = false;
  },

//==================END OF LEVEL RELATED========================

  calcBonusCoins: function () {
	// Must collect at least 10 coins. Bump up one reward tier for collecting all the coins.
	var tier = Math.min(12, Math.floor(this.coinsCollected / 10) + Math.floor(this.coinsCollected / this.coinsInLevel));    
    return parseInt(RocketTux.bonusCoins[RocketTux.gameMode][tier]);
  },
  quit: function(){
	this.game.paused = !this.game.paused;
    this.gameOver = true; // Prevent crash caused by running game loop after destroying the following objects
    this.player.destroy();
    this.theLevel.destroy();
    this.sndRocketStart.destroy();
    this.sndRocketRunning.destroy();
    this.sndRocketWindup.destroy();
    this.sndRocketBoost.destroy();
    
    this.sndWarp.play();
    music.destroy();
    this.coins.destroy();
    this.blocks.destroy();
    this.enemies.destroy();
    
    // Calculate bonues
    var savedCoins = parseInt(localStorage.getItem('RocketTux-myWallet'));
    var bonus = this.calcBonusCoins();
    
    var totalCoins = this.coinsCollected + bonus;

    // Save data
    var newWalletValue = savedCoins + totalCoins;
    // Cap saved coins at 1,000,000,000
    if (newWalletValue > 999999999){
        newWalletValue = 1000000000;
    } 
    localStorage.setItem('RocketTux-myWallet', newWalletValue);
    
    this.endLevel()
  },
  endLevel: function(){
    this.game.state.start('MainMenu', true, false); // Destroy all - yes. Clear cache - no.
  }
};
