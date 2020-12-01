var RocketTux = RocketTux || {};
 
RocketTux.Inventory = function (){};
 
RocketTux.Inventory.prototype = {
	init: function(){
		// console.log("Inventory state loaded");
	},
	preload: function () {
		
	},
	create: function () {
		// Background image
		this.bgImage = this.game.add.sprite(0, 0, 'skies-special');
		this.bgImage.animations.add('stand', [3], 1, true);
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
			font: "30px Verdana", 
			fill: "#" + RocketTux.scrnTextColor, 
			boundsAlignH: "center", boundsAlignV: "top"
		};
		this.titleText = this.game.add.text(0, 0, "Inventory", this.titleStyle);
		this.titleText.setTextBounds(160, 94, 672, 32);
		
		this.colStyle = { 
			font: "22px Verdana", 
			fill: "#" + RocketTux.scrnTextColor, 
			boundsAlignH: "left", boundsAlignV: "top"
		};
		this.haveText = this.game.add.text(190, 102, "Have", this.colStyle);
		this.sellText = this.game.add.text(750, 102, "Sell", this.colStyle);
		
		this.pagerStyle = { 
			font: "26px Verdana", 
			fill: "#" + RocketTux.scrnTextColor, 
			boundsAlignH: "center", boundsAlignV: "middle"
		};
		this.pagerText = this.game.add.text(0, 0, "1 / 25", this.pagerStyle);
		this.pagerText.setTextBounds(960, 608, 160, 64);
		
		// Item quantities
		this.haveQ = {};
		this.sellQ = {};
		this.showPage = 0;
		var i = 0;
		
		for (i = 0; i < 8; i++){
			this.haveQ[i] = this.game.add.text(190, 150 + i*64, "", this.colStyle);
			this.haveQ[i].text = localStorage.getItem('RocketTux-invItem' + i);
			this.sellQ[i] = this.game.add.text(750, 150+ i*64, "", this.colStyle);
		}
		
		// Item icons
		this.showPage = 0; // Index 0/24 gets displayed as user friendly 1/25
		this.itemIcons = this.game.add.group();
		var tmpIcon;
		

		for (i = 0; i < 8; i++){
			tmpIcon = this.itemIcons.create(288, 150 + i*64, 'atlas');
			tmpIcon.frameName = 'icon-' + i;
			tmpIcon.fixedToCamera = true;
		}
		
		// Item descriptions and hints
		this.descStyle = { 
			font: "15px Verdana", 
			fill: "#" + RocketTux.scrnTextColor, 
			boundsAlignH: "left", boundsAlignV: "top"
		};
		this.desc = {};
		var i = 0;
		
		for (i = 0; i < 8; i++){
			this.desc[i] = this.game.add.text(334, 142 + i*64, "", this.descStyle);
			this.desc[i].text = RocketTux.lootNames[i] + "\nHint: " + RocketTux.lootDesc[i];
		}
		
		// Buttons
		this.btPageDown = this.game.add.button(934, 543, 'ui-map', this.pageDown, this, 'glow-recsml-over', 'glow-recsml-out', 'glow-recsml-down');
		this.btPageUp = this.game.add.button(1062, 543, 'ui-map', this.pageUp, this, 'glow-recsml-over', 'glow-recsml-out', 'glow-recsml-down');
		
		// Screen lines
		var scrLines;
		//Horizontal
		for (i = 0; i < 9; i++){
			scrLines = this.game.add.graphics();
			scrLines.beginFill("0x" + RocketTux.scrnTextColor, 0.6);
			scrLines.drawRect(168, 131 + i*64, 656, 4);
		}
		// Vertical
		scrLines = this.game.add.graphics();
		scrLines.beginFill("0x" + RocketTux.scrnTextColor, 0.6);
		scrLines.drawRect(270, 135, 4, 508);
		scrLines = this.game.add.graphics();
		scrLines.beginFill("0x" + RocketTux.scrnTextColor, 0.6);
		scrLines.drawRect(718, 135, 4, 508);
		
	}, 
	update: function () {
		if (this.game.input.keyboard.downDuration(Phaser.Keyboard.ESC, 1)){
			this.game.state.start('MainMenu', true, false);
		}
	},
	pageUp: function () {
		this.showPage++
		
		if (this.showPage > 24){
			this.showPage = 0; // Wrap around
		}
		
		this.pageAdvance();
	},
	pageDown: function () {
		this.showPage--
		
		if (this.showPage < 0){
			this.showPage = 24; // Wrap around
		}
		
		this.pageAdvance();
	},
	pageAdvance: function () {
		// Advance 8 items each page
		var currentPage = this.showPage * 8;
		
		for (i = 0; i < 8; i++){
			if (currentPage + i < 196){
				 // 8*25 = 200, but we only have 196 icons/items (and I am all out of sprite map to add 4 more!)
				this.itemIcons.getChildAt(i).frameName =  'icon-' + (currentPage + i);
				this.desc[i].text = RocketTux.lootNames[currentPage + i] + "\nHint: " + RocketTux.lootDesc[currentPage + i];
				this.haveQ[i].text = localStorage.getItem('RocketTux-invItem' + (currentPage + i));
				this.sellQ[i].text = "";
			} else {
				// Blank spaces
				this.itemIcons.getChildAt(i).frameName =  'blank-icon';
				this.desc[i].text = "";
				this.haveQ[i].text = "";
				this.sellQ[i].text = "";
			}
		}
		
		this.pagerText.text = (this.showPage + 1) + " / 25";
	},
	shutdown: function (){
		// console.log("Inventory state exited");
	},
	makeMenu: function (){
	// Tilemap data
	this.layers = {
		// Background texture that can be colorized
		bg:[
			'0,0,0,150,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,151,152,0,0,0,',
			'0,0,0,166,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,168,0,0,0,',
			'0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,',
			'0,0,0,118,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,120,0,0,0,',
			'0,0,0,134,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,135,136,0,0,0,'
		],
		// Foreground parts (frame, buttons, etc)
		fg:[
			'0,0,0,77,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,78,79,0,0,0,',
			'0,0,0,93,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,95,0,0,0,',
			'0,0,0,92,70,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,72,0,0,0,0,0,0,0,0,0,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,0,0,0,0,0,0,0,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,0,0,2,3,4,0,0,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,16,17,18,19,20,21,0,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,32,33,34,35,36,37,0,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,48,49,50,51,52,53,0,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,0,0,66,67,0,0,0,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,0,0,82,83,0,0,0,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,0,0,0,0,6,7,8,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,0,0,0,0,22,42,24,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,6,7,8,0,38,39,40,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,22,9,24,0,0,0,0,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,38,39,40,0,0,0,0,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,0,0,0,0,0,0,0,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,0,0,0,0,0,0,0,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,11,45,15,0,11,44,15,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,27,28,31,0,27,28,31,76,0,0,0,',
			'0,0,0,92,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,0,0,0,70,71,71,71,72,0,76,0,0,0,',
			'0,0,0,92,87,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,86,88,0,0,0,87,86,86,86,88,0,76,0,0,0,',
			'0,0,0,73,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,75,0,0,0,',
			'0,0,0,89,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,90,91,0,0,0,'
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
