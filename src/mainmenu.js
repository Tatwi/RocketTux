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
       
    // Coin status
	this.coinIcon = this.game.add.sprite(454, 144, 'atlas');
    this.coinIcon.fixedToCamera = true;
    this.coinIcon.frameName = 'ui-coin';
    this.coinStyle = { 
		font: "24px Verdana", 
		fill: "#ffffff", align: "left",
	};
    this.uiCoinStatus = this.game.add.text(0, 0, "", this.coinStyle);
    this.uiCoinStatus.alignTo(this.coinIcon, Phaser.RIGHT_TOP, 10, -2);
    this.uiCoinStatus.fixedToCamera = true;
    this.uiCoinStatus.text = this.addComma(localStorage.getItem('RocketTux-myWallet'), 3);
	
	// Game mode status
	this.modeStyle = { 
		font: "24px Verdana", 
		fill: "#ffffff", align: "left",
	};
	this.modeText = this.game.add.text(690, 146, "", this.modeStyle);
	this.modeText.text = RocketTux.gameMode.charAt(0).toUpperCase() + RocketTux.gameMode.slice(1);
	
	// Powerup status
	this.powerUpIcon = this.game.add.sprite(790, 144, 'atlas');
	if (RocketTux.powerUpActive == 'none'){
		this.powerUpIcon.frameName = 'blk-empty';
	} else {
		this.powerUpIcon.frameName = 'pwrup-icon-' + RocketTux.powerUpActive;
	}
	
	// Buttons
	this.btDpadUp = this.game.add.button(202, 288, 'ui-map', this.modeSelectUp, this, 'glow-sqr-over', 'glow-sqr-out', 'glow-sqr-down');
	this.btDpadDown = this.game.add.button(202, 406, 'ui-map', this.modeSelectDown, this, 'glow-sqr-over', 'glow-sqr-out', 'glow-sqr-down');
	this.btDpadLeft = this.game.add.button(142, 348, 'ui-map', this.levelSelectLeft, this, 'glow-sqr-over', 'glow-sqr-out', 'glow-sqr-down');
	this.btDpadRight = this.game.add.button(260, 348, 'ui-map', this.levelSelectRight, this, 'glow-sqr-over', 'glow-sqr-out', 'glow-sqr-down');
	this.btSelect = this.game.add.button(422, 574, 'ui-map', this.pickRandomLevel, this, 'glow-rec-over', 'glow-rec-out', 'glow-rec-down');
	this.btStart = this.game.add.button(710, 574, 'ui-map', this.startGame, this, 'glow-rec-over', 'glow-rec-out', 'glow-rec-down');
	this.btF = this.game.add.button(927, 385, 'ui-map', this.goFriends, this, 'glow-cir-over', 'glow-cir-out', 'glow-cir-down');
	this.btI = this.game.add.button(1055, 353, 'ui-map', this.goInventory, this, 'glow-cir-over', 'glow-cir-out', 'glow-cir-down');
	this.btS = this.game.add.button(927, 257, 'ui-map', this.goSettings, this, 'glow-cir-over', 'glow-cir-out', 'glow-cir-down');
	this.btH = this.game.add.button(1055, 225, 'ui-map', this.goHelp, this, 'glow-cir-over', 'glow-cir-out', 'glow-cir-down');
	
	this.unlockStyle = { 
		font: "28px Verdana", 
		fill: "#FFFF00", align: "center",
	};
	this.unlockText = this.game.add.text(490, 280, "", this.unlockStyle);
	this.unlockText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
	this.unlockText.visible = false;
  },
    
//==================GAME LOOP START========================
  update: function() { 
	// Level selection with keyboard / gamepad
	if (this.game.input.keyboard.downDuration(Phaser.Keyboard.RIGHT, 1) || this.pad1.justReleased(Phaser.Gamepad.XBOX360_DPAD_RIGHT, 20)){
		this.levelSelectRight();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.LEFT, 1) || this.pad1.justReleased(Phaser.Gamepad.XBOX360_DPAD_LEFT, 20)){
		this.levelSelectLeft();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.P, 1) || this.pad1.justPressed(9, 20)){ // Gamepad Start button
		this.startGame();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.R, 1) || this.pad1.justPressed(8, 20)){ // Gamepad Select button
		this.pickRandomLevel();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.DOWN, 1) || this.pad1.justReleased(Phaser.Gamepad.XBOX360_DPAD_DOWN, 20)){
		this.modeSelectDown();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.UP, 1) || this.pad1.justReleased(Phaser.Gamepad.XBOX360_DPAD_UP, 20)){
		this.modeSelectUp();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.F, 1)){
		this.goFriends();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.I, 1)){
		this.goInventory();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.S, 1)){
		this.goSettings();
	} else if (this.game.input.keyboard.downDuration(Phaser.Keyboard.H, 1)){
		this.goHelp();
	}
	
	// Display for locked levels
	if (!this.unlocks.includes(String(this.activeScrn))){
		this.scrns[this.activeScrn].tint = 0x4E4E4E;
		
		var myCoins = parseInt(localStorage.getItem('RocketTux-myWallet'));
		
		if (myCoins >= RocketTux.unlockCost[this.activeScrn]){
			this.unlockText.text = "Press Play to Unlock!\n\n\n\n" + this.addComma(RocketTux.unlockCost[this.activeScrn], 3) + " Coins";
		} else {
			var coinsRequired = RocketTux.unlockCost[this.activeScrn] - myCoins;
			this.unlockText.text = "I need " + coinsRequired + " Coins\n\n\n\nto unlock this level...";
		}
		
		this.unlockText.visible = true;
	} else {
		this.unlockText.text = "";
		this.unlockText.visible = false;
	}
  },
//__________________GAME LOOP END___________________________ 

  startGame: function () {
	if (this.levelIsLocked()){
		return;
	}  
	  
	if (RocketTux.gameMode == 'easy'){
		this.startGameEasy();
	} else if (RocketTux.gameMode == 'hard'){
		this.startGameHard();
	} else {
		this.startGameNormal();
	}
  },
  startGameNormal: function () {
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
  levelSelectLeft: function (){
	this.scrns[this.activeScrn].visible = false;
		
	this.activeScrn -= 1;
	if (this.activeScrn < 0){
		this.activeScrn = 22
	}
	
	this.scrns[this.activeScrn].visible = true;
	this.selectedLevel = this.scrNames[this.activeScrn].split('_');
  },
  modeSelectUp: function () {
	switch (RocketTux.gameMode){
		case "easy":
			RocketTux.gameMode = "hard";
			break;
		case "normal":
			RocketTux.gameMode = "easy";
			break;
		case "hard":
			RocketTux.gameMode = "normal";
			break;
	}
	
	this.modeText.text = RocketTux.gameMode.charAt(0).toUpperCase() + RocketTux.gameMode.slice(1);
  },
  modeSelectDown: function () {
	switch (RocketTux.gameMode){
		case "easy":
			RocketTux.gameMode = "normal";
			break;
		case "normal":
			RocketTux.gameMode = "hard";
			break;
		case "hard":
			RocketTux.gameMode = "easy";
			break;
	}
	
	this.modeText.text = RocketTux.gameMode.charAt(0).toUpperCase() + RocketTux.gameMode.slice(1);
  },
  pickRandomLevel: function (){
	this.scrns[this.activeScrn].visible = false;
	
	this.unlocks = RocketTux.levelUnlocks.split(','); // Update in case they just unlocked a level
			
	// Exclude the currently selected level
	var tmpUnlocks = this.unlocks;
	tmpUnlocks.splice(tmpUnlocks.indexOf(String(this.activeScrn)),1);
	
	// Pick a random index value that will be used to reference a level theme and time of day
	this.activeScrn = parseInt(this.unlocks[this.game.rnd.between(0, this.unlocks.length - 1)]);

	this.scrns[this.activeScrn].visible = true;
	this.selectedLevel = this.scrNames[this.activeScrn].split('_');
  },
  goFriends: function (){
	music.destroy();
    this.game.state.start('Friends', true, false);
  },
  goInventory: function (){
	music.destroy();
    this.game.state.start('Inventory', true, false);
  },
  goSettings: function (){
	music.destroy();
    this.game.state.start('Settings', true, false);
  },
  goHelp: function (){
	music.destroy();
    this.game.state.start('Help', true, false);
  },
  levelIsLocked: function(){
	// if level is locked, prevent the startGame function from completing
	if (!this.unlocks.includes(String(this.activeScrn))){
		var myCoins = parseInt(localStorage.getItem('RocketTux-myWallet'));
		
		if (myCoins >= RocketTux.unlockCost[this.activeScrn]){
			// Update wallet
			myCoins = myCoins - RocketTux.unlockCost[this.activeScrn];
			localStorage.setItem('RocketTux-myWallet', myCoins);
			
			// Update unlocks
			var tmpUnlocks = localStorage.getItem('RocketTux-levelUnlocks'); // Get stored
			localStorage.setItem('RocketTux-levelUnlocks', tmpUnlocks + "," + this.activeScrn); // Update stored
			RocketTux.levelUnlocks = localStorage.getItem('RocketTux-levelUnlocks'); // Update RAM reference
		} else {
			return true; // Level is locked
		}
	}
	
	return false; // Level is or has just been unlocked
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
  }, 
  addComma: function (num, per) {
	// W.S. Toh: https://code-boxx.com/format-numbers-javascript/
	// addComma() : add commas to seperate given number
	// PARAM num : original number
	//       per : add comma per X digits

	  var cString = num.toString(),
		  aComma = "";

	  if (cString.length > per) {
		var j = 0;
		for (let i=(cString.length-1); i>=0; i--) {
		  // Add last character
		  aComma = cString.charAt(i) + aComma;

		  // Add comma?
		  j++;
		  if (j == per && i!=0) { 
			aComma = "," + aComma; 
			j = 0;
		  }
		}
	  } else {
		aComma = cString;
	  }
	  
	  return aComma;
  },
 
//==================BUTTON CALLBACKS========================
};
