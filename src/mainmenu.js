RocketTux.MainMenu = function(){};
 
RocketTux.MainMenu.prototype = {
  init: function() {
	// Start gamepad input
    this.game.input.gamepad.start(); // Tested with Super Nintendo style USB
    this.pad1 = this.game.input.gamepad.pad1;
  },
  create: function() {
  	// Add background
    this.activeBG = this.game.add.sprite(0, 0, 'skies');
    this.activeBG.animations.add('stand', [3], 1, true);
    this.activeBG.scale.setTo(1.25, 0.71); //wide, tall
    this.activeBG.width = this.game.width;
    this.activeBG.play('stand');
    this.activeBG.bringToTop();
    this.activeBG.fixedToCamera = true;
    
    // Game Logo
    this.logo = this.game.add.sprite(this.game.width / 2, 52, 'logo')
    this.logo.scale.setTo(2, 0.5);
    this.logo.anchor.setTo(0.5);

    // Music and sounds
    music = this.game.add.audio('menu');
    music.loop = true;
    music.play();
    this.mouseoverSnd = this.game.add.audio('mouseover');
    
    // Load menu tilemaps and draw game device
    this.makeMenu();
    
    // Add screens for game device
    this.makeScreens();
    this.activeScrn = 1;
    this.scrns[this.activeScrn].visible = true;
    
    // Chosen level
    this.selectedLevel = this.scrNames[this.activeScrn].split('_');
    this.unlocks = RocketTux.levelUnlocks.split(','); // These are index values corresponding to the level names in this.scrNames[]
  },
  
//==================GAME LOOP START========================
  update: function() {
	// Level selection with keyboard / gamepad
	if (this.game.input.keyboard.downDuration(Phaser.Keyboard.RIGHT, 1) || this.pad1.justReleased(Phaser.Gamepad.XBOX360_DPAD_RIGHT, 20)){
		this.levelSelectRight();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.LEFT, 1) || this.pad1.justReleased(Phaser.Gamepad.XBOX360_DPAD_LEFT, 20)){
		this.levelSelectLeft();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.P, 1) || this.pad1.justPressed(9, 20)){ // Gamepad Start button
		 if (RocketTux.gameMode == 'easy'){
			this.startGameEasy();
		} else if (RocketTux.gameMode == 'hard'){
			this.startGameHard();
		} else {
			this.startGame();
		}
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.R, 1) || this.pad1.justPressed(8, 20)){ // Gamepad Select button
		this.scrns[this.activeScrn].visible = false;
		
		this.unlocks = RocketTux.levelUnlocks.split(','); // Update in case they just unlocked a level
				
		// Pick a random level and time of day
		this.activeScrn = parseInt(this.unlocks[this.game.rnd.between(0, this.unlocks.length - 1)]);

		this.scrns[this.activeScrn].visible = true;
		this.selectedLevel = this.scrNames[this.activeScrn].split('_');
	} 
  },
//__________________GAME LOOP END___________________________ 
  
  startGame: function () {
    music.destroy();
    RocketTux.gameMode = 'normal';
    this.game.state.start('Game', true, false, this.selectedLevel[0], this.selectedLevel[1]); // 0 = theme, 1 = time of day
  },
  startGameEasy: function () {
    music.destroy();
    //RocketTux.bonusBoosts = 50;
    RocketTux.gameMode = 'easy';
    this.game.state.start('Game', true, false, this.selectedLevel[0], this.selectedLevel[1]); // 0 = theme, 1 = time of day
  },
  startGameHard: function () {
    music.destroy();
    RocketTux.gameMode = 'hard';
    this.game.state.start('Game', true, false, this.selectedLevel[0], this.selectedLevel[1]); // 0 = theme, 1 = time of day
  },
  levelSelectRight: function(){
	this.scrns[this.activeScrn].visible = false;
		
	this.activeScrn += 1;
	if (this.activeScrn > 22){
		this.activeScrn = 0
	}
	
	this.scrns[this.activeScrn].visible = true;
	this.selectedLevel = this.scrNames[this.activeScrn].split('_');
  },
  levelSelectLeft: function(){
	this.scrns[this.activeScrn].visible = false;
		
	this.activeScrn -= 1;
	if (this.activeScrn < 0){
		this.activeScrn = 22
	}
	
	this.scrns[this.activeScrn].visible = true;
	this.selectedLevel = this.scrNames[this.activeScrn].split('_');
  },
  makeMenu: function (){
	// Tilemap data
	this.layers = {
		// Background texture that can be colorized
		bg:[
			'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
			'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
			'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
			'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
			'0,0,0,150,151,151,151,151,151,151,151,151,151,121,1,1,1,1,1,1,1,1,1,1,1,1,122,151,151,151,151,151,151,151,151,151,152,0,0,0,',
			'0,0,0,166,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,168,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,118,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,120,0,0,0,',
			'0,0,0,134,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,136,0,0,0,',
			'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
			'0,0,0,214,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'
		],
		// Foreground parts (frame, buttons, etc)
		fg:[
			'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
			'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
			'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
			'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
			'0,0,0,77,78,78,78,78,78,78,78,78,78,43,46,46,46,46,46,46,46,46,46,46,46,46,47,78,78,78,78,78,78,78,78,78,79,0,0,0,',
			'0,0,0,93,0,0,0,0,0,0,0,0,0,59,60,61,61,61,61,61,61,61,61,61,61,62,63,0,0,0,0,0,0,0,0,0,95,0,0,0,',
			'0,0,0,92,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,0,0,0,',
			'0,0,0,92,0,0,0,0,0,0,0,0,70,71,71,71,71,71,71,71,71,71,71,71,71,71,71,72,0,0,0,0,0,6,7,8,76,0,0,0,',
			'0,0,0,92,0,0,0,0,0,0,0,0,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,6,7,8,0,22,10,24,76,0,0,0,',
			'0,0,0,92,0,0,2,3,0,0,0,0,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,22,9,24,0,38,39,40,76,0,0,0,',
			'0,0,0,92,16,17,18,19,20,21,0,0,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,38,39,40,0,0,0,0,76,0,0,0,',
			'0,0,0,92,32,33,34,35,36,37,0,0,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,0,0,0,6,7,8,76,0,0,0,',
			'0,0,0,92,48,49,50,51,52,53,0,0,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,6,7,8,0,22,26,24,76,0,0,0,',
			'0,0,0,92,0,0,66,67,0,0,0,0,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,22,25,24,0,38,39,40,76,0,0,0,',
			'0,0,0,92,0,0,82,83,0,0,0,0,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,38,39,40,0,0,0,0,76,0,0,0,',
			'0,0,0,92,0,0,0,0,0,0,0,0,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,0,0,0,0,0,0,76,0,0,0,',
			'0,0,0,92,0,0,0,0,0,0,0,0,87,86,86,86,86,86,86,86,86,86,86,86,86,86,86,88,0,0,0,0,0,0,0,0,76,0,0,0,',
			'0,0,0,92,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,0,0,0,',
			'0,0,0,92,0,0,0,0,0,140,141,142,143,11,12,13,14,15,0,0,0,0,11,12,13,14,15,143,157,0,0,0,0,0,0,0,76,0,0,0,',
			'0,0,0,73,0,0,0,0,0,0,0,0,0,27,28,29,30,31,0,0,0,0,27,28,29,30,31,0,0,0,0,0,0,0,0,0,75,0,0,0,',
			'0,0,0,89,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,91,0,0,0,',
			'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,',
			'0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'
		]
	};
	
	// Background texture
	var data = '';
	var tmpRow = "";
	
	for (i = 0; i < 23; i++){
		tmpRow = this.layers.bg[i].toString();
		data += tmpRow.slice(0, -1) + "\n";
	}
	
	this.game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);
	this.menuMapBG = this.game.add.tilemap('dynamicMap', 32, 32);
	this.menuMapBG.addTilesetImage('menu-map', 'menu-map', 32, 32);
	this.menuBG = this.menuMapBG.createLayer(0);
	this.menuBG.resizeWorld();
	this.menuBG.tint = RocketTux.mainMenuColor;
	
	// Foreground items
	data = '';
	tmpRow = "";
	
	for (i = 0; i < 23; i++){
		tmpRow = this.layers.fg[i].toString();
		data += tmpRow.slice(0, -1) + "\n";
	}
	
	this.game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);
	this.menuMapFG = this.game.add.tilemap('dynamicMap', 32, 32);
	this.menuMapFG.addTilesetImage('menu-map', 'menu-map', 32, 32);
	this.menuFG = this.menuMapFG.createLayer(0);
	this.menuFG.resizeWorld();
  },
  makeScreens: function(){
	this.scrNames = [
		'snow1_sunrise', 'snow1_day', 'snow1_sunset', 'snow1_night',
		'snow2_sunrise', 'snow2_day', 'snow2_sunset', 'snow2_night',
		'snow3_sunrise', 'snow3_day', 'snow3_sunset', 'snow3_night',
		'forest1_sunrise', 'forest1_day', 'forest1_sunset', 'forest1_night',
		'forest2_sunrise', 'forest2_day', 'forest2_sunset', 'forest2_night',
		 'beachfront_day', 'beach_day', 'candyland_day'
	];
	this.scrns = {};
	
	for (i = 0; i < 23; i++){
		this.scrns[i] = this.game.add.sprite(448,256, 'screens');
		this.scrns[i].frameName = this.scrNames[i];
		this.scrns[i].visible = false;
	}
  }
};
