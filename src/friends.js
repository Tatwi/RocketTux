var RocketTux = RocketTux || {};
 
RocketTux.Friends = function(){};
 
RocketTux.Friends.prototype = {
	init: function(){
		// console.log("Friends state loaded");
	},
	preload: function() {
		
	},
	create: function() {
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
		this.titleText = this.game.add.text(0, 0, "Friends", this.titleStyle);
		this.titleText.setTextBounds(0, 0, this.game.width, 30);
	}, 
	update: function() {
		if (this.game.input.keyboard.downDuration(Phaser.Keyboard.ESC, 1)){
			this.game.state.start('MainMenu', true, false);
		}
	},
	shutdown: function(){
		// console.log("Friends state exited");
	}
};
