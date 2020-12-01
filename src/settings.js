var RocketTux = RocketTux || {};
 
RocketTux.Settings = function(){};
 
RocketTux.Settings.prototype = {
	init: function(){
		// console.log("Settings state loaded");
	},
	preload: function() {
		
	},
	create: function() {
	  // Background image
		this.bgImage = this.game.add.sprite(0, 0, 'skies-special');
		this.bgImage.animations.add('stand', [3], 1, true);
		this.bgImage.scale.setTo(1.25, 0.71); //wide, tall
		this.bgImage.width = this.game.width;
		this.bgImage.play('stand');
		this.bgImage.fixedToCamera = true;
		
		this.style = { 
			font: "11px Verdana", 
			fill: "#ffffff", align: "left"
		};
		this.escText = this.game.add.text(4, 2, "Press ESC to exit", this.style);
		
		this.titleStyle = { 
			font: "30px Verdana", 
			fill: "#ffffff", 
			boundsAlignH: "center", boundsAlignV: "top"
		};
		this.titleText = this.game.add.text(0, 0, "Settings", this.titleStyle);
		this.titleText.setTextBounds(0, 0, this.game.width, 30);
		
		this.headingsStyle = { 
			font: "22px Verdana", 
			fill: "#ffffff", align: "left"
		};
		this.headingsLeft = this.game.add.text(16, 64, "", this.headingsStyle);
		this.headingsLeft.text = "Game Device Color\n\n\n\n";
		//this.headingsLeft.text += "Disable Music\n\n\n\n";
		this.headingsRight = this.game.add.text(this.game.width/2+16, 64, "", this.headingsStyle);
		this.headingsRight.text = "Screen Font Color\n\n\n\n";
		//this.headingsRight.text += "Controller Style \n\n\n\n";
		
		// Game device color buttons
		var gdColors = ['0xB7B7B7','0x333333','0xB5000E','0x1EDC00','0x0042A9','0xFFFF84','0x0AB9E6','0x69E696','0xFF3278','0x4655E6','0xB400F5','0xFFFF00'];
		this.btGDC = this.game.add.group();
		var gdcBtn;
		for (i = 0; i < 12; i++){
			gdcBtn = this.game.add.button(16 + i*40, 96, 'ui-map', this.setGDColor, this, 'check-over', 'check-out', 'check-down');
			gdcBtn.tint = gdColors[i];
			this.btGDC.add(gdcBtn);
			
			// Set current as selected
			if (gdColors[i] === RocketTux.mainMenuColor){
				gdcBtn.setFrames('check-selected', 'check-selected', 'check-selected');
			}
		}
		
		// Game screen color buttons
		var scrnColors = ['01BB01','FFBF00','FFFFFF','FF0000','66FFFF','3333FF','DD33FF','FF0080'];
		this.btSC = this.game.add.group();
		var scrnBtn;
		for (i = 0; i < 8; i++){
			scrnBtn = this.game.add.button(this.game.width/2+16 + i*40, 96, 'ui-map', this.setScrnColor, this, 'check-over', 'check-out', 'check-down');
			scrnBtn.tint = "0x" + scrnColors[i];
			this.btSC.add(scrnBtn);
			
			// Set current as selected
			if (scrnColors[i] === RocketTux.scrnTextColor){
				scrnBtn.setFrames('check-selected', 'check-selected', 'check-selected');
			}
		}
		
	}, 
	update: function() {
		if (this.game.input.keyboard.downDuration(Phaser.Keyboard.ESC, 1)){
			this.game.state.start('MainMenu', true, false);
		}
	},
	shutdown: function(){
		// console.log("Settings state exited");
	},
	setGDColor: function (btn) {
		// Reset all to unselected 
		this.btGDC.forEach(function(gdcBtn) {
			gdcBtn.setFrames('check-over', 'check-out', 'check-down');
		}, this, true);
		
		// Set selected
		btn.setFrames('check-selected', 'check-selected', 'check-selected');
		
		// Update color
		localStorage.setItem('RocketTux-mainMenuColor', btn.tint);
		RocketTux.mainMenuColor = btn.tint;
	},
	setScrnColor: function (btn) {
		// Reset all to unselected 
		this.btSC.forEach(function(scrnBtn) {
			scrnBtn.setFrames('check-over', 'check-out', 'check-down');
		}, this, true);
		
		// Set selected
		btn.setFrames('check-selected', 'check-selected', 'check-selected');
		
		// Update color
		var justTheColor = btn.tint.slice(2,8);
		localStorage.setItem('RocketTux-scrnTextColor', justTheColor);
		RocketTux.scrnTextColor = justTheColor;
	}
};
