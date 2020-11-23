var RocketTux = RocketTux || {};
 
RocketTux.Settings = function(){};
 
RocketTux.Settings.prototype = {
	init: function(){
		// console.log("Settings state loaded");
	},
	preload: function() {
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
	},
	create: function() {
	  
	}, 
	update: function() {
		if (this.game.input.keyboard.downDuration(Phaser.Keyboard.ESC, 1)){
			this.game.state.start('MainMenu');
		}
	},
	shutdown: function(){
		// console.log("Settings state exited");
	}
};
