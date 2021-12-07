var RocketTux = RocketTux || {};
 
RocketTux.Friends = function(){};
 
RocketTux.Friends.prototype = {
	init: function(){
		// console.log("Friends state loaded");
	},
	preload: function() {
		
	},
	create: function() {
		music = this.game.add.audio("friends");
    music.loop = true;
    music.volume = 0.5;
    music.play();
    
    // Background image
		this.bgImage = this.game.add.sprite(0, 0, 'skies-special');
		this.bgImage.animations.add('stand', [1], 1, true);
		this.bgImage.scale.setTo(1.25, 0.71); //wide, tall
		this.bgImage.width = this.game.width;
		this.bgImage.play('stand');
		this.bgImage.fixedToCamera = true;
			
		// Load menu tilemaps and draw game device
		this.makeMenu();
		
		this.style = { 
			font: "11px Verdana", 
			fill: "#ffffff", align: "left"
		};
		this.escText = this.game.add.text(4, 2, "Press ESC to exit", this.style);
		
		this.titleStyle = { 
			font: "24px Verdana", 
			fill: "#" + RocketTux.scrnTextColor, 
			boundsAlignH: "left", boundsAlignV: "top"
		};
			
		this.descStyle = { 
			font: "18px Verdana", 
			fill: "#" + RocketTux.scrnTextColor, 
			boundsAlignH: "left", boundsAlignV: "top"
		};
		
		// Default pages
		this.fPage = 0;
		this.cPage = 0;
		
		// Buttons
		this.btFL = this.game.add.button(102, 606, 'ui-map', this.pageFL, this, 'glow-recsml-over', 'glow-recsml-out', 'glow-recsml-down');
		this.btFR = this.game.add.button(422, 606, 'ui-map', this.pageFR, this, 'glow-recsml-over', 'glow-recsml-out', 'glow-recsml-down');
		this.btH = this.game.add.button(255, 609, 'ui-map', this.helpF, this, 'glow-cir-over', 'glow-cir-out', 'glow-cir-down');		
		this.btCL = this.game.add.button(774, 606, 'ui-map', this.pageCL, this, 'glow-recsml-over', 'glow-recsml-out', 'glow-recsml-down');
		this.btCR = this.game.add.button(1094, 606, 'ui-map', this.pageCR, this, 'glow-recsml-over', 'glow-recsml-out', 'glow-recsml-down');
		this.btS = this.game.add.button(927, 609, 'ui-map', this.setC, this, 'glow-cir-over', 'glow-cir-out', 'glow-cir-down');
				
		// Screen lines
		var scrLines = this.game.add.graphics();
		scrLines.beginFill("0x" + RocketTux.scrnTextColor, 0.6);
		// Friends screen
		scrLines.drawRect(68, 140, 472, 4);
		scrLines.drawRect(68, 388, 472, 4);
		
		// Friend text
		this.fTitle = this.game.add.text(118, 100, "", this.titleStyle);		
		this.fDesc = this.game.add.text(218, 160, "", this.descStyle);	
		this.fMissing = this.game.add.text(108, 406, "Missing Items:", this.descStyle);
		
		// Friend item icons
		this.fIcons = this.game.add.group();
		var tmpIcon;
		var mvR = 0;
		var mvD = 0;
		this.fCheck = this.game.add.group();
		var tempCheck;
		
		for (i = 0; i < 10; i++){
			tmpIcon = this.fIcons.create(104 + mvR*90, 440 + mvD, 'atlas');
			tmpIcon.frameName = 'icon-' + RocketTux.frndItems[this.fPage][i];
			tmpIcon.fixedToCamera = true;
			
			// Check mark if player has the item
			tempCheck = this.fCheck.create(112 + mvR*90, 480 + mvD, 'ui-map');
			tempCheck.frameName = 'check-selected';
			tempCheck.fixedToCamera = true;
			tempCheck.tint = '0x1EDC00';
			tempCheck.scale.setTo(0.50, 0.50);
			tempCheck.visible = false;
			
			mvR++;
			
			if (mvR == 5){
				mvR = 0;
				mvD = 68;
			}
		}
		
		// Show first friend and cubimal pages
		this.showF();
		this.showC();
	}, 
	update: function() {
		if (this.game.input.keyboard.downDuration(Phaser.Keyboard.ESC, 1)){
			this.game.state.start('MainMenu', true, false);
		}
	},
	pageFL: function() {
		this.fPage--;
		
		if (this.fPage < 0){
			this.fPage = 17;
		}
		
		this.showF();
	},
	pageFR: function() {
		this.fPage++;
		
		if (this.fPage > 17){
			this.fPage = 0;
		}
		
		this.showF();
	},
	helpF: function() {
	
	},
	pageCL: function() {
	
	},
	pageCR: function() {
	
	},
	setC: function() {
	
	},
	showF: function() {
		this.fTitle.text = RocketTux.frndName[this.fPage];
		this.fDesc.text = RocketTux.frndDesc[this.fPage];
		
		// Show items
		for (i = 0; i < 10; i++){	
			this.fIcons.getChildAt(i).frameName =  'icon-' + RocketTux.frndItems[this.fPage][i];
			
			// Show check mark
			if (parseInt(localStorage.getItem('RocketTux-invItem' + RocketTux.frndItems[this.fPage][i])) > 0){
				this.fCheck.getChildAt(i).visible = true;
			} else {
				this.fCheck.getChildAt(i).visible = false;
			}
		}
	},
	showC: function() {
	
	},
	shutdown: function(){
		music.destroy();
		//console.log("Friends state exited");
	},
	makeMenu: function (){
	// Tilemap data
	this.layers = {
		// Background texture that can be colorized
		bg:[
			'0,150,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,152,0,0,0,0,150,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,152,0,',
			'0,166,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,168,0,0,0,0,166,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,168,0,',
			'0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,',
			'0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,',
			'0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,',
			'0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,',
			'0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,',
			'0,118,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,120,0,0,0,0,118,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,120,0,',
			'0,134,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,136,0,0,0,0,134,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,136,0,'
		],
		// Foreground parts (frame, buttons, etc)
		fg:[
			'0,77,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,79,0,0,0,0,77,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,79,0,',
			'0,93,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,95,0,0,0,0,93,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,95,0,',
			'0,92,70,71,71,71,71,71,71,71,71,71,71,71,71,71,72,76,0,0,0,0,92,70,71,71,71,71,71,71,71,71,71,71,71,71,71,72,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,76,0,',
			'0,92,87,86,86,86,86,86,86,86,86,86,86,86,86,86,88,76,0,0,0,0,92,87,86,86,86,86,86,86,86,86,86,86,86,86,86,88,76,0,',
			'0,92,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,0,0,0,0,92,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,76,0,',
			'0,92,0,11,45,15,0,0,6,7,8,0,0,11,44,15,0,76,0,0,0,0,92,0,11,45,15,0,0,6,7,8,0,0,11,44,15,0,76,0,',
			'0,92,0,27,28,31,0,0,22,10,24,0,0,27,28,31,0,76,0,0,0,0,92,0,27,28,31,0,0,22,9,24,0,0,27,28,31,0,76,0,',
			'0,73,0,0,0,0,0,0,38,39,40,0,0,0,0,0,0,75,0,0,0,0,73,0,0,0,0,0,0,38,39,40,0,0,0,0,0,0,75,0,',
			'0,89,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,91,0,0,0,0,89,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,91,0,'
		],
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
};
