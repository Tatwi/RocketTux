var RocketTux = RocketTux || {};
 
RocketTux.Friends = function(){};
 
RocketTux.Friends.prototype = {
	init: function(){
		// console.log("Friends state loaded");
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
		// console.log("Friends state exited");
	}
};
