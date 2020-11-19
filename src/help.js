var RocketTux = RocketTux || {};
 
RocketTux.Help = function(){};
 
RocketTux.Help.prototype = {
	init: function(){
		// console.log("Help state loaded");
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
		// console.log("Help state exited");
	}
};
