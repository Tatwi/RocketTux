var RocketTux = RocketTux || {};
 
RocketTux.Inventory = function(){};
 
RocketTux.Inventory.prototype = {
	init: function(){
		console.log("Inventory state loaded");
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
		console.log("Inventory state exited");
	}
};
