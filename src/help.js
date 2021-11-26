var RocketTux = RocketTux || {};
 
RocketTux.Help = function(){};
 
RocketTux.Help.prototype = {
	init: function(){
		// console.log("Help state loaded");
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
		this.titleText = this.game.add.text(0, 0, "Help", this.titleStyle);
		this.titleText.setTextBounds(0, 0, this.game.width, 30);
	},
	create: function() {
		music = this.game.add.audio("help");
    music.loop = true;
    music.volume = 0.5;
    music.play();  
	}, 
	update: function() {
		if (this.game.input.keyboard.downDuration(Phaser.Keyboard.ESC, 1)){
			this.game.state.start('MainMenu', true, false);
		}
	},
	shutdown: function(){
		music.destroy();
		// console.log("Help state exited");
	}
};
