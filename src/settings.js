var RocketTux = RocketTux || {};
 
RocketTux.Settings = function(){};
 
RocketTux.Settings.prototype = {
	init: function(){
		// console.log("Settings state loaded");
	},
	preload: function() {
		
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
